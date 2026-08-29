import { Component, OnInit, ViewChild } from "@angular/core";
import { CrmService } from "../../services/crm.service";
import { avatarColor, followUpState, initials, relativeTime, waLink } from "../../crm-utils";
import { CrmStatusModalComponent } from "../crm-status-modal/crm-status-modal.component";
import { CrmLeadFormComponent } from "../crm-lead-form/crm-lead-form.component";
import {
  CrmAgent,
  CrmLead,
  CrmLeadStatus,
  CrmPipelineColumn,
  EnumMeta,
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  metaOf,
} from "../../types";

@Component({
  selector: "app-crm-pipeline",
  templateUrl: "./crm-pipeline.component.html",
  styleUrls: ["../../crm-shared.scss", "./crm-pipeline.component.scss"],
})
export class CrmPipelineComponent implements OnInit {
  breadCrumbItems = [{ label: "CRM" }, { label: "Pipeline", active: true }];

  statuses = LEAD_STATUSES;
  columns: CrmPipelineColumn[] = [];
  loading = true;
  agents: CrmAgent[] = [];
  showClosed = false;

  @ViewChild("statusModal") statusModal?: CrmStatusModalComponent;
  @ViewChild("leadForm") leadForm?: CrmLeadFormComponent;

  constructor(private crm: CrmService) {}

  ngOnInit() {
    this.load();
    this.crm.getAgents().subscribe((agents) => (this.agents = agents));
  }

  load() {
    this.loading = true;
    this.crm.getPipeline(30).subscribe({
      next: (columns) => {
        this.columns = columns;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  get visibleColumns(): CrmPipelineColumn[] {
    return this.showClosed
      ? this.columns
      : this.columns.filter((c) => c.status !== CrmLeadStatus.Won && c.status !== CrmLeadStatus.Lost);
  }

  get openCount(): number {
    return this.columns
      .filter((c) => c.status !== CrmLeadStatus.Won && c.status !== CrmLeadStatus.Lost)
      .reduce((sum, c) => sum + c.total, 0);
  }

  move(lead: CrmLead, status: CrmLeadStatus) {
    if (status === lead.status) return;
    this.statusModal?.open(lead, status);
  }

  statusMeta(status: CrmLeadStatus): EnumMeta {
    return metaOf(LEAD_STATUSES, status);
  }

  priorityMeta(priority: number): EnumMeta {
    return metaOf(LEAD_PRIORITIES, priority);
  }

  waLink = waLink;
  initials = initials;
  avatarColor = avatarColor;
  relativeTime = relativeTime;
  followUpState = followUpState;
}
