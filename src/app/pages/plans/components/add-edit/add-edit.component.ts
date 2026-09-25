import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { forkJoin, map, of, switchMap, tap } from "rxjs";
import { CreatePlanFromContactState } from "src/app/pages/customer-contact/types";
import { CustomerContactService } from "src/app/pages/customer-contact/services/customer-contact.service";
import { SubscriptionService } from "src/app/pages/tenant/services/subscription.service";
import {
  LimitDefinition,
  LimitValueType,
  PlanLimitDto,
  SaveSubscriptionPlanPayload,
  SubscriptionPlan,
} from "src/app/pages/tenant/types/subscription.types";
import {
  LIMIT_KEY,
  PLATFORM_ADDON,
  PLATFORM_BILLING_CYCLE,
  PLATFORM_BILLING_MONTHS,
  PLATFORM_UNLIMITED,
  planColumnValue,
  platformRequestLimits,
} from "src/app/shared/platform-request";

const CUSTOM_PLAN_SORT_ORDER = 100;

@Component({
  selector: "app-add-edit",
  templateUrl: "./add-edit.component.html",
  styleUrls: ["./add-edit.component.css"],
})
export class AddEditComponent implements OnInit {
  readonly LimitValueType = LimitValueType;
  readonly PLATFORM_UNLIMITED = PLATFORM_UNLIMITED;

  breadCrumbItems: Array<{}> = [];
  planId: number | null = null;
  source: CreatePlanFromContactState | null = null;
  definitions: LimitDefinition[] = [];
  loading = true;
  saving = false;
  submitted = false;
  private existingPlan: SubscriptionPlan | null = null;

  readonly planForm = new FormGroup({
    displayName: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    description: new FormControl("", { nonNullable: true, validators: [Validators.maxLength(1000)] }),
    monthlyPrice: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    yearlyPrice: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    maxStudents: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    maxCourses: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    maxVideoSizeGB: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    isCustom: new FormControl(true, { nonNullable: true }),
  });
  readonly limitsForm = new FormGroup<Record<string, FormControl<number>>>({});

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private customerContactService: CustomerContactService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  get isEdit(): boolean {
    return this.planId !== null;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.planId = Number.isFinite(id) && id > 0 ? id : null;
    const state = history.state as Partial<CreatePlanFromContactState> | null;
    this.source =
      !this.isEdit && state?.contactId && state.platformRequest
        ? { contactId: state.contactId, contactName: state.contactName ?? "", platformRequest: state.platformRequest }
        : null;

    this.breadCrumbItems = [
      { label: "MENUITEMS.PLANS.TEXT" },
      { label: this.isEdit ? "PLANS.FORM.EDIT_TITLE" : "PLANS.FORM.CREATE_TITLE", active: true },
    ];

    if (this.isEdit) {
      this.loadForEdit(this.planId!);
    } else {
      this.loadForCreate();
    }
  }

  isInvalid(control: FormControl): boolean {
    return this.submitted && control.invalid;
  }

  sourceBillingLabel(): string {
    return this.source?.platformRequest.billingCycle === PLATFORM_BILLING_CYCLE.Annual
      ? "CONTACT.PLATFORM.BILLING.ANNUAL"
      : "CONTACT.PLATFORM.BILLING.SEMI_ANNUAL";
  }

  applyAnnualPrice(): void {
    const { paidMonths } = PLATFORM_BILLING_MONTHS[PLATFORM_BILLING_CYCLE.Annual];
    this.planForm.controls.yearlyPrice.setValue(this.planForm.controls.monthlyPrice.value * paidMonths);
  }

  limitControl(key: string): FormControl<number> {
    return this.limitsForm.controls[key];
  }

  isLimitUnlimited(key: string): boolean {
    return this.limitControl(key).value === PLATFORM_UNLIMITED;
  }

  toggleUnlimited(key: string, unlimited: boolean): void {
    this.limitControl(key).setValue(unlimited ? PLATFORM_UNLIMITED : 0);
  }

  toggleFeature(key: string, enabled: boolean): void {
    this.limitControl(key).setValue(enabled ? 1 : 0);
  }

  save(): void {
    this.submitted = true;
    if (this.planForm.invalid || this.limitsForm.invalid || this.saving) return;

    this.saving = true;
    const payload = this.buildPayload();
    const limits = this.buildLimits();
    const creating = !this.isEdit;
    const save$ = this.isEdit
      ? this.subscriptionService.updatePlan(this.planId!, payload)
      : this.subscriptionService.createPlan(payload);

    save$
      .pipe(
        tap((plan) => {
          this.planId = plan.id;
          this.existingPlan = plan;
        }),
        switchMap((plan) => this.subscriptionService.setPlanLimits(plan.id, limits).pipe(map(() => plan))),
        switchMap((plan) =>
          this.source
            ? this.customerContactService.linkSubscriptionPlan(this.source.contactId, plan.id).pipe(map(() => plan))
            : of(plan)
        )
      )
      .subscribe({
        next: () => {
          this.saving = false;
          this.toastr.success(this.translate.instant(creating ? "PLANS.FORM.CREATED" : "PLANS.FORM.UPDATED"));
          this.router.navigate([this.source ? "/customer-contact" : "/plans"]);
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(err?.error?.message ?? this.translate.instant("PLANS.FORM.SAVE_FAILED"));
        },
      });
  }

  cancel(): void {
    this.router.navigate([this.source ? "/customer-contact" : "/plans"]);
  }

  private loadForCreate(): void {
    this.subscriptionService.getDefinitions().subscribe({
      next: (definitions) => {
        const requested = this.source ? platformRequestLimits(this.source.platformRequest) : {};
        this.buildLimitControls(definitions, (def) => requested[def.key] ?? def.defaultValue);
        if (this.source) this.prefillFromRequest();
        this.loading = false;
      },
      error: () => this.onLoadFailed(),
    });
  }

  private loadForEdit(id: number): void {
    forkJoin({
      plan: this.subscriptionService.getPlan(id),
      definitions: this.subscriptionService.getDefinitions(),
      limits: this.subscriptionService.getPlanLimits(id),
    }).subscribe({
      next: ({ plan, definitions, limits }) => {
        this.existingPlan = plan;
        this.planForm.patchValue({
          displayName: plan.displayName,
          description: plan.description ?? "",
          monthlyPrice: plan.monthlyPrice,
          yearlyPrice: plan.yearlyPrice,
          maxStudents: plan.maxStudents,
          maxCourses: plan.maxCourses,
          maxVideoSizeGB: plan.maxVideoSizeGB,
          isCustom: !!plan.isCustom,
        });
        const current = new Map(limits.map((l) => [l.limitKey, l.value]));
        this.buildLimitControls(definitions, (def) => current.get(def.key) ?? def.defaultValue);
        this.loading = false;
      },
      error: () => this.onLoadFailed(),
    });
  }

  private prefillFromRequest(): void {
    const { contactName, platformRequest: request } = this.source!;
    const { paidMonths } = PLATFORM_BILLING_MONTHS[PLATFORM_BILLING_CYCLE.Annual];
    this.planForm.patchValue({
      displayName: this.translate.instant("PLANS.FORM.DEFAULT_NAME", { name: contactName }),
      monthlyPrice: request.monthlyTotal,
      yearlyPrice: request.monthlyTotal * paidMonths,
      maxStudents: planColumnValue(request.students),
      maxCourses: planColumnValue(request.courses),
      maxVideoSizeGB: planColumnValue(request.videoStorageGb),
      isCustom: true,
    });
  }

  private buildLimitControls(definitions: LimitDefinition[], valueOf: (def: LimitDefinition) => number): void {
    this.definitions = [...definitions].sort((a, b) => a.sortOrder - b.sortOrder);
    for (const def of this.definitions) {
      this.limitsForm.addControl(
        def.key,
        new FormControl(valueOf(def), {
          nonNullable: true,
          validators: [Validators.required, Validators.min(PLATFORM_UNLIMITED)],
        })
      );
    }
  }

  private buildPayload(): SaveSubscriptionPlanPayload {
    const form = this.planForm.getRawValue();
    const limits = this.limitsForm.getRawValue();
    const enabled = (key: string) => (limits[key] ?? 0) !== 0;
    const addons = this.source?.platformRequest.addons ?? [];

    return {
      name: this.existingPlan?.name ?? `custom-${this.source?.contactId ?? "plan"}-${Date.now()}`,
      displayName: form.displayName.trim(),
      description: form.description.trim() || null,
      monthlyPrice: form.monthlyPrice,
      yearlyPrice: form.yearlyPrice,
      originalPrice: this.existingPlan?.originalPrice ?? null,
      maxStudents: form.maxStudents,
      maxCourses: form.maxCourses,
      maxVideoSizeGB: form.maxVideoSizeGB,
      hasSpecializedOptions: false,
      hasCustomUI: enabled(LIMIT_KEY.CustomUi),
      hasQuizAndAssignments: enabled(LIMIT_KEY.Quizzes) || addons.includes(PLATFORM_ADDON.Exams),
      hasTechnicalSupport: enabled(LIMIT_KEY.TechnicalSupport),
      hasDocumentAndMedia: enabled(LIMIT_KEY.DocumentsMedia),
      hasLifelongAccess: false,
      hasAdvancedReports: enabled(LIMIT_KEY.AdvancedReports),
      sortOrder: this.existingPlan?.sortOrder ?? CUSTOM_PLAN_SORT_ORDER,
      isFeatured: this.existingPlan?.isFeatured ?? false,
      isPopular: this.existingPlan?.isPopular ?? false,
      isCustom: form.isCustom,
    };
  }

  private buildLimits(): PlanLimitDto[] {
    return Object.entries(this.limitsForm.getRawValue()).map(([limitKey, value]) => ({
      limitKey,
      value: Number(value),
    }));
  }

  private onLoadFailed(): void {
    this.loading = false;
    this.toastr.error(this.translate.instant("PLANS.TOAST.LOAD_FAILED"));
  }
}
