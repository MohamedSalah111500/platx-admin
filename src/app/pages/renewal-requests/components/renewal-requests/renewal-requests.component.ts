import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { SubscriptionService } from "src/app/pages/tenant/services/subscription.service";
import {
  RenewalRequest,
  RenewalRequestStatus,
} from "src/app/pages/tenant/types/subscription.types";

@Component({
  selector: "platx-renewal-requests",
  templateUrl: "./renewal-requests.component.html",
  styleUrls: ["./renewal-requests.component.scss"],
})
export class RenewalRequestsComponent implements OnInit {
  RenewalRequestStatus = RenewalRequestStatus;
  breadCrumbItems = [{ label: "Renewal Requests", active: true }];

  items: RenewalRequest[] = [];
  totalCount = 0;
  page = 1;
  size = 20;
  filterStatus: RenewalRequestStatus | null = RenewalRequestStatus.Pending;
  loading = false;

  modalRef?: BsModalRef;
  selected?: RenewalRequest;
  handleForm: FormGroup;

  constructor(
    private subService: SubscriptionService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.handleForm = this.fb.group({
      status: [RenewalRequestStatus.Handled, Validators.required],
      adminNotes: [""],
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.subService.getRenewalRequests(this.filterStatus, this.page, this.size).subscribe({
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

  statusLabel(s: RenewalRequestStatus): string {
    return RenewalRequestStatus[s] ?? "-";
  }

  pillClass(s: RenewalRequestStatus): string {
    switch (s) {
      case RenewalRequestStatus.Pending:
        return "pill-pending";
      case RenewalRequestStatus.Handled:
        return "pill-handled";
      case RenewalRequestStatus.Rejected:
        return "pill-rejected";
      default:
        return "pill-soft";
    }
  }

  dotClass(s: RenewalRequestStatus): string {
    switch (s) {
      case RenewalRequestStatus.Pending:
        return "dot-pending";
      case RenewalRequestStatus.Handled:
        return "dot-handled";
      case RenewalRequestStatus.Rejected:
        return "dot-rejected";
      default:
        return "dot-pending";
    }
  }

  openHandle(template: TemplateRef<any>, item: RenewalRequest): void {
    this.selected = item;
    this.handleForm.reset({
      status: RenewalRequestStatus.Handled,
      adminNotes: "",
    });
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  submitHandle(): void {
    if (!this.selected || this.handleForm.invalid) return;
    const v = this.handleForm.value;
    this.subService
      .handleRenewalRequest(this.selected.id, {
        status: v.status,
        adminNotes: v.adminNotes,
      })
      .subscribe({
        next: () => {
          this.toastr.success("Request updated");
          this.modalRef?.hide();
          this.load();
        },
        error: (err) => this.toastr.error(err?.error?.message ?? "Failed"),
      });
  }
}
