import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { CrmService } from "../../services/crm.service";
import { CrmAuthService } from "../../services/crm-auth.service";
import { fromInputDateTime, phoneDigits, toInputDateTime } from "../../crm-utils";
import {
  CrmAgent,
  CrmLead,
  CrmLeadPayload,
  CrmLeadPriority,
  CrmLeadSource,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
} from "../../types";

function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const digits = phoneDigits(control.value);
  if (!control.value) return null;
  return digits.length >= 7 && digits.length <= 15 ? null : { phone: true };
}

@Component({
  selector: "app-crm-lead-form",
  templateUrl: "./crm-lead-form.component.html",
  styleUrls: ["../../crm-shared.scss"],
})
export class CrmLeadFormComponent {
  @Input() agents: CrmAgent[] = [];
  @Output() saved = new EventEmitter<CrmLead>();
  @ViewChild("modal") modal?: ModalDirective;

  sources = LEAD_SOURCES;
  priorities = LEAD_PRIORITIES;
  isSuperAdmin = this.auth.isSuperAdmin;
  editing: CrmLead | null = null;
  submitted = false;
  saving = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private crm: CrmService,
    private auth: CrmAuthService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(150)]],
      phone: ["", [Validators.required, phoneValidator]],
      email: ["", [Validators.email]],
      organization: ["", [Validators.maxLength(150)]],
      country: ["", [Validators.maxLength(100)]],
      city: ["", [Validators.maxLength(100)]],
      source: [CrmLeadSource.WhatsApp],
      priority: [CrmLeadPriority.Medium],
      interestedPlan: ["", [Validators.maxLength(100)]],
      notes: ["", [Validators.maxLength(4000)]],
      assignedToUserId: [null],
      nextFollowUpAt: [""],
    });
  }

  get f() {
    return this.form.controls;
  }

  get activeAgents(): CrmAgent[] {
    return this.agents.filter((a) => a.isActive || a.id === this.editing?.assignedToUserId);
  }

  open(lead?: CrmLead) {
    this.editing = lead || null;
    this.submitted = false;
    this.form.reset({
      name: lead?.name || "",
      phone: lead?.phone || "",
      email: lead?.email || "",
      organization: lead?.organization || "",
      country: lead?.country || "",
      city: lead?.city || "",
      source: lead?.source ?? CrmLeadSource.WhatsApp,
      priority: lead?.priority ?? CrmLeadPriority.Medium,
      interestedPlan: lead?.interestedPlan || "",
      notes: lead?.notes || "",
      assignedToUserId: lead?.assignedToUserId ?? (this.isSuperAdmin ? this.auth.userId : null),
      nextFollowUpAt: toInputDateTime(lead?.nextFollowUpAt),
    });
    this.modal?.show();
  }

  close() {
    this.modal?.hide();
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid || this.saving) return;

    const v = this.form.value;
    const payload: CrmLeadPayload = {
      name: v.name,
      phone: v.phone,
      email: v.email || null,
      organization: v.organization || null,
      country: v.country || null,
      city: v.city || null,
      source: Number(v.source),
      priority: Number(v.priority),
      interestedPlan: v.interestedPlan || null,
      notes: v.notes || null,
      assignedToUserId: v.assignedToUserId || null,
      nextFollowUpAt: fromInputDateTime(v.nextFollowUpAt),
    };

    this.saving = true;
    const request = this.editing
      ? this.crm.updateLead(this.editing.id, payload)
      : this.crm.createLead(payload);

    request.subscribe({
      next: (lead) => {
        this.saving = false;
        this.toastr.success(this.editing ? "Lead updated" : "Lead added", "CRM");
        this.saved.emit(lead);
        this.close();
      },
      error: () => (this.saving = false),
    });
  }
}
