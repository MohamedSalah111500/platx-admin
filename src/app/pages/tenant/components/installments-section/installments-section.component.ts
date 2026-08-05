import { Component, Input, OnChanges, SimpleChanges, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { TenantInstallmentService } from "../../services/tenant-installment.service";
import { InstallmentStatus, TenantInstallment } from "../../types/installment.types";

@Component({
  selector: "platx-tenant-installments-section",
  templateUrl: "./installments-section.component.html",
  styleUrls: ["./installments-section.component.scss"],
})
export class InstallmentsSectionComponent implements OnChanges {
  @Input() tenantId!: string;

  InstallmentStatus = InstallmentStatus;

  items: TenantInstallment[] = [];
  loading = false;

  modalRef?: BsModalRef;
  form: FormGroup;
  editingId: number | null = null;

  deleteModalRef?: BsModalRef;
  itemToDelete: TenantInstallment | null = null;

  constructor(
    private installmentService: TenantInstallmentService,
    private modalService: BsModalService,
    private toastr: ToastrService,
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
  }

  get totalAmount(): number {
    return this.items.reduce((sum, i) => sum + i.amount, 0);
  }

  get paidAmount(): number {
    return this.items.filter((i) => i.isPaid).reduce((sum, i) => sum + i.amount, 0);
  }

  get outstandingAmount(): number {
    return this.totalAmount - this.paidAmount;
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
            this.toastr.success("Installment updated");
            this.modalRef?.hide();
            this.load();
          },
          error: (err) => this.toastr.error(err?.error?.message ?? "Failed to update installment"),
        });
    } else {
      this.installmentService
        .create(this.tenantId, { amount: v.amount, dueDate: v.dueDate, note: v.note })
        .subscribe({
          next: () => {
            this.toastr.success("Installment added");
            this.modalRef?.hide();
            this.load();
          },
          error: (err) => this.toastr.error(err?.error?.message ?? "Failed to add installment"),
        });
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

  markUnpaid(item: TenantInstallment): void {
    this.installmentService.markUnpaid(item.id).subscribe({
      next: () => {
        this.toastr.success("Marked as unpaid");
        this.load();
      },
      error: (err) => this.toastr.error(err?.error?.message ?? "Failed to mark as unpaid"),
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
        this.toastr.success("Installment deleted");
        this.deleteModalRef?.hide();
        this.load();
      },
      error: (err) => this.toastr.error(err?.error?.message ?? "Failed to delete installment"),
    });
  }
}
