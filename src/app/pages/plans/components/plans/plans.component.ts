import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin } from "rxjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CurrentUserService } from "src/app/core/services/current-user.service";
import { SubscriptionService } from "src/app/pages/tenant/services/subscription.service";
import {
  LimitDefinition,
  PlanLimitDto,
  SubscriptionPlan,
} from "src/app/pages/tenant/types/subscription.types";

@Component({
  selector: "app-plans",
  templateUrl: "./plans.component.html",
  styleUrls: ["./plans.component.scss"],
})
export class PlansComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  term = "";
  loading = false;
  plans: SubscriptionPlan[] = [];
  filteredPlans: SubscriptionPlan[] = [];

  limitsModalRef?: BsModalRef;
  editingPlanId?: number;
  editingPlanName = "";
  definitions: LimitDefinition[] = [];
  planLimitValues: Record<string, number> = {};
  limitsLoading = false;
  limitsSaving = false;

  constructor(
    public toastr: ToastrService,
    private subService: SubscriptionService,
    private modalService: BsModalService,
    private router: Router,
    private translate: TranslateService,
    private currentUser: CurrentUserService
  ) {}

  get canManage(): boolean {
    return this.currentUser.isSuperAdmin;
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: "MENUITEMS.PLANS.TEXT" },
      { label: "PLANS.TITLE", active: true },
    ];
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading = true;
    const plans$ = this.canManage ? this.subService.getAllPlans() : this.subService.getPublicPlans();
    plans$.subscribe({
      next: (plans) => {
        this.plans = plans;
        this.search();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error(this.translate.instant("PLANS.TOAST.LIST_FAILED"));
      },
    });
  }

  search(): void {
    const q = this.term.trim().toLowerCase();
    this.filteredPlans = q
      ? this.plans.filter((p) => `${p.displayName} ${p.name}`.toLowerCase().includes(q))
      : this.plans;
  }

  addPlan(): void {
    this.router.navigate(["/plans/add-edit"]);
  }

  edit(plan: SubscriptionPlan): void {
    this.router.navigate(["/plans/add-edit", plan.id]);
  }

  openLimitsModal(template: TemplateRef<unknown>, plan: SubscriptionPlan): void {
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
        const values: Record<string, number> = {};
        defs.forEach((d) => {
          const existing = limits.find((l) => l.limitKey === d.key);
          values[d.key] = existing != null ? existing.value : d.defaultValue;
        });
        this.planLimitValues = values;
        this.limitsLoading = false;
      },
      error: () => {
        this.toastr.error(this.translate.instant("PLANS.TOAST.LOAD_FAILED"));
        this.limitsLoading = false;
      },
    });
  }

  savePlanLimits(): void {
    if (this.editingPlanId == null) return;
    this.limitsSaving = true;
    const payload: PlanLimitDto[] = Object.entries(this.planLimitValues).map(([limitKey, value]) => ({
      limitKey,
      value: Number(value),
    }));
    this.subService.setPlanLimits(this.editingPlanId, payload).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant("PLANS.TOAST.SAVED"));
        this.limitsModalRef?.hide();
        this.limitsSaving = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? this.translate.instant("PLANS.TOAST.SAVE_FAILED"));
        this.limitsSaving = false;
      },
    });
  }
}
