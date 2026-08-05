import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TenantInstallmentService } from "src/app/pages/tenant/services/tenant-installment.service";
import { InstallmentStatus, TenantInstallment } from "src/app/pages/tenant/types/installment.types";

@Component({
  selector: "platx-installments-dashboard",
  templateUrl: "./installments-dashboard.component.html",
  styleUrls: ["./installments-dashboard.component.scss"],
})
export class InstallmentsDashboardComponent implements OnInit {
  InstallmentStatus = InstallmentStatus;
  breadCrumbItems = [{ label: "Payments Due", active: true }];

  items: TenantInstallment[] = [];
  totalCount = 0;
  page = 1;
  size = 20;
  unpaidOnly = true;
  loading = false;

  constructor(
    private installmentService: TenantInstallmentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.installmentService.getDue(this.unpaidOnly, this.page, this.size).subscribe({
      next: (res) => {
        this.items = res.items ?? [];
        this.totalCount = res.totalCount ?? 0;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onFilterChange(): void {
    this.page = 1;
    this.load();
  }

  onPageChange(e: { page: number }): void {
    this.page = e.page;
    this.load();
  }

  statusLabel(status: InstallmentStatus): string {
    switch (status) {
      case InstallmentStatus.Paid:
        return "Paid";
      case InstallmentStatus.Overdue:
        return "Overdue";
      case InstallmentStatus.Upcoming:
        return "Upcoming";
      default:
        return "-";
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
    this.installmentService.markPaid(item.id, {}).subscribe({
      next: () => {
        this.toastr.success("Marked as paid");
        this.load();
      },
      error: (err) => this.toastr.error(err?.error?.message ?? "Failed to mark as paid"),
    });
  }
}
