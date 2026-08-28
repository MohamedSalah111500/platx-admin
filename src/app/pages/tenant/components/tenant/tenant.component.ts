import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ToastrService } from "ngx-toastr";
import { TenantService } from "./../../services/tenantService.service";
import { SubscriptionService } from "./../../services/subscription.service";
import { AnalyticsService } from "src/app/pages/dashboards/analytics.service";
import { Router } from "@angular/router";
import { forkJoin, Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Tenant } from "../../types";
import {
  SubscriptionStatus,
  TenantSubscription,
} from "../../types/subscription.types";

interface SubscriptionMeta {
  sub: TenantSubscription | null;
  daysRemaining: number;
  bucket: "active" | "expiring" | "expired" | "none";
}

@Component({
  selector: "app-tenant",
  templateUrl: "./tenant.component.html",
  styleUrls: ["./tenant.component.scss"],
})
export class TenantComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  term: any;

  @ViewChild("removeItemModal") removeItemModal?: ModalDirective;
  @ViewChild("confirmModal") confirmModal?: ModalDirective;
  @ViewChild("updateQuota") updateQuota?: ModalDirective;
  @ViewChild("fullDeleteModal") fullDeleteModal?: ModalDirective;

  deleteId: any;
  fullDeleteId: string;
  fullDeleteTenantName: string = "";
  fullDeleteConfirmText: string = "";
  returnedArray: Tenant[] = [];
  tenantIdOfQuota: string;
  // -------------------
  loading: boolean = false;
  list: Tenant[] = [];
  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 10;
  newQuota: number = 0;
  isSubmitedNewQuota = false;
  selectedTenant: any;

  // subscriptions per tenant on the current page
  subMap: Record<string, SubscriptionMeta> = {};
  subsLoading = false;

  // Filter for status pills
  statusFilter: "all" | "active" | "inactive" | "expiring" | "expired" = "all";

  // KPI stats
  stats = {
    total: 0,
    active: 0,
    inactive: 0,
    expiringSoon: 0,
    expired: 0,
  };

  constructor(
    public toastr: ToastrService,
    public tenantService: TenantService,
    public subscriptionService: SubscriptionService,
    private analyticsService: AnalyticsService,
    private router: Router
  ) {}
  OnBeforeChange: Observable<boolean> = new Observable((observer) => {
    this.confirmModal.show();
  });

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage Tenant" },
      { label: "List", active: true },
    ];
    this.getAllData(this.page, this.pageSize);
    this.loadStats();
  }

  refresh(): void {
    this.getAllData(this.page, this.pageSize);
    this.loadStats();
  }

  private loadStats(): void {
    this.analyticsService.getTenantStats().subscribe((s) => {
      this.stats = {
        total: s.totalTenants,
        active: s.activeTenants,
        inactive: s.inactiveTenants,
        expiringSoon: s.expiringSoon,
        expired: s.expired,
      };
    });
  }

  getAllData(pageNumber: number, pageSize: number) {
    this.loading = true;
    this.tenantService.getAllTenants(pageNumber, pageSize).subscribe(
      (response) => {
        this.returnedArray = response.items || [];
        this.list = this.returnedArray;
        this.totalCount = response.totalCount;
        this.loading = false;
        this.loadSubscriptionsForList();
      },
      () => {
        this.loading = false;
      }
    );
  }

  private loadSubscriptionsForList() {
    if (!this.returnedArray.length) {
      this.subMap = {};
      this.applyFilter();
      return;
    }
    this.subsLoading = true;
    const calls = this.returnedArray.map((t) =>
      this.subscriptionService.getCurrent(t.id!).pipe(
        catchError(() => of(null))
      )
    );
    forkJoin(calls).subscribe({
      next: (results) => {
        const map: Record<string, SubscriptionMeta> = {};
        results.forEach((sub, idx) => {
          const tenantId = this.returnedArray[idx].id!;
          map[tenantId] = this.toMeta(sub);
        });
        this.subMap = map;
        this.subsLoading = false;
        this.applyFilter();
      },
      error: () => {
        this.subsLoading = false;
      },
    });
  }

  private toMeta(sub: TenantSubscription | null): SubscriptionMeta {
    if (!sub) {
      return { sub: null, daysRemaining: 0, bucket: "none" };
    }
    const days = this.computeDays(sub.endDate);
    let bucket: SubscriptionMeta["bucket"];
    if (
      sub.status === SubscriptionStatus.Expired ||
      sub.status === SubscriptionStatus.Cancelled ||
      days <= 0
    ) {
      bucket = "expired";
    } else if (days <= 7 || sub.status === SubscriptionStatus.Grace) {
      bucket = "expiring";
    } else {
      bucket = "active";
    }
    return { sub, daysRemaining: days, bucket };
  }

  private computeDays(endDate: string): number {
    if (!endDate) return 0;
    const ms = new Date(endDate).getTime() - Date.now();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }

  daysSinceCreation(creationTime?: string): number {
    if (!creationTime) return 0;
    const ms = Date.now() - new Date(creationTime).getTime();
    return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  }

  relativeCreated(creationTime?: string): string {
    if (!creationTime) return "-";
    const days = this.daysSinceCreation(creationTime);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }

  initials(name?: string): string {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  avatarColor(id?: string): string {
    const palette = [
      "#6366f1",
      "#0ea5e9",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#14b8a6",
      "#ec4899",
    ];
    if (!id) return palette[0];
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % 999;
    return palette[hash % palette.length];
  }

  subMeta(tenantId?: string): SubscriptionMeta {
    if (!tenantId || !this.subMap[tenantId]) {
      return { sub: null, daysRemaining: 0, bucket: "none" };
    }
    return this.subMap[tenantId];
  }

  subPillClass(bucket: SubscriptionMeta["bucket"]): string {
    switch (bucket) {
      case "active":
        return "pill pill-success";
      case "expiring":
        return "pill pill-warning";
      case "expired":
        return "pill pill-danger";
      default:
        return "pill pill-muted";
    }
  }

  subPillLabel(meta: SubscriptionMeta): string {
    if (!meta.sub) return "No subscription";
    switch (meta.bucket) {
      case "active":
        return `${meta.daysRemaining} days left`;
      case "expiring":
        return meta.daysRemaining <= 0
          ? "Expires today"
          : `Renew in ${meta.daysRemaining}d`;
      case "expired":
        return "Expired";
      default:
        return "-";
    }
  }

  setFilter(filter: TenantComponent["statusFilter"]) {
    this.statusFilter = filter;
    this.applyFilter();
  }

  private applyFilter() {
    let result = [...this.returnedArray];
    if (this.statusFilter !== "all") {
      result = result.filter((t) => {
        const meta = this.subMap[t.id!];
        switch (this.statusFilter) {
          case "active":
            return !!t.isActive;
          case "inactive":
            return !t.isActive;
          case "expiring":
            return meta?.bucket === "expiring";
          case "expired":
            return meta?.bucket === "expired";
        }
        return true;
      });
    }
    if (this.term) {
      const q = this.term.toLowerCase();
      result = result.filter(
        (data: any) =>
          (data.title || "").toLowerCase().includes(q) ||
          (data.domain || "").toLowerCase().includes(q) ||
          (data.email || "").toLowerCase().includes(q) ||
          (data.phoneNumber || "").toLowerCase().includes(q)
      );
    }
    this.list = result;
  }

  search() {
    this.applyFilter();
  }

  edit(item: any) {
    this.router.navigate(["/tenant/add-edit", item.id]);
  }

  manageSubscription(item: any) {
    this.router.navigate(["/tenant/subscription", item.id]);
  }

  onToggle(event, tenant: Tenant) {
    this.selectedTenant = tenant;
  }

  confirmActivation() {
    if (this.selectedTenant.isActive) {
      this.tenantService.deActivateTenant(this.selectedTenant.id).subscribe(
        () => {
          this.toastr.success("Tenant DeActivated successfully");
          this.getAllData(this.page, this.pageSize);
          this.loadStats();
          this.confirmModal.hide();
        },
        () => this.toastr.error("Tenant DeActivated Failed")
      );
    } else {
      this.tenantService.activateTenant(this.selectedTenant.id).subscribe(
        () => {
          this.toastr.success("Tenant Activated successfully");
          this.getAllData(this.page, this.pageSize);
          this.loadStats();
          this.confirmModal.hide();
        },
        () => this.toastr.error("Tenant Activated Failed")
      );
    }
  }
  // pagechanged
  pageChanged(event: PageChangedEvent): void {
    if (event.page === this.page) return;
    this.page = event.page;
    // page-scope filters are reset when paginating — server-side filtering would be a separate endpoint
    this.statusFilter = "all";
    this.term = "";
    this.getAllData(event.page, event.itemsPerPage);
  }

  onPageSizeChange(): void {
    this.page = 1;
    this.statusFilter = "all";
    this.term = "";
    this.getAllData(this.page, this.pageSize);
  }

  openDeleteModel(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show();
  }
  openUpgradeQuotaModal(id: string, quota: number) {
    this.tenantIdOfQuota = id;
    this.newQuota = quota;
    this.updateQuota?.show();
  }
  onConfirmChangeQuota() {
    this.isSubmitedNewQuota = true;
    if (!this.newQuota) return;
    this.tenantService
      .updateTenantQuota(this.tenantIdOfQuota, this.newQuota)
      .subscribe({
        next: () => {
          this.toastr.success("Quota Updated successfully");
          this.getAllData(this.page, this.pageSize);
        },
        error: () => this.toastr.error("Quota Updated Failed"),
        complete: () => {
          this.updateQuota?.hide();
          this.isSubmitedNewQuota = false;
        },
      });
  }
  onCancelChangeQuota() {
    this.newQuota = 0;
    this.updateQuota?.hide();
  }
  confirmDelete(id: any) {
    this.tenantService.deleteTenant(id).subscribe(() => {
      this.toastr.success("deleted successfully", "Role");
      this.getAllData(this.page, this.pageSize);
      this.loadStats();
    });
    this.removeItemModal?.hide();
  }

  openFullDeleteModel(id: string, name: string) {
    this.fullDeleteId = id;
    this.fullDeleteTenantName = name;
    this.fullDeleteConfirmText = "";
    this.fullDeleteModal?.show();
  }

  confirmFullDelete() {
    if (this.fullDeleteConfirmText !== "delete") return;
    this.tenantService.fullDeleteTenant(this.fullDeleteId).subscribe(
      () => {
        this.toastr.success("Tenant deleted permanently", "Tenant");
        this.getAllData(this.page, this.pageSize);
        this.loadStats();
        this.fullDeleteModal?.hide();
      },
      () => {
        this.toastr.error("Failed to delete tenant", "Tenant");
      }
    );
  }

  cancelFullDelete() {
    this.fullDeleteConfirmText = "";
    this.fullDeleteModal?.hide();
  }
}
