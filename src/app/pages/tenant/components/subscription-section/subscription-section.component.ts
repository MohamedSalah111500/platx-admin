import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TemplateRef } from "@angular/core";
import { SubscriptionService } from "../../services/subscription.service";
import {
  LimitPeriod,
  SubscriptionPlan,
  SubscriptionStatus,
  TenantLimitsDashboard,
  TenantLimitUsage,
  TenantSubscription,
} from "../../types/subscription.types";

@Component({
  selector: "platx-tenant-subscription-section",
  templateUrl: "./subscription-section.component.html",
  styleUrls: ["./subscription-section.component.scss"],
})
export class SubscriptionSectionComponent implements OnChanges {
  @Input() tenantId!: string;

  // Expose enums to template
  SubscriptionStatus = SubscriptionStatus;
  LimitPeriod = LimitPeriod;

  current: TenantSubscription | null = null;
  history: TenantSubscription[] = [];
  plans: SubscriptionPlan[] = [];
  loading = false;

  dashboard: TenantLimitsDashboard | null = null;
  limitsLoading = false;

  modalRef?: BsModalRef;
  assignForm: FormGroup;
  extendForm: FormGroup;
  overrideModalRef?: BsModalRef;
  overrideItem?: TenantLimitUsage;
  overrideForm: FormGroup;

  constructor(
    private subService: SubscriptionService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.assignForm = this.fb.group({
      subscriptionPlanId: [null, Validators.required],
      durationDays: [30, [Validators.required, Validators.min(1)]],
      amount: [null],
    });
    this.extendForm = this.fb.group({
      days: [30, [Validators.required, Validators.min(1)]],
    });
    this.overrideForm = this.fb.group({
      value: [null, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tenantId"] && this.tenantId) {
      this.loadAll();
    }
  }

  loadAll(): void {
    this.loading = true;
    this.subService.getCurrent(this.tenantId).subscribe({
      next: (c) => (this.current = c),
      error: () => (this.current = null),
    });
    this.subService.getHistory(this.tenantId).subscribe({
      next: (h) => {
        this.history = h ?? [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
    if (this.plans.length === 0) {
      this.subService.getAllPlans().subscribe({
        next: (p) => (this.plans = p),
      });
    }
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.limitsLoading = true;
    this.subService.getTenantDashboard(this.tenantId).subscribe({
      next: (d) => {
        this.dashboard = d;
        this.limitsLoading = false;
      },
      error: () => (this.limitsLoading = false),
    });
  }

  statusLabel(status: SubscriptionStatus): string {
    switch (status) {
      case SubscriptionStatus.Active:
        return "Active";
      case SubscriptionStatus.Grace:
        return "Grace";
      case SubscriptionStatus.Expired:
        return "Expired";
      case SubscriptionStatus.Cancelled:
        return "Cancelled";
      default:
        return "-";
    }
  }

  pillClass(status: SubscriptionStatus): string {
    switch (status) {
      case SubscriptionStatus.Active:
        return "pill-active";
      case SubscriptionStatus.Grace:
        return "pill-grace";
      case SubscriptionStatus.Expired:
        return "pill-expired";
      case SubscriptionStatus.Cancelled:
        return "pill-cancelled";
      default:
        return "pill-soft";
    }
  }

  dotClass(status: SubscriptionStatus): string {
    switch (status) {
      case SubscriptionStatus.Active:
        return "dot-active";
      case SubscriptionStatus.Grace:
        return "dot-grace";
      case SubscriptionStatus.Expired:
        return "dot-expired";
      case SubscriptionStatus.Cancelled:
        return "dot-cancelled";
      default:
        return "dot-active";
    }
  }

  daysRemaining(endDate: string): number {
    const ms = new Date(endDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }

  openAssignModal(template: TemplateRef<any>): void {
    this.assignForm.reset({
      subscriptionPlanId: this.plans[0]?.id ?? null,
      durationDays: 30,
      amount: null,
    });
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  openExtendModal(template: TemplateRef<any>): void {
    this.extendForm.reset({ days: 30 });
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  onPlanChange(): void {
    const planId = this.assignForm.value.subscriptionPlanId;
    const plan = this.plans.find((p) => p.id === planId);
    if (plan) {
      this.assignForm.patchValue({ amount: plan.monthlyPrice }, { emitEvent: false });
    }
  }

  submitAssign(): void {
    if (this.assignForm.invalid) return;
    const v = this.assignForm.value;
    this.subService
      .assign(this.tenantId, {
        subscriptionPlanId: v.subscriptionPlanId,
        durationDays: v.durationDays,
        amount: v.amount,
      })
      .subscribe({
        next: () => {
          this.toastr.success("Subscription assigned");
          this.modalRef?.hide();
          this.loadAll();
        },
        error: (err) => this.toastr.error(err?.error?.message ?? "Failed to assign"),
      });
  }

  submitExtend(): void {
    if (this.extendForm.invalid || !this.current) return;
    this.subService
      .extend(this.current.id, { days: this.extendForm.value.days })
      .subscribe({
        next: () => {
          this.toastr.success("Subscription extended");
          this.modalRef?.hide();
          this.loadAll();
        },
        error: (err) => this.toastr.error(err?.error?.message ?? "Failed to extend"),
      });
  }

  openOverrideModal(template: TemplateRef<any>, item: TenantLimitUsage): void {
    this.overrideItem = item;
    this.overrideForm.reset({
      value: item.isUnlimited ? -1 : item.limit,
    });
    this.overrideModalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  submitOverride(): void {
    if (this.overrideForm.invalid || !this.overrideItem) return;
    const v = this.overrideForm.value;
    this.subService
      .setTenantOverride({
        tenantId: this.tenantId,
        limitKey: this.overrideItem.key,
        value: v.value,
      })
      .subscribe({
        next: () => {
          this.toastr.success("Override saved");
          this.overrideModalRef?.hide();
          this.loadDashboard();
        },
        error: (err) => this.toastr.error(err?.error?.message ?? "Failed to save override"),
      });
  }

  removeOverride(key: string): void {
    this.subService.removeTenantOverride(this.tenantId, key).subscribe({
      next: () => {
        this.toastr.success("Override removed");
        this.loadDashboard();
      },
      error: () => this.toastr.error("Failed to remove override"),
    });
  }

  limitPercent(item: TenantLimitUsage): number {
    if (item.isUnlimited || item.limit <= 0) return 0;
    return Math.min(100, Math.round((item.used / item.limit) * 100));
  }

  periodLabel(p: LimitPeriod): string {
    switch (p) {
      case LimitPeriod.Monthly: return "monthly";
      case LimitPeriod.Daily: return "daily";
      case LimitPeriod.Total: return "total";
      default: return "";
    }
  }
}
