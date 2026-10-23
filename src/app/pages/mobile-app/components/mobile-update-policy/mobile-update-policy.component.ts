import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MobileAppService } from "../../mobile-app.service";
import { MobilePlatform, MobileUpdatePolicy } from "../../mobile-app.types";

@Component({
  selector: "platx-mobile-update-policy",
  templateUrl: "./mobile-update-policy.component.html",
})
export class MobileUpdatePolicyComponent implements OnInit {
  breadCrumbItems = [{ label: "MOBILE_APP.TITLE", active: true }];
  policies: MobileUpdatePolicy[] = [];
  loading = true;
  failed = false;
  saving: MobilePlatform | null = null;

  constructor(
    private mobileApp: MobileAppService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.failed = false;
    this.mobileApp.getPolicy().subscribe({
      next: (policies) => {
        this.policies = policies;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.failed = true;
      },
    });
  }

  toggle(policy: MobileUpdatePolicy, forceUpdate: boolean): void {
    this.saving = policy.platform;
    this.mobileApp.setForceUpdate(policy.platform, forceUpdate).subscribe({
      next: (policies) => {
        this.policies = policies;
        this.saving = null;
        this.toastr.success(this.translate.instant("MOBILE_APP.SAVED"));
      },
      error: () => {
        this.saving = null;
        policy.forceUpdate = !forceUpdate;
      },
    });
  }

  icon(platform: MobilePlatform): string {
    return platform === "ios" ? "bxl-apple" : "bxl-android";
  }
}
