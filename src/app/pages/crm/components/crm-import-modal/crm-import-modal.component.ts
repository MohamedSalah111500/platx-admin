import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { CrmService } from "../../services/crm.service";
import { CrmAuthService } from "../../services/crm-auth.service";
import { parseImportText } from "../../crm-utils";
import { CrmAgent, CrmImportResult, CrmImportRow, CrmLeadSource, LEAD_SOURCES } from "../../types";

@Component({
  selector: "app-crm-import-modal",
  templateUrl: "./crm-import-modal.component.html",
  styleUrls: ["../../crm-shared.scss"],
})
export class CrmImportModalComponent {
  @Input() agents: CrmAgent[] = [];
  @Output() imported = new EventEmitter<CrmImportResult>();
  @ViewChild("modal") modal?: ModalDirective;

  readonly maxRows = 500;
  sources = LEAD_SOURCES;
  isSuperAdmin = this.auth.isSuperAdmin;
  raw = "";
  rows: CrmImportRow[] = [];
  source: CrmLeadSource = CrmLeadSource.WhatsApp;
  assignedToUserId: string | null = null;
  saving = false;

  constructor(private crm: CrmService, private auth: CrmAuthService, private toastr: ToastrService) {}

  get activeAgents(): CrmAgent[] {
    return this.agents.filter((a) => a.isActive);
  }

  open() {
    this.raw = "";
    this.rows = [];
    this.source = CrmLeadSource.WhatsApp;
    this.assignedToUserId = this.isSuperAdmin ? this.auth.userId : null;
    this.modal?.show();
  }

  close() {
    this.modal?.hide();
  }

  parse() {
    this.rows = parseImportText(this.raw);
  }

  remove(index: number) {
    this.rows.splice(index, 1);
  }

  submit() {
    if (!this.rows.length || this.saving) return;
    this.saving = true;
    this.crm
      .importLeads({
        rows: this.rows.slice(0, this.maxRows),
        source: Number(this.source),
        assignedToUserId: this.assignedToUserId || null,
      })
      .subscribe({
        next: (result) => {
          this.saving = false;
          this.toastr.success(
            `${result.created} added · ${result.skippedDuplicates} duplicates · ${result.skippedInvalid} invalid`,
            "Import finished"
          );
          this.imported.emit(result);
          this.close();
        },
        error: () => (this.saving = false),
      });
  }
}
