import { Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { errorMapper } from "src/app/utiltis/functions";
import { SubscriptionService } from "src/app/core/services/subscription.service";
import { SubscriptionPlan } from "src/app/core/data/subscription-plan";
import { Router } from "@angular/router";

@Component({
  selector: "platx-admin-add-edit",
  templateUrl: "./add-edit.component.html",
  styleUrl: "./add-edit.component.css",
})
export class AddEditComponent {
  errorMapper = errorMapper;
  breadCrumbItems: Array<{}> = [
    { label: "Subscription Plans" },
    { label: "Add/Edit Plan", active: true },
  ];
  submitted = false;
  mode: string = "create";
  subscriptionForm: FormGroup<any> = this.fb.group<any>({
    id: new FormControl("", []),
    name: new FormControl("", [Validators.required]),
    displayName: new FormControl("", []),
    description: new FormControl("", []),
    monthlyPrice: new FormControl(0, []),
    yearlyPrice: new FormControl(0, []),
    originalPrice: new FormControl(0, []),
    maxStudents: new FormControl(0, []),
    maxCourses: new FormControl(0, []),
    maxVideoSizeGB: new FormControl(0, []),
    hasSpecializedOptions: new FormControl(true, []),
    hasCustomUI: new FormControl(true, []),
    hasQuizAndAssignments: new FormControl(true, []),
    hasTechnicalSupport: new FormControl(true, []),
    hasDocumentAndMedia: new FormControl(true, []),
    hasLifelongAccess: new FormControl(true, []),
    hasAdvancedReports: new FormControl(true, []),
    sortOrder: new FormControl(0, []),
    isFeatured: new FormControl(true, []),
    isPopular: new FormControl(true, []),
  });

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    public toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mode = history.state?.mode;

    // If the full plan object was passed in navigation state, use it to prefill the form
    const navPlan = history.state?.plan as SubscriptionPlan | undefined;
    if (navPlan && this.mode === "edit") {
      this.updateForm(navPlan);
      return;
    }

    if (this.mode == "edit") {
      this.getPlan(history.state?.id);
    }
  }

  getPlan(id: string) {
    if (!id) return;
    this.subscriptionService.getPlan(id).subscribe(
      (response) => this.updateForm(response),
      (error) => {}
    );
  }

  updateForm(plan: SubscriptionPlan): void {
    const mappedResponse = {
      id: plan.id,
      name: plan.name || "",
      displayName: plan.displayName || "",
      description: plan.description || "",
      monthlyPrice: plan.monthlyPrice ?? 0,
      yearlyPrice: plan.yearlyPrice ?? 0,
      originalPrice: plan.originalPrice ?? 0,
      maxStudents: plan.maxStudents ?? 0,
      maxCourses: plan.maxCourses ?? 0,
      maxVideoSizeGB: plan.maxVideoSizeGB ?? 0,
      hasSpecializedOptions: plan.hasSpecializedOptions ?? false,
      hasCustomUI: plan.hasCustomUI ?? false,
      hasQuizAndAssignments: plan.hasQuizAndAssignments ?? false,
      hasTechnicalSupport: plan.hasTechnicalSupport ?? false,
      hasDocumentAndMedia: plan.hasDocumentAndMedia ?? false,
      hasLifelongAccess: plan.hasLifelongAccess ?? false,
      hasAdvancedReports: plan.hasAdvancedReports ?? false,
      sortOrder: plan.sortOrder ?? 0,
      isFeatured: plan.isFeatured ?? false,
      isPopular: plan.isPopular ?? false,
    };
    this.subscriptionForm.patchValue(mappedResponse);
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.subscriptionForm.valid) return;

    const payload = this.subscriptionForm.value;

    if (this.mode == "edit") {
      this.subscriptionService.updatePlan(payload.id, payload).subscribe({
        next: () => {
          this.toastr.success("Plan updated successfully");
          this.router.navigate(["/plans"]);
        },
        error: (err) => {
          this.toastr.error(this.errorMapper(err.error?.errors) ?? "Error Please Try Again");
          this.submitted = false;
        },
      });
    } else {
      this.subscriptionService.createPlan(payload).subscribe({
        next: () => {
          this.toastr.success("Plan created successfully");
          this.router.navigate(["/plans"]);
        },
        error: (err) => {
          this.toastr.error(this.errorMapper(err.error?.errors) ?? "Error Please Try Again");
          this.submitted = false;
        },
      });
    }
  }
}
