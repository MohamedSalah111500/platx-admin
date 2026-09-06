import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { CrmService } from "../../services/crm.service";
import { fromInputDateTime, toInputDateTime } from "../../crm-utils";
import { CrmLead, CrmLeadStatus, LEAD_STATUSES, metaOf } from "../../types";

@Component({
  selector: "app-crm-status-modal",
  templateUrl: "./crm-status-modal.component.html",
  styleUrls: ["../../crm-shared.scss"],
})
export class CrmStatusModalComponent {
  @Output() changed = new EventEmitter<CrmLead>();
  @ViewChild("modal") modal?: ModalDirective;

  statuses = LEAD_STATUSES;
  lead: CrmLead | null = null;
  saving = false;
  model = { status: CrmLeadStatus.New, note: "", lostReason: "", nextFollowUpAt: "" };

  constructor(
    private crm: CrmService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  get isLost(): boolean {
    return Number(this.model.status) === CrmLeadStatus.Lost;
  }

  get isClosed(): boolean {
    const s = Number(this.model.status);
    return s === CrmLeadStatus.Lost || s === CrmLeadStatus.Won;
  }

  open(lead: CrmLead, targetStatus?: CrmLeadStatus) {
    this.lead = lead;
    this.model = {
      status: targetStatus ?? lead.status,
      note: "",
      lostReason: lead.lostReason || "",
      nextFollowUpAt: toInputDateTime(lead.nextFollowUpAt),
    };
    this.modal?.show();
  }

  close() {
    this.modal?.hide();
  }

  label(status: CrmLeadStatus): string {
    return metaOf(this.statuses, status).label;
  }

  submit() {
    if (!this.lead || this.saving) return;
    this.saving = true;
    this.crm
      .updateStatus(this.lead.id, {
        status: Number(this.model.status),
        note: this.model.note || null,
        lostReason: this.isLost ? this.model.lostReason || null : null,
        nextFollowUpAt: this.isClosed ? null : fromInputDateTime(this.model.nextFollowUpAt),
      })
      .subscribe({
        next: (lead) => {
          this.saving = false;
          const statusText = this.translate.instant(this.label(lead.status));
          this.toastr.success(
            this.translate.instant("CRM.TOAST.STATUS_SET", { status: statusText }),
            this.translate.instant("MENUITEMS.CRM.TEXT")
          );
          this.changed.emit(lead);
          this.close();
        },
        error: () => (this.saving = false),
      });
  }
}
