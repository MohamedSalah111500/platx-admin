import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { TenantInstallmentService } from "../../services/tenant-installment.service";
import { InstallmentStatus, TenantInstallment } from "../../types/installment.types";
import {
  InstallmentFrequency,
  PaymentPlanKind,
  PlanPreviewLine,
  TenantFinancialSummary,
} from "../../types/payment-plan.types";
import { buildPlanPreview, SchedulePlanInput } from "../../services/payment-schedule";

interface PlanDraft extends SchedulePlanInput {
  depositAlreadyPaid: boolean;
}

@Component({
  selector: "platx-tenant-installments-section",
  templateUrl: "./installments-section.component.html",
  styleUrls: ["./installments-section.component.scss"],
})
export class InstallmentsSectionComponent implements OnChanges {
  @Input() tenantId!: string;
  @Input() tenantTotalAmount?: number | null;
  @Output() tenantTotalAmountChange = new EventEmitter<number | null>();

  InstallmentStatus = InstallmentStatus;
  PaymentPlanKind = PaymentPlanKind;
  InstallmentFrequency = InstallmentFrequency;

  readonly depositPercents = [10, 25, 50];
  readonly quickCounts = [3, 6, 12];

  items: TenantInstallment[] = [];
  summary: TenantFinancialSummary | null = null;
  loading = false;

  modalRef?: BsModalRef;
  form: FormGroup;
  editingId: number | null = null;

  deleteModalRef?: BsModalRef;
  itemToDelete: TenantInstallment | null = null;

  planModalRef?: BsModalRef;
  savingPlan = false;
  plan: PlanDraft = this.emptyPlan();
  preview: PlanPreviewLine[] = [];

  constructor(
    private installmentService: TenantInstallmentService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
      dueDate: [null, Validators.required],
      note: [""],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tenantId"] && this.tenantId) {
      this.load();
    }
  }

  load(): void {
    this.loading = true;
    this.installmentService.getByTenant(this.tenantId).subscribe({
      next: (items) => {
        this.items = items ?? [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
    this.loadSummary();
  }

  private loadSummary(): void {
    this.installmentService.getSummary(this.tenantId).subscribe({
      next: (summary) => {
        this.summary = summary;
        if (summary.contractAmount !== this.tenantTotalAmount) {
          this.tenantTotalAmount = summary.contractAmount;
          this.tenantTotalAmountChange.emit(summary.contractAmount);
        }
      },
      error: () => (this.summary = null),
    });
  }

  get hasPaidInstallments(): boolean {
    return this.items.some((i) => i.isPaid);
  }

  get overdueCount(): number {
    return this.summary?.overdueCount ?? 0;
  }

  get collectedPercentage(): number {
    return Math.min(100, Math.max(0, this.summary?.collectedPercentage ?? 0));
  }

  // ---------------------------------------------------------------- payment plan

  private emptyPlan(): PlanDraft {
    return {
      totalAmount: 0,
      kind: PaymentPlanKind.EqualInstallments,
      depositAmount: null,
      depositDueDate: null,
      installmentsCount: 3,
      frequency: InstallmentFrequency.Monthly,
      firstDueDate: new Date().toISOString().substring(0, 10),
      depositAlreadyPaid: false,
    };
  }

  openPlanModal(template: TemplateRef<any>): void {
    this.plan = this.emptyPlan();
    this.plan.totalAmount = this.tenantTotalAmount ?? 0;
    this.onPlanChange();
    this.planModalRef = this.modalService.show(template, { class: "modal-lg" });
  }

  selectKind(kind: PaymentPlanKind): void {
    this.plan.kind = kind;
    if (kind === PaymentPlanKind.PaidInFull) {
      this.plan.installmentsCount = 1;
      this.plan.depositAmount = null;
    } else if (this.plan.installmentsCount < 1) {
      this.plan.installmentsCount = 3;
    }
    this.onPlanChange();
  }

  applyDepositPercent(percent: number): void {
    if (!this.plan.totalAmount) return;
    this.plan.depositAmount = Math.round(this.plan.totalAmount * (percent / 100) * 100) / 100;
    this.onPlanChange();
  }

  applyCount(count: number): void {
    this.plan.installmentsCount = count;
    this.onPlanChange();
  }

  onPlanChange(): void {
    this.preview = buildPlanPreview(this.plan);
  }

  get previewTotal(): number {
    return Math.round(this.preview.reduce((sum, l) => sum + l.amount, 0) * 100) / 100;
  }

  get previewMatchesTotal(): boolean {
    return Math.abs(this.previewTotal - Number(this.plan.totalAmount || 0)) < 0.005;
  }

  get canSavePlan(): boolean {
    return this.preview.length > 0 && this.previewMatchesTotal && !this.hasPaidInstallments;
  }

  /** The one-line answer to "what did I just set up?" shown above the preview. */
  get planSentence(): string {
    if (this.preview.length === 0) return "";

    if (this.plan.kind === PaymentPlanKind.PaidInFull) {
      return this.translate.instant("INST.PLAN.SENTENCE_FULL", {
        amount: this.formatAmount(this.plan.totalAmount),
      });
    }

    const frequency = this.translate.instant(this.frequencyKey(this.plan.frequency));

    if (this.plan.kind === PaymentPlanKind.DepositThenInstallments) {
      const installments = this.preview.filter((l) => !l.isDeposit);
      return this.translate.instant("INST.PLAN.SENTENCE_DEPOSIT", {
        deposit: this.formatAmount(this.plan.depositAmount ?? 0),
        count: installments.length,
        amount: this.formatAmount(installments[0]?.amount ?? 0),
        frequency,
      });
    }

    return this.translate.instant("INST.PLAN.SENTENCE_EQUAL", {
      count: this.preview.length,
      amount: this.formatAmount(this.preview[0]?.amount ?? 0),
      frequency,
    });
  }

  private frequencyKey(frequency: InstallmentFrequency): string {
    switch (frequency) {
      case InstallmentFrequency.Weekly:
        return "INST.PLAN.EVERY_WEEK";
      case InstallmentFrequency.Quarterly:
        return "INST.PLAN.EVERY_QUARTER";
      case InstallmentFrequency.Yearly:
        return "INST.PLAN.EVERY_YEAR";
      default:
        return "INST.PLAN.EVERY_MONTH";
    }
  }

  private formatAmount(value: number): string {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value || 0);
  }

  savePlan(): void {
    if (!this.canSavePlan || this.savingPlan) return;
    this.savingPlan = true;

    this.installmentService
      .generatePlan(this.tenantId, {
        totalAmount: Number(this.plan.totalAmount),
        kind: this.plan.kind,
        depositAmount: this.plan.kind === PaymentPlanKind.DepositThenInstallments ? Number(this.plan.depositAmount) : null,
        depositDueDate: this.plan.depositDueDate || null,
        installmentsCount: this.plan.kind === PaymentPlanKind.PaidInFull ? 1 : Number(this.plan.installmentsCount),
        frequency: this.plan.frequency,
        firstDueDate: this.plan.firstDueDate!,
        replaceExisting: true,
        depositAlreadyPaid: this.plan.depositAlreadyPaid,
      })
      .subscribe({
        next: (result) => {
          this.savingPlan = false;
          this.items = result.installments ?? [];
          this.summary = result.summary;
          this.tenantTotalAmount = result.summary.contractAmount;
          this.tenantTotalAmountChange.emit(result.summary.contractAmount);
          this.planModalRef?.hide();
          this.toastr.success(this.translate.instant("INST.PLAN.SAVED"));
        },
        error: (err) => {
          this.savingPlan = false;
          this.toastr.error(err?.error?.message ?? this.translate.instant("INST.PLAN.SAVE_FAILED"));
        },
      });
  }

  // ---------------------------------------------------------------- single installment

  statusLabel(status: InstallmentStatus): string {
    switch (status) {
      case InstallmentStatus.Paid: return "INST.STATUS.PAID";
      case InstallmentStatus.Overdue: return "INST.STATUS.OVERDUE";
      case InstallmentStatus.Upcoming: return "INST.STATUS.UPCOMING";
      default: return "-";
    }
  }

  pillClass(status: InstallmentStatus): string {
    switch (status) {
      case InstallmentStatus.Paid:
        return "pill-active";
      case InstallmentStatus.Overdue:
        return "pill-expired";
      case InstallmentStatus.Upcoming:
        return "pill-grace";
      default:
        return "pill-soft";
    }
  }

  dotClass(status: InstallmentStatus): string {
    switch (status) {
      case InstallmentStatus.Paid:
        return "dot-active";
      case InstallmentStatus.Overdue:
        return "dot-expired";
      case InstallmentStatus.Upcoming:
        return "dot-grace";
      default:
        return "dot-active";
    }
  }

  openAddModal(template: TemplateRef<any>): void {
    this.editingId = null;
    this.form.reset({ amount: null, dueDate: null, note: "" });
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  openEditModal(template: TemplateRef<any>, item: TenantInstallment): void {
    this.editingId = item.id;
    this.form.reset({
      amount: item.amount,
      dueDate: item.dueDate ? item.dueDate.substring(0, 10) : null,
      note: item.note ?? "",
    });
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;

    if (this.editingId != null) {
      const existing = this.items.find((i) => i.id === this.editingId);
      this.installmentService
        .update(this.editingId, {
          amount: v.amount,
          dueDate: v.dueDate,
          note: v.note,
          sortOrder: existing?.sortOrder ?? 0,
        })
        .subscribe({
          next: () => {
            this.toastr.success(this.translate.instant("INST.TOAST.UPDATED"));
            this.modalRef?.hide();
            this.load();
          },
          error: (err) => this.toastr.error(err?.error?.message ?? this.translate.instant("INST.TOAST.UPDATE_FAILED")),
        });
    } else {
      this.installmentService
        .create(this.tenantId, { amount: v.amount, dueDate: v.dueDate, note: v.note })
        .subscribe({
          next: () => {
            this.toastr.success(this.translate.instant("INST.TOAST.ADDED"));
            this.modalRef?.hide();
            this.load();
          },
          error: (err) => this.toastr.error(err?.error?.message ?? this.translate.instant("INST.TOAST.ADD_FAILED")),
        });
    }
  }

  markPaid(item: TenantInstallment): void {
    this.installmentService.markPaid(item.id, {}).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant("INST.TOAST.MARKED_PAID"));
        this.load();
      },
      error: (err) => this.toastr.error(err?.error?.message ?? this.translate.instant("INST.TOAST.MARK_FAILED")),
    });
  }

  markUnpaid(item: TenantInstallment): void {
    this.installmentService.markUnpaid(item.id).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant("INST.TOAST.MARKED_UNPAID"));
        this.load();
      },
      error: (err) => this.toastr.error(err?.error?.message ?? this.translate.instant("INST.TOAST.MARK_FAILED")),
    });
  }

  openDeleteConfirm(template: TemplateRef<any>, item: TenantInstallment): void {
    this.itemToDelete = item;
    this.deleteModalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  confirmDelete(): void {
    if (!this.itemToDelete) return;
    this.installmentService.delete(this.itemToDelete.id).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant("INST.TOAST.DELETED"));
        this.deleteModalRef?.hide();
        this.load();
      },
      error: (err) => this.toastr.error(err?.error?.message ?? this.translate.instant("INST.TOAST.DELETE_FAILED")),
    });
  }
}
