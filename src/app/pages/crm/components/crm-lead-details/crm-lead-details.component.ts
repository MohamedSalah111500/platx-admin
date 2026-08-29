import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { CrmService } from "../../services/crm.service";
import { CrmAuthService } from "../../services/crm-auth.service";
import { avatarColor, followUpState, fromInputDateTime, initials, relativeTime, waLink } from "../../crm-utils";
import { CrmLeadFormComponent } from "../crm-lead-form/crm-lead-form.component";
import { CrmStatusModalComponent } from "../crm-status-modal/crm-status-modal.component";
import {
  ACTIVITY_TYPES,
  CrmActivity,
  CrmActivityType,
  CrmAgent,
  CrmLead,
  CrmLeadStatus,
  EnumMeta,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  LOGGABLE_ACTIVITY_TYPES,
  metaOf,
} from "../../types";

@Component({
  selector: "app-crm-lead-details",
  templateUrl: "./crm-lead-details.component.html",
  styleUrls: ["../../crm-shared.scss", "./crm-lead-details.component.scss"],
})
export class CrmLeadDetailsComponent implements OnInit {
  breadCrumbItems = [{ label: "CRM" }, { label: "Leads", link: "/crm/leads" }, { label: "Details", active: true }];

  statuses = LEAD_STATUSES;
  activityTypes = LOGGABLE_ACTIVITY_TYPES;
  isSuperAdmin = this.auth.isSuperAdmin;

  leadId = 0;
  lead: CrmLead | null = null;
  loading = true;
  agents: CrmAgent[] = [];

  activities: CrmActivity[] = [];
  activitiesTotal = 0;
  activitiesPage = 1;
  readonly activitiesSize = 20;
  activitiesLoading = false;

  newActivity = { type: CrmActivityType.Note, content: "", nextFollowUpAt: "", markAsContacted: false };
  savingActivity = false;

  @ViewChild("leadForm") leadForm?: CrmLeadFormComponent;
  @ViewChild("statusModal") statusModal?: CrmStatusModalComponent;
  @ViewChild("removeModal") removeModal?: ModalDirective;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private crm: CrmService,
    private auth: CrmAuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.leadId = Number(params.get("id"));
      this.loadLead();
      this.loadActivities(true);
    });
    this.crm.getAgents().subscribe((agents) => (this.agents = agents));
  }

  loadLead() {
    this.loading = true;
    this.crm.getLead(this.leadId).subscribe({
      next: (lead) => {
        this.lead = lead;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(["/crm/leads"]);
      },
    });
  }

  loadActivities(reset = false) {
    if (reset) {
      this.activitiesPage = 1;
      this.activities = [];
    }
    this.activitiesLoading = true;
    this.crm.getActivities(this.leadId, this.activitiesPage, this.activitiesSize).subscribe({
      next: (res) => {
        this.activities = reset ? res.items : [...this.activities, ...res.items];
        this.activitiesTotal = res.totalCount;
        this.activitiesLoading = false;
      },
      error: () => (this.activitiesLoading = false),
    });
  }

  loadMoreActivities() {
    this.activitiesPage++;
    this.loadActivities();
  }

  get hasMoreActivities(): boolean {
    return this.activities.length < this.activitiesTotal;
  }

  addActivity() {
    const content = this.newActivity.content.trim();
    if (!content || this.savingActivity) return;
    this.savingActivity = true;
    this.crm
      .addActivity(this.leadId, {
        type: Number(this.newActivity.type),
        content,
        nextFollowUpAt: fromInputDateTime(this.newActivity.nextFollowUpAt),
        markAsContacted: this.newActivity.markAsContacted,
      })
      .subscribe({
        next: (activity) => {
          this.savingActivity = false;
          this.activities = [activity, ...this.activities];
          this.activitiesTotal++;
          this.newActivity = { type: this.newActivity.type, content: "", nextFollowUpAt: "", markAsContacted: false };
          this.toastr.success("Activity logged", "CRM");
          this.loadLead();
        },
        error: () => (this.savingActivity = false),
      });
  }

  quickStatus(status: CrmLeadStatus) {
    if (!this.lead || status === this.lead.status) return;
    this.statusModal?.open(this.lead, status);
  }

  onStatusChanged(lead: CrmLead) {
    this.lead = lead;
    this.loadActivities(true);
  }

  onSaved(lead: CrmLead) {
    this.lead = lead;
    this.loadActivities(true);
  }

  assign(userId: string | null) {
    if (!this.lead || (this.lead.assignedToUserId || null) === userId) return;
    this.crm.assign(this.lead.id, userId).subscribe((lead) => {
      this.lead = lead;
      this.toastr.success(lead.assignedToName ? `Assigned to ${lead.assignedToName}` : "Unassigned", "CRM");
      this.loadActivities(true);
    });
  }

  confirmDelete() {
    if (!this.lead) return;
    this.crm.deleteLead(this.lead.id).subscribe(() => {
      this.toastr.success("Lead deleted", "CRM");
      this.router.navigate(["/crm/leads"]);
    });
    this.removeModal?.hide();
  }

  get activeAgents(): CrmAgent[] {
    return this.agents.filter((a) => a.isActive);
  }

  statusMeta(status: CrmLeadStatus): EnumMeta {
    return metaOf(LEAD_STATUSES, status);
  }

  sourceMeta(source: number): EnumMeta {
    return metaOf(LEAD_SOURCES, source);
  }

  priorityMeta(priority: number): EnumMeta {
    return metaOf(LEAD_PRIORITIES, priority);
  }

  activityMeta(type: CrmActivityType): EnumMeta {
    return metaOf(ACTIVITY_TYPES, type);
  }

  waLink = waLink;
  initials = initials;
  avatarColor = avatarColor;
  relativeTime = relativeTime;
  followUpState = followUpState;
}
