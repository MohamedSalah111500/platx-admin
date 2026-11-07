import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { LandingThemeOption, TenantService } from "../../services/tenantService.service";

@Component({
  selector: "platx-tenant-landing-theme",
  templateUrl: "./tenant-landing-theme.component.html",
})
export class TenantLandingThemeComponent implements OnChanges {
  @Input() tenantId!: string;

  themes: LandingThemeOption[] = [];
  selected = "";
  saved = "";
  loading = false;
  failed = false;
  saving = false;

  constructor(
    private tenantService: TenantService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tenantId"] && this.tenantId) this.load();
  }

  load(): void {
    this.loading = true;
    this.failed = false;
    this.tenantService.getLandingTheme(this.tenantId).subscribe({
      next: ({ themeId, themes }) => {
        this.themes = themes;
        this.saved = themeId;
        this.selected = themeId;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.failed = true;
      },
    });
  }

  themeName(theme: LandingThemeOption): string {
    return (this.translate.currentLang || "ar") === "ar" ? theme.nameAr : theme.nameEn;
  }

  save(): void {
    if (this.saving || this.selected === this.saved) return;
    this.saving = true;
    this.tenantService.setLandingTheme(this.tenantId, this.selected).subscribe({
      next: ({ themeId }) => {
        this.saving = false;
        this.saved = themeId;
        this.selected = themeId;
        this.toastr.success(this.translate.instant("LANDING_THEME.SAVED"));
      },
      error: () => (this.saving = false),
    });
  }
}
