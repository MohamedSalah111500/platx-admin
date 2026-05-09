import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TenantService } from "../../services/tenantService.service";
import { Tenant } from "../../types";

@Component({
  selector: "platx-tenant-subscription",
  templateUrl: "./tenant-subscription.component.html",
  styleUrls: ["./tenant-subscription.component.scss"],
})
export class TenantSubscriptionComponent implements OnInit {
  tenantId!: string;
  tenant?: Tenant;
  loading = false;

  breadCrumbItems = [
    { label: "Manage Tenant" },
    { label: "Subscription", active: true },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.tenantId = this.route.snapshot.paramMap.get("id") ?? "";
    if (this.tenantId) {
      this.loadTenant();
    }
  }

  loadTenant(): void {
    this.loading = true;
    this.tenantService.getTenant(this.tenantId).subscribe({
      next: (t) => {
        this.tenant = t;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  back(): void {
    this.router.navigate(["/tenant"]);
  }
}
