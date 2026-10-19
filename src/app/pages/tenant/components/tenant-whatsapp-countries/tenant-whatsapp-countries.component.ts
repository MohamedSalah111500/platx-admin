import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { SubscriptionService } from "../../services/subscription.service";

const COUNTRIES = [
  "EG", "SA", "AE", "KW", "QA", "BH", "OM", "JO", "LB", "IQ", "SY", "PS", "YE", "LY", "TN", "DZ", "MA", "SD",
  "US", "GB", "CA", "DE", "FR", "IT", "TR", "AU",
];

interface CountryOption {
  code: string;
  name: string;
}

@Component({
  selector: "platx-tenant-whatsapp-countries",
  templateUrl: "./tenant-whatsapp-countries.component.html",
})
export class TenantWhatsAppCountriesComponent implements OnChanges {
  @Input() tenantId!: string;

  options: CountryOption[] = [];
  selected = new Set<string>();
  saved = new Set<string>();
  loading = false;
  failed = false;
  saving = false;

  constructor(
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  get dirty(): boolean {
    return this.selected.size !== this.saved.size || [...this.selected].some((code) => !this.saved.has(code));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tenantId"] && this.tenantId) this.load();
  }

  load(): void {
    this.loading = true;
    this.failed = false;
    this.subscriptionService.getWhatsAppCountries(this.tenantId).subscribe({
      next: ({ countries }) => {
        this.saved = new Set(countries);
        this.selected = new Set(countries);
        this.options = this.buildOptions(countries);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.failed = true;
      },
    });
  }

  toggle(code: string, checked: boolean): void {
    if (checked) this.selected.add(code);
    else this.selected.delete(code);
  }

  reset(): void {
    this.selected = new Set(this.saved);
  }

  save(): void {
    if (!this.selected.size || this.saving) return;
    this.saving = true;
    this.subscriptionService.setWhatsAppCountries(this.tenantId, [...this.selected]).subscribe({
      next: ({ countries }) => {
        this.saving = false;
        this.saved = new Set(countries);
        this.selected = new Set(countries);
        this.toastr.success(this.translate.instant("WHATSAPP_COUNTRIES.SAVED"));
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(err?.error?.message ?? this.translate.instant("WHATSAPP_COUNTRIES.SAVE_FAILED"));
      },
    });
  }

  private buildOptions(current: string[]): CountryOption[] {
    const lang = this.translate.currentLang || "ar";
    const names = new Intl.DisplayNames([lang], { type: "region" });
    const codes = [...new Set([...COUNTRIES, ...current])];
    return codes.map((code) => ({ code, name: names.of(code) ?? code }));
  }
}
