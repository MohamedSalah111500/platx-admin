import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";
import { TenantInstallmentService } from "src/app/pages/tenant/services/tenant-installment.service";
import { InstallmentStatus, TenantInstallment } from "src/app/pages/tenant/types/installment.types";
import { DueInstallmentsResult } from "src/app/pages/tenant/types/payment-plan.types";

const SEARCH_DEBOUNCE_MS = 600;

@Component({
  selector: "platx-installments-dashboard",
  templateUrl: "./installments-dashboard.component.html",
  styleUrls: ["./installments-dashboard.component.scss"],
})
export class InstallmentsDashboardComponent implements OnInit, OnDestroy {
  InstallmentStatus = InstallmentStatus;
  breadCrumbItems = [{ label: "PAYMENTS.TITLE", active: true }];

  items: TenantInstallment[] = [];
  totalCount = 0;
  totalAmount = 0;
  overdueAmount = 0;
  overdueCount = 0;
  dueThisMonthAmount = 0;
  dueThisMonthCount = 0;

  page = 1;
  size = 20;
  search = "";
  status: InstallmentStatus | null = null;
  loading = false;
  markingId: number | null = null;

  private readonly search$ = new Subject<string>();
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private installmentService: TenantInstallmentService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.search$
      .pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe(() => {
        this.page = 1;
        this.load();
      });

    this.load();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  load(): void {
    this.loading = true;
    this.installmentService
      .getDue({
        unpaidOnly: this.status === null,
        status: this.status,
        search: this.search,
        page: this.page,
        size: this.size,
      })
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res: DueInstallmentsResult) => {
          this.items = res.items ?? [];
          this.totalCount = res.totalCount ?? 0;
          this.totalAmount = res.totalAmount ?? 0;
          this.overdueAmount = res.overdueAmount ?? 0;
          this.overdueCount = res.overdueCount ?? 0;
          this.dueThisMonthAmount = res.dueThisMonthAmount ?? 0;
          this.dueThisMonthCount = res.dueThisMonthCount ?? 0;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  onSearch(term: string): void {
    this.search = term;
    this.search$.next(term || "");
  }

  setStatus(status: InstallmentStatus | null): void {
    this.status = status;
    this.page = 1;
    this.load();
  }

  onPageChange(e: { page: number }): void {
    this.page = e.page;
    this.load();
  }

  openTenant(item: TenantInstallment): void {
    this.router.navigate(["/tenants", item.tenantId]);
  }

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
        return "pill-handled";
      case InstallmentStatus.Overdue:
        return "pill-rejected";
      case InstallmentStatus.Upcoming:
        return "pill-pending";
      default:
        return "pill-soft";
    }
  }

  dotClass(status: InstallmentStatus): string {
    switch (status) {
      case InstallmentStatus.Paid:
        return "dot-handled";
      case InstallmentStatus.Overdue:
        return "dot-rejected";
      case InstallmentStatus.Upcoming:
        return "dot-pending";
      default:
        return "dot-pending";
    }
  }

  markPaid(item: TenantInstallment): void {
    this.markingId = item.id;
    this.installmentService.markPaid(item.id, {}).subscribe({
      next: () => {
        this.markingId = null;
        this.toastr.success(this.translate.instant("PAYMENTS.TOAST.MARKED_PAID"));
        this.load();
      },
      error: (err) => {
        this.markingId = null;
        this.toastr.error(err?.error?.message ?? this.translate.instant("PAYMENTS.TOAST.MARK_FAILED"));
      },
    });
  }
}
