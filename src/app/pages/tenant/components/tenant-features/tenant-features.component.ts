import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import {
  LIMIT_GROUP,
  LIMIT_GROUPS,
  LimitGroup,
  limitGroupHint,
  limitGroupTitle,
  limitHint,
  limitMeta,
  limitName,
  limitOrder,
} from "src/app/shared/limit-catalog";
import { PLATFORM_MAX_QUANTITY, PLATFORM_UNLIMITED } from "src/app/shared/platform-request";
import { SubscriptionService } from "../../services/subscription.service";
import { LimitPeriod, LimitValueType, TenantLimitUsage } from "../../types/subscription.types";

interface FeatureSection {
  group: LimitGroup;
  title: string;
  hint: string;
  items: TenantLimitUsage[];
}

interface LimitDraft {
  value: number | null;
  unlimited: boolean;
  reason: string;
}

@Component({
  selector: "platx-tenant-features",
  templateUrl: "./tenant-features.component.html",
})
export class TenantFeaturesComponent implements OnChanges {
  @Input() tenantId!: string;

  readonly LIMIT_GROUP = LIMIT_GROUP;
  readonly limitName = limitName;
  readonly limitHint = limitHint;

  planName?: string;
  sections: FeatureSection[] = [];
  loading = false;
  failed = false;
  busy = new Set<string>();
  editingKey: string | null = null;
  draft: LimitDraft = { value: null, unlimited: false, reason: "" };

  constructor(
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tenantId"] && this.tenantId) this.load();
  }

  load(): void {
    this.loading = true;
    this.failed = false;
    this.subscriptionService.getTenantDashboard(this.tenantId).subscribe({
      next: (dashboard) => {
        this.planName = dashboard.planName;
        this.sections = this.buildSections(dashboard.items);
        this.loading = false;
        if (this.route.snapshot.fragment === "features")
          setTimeout(() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }));
      },
      error: () => {
        this.loading = false;
        this.failed = true;
      },
    });
  }

  icon(item: TenantLimitUsage): string {
    return limitMeta(item.key, this.isToggle(item)).icon;
  }

  presets(item: TenantLimitUsage): number[] {
    return limitMeta(item.key, false).presets ?? [];
  }

  isToggle(item: TenantLimitUsage): boolean {
    return item.valueType === LimitValueType.Boolean;
  }

  isOn(item: TenantLimitUsage): boolean {
    return item.limit !== 0;
  }

  baseValue(item: TenantLimitUsage): number {
    return item.planValue ?? item.defaultValue;
  }

  isUnlimitedValue(value: number): boolean {
    return value === PLATFORM_UNLIMITED;
  }

  percent(item: TenantLimitUsage): number {
    if (item.isUnlimited || item.limit <= 0) return 0;
    return Math.min(100, Math.round((item.used / item.limit) * 100));
  }

  barClass(item: TenantLimitUsage): string {
    const percent = this.percent(item);
    return percent >= 90 ? "bg-danger" : percent >= 75 ? "bg-warning" : "bg-primary";
  }

  periodKey(period: LimitPeriod): string | null {
    switch (period) {
      case LimitPeriod.Monthly: return "LIMITS.PERIOD.MONTHLY";
      case LimitPeriod.Daily: return "LIMITS.PERIOD.DAILY";
      case LimitPeriod.Subscription: return "LIMITS.PERIOD.SUBSCRIPTION";
      default: return null;
    }
  }

  toggle(item: TenantLimitUsage, enabled: boolean): void {
    const previous = item.limit;
    item.limit = enabled ? 1 : 0;
    this.save(item, item.limit, "", () => (item.limit = previous));
  }

  startEdit(item: TenantLimitUsage): void {
    this.editingKey = item.key;
    this.draft = {
      value: item.isUnlimited ? null : item.limit,
      unlimited: item.isUnlimited,
      reason: item.isOverridden ? item.reason ?? "" : "",
    };
  }

  cancelEdit(): void {
    this.editingKey = null;
  }

  applyPreset(value: number): void {
    this.draft.value = value;
    this.draft.unlimited = false;
  }

  draftValid(): boolean {
    if (this.draft.unlimited) return true;
    const value = this.draft.value;
    return value !== null && Number.isInteger(value) && value >= 0 && value <= PLATFORM_MAX_QUANTITY;
  }

  saveEdit(item: TenantLimitUsage): void {
    if (!this.draftValid()) return;
    const value = this.draft.unlimited ? PLATFORM_UNLIMITED : Number(this.draft.value);
    this.save(item, value, this.draft.reason.trim(), () => {}, () => (this.editingKey = null));
  }

  reset(item: TenantLimitUsage): void {
    this.run(item, this.subscriptionService.removeTenantOverride(this.tenantId, item.key), () => {});
  }

  private save(item: TenantLimitUsage, value: number, reason: string, revert: () => void, done?: () => void): void {
    const request = value === this.baseValue(item) && !reason
      ? this.subscriptionService.removeTenantOverride(this.tenantId, item.key)
      : this.subscriptionService.setTenantOverride({ tenantId: this.tenantId, limitKey: item.key, value, reason: reason || undefined });
    this.run(item, request, revert, done);
  }

  private run(item: TenantLimitUsage, request: Observable<unknown>, revert: () => void, done?: () => void): void {
    this.busy.add(item.key);
    request.subscribe({
      next: () => {
        this.busy.delete(item.key);
        done?.();
        this.toastr.success(this.translate.instant("LIMITS.SAVED"));
        this.refresh();
      },
      error: (err) => {
        this.busy.delete(item.key);
        revert();
        this.toastr.error(err?.error?.message ?? this.translate.instant("LIMITS.SAVE_FAILED"));
      },
    });
  }

  private refresh(): void {
    this.subscriptionService.getTenantDashboard(this.tenantId).subscribe({
      next: (dashboard) => (this.sections = this.buildSections(dashboard.items)),
    });
  }

  private buildSections(items: TenantLimitUsage[]): FeatureSection[] {
    const sorted = [...items].sort((a, b) => limitOrder(a.key) - limitOrder(b.key));
    return LIMIT_GROUPS.map((group) => ({
      group,
      title: limitGroupTitle(group),
      hint: limitGroupHint(group),
      items: sorted.filter((item) => limitMeta(item.key, this.isToggle(item)).group === group),
    })).filter((section) => section.items.length > 0);
  }
}
