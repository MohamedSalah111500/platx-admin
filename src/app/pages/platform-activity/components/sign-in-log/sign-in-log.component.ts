import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PlatformActivityService } from "../../platform-activity.service";
import {
  EngagementSummary,
  SignInEntry,
  SignInLogResult,
} from "../../platform-activity.types";

@Component({
  selector: "app-sign-in-log",
  templateUrl: "./sign-in-log.component.html",
})
export class SignInLogComponent implements OnInit {
  breadCrumbItems = [
    { label: "PLATFORM_ACTIVITY.TITLE" },
    { label: "PLATFORM_ACTIVITY.LOG.TITLE", active: true },
  ];

  periods = [1, 7, 30];
  days = 7;
  page = 1;
  size = 50;

  loading = true;
  refreshing = false;
  loadError = false;
  log?: SignInLogResult;
  engagement?: EngagementSummary;

  constructor(
    private service: PlatformActivityService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadEngagement();
  }

  loadEngagement(): void {
    this.service.engagement(10).subscribe({
      next: (engagement) => (this.engagement = engagement),
      error: () => (this.engagement = undefined),
    });
  }

  initials(name: string): string {
    const parts = (name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  }

  load(): void {
    if (this.log) {
      this.refreshing = true;
    } else {
      this.loading = true;
    }

    this.loadEngagement();
    this.service.signIns(this.days, this.page, this.size).subscribe({
      next: (log) => {
        this.log = log;
        this.loadError = false;
        this.loading = false;
        this.refreshing = false;
      },
      error: () => {
        this.loading = false;
        this.refreshing = false;
        this.loadError = true;
      },
    });
  }

  selectPeriod(days: number): void {
    if (this.days === days) return;
    this.days = days;
    this.page = 1;
    this.load();
  }

  pageChanged(event: { page: number }): void {
    this.page = event.page;
    this.load();
  }

  sourceLabel(entry: SignInEntry): string {
    return this.translate.instant(
      entry.source === 1 ? "PLATFORM_ACTIVITY.LOG.MOBILE" : "PLATFORM_ACTIVITY.LOG.WEB"
    );
  }

  roleLabel(entry: SignInEntry): string {
    const key = `PLATFORM_ACTIVITY.LOG.ROLE_${(entry.role || "").toUpperCase()}`;
    const label = this.translate.instant(key);
    return label === key ? entry.role || "—" : label;
  }
}
