import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Observable, forkJoin, map } from "rxjs";
import { CreatePlatformFromContactState } from "src/app/pages/customer-contact/types";
import { errorMapper } from "src/app/utiltis/functions";
import {
  ADDON_LIMIT_KEYS,
  AI_UNLIMITED_QUOTA,
  FEATURE_DISABLED,
  FEATURE_ENABLED,
  LIMIT_KEY,
  LIMIT_VALUE_PATTERN,
  PLATFORM_MAX_QUANTITY,
  PLATFORM_UNLIMITED,
  SUBSCRIPTION_TERM,
  SUBSCRIPTION_TERM_DETAILS,
  SubscriptionTerm,
  platformRequestLimits,
} from "src/app/shared/platform-request";
import { SubscriptionService } from "../../services/subscription.service";
import { TenantService } from "../../services/tenantService.service";
import { Tenant } from "../../types";
import { LimitDefinition, LimitValueType, SubscriptionPlan } from "../../types/subscription.types";

interface FeatureGroup {
  titleKey: string;
  hintKey: string;
  definitions: LimitDefinition[];
}

const CUSTOM_TEMPLATE = "custom";
const DEFAULT_AI_QUOTA = 30;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EDIT_LOCKED_FIELDS = ["FirstName", "LastName", "Email", "IsActive"] as const;

@Component({
  selector: "platx-admin-add-edit",
  templateUrl: "./add-edit.component.html",
  styleUrl: "./add-edit.component.css",
})
export class AddEditComponent implements OnInit {
  readonly CUSTOM_TEMPLATE = CUSTOM_TEMPLATE;
  readonly terms = Object.values(SUBSCRIPTION_TERM);

  breadCrumbItems: Array<{}> = [];
  mode: "create" | "edit" = "create";
  tenantId: string | null = null;
  source: CreatePlatformFromContactState | null = null;
  loading = true;
  saving = false;
  submitted = false;
  plans: SubscriptionPlan[] = [];
  numberDefinitions: LimitDefinition[] = [];
  featureGroups: FeatureGroup[] = [];
  private currentQuotaAI = DEFAULT_AI_QUOTA;

  readonly tenantForm = new FormGroup({
    FirstName: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    LastName: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    Email: new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.email] }),
    PhoneNumber: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    Title: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    Domain: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    Description: new FormControl("", { nonNullable: true }),
    IsActive: new FormControl(true, { nonNullable: true }),
    LogoFile: new FormControl<unknown>(null),
    CoverFile: new FormControl<unknown>(null),
  });

  readonly subscriptionForm = new FormGroup({
    template: new FormControl<string>(CUSTOM_TEMPLATE, { nonNullable: true }),
    monthlyPrice: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    term: new FormControl<SubscriptionTerm>(SUBSCRIPTION_TERM.Monthly, { nonNullable: true }),
  });

  readonly limitsForm = new FormGroup<Record<string, FormControl<number>>>({});

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantService: TenantService,
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  get isCreate(): boolean {
    return this.mode === "create";
  }

  get subscriptionAmount(): number {
    const { monthlyPrice, term } = this.subscriptionForm.getRawValue();
    return (monthlyPrice || 0) * SUBSCRIPTION_TERM_DETAILS[term].paidMonths;
  }

  get subscriptionDays(): number {
    return SUBSCRIPTION_TERM_DETAILS[this.subscriptionForm.controls.term.value].days;
  }

  ngOnInit(): void {
    this.tenantId = this.route.snapshot.paramMap.get("id");
    this.mode = this.tenantId ? "edit" : "create";
    this.breadCrumbItems = [
      { label: "MENUITEMS.MANAGE_TENANT.TEXT" },
      { label: this.isCreate ? "TENANT_FORM.CREATE_TITLE" : "TENANT_FORM.EDIT_TITLE", active: true },
    ];

    if (this.isCreate) {
      this.source = this.readSourceFromState();
      this.loadCreateData();
    } else {
      this.loadTenant(this.tenantId!);
    }
  }

  isInvalid(control: FormControl<unknown>): boolean {
    return this.submitted && control.invalid;
  }

  termLabel(term: SubscriptionTerm): string {
    return `TENANT_FORM.TERM.${term.toUpperCase()}`;
  }

  limitControl(key: string): FormControl<number> {
    return this.limitsForm.controls[key];
  }

  isUnlimited(key: string): boolean {
    return this.limitControl(key).value === PLATFORM_UNLIMITED;
  }

  toggleUnlimited(key: string, unlimited: boolean): void {
    this.limitControl(key).setValue(unlimited ? PLATFORM_UNLIMITED : 0);
  }

  toggleFeature(key: string, enabled: boolean): void {
    this.limitControl(key).setValue(enabled ? FEATURE_ENABLED : FEATURE_DISABLED);
  }

  setGroupFeatures(group: FeatureGroup, enabled: boolean): void {
    for (const def of group.definitions) this.toggleFeature(def.key, enabled);
  }

  applyTemplate(template: string): void {
    if (template === CUSTOM_TEMPLATE) return;
    const plan = this.plans.find((p) => String(p.id) === template);
    if (!plan) return;

    this.subscriptionForm.controls.monthlyPrice.setValue(plan.monthlyPrice);
    this.subscriptionService.getPlanLimits(plan.id).subscribe({
      next: (limits) => {
        const values = new Map(limits.map((l) => [l.limitKey, l.value]));
        for (const def of [...this.numberDefinitions, ...this.featureGroups.flatMap((g) => g.definitions)]) {
          this.limitControl(def.key).setValue(values.get(def.key) ?? def.defaultValue);
        }
      },
      error: () => this.toastr.error(this.translate.instant("TENANT_FORM.TOAST.TEMPLATE_FAILED")),
    });
  }

  onFileUploadSuccess(control: "LogoFile" | "CoverFile", file: unknown): void {
    this.tenantForm.controls[control].setValue(file);
  }

  save(): void {
    this.submitted = true;
    const formsValid = this.isCreate
      ? this.tenantForm.valid && this.subscriptionForm.valid && this.limitsForm.valid
      : this.tenantForm.valid;
    if (!formsValid || this.saving) return;

    this.saving = true;
    const creating = this.isCreate;
    const request$: Observable<string | null> = creating
      ? this.tenantService.postCreateTenant(this.buildCreatePayload()).pipe(map((response) => response?.tenantId ?? null))
      : this.tenantService.putUpdateTenant(this.buildUpdatePayload()).pipe(map(() => null));

    request$.subscribe({
      next: (createdId) => {
        this.saving = false;
        this.toastr.success(this.translate.instant(creating ? "TENANT_FORM.TOAST.CREATED" : "TENANT_FORM.TOAST.UPDATED"));
        this.router.navigate(createdId ? ["/tenant/subscription", createdId] : ["/tenant"]);
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(
          errorMapper(err?.error?.errors) ?? err?.error?.message ?? this.translate.instant("TENANT_FORM.TOAST.SAVE_FAILED")
        );
      },
    });
  }

  cancel(): void {
    this.router.navigate([this.source ? "/customer-contact" : "/tenant"]);
  }

  private readSourceFromState(): CreatePlatformFromContactState | null {
    const state = history.state as Partial<CreatePlatformFromContactState> | null;
    if (!state?.contactId || !state.platformRequest) return null;
    return {
      contactId: state.contactId,
      name: state.name ?? "",
      email: state.email ?? "",
      phone: state.phone ?? "",
      platformRequest: state.platformRequest,
    };
  }

  private loadCreateData(): void {
    forkJoin({
      plans: this.subscriptionService.getAllPlans(),
      definitions: this.subscriptionService.getDefinitions(),
    }).subscribe({
      next: ({ plans, definitions }) => {
        this.plans = plans.filter((p) => p.isActive && !p.isCustom).sort((a, b) => a.sortOrder - b.sortOrder);
        const requested = this.source ? platformRequestLimits(this.source.platformRequest) : {};
        this.buildLimitControls(definitions, (def) => requested[def.key] ?? this.defaultLimitValue(def));
        if (this.source) this.prefillFromRequest();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error(this.translate.instant("TENANT_FORM.TOAST.LOAD_FAILED"));
      },
    });
  }

  private loadTenant(id: string): void {
    this.tenantService.getTenant(id).subscribe({
      next: (tenant: Tenant) => {
        this.currentQuotaAI = tenant.quotaAI ?? DEFAULT_AI_QUOTA;
        this.tenantForm.patchValue({
          FirstName: tenant.firstName ?? "",
          LastName: tenant.lastName ?? "",
          Email: tenant.email ?? "",
          PhoneNumber: tenant.phoneNumber ?? "",
          Title: tenant.title ?? "",
          Domain: tenant.domain ?? "",
          Description: tenant.description ?? "",
          IsActive: tenant.isActive ?? true,
          LogoFile: tenant.logoFile ?? null,
          CoverFile: tenant.coverFile ?? null,
        });
        for (const control of EDIT_LOCKED_FIELDS) this.tenantForm.controls[control].disable();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error(this.translate.instant("TENANT_FORM.TOAST.LOAD_FAILED"));
      },
    });
  }

  private prefillFromRequest(): void {
    const { name, email, phone, platformRequest } = this.source!;
    const [firstName, ...rest] = name.trim().split(/\s+/);
    this.tenantForm.patchValue({
      FirstName: firstName ?? "",
      LastName: rest.join(" ") || firstName || "",
      Email: EMAIL_PATTERN.test(email) ? email : "",
      PhoneNumber: phone,
    });
    this.subscriptionForm.patchValue({
      monthlyPrice: platformRequest.monthlyTotal,
      term: platformRequest.billingCycle,
    });
  }

  private defaultLimitValue(def: LimitDefinition): number {
    const isCoreFeature = def.valueType === LimitValueType.Boolean && !ADDON_LIMIT_KEYS.has(def.key);
    return isCoreFeature ? FEATURE_ENABLED : def.defaultValue;
  }

  private buildLimitControls(definitions: LimitDefinition[], valueOf: (def: LimitDefinition) => number): void {
    const sorted = [...definitions].sort((a, b) => a.sortOrder - b.sortOrder);
    const features = sorted.filter((d) => d.valueType === LimitValueType.Boolean);
    this.numberDefinitions = sorted.filter((d) => d.valueType !== LimitValueType.Boolean);
    this.featureGroups = [
      {
        titleKey: "TENANT_FORM.ADDON_FEATURES_TITLE",
        hintKey: "TENANT_FORM.ADDON_FEATURES_HINT",
        definitions: features.filter((d) => ADDON_LIMIT_KEYS.has(d.key)),
      },
      {
        titleKey: "TENANT_FORM.CORE_FEATURES_TITLE",
        hintKey: "TENANT_FORM.CORE_FEATURES_HINT",
        definitions: features.filter((d) => !ADDON_LIMIT_KEYS.has(d.key)),
      },
    ];
    for (const def of sorted) {
      this.limitsForm.addControl(
        def.key,
        new FormControl(valueOf(def), {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.max(PLATFORM_MAX_QUANTITY),
            Validators.pattern(LIMIT_VALUE_PATTERN),
          ],
        })
      );
    }
  }

  private appendTenantFields(formData: FormData): void {
    const form = this.tenantForm.getRawValue();
    formData.append("FirstName", form.FirstName.trim());
    formData.append("LastName", form.LastName.trim());
    formData.append("Email", form.Email.trim());
    formData.append("PhoneNumber", form.PhoneNumber.trim());
    formData.append("Title", form.Title.trim());
    formData.append("Domain", form.Domain.trim());
    formData.append("Description", form.Description);
    formData.append("IsActive", String(form.IsActive));
    if (form.LogoFile instanceof File) formData.append("LogoFile", form.LogoFile);
    if (form.CoverFile instanceof File) formData.append("CoverFile", form.CoverFile);
  }

  private buildCreatePayload(): FormData {
    const formData = new FormData();
    this.appendTenantFields(formData);

    const limits = this.limitsForm.getRawValue();
    const aiCredits = limits[LIMIT_KEY.AiCredits];
    const quotaAI =
      aiCredits === undefined ? DEFAULT_AI_QUOTA : aiCredits === PLATFORM_UNLIMITED ? AI_UNLIMITED_QUOTA : aiCredits;
    formData.append("QuotaAI", String(quotaAI));

    const { template } = this.subscriptionForm.getRawValue();
    if (template !== CUSTOM_TEMPLATE) formData.append("SubscriptionPlanId", template);
    formData.append("SubscriptionAmount", String(this.subscriptionAmount));
    formData.append("SubscriptionDurationDays", String(this.subscriptionDays));
    formData.append(
      "SubscriptionBillingCycle",
      String(SUBSCRIPTION_TERM_DETAILS[this.subscriptionForm.controls.term.value].billingCycle)
    );
    formData.append(
      "LimitOverrides",
      JSON.stringify(Object.entries(limits).map(([limitKey, value]) => ({ limitKey, value: Number(value) })))
    );
    if (this.source) formData.append("SourceContactId", this.source.contactId);
    return formData;
  }

  private buildUpdatePayload(): FormData {
    const formData = new FormData();
    formData.append("Id", this.tenantId!);
    formData.append("QuotaAI", String(this.currentQuotaAI));
    this.appendTenantFields(formData);
    return formData;
  }
}
