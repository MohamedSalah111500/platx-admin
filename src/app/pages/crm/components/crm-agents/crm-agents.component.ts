import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { CrmService } from "../../services/crm.service";
import { CrmAuthService } from "../../services/crm-auth.service";
import { avatarColor, initials, relativeTime } from "../../crm-utils";
import { CrmAgent } from "../../types";

@Component({
  selector: "app-crm-agents",
  templateUrl: "./crm-agents.component.html",
  styleUrls: ["../../crm-shared.scss", "./crm-agents.component.scss"],
})
export class CrmAgentsComponent implements OnInit {
  breadCrumbItems = [{ label: "MENUITEMS.CRM.TEXT" }, { label: "MENUITEMS.CRM_TEAM.TEXT", active: true }];

  agents: CrmAgent[] = [];
  loading = true;
  currentUserId = this.auth.userId;

  createModel = { firstName: "", lastName: "", email: "", password: "" };
  editTarget: CrmAgent | null = null;
  editModel = { firstName: "", lastName: "", isActive: true };
  resetTarget: CrmAgent | null = null;
  resetModel = { newPassword: "" };
  submitted = false;
  saving = false;

  @ViewChild("createModal") createModal?: ModalDirective;
  @ViewChild("editModal") editModal?: ModalDirective;
  @ViewChild("resetModal") resetModal?: ModalDirective;

  constructor(
    private crm: CrmService,
    private auth: CrmAuthService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  private t(key: string): string { return this.translate.instant(key); }
  private crmTitle(): string { return this.translate.instant("MENUITEMS.CRM.TEXT"); }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.crm.getAgents().subscribe({
      next: (agents) => {
        this.agents = agents;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  get activeCount(): number {
    return this.agents.filter((a) => a.isActive && !a.isSuperAdmin).length;
  }

  get totalAssigned(): number {
    return this.agents.reduce((sum, a) => sum + a.leadsCount, 0);
  }

  openCreate() {
    this.createModel = { firstName: "", lastName: "", email: "", password: "" };
    this.submitted = false;
    this.createModal?.show();
  }

  create() {
    this.submitted = true;
    const m = this.createModel;
    if (!m.firstName.trim() || !m.lastName.trim() || !m.email.trim() || m.password.length < 8 || this.saving) return;
    this.saving = true;
    this.crm.createAgent({ ...m, email: m.email.trim() }).subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success(this.t("CRM.AGENTS.TOAST.CREATED"), this.crmTitle());
        this.createModal?.hide();
        this.load();
      },
      error: () => (this.saving = false),
    });
  }

  openEdit(agent: CrmAgent) {
    this.editTarget = agent;
    this.editModel = { firstName: agent.firstName, lastName: agent.lastName, isActive: agent.isActive };
    this.submitted = false;
    this.editModal?.show();
  }

  saveEdit() {
    this.submitted = true;
    if (!this.editTarget || !this.editModel.firstName.trim() || !this.editModel.lastName.trim() || this.saving) return;
    this.saving = true;
    this.crm.updateAgent(this.editTarget.id, this.editModel).subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success(this.t("CRM.AGENTS.TOAST.UPDATED"), this.crmTitle());
        this.editModal?.hide();
        this.load();
      },
      error: () => (this.saving = false),
    });
  }

  toggleActive(agent: CrmAgent) {
    this.crm
      .updateAgent(agent.id, { firstName: agent.firstName, lastName: agent.lastName, isActive: !agent.isActive })
      .subscribe(() => {
        this.toastr.success(
          this.t(agent.isActive ? "CRM.AGENTS.TOAST.DEACTIVATED" : "CRM.AGENTS.TOAST.ACTIVATED"),
          this.crmTitle()
        );
        this.load();
      });
  }

  openReset(agent: CrmAgent) {
    this.resetTarget = agent;
    this.resetModel = { newPassword: "" };
    this.submitted = false;
    this.resetModal?.show();
  }

  resetPassword() {
    this.submitted = true;
    if (!this.resetTarget || this.resetModel.newPassword.length < 8 || this.saving) return;
    this.saving = true;
    this.crm.resetAgentPassword(this.resetTarget.id, this.resetModel.newPassword).subscribe({
      next: () => {
        this.saving = false;
        this.toastr.success(this.t("CRM.AGENTS.TOAST.PASSWORD_RESET"), this.crmTitle());
        this.resetModal?.hide();
      },
      error: () => (this.saving = false),
    });
  }

  initials = initials;
  avatarColor = avatarColor;
  relativeTime = relativeTime;
}
