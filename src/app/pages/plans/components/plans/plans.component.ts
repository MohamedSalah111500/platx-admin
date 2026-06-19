import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { FormBuilder } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { PlansService } from "../../services/plansService.service";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { Plan } from "../../types";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { SubscriptionService } from "src/app/pages/tenant/services/subscription.service";
import { LimitDefinition, PlanLimitDto } from "src/app/pages/tenant/types/subscription.types";

@Component({
  selector: "app-plans",
  templateUrl: "./plans.component.html",
  styleUrls: ["./plans.component.scss"],
})
export class PlansComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  term: any;

  @ViewChild("newContactModal", { static: false })
  newContactModal?: ModalDirective;
  @ViewChild("removeItemModal") removeItemModal?: ModalDirective;
  @ViewChild("confirmModal") confirmModal?: ModalDirective;

  plans: Plan[] = [];
  error: string | null = null;

  deleteId: any;
  returnedArray: any;
  // -------------------
  loading: boolean = false;
  list: any[];
  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 10;
  isLoading = true;

  selectedTenant: any;

  // Plan limits editor
  limitsModalRef?: BsModalRef;
  editingPlanId?: number;
  editingPlanName = "";
  definitions: LimitDefinition[] = [];
  planLimitValues: Record<string, number> = {};
  limitsLoading = false;
  limitsSaving = false;

  constructor(
    private fb: FormBuilder,
    public toastr: ToastrService,
    public plansService: PlansService,
    private subService: SubscriptionService,
    private modalService: BsModalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage Plans" },
      { label: "List", active: true },
    ];
    this.getAllData(this.page, this.pageSize);
  }

  getAllData(pageNumber: number, pageSize: number) {
    this.plansService.getAllPLans().subscribe(
      (response) => {
        console.log(response);
        this.plans = response;
        this.returnedArray = response;
        this.totalCount = response.length;
      },
      (error) => {}
    );
  }

  search() {
    if (this.term) {
      this.list = this.returnedArray.filter((data: any) => {
        return data.name.toLowerCase().includes(this.term.toLowerCase());
      });
    } else {
      this.list = this.returnedArray;
    }
  }

  edit(item: any) {
    this.router.navigateByUrl("/tenant/add-edit", {
      state: { mode: "edit", id: item.id },
    });
  }

  // onToggle(event, tenant: string) {
  //   this.selectedTenant = tenant;
  // }

   confirmActivation() {
  //   if (this.selectedTenant.isActive) {
  //     this.tenantService.deActivateTenant(this.selectedTenant.id).subscribe(
  //       () => {
  //         this.toastr.success("Tenant DeActivated successfully");
  //         this.getAllData(this.page, this.pageSize);
  //         this.confirmModal.hide();
  //       },
  //       (error) => this.toastr.success("Tenant DeActivated Failed")
  //     );
  //   } else {
  //     this.tenantService.activateTenant(this.selectedTenant.id).subscribe(
  //       () => {
  //         this.toastr.success("Tenant DeActivated successfully");
  //         this.getAllData(this.page, this.pageSize);
  //         this.confirmModal.hide();
  //       },
  //       (error) => this.toastr.success("Tenant DeActivated Failed")
  //     );
  //   }
  }

   openDeleteModel(id: any) {
  //   this.deleteId = id;
  //   this.removeItemModal?.show();
   }

   confirmDelete(id: any) {
  //   this.tenantService.deleteTenant(id).subscribe(() => {
  //     this.toastr.success("deleted successfully", "Role");
  //     this.getAllData(this.page, this.pageSize);
  //   });
  //   this.removeItemModal?.hide();
   }

  openLimitsModal(template: TemplateRef<any>, plan: any): void {
    this.editingPlanId = plan.id;
    this.editingPlanName = plan.displayName || plan.name;
    this.planLimitValues = {};
    this.limitsLoading = true;
    this.limitsModalRef = this.modalService.show(template, { class: "modal-md" });

    forkJoin({
      defs: this.subService.getDefinitions(),
      limits: this.subService.getPlanLimits(plan.id),
    }).subscribe({
      next: ({ defs, limits }) => {
        this.definitions = defs;
        const map: Record<string, number> = {};
        defs.forEach((d) => {
          const existing = limits.find((l) => l.limitKey === d.key);
          map[d.key] = existing != null ? existing.value : d.defaultValue;
        });
        this.planLimitValues = map;
        this.limitsLoading = false;
      },
      error: () => {
        this.toastr.error("Failed to load limits");
        this.limitsLoading = false;
      },
    });
  }

  savePlanLimits(): void {
    if (this.editingPlanId == null) return;
    this.limitsSaving = true;
    const payload: PlanLimitDto[] = Object.entries(this.planLimitValues).map(
      ([limitKey, value]) => ({ limitKey, value: Number(value) })
    );
    this.subService.setPlanLimits(this.editingPlanId, payload).subscribe({
      next: () => {
        this.toastr.success("Plan limits saved");
        this.limitsModalRef?.hide();
        this.limitsSaving = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? "Failed to save limits");
        this.limitsSaving = false;
      },
    });
  }
}
