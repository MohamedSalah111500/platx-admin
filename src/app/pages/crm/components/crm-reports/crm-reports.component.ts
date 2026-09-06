import { Component, OnInit } from "@angular/core";
import { CrmService } from "../../services/crm.service";
import { CrmAuthService } from "../../services/crm-auth.service";
import { avatarColor, initials, relativeTime } from "../../crm-utils";
import {
  ACTIVITY_TYPES,
  CrmAgentDayEntry,
  CrmAgentPerformance,
  CrmDayEntryKind,
  CrmTeamReport,
  EnumMeta,
  LEAD_STATUSES,
  metaOf,
} from "../../types";

type PresetKey = "today" | "week" | "month" | "custom";

@Component({
  selector: "app-crm-reports",
  templateUrl: "./crm-reports.component.html",
  styleUrls: ["../../crm-shared.scss", "./crm-reports.component.scss"],
})
export class CrmReportsComponent implements OnInit {
  breadCrumbItems = [{ label: "MENUITEMS.CRM.TEXT" }, { label: "MENUITEMS.CRM_REPORTS.TEXT", active: true }];

  readonly entryKind = CrmDayEntryKind;
  isSuperAdmin = this.auth.isSuperAdmin;

  preset: PresetKey = "today";
  from = "";
  to = "";

  report: CrmTeamReport | null = null;
  feed: CrmAgentDayEntry[] = [];
  loading = false;
  feedLoading = false;
  selectedAgentId: string | null = null;

  constructor(private crm: CrmService, private auth: CrmAuthService) {}

  ngOnInit() {
    this.setPreset("today");
  }

  setPreset(preset: PresetKey) {
    this.preset = preset;
    const today = new Date();
    const iso = (d: Date) => d.toISOString().slice(0, 10);

    if (preset === "today") {
      this.from = this.to = iso(today);
    } else if (preset === "week") {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      this.from = iso(start);
      this.to = iso(today);
    } else if (preset === "month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      this.from = iso(start);
      this.to = iso(today);
    }

    if (preset !== "custom") this.load();
  }

  onCustomRange() {
    this.preset = "custom";
    if (this.from && this.to) this.load();
  }

  load() {
    const range = { from: this.from, to: this.to };

    this.loading = true;
    this.crm.getTeamReport(range).subscribe({
      next: (report) => {
        this.report = report;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });

    this.feedLoading = true;
    this.crm.getActivityFeed(range, 150).subscribe({
      next: (feed) => {
        this.feed = feed;
        this.feedLoading = false;
      },
      error: () => (this.feedLoading = false),
    });
  }

  get agents(): CrmAgentPerformance[] {
    return this.report?.agents ?? [];
  }

  get visibleFeed(): CrmAgentDayEntry[] {
    return this.selectedAgentId
      ? this.feed.filter((e) => e.userId === this.selectedAgentId)
      : this.feed;
  }

  selectAgent(agent: CrmAgentPerformance) {
    this.selectedAgentId = this.selectedAgentId === agent.userId ? null : agent.userId;
  }

  get selectedAgentName(): string {
    return this.agents.find((a) => a.userId === this.selectedAgentId)?.name || "";
  }

  get busiestDay(): { day: string; leadsAdded: number } | null {
    const daily = this.report?.daily ?? [];
    if (!daily.length) return null;
    return daily.reduce((best, d) => (d.leadsAdded > best.leadsAdded ? d : best), daily[0]);
  }

  barWidth(value: number, max: number): string {
    if (!max) return "0%";
    return `${Math.max(4, Math.round((value / max) * 100))}%`;
  }

  get maxDaily(): number {
    return Math.max(1, ...(this.report?.daily ?? []).map((d) => Math.max(d.leadsAdded, d.activitiesLogged)));
  }

  statusMeta(status: number): EnumMeta {
    return metaOf(LEAD_STATUSES, status);
  }

  activityMeta(type?: number | null): EnumMeta {
    return metaOf(ACTIVITY_TYPES, type ?? 0);
  }

  initials = initials;
  avatarColor = avatarColor;
  relativeTime = relativeTime;
}
