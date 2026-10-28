import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PlatformActivityService } from "../../platform-activity.service";
import {
  PlatformActivityResult,
  PlatformActivityRow,
  PlatformGroup,
  PlatformState,
} from "../../platform-activity.types";

@Component({
  selector: "app-platform-activity",
  templateUrl: "./platform-activity.component.html",
  styleUrls: ["./platform-activity.component.scss"],
})
export class PlatformActivityComponent implements OnInit {
  breadCrumbItems = [
    { label: "MENUITEMS.MENU.TEXT" },
    { label: "PLATFORM_ACTIVITY.TITLE", active: true },
  ];

  periods = [1, 7, 30];
  days = 30;

  loading = true;
  refreshing = false;
  loadError = false;
  board?: PlatformActivityResult;

  constructor(
    private service: PlatformActivityService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    if (this.board) {
      this.refreshing = true;
    } else {
      this.loading = true;
    }

    this.service.get(this.days).subscribe({
      next: (board) => {
        this.board = board;
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
    this.load();
  }

  get groups(): PlatformGroup[] {
    const rows = this.board?.platforms ?? [];

    const openedToday = rows.filter((r) => r.openedToday);
    const thisWeek = rows.filter((r) => !r.openedToday && r.state === PlatformState.Active);
    const quiet = rows.filter((r) => r.state === PlatformState.Quiet);
    const dormant = rows.filter((r) => r.state === PlatformState.Dormant);
    const never = rows.filter((r) => r.state === PlatformState.Never);

    return [
      { key: "OPENED_TODAY", icon: "bx-check-circle", tone: "success", rows: openedToday },
      { key: "THIS_WEEK", icon: "bx-time-five", tone: "info", rows: thisWeek },
      { key: "QUIET", icon: "bx-volume-mute", tone: "warning", rows: quiet },
      { key: "DORMANT", icon: "bx-error-circle", tone: "danger", rows: dormant },
      { key: "NEVER", icon: "bx-ghost", tone: "muted", rows: never },
    ].filter((group) => group.rows.length > 0);
  }

  lastActivityLabel(row: PlatformActivityRow): string {
    const days = row.daysSinceActivity;
    if (days === null || days === undefined) return this.t("PLATFORM_ACTIVITY.NO_ACTIVITY");
    if (days === 0) return this.t("PLATFORM_ACTIVITY.TODAY");
    if (days === 1) return this.t("PLATFORM_ACTIVITY.YESTERDAY");
    return this.translate.instant("PLATFORM_ACTIVITY.DAYS_AGO", { days });
  }

  alertLink(row: PlatformActivityRow): string {
    const subject = this.translate.instant("PLATFORM_ACTIVITY.MAIL_SUBJECT", { name: row.title });
    const body = this.translate.instant("PLATFORM_ACTIVITY.MAIL_BODY", { name: row.title });
    return `mailto:${row.adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}
