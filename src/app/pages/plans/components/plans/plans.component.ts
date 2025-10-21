import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { FormBuilder } from "@angular/forms";

import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ToastrService } from "ngx-toastr";
import { PlansService } from "../../services/plansService.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Plan } from "../../types";
import { SubscriptionService } from "src/app/core/services/subscription.service";
import { SubscriptionPlan } from "src/app/core/data/subscription-plan";

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
@ViewChild('removeItemModal', { static: false }) removeItemModal: any;
  @ViewChild("confirmModal") confirmModal?: ModalDirective;

  plans: SubscriptionPlan[] = [];
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

  constructor(
    private fb: FormBuilder,
    public toastr: ToastrService,
    public subscribtionService: SubscriptionService,
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
    this.subscribtionService.getPlans().subscribe(
      (response) => {
        this.plans = response;
        console.log(this.plans);
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
    // fallback compatibility: if edit(item) is used, forward to plans add-edit
    this.editPlan(item as SubscriptionPlan);
  }

  editPlan(plan: SubscriptionPlan) {
    this.router.navigateByUrl("/plans/add-edit", {
      state: { mode: "edit", plan },
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

  openDeleteModel(plan: SubscriptionPlan) {
    this.deleteId = plan?.id;
    this.removeItemModal?.show();
  }

  
  deletePlan = (plan: SubscriptionPlan) => {
    console.log('deletePlan invoked for', plan?.id);
    this.openDeleteModel(plan);
  };



  confirmDelete(id: any) {
    if (!id) return;
    this.subscribtionService.deletePlan(id).subscribe(
      () => {
        this.toastr.success("Plan deleted successfully");
        this.getAllData(this.page, this.pageSize);
        this.removeItemModal?.hide();
      },
      (error) => {
        this.toastr.error("Failed to delete plan");
        this.removeItemModal?.hide();
      }
    );
  }
}
