import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ExternalUsageApiService } from "../../external-usage.service";
import {
  ExternalUsageRates,
  ExternalUsageResult,
  ExternalUsageRow,
} from "../../external-usage.types";

@Component({
  selector: "app-external-usage",
  templateUrl: "./external-usage.component.html",
  styleUrls: ["./external-usage.component.scss"],
})
export class ExternalUsageComponent implements OnInit {
  breadCrumbItems = [
    { label: "MENUITEMS.MENU.TEXT" },
    { label: "EXTERNAL_USAGE.TITLE", active: true },
  ];

  periods = [7, 30, 90, 365];
  days = 30;

  loading = true;
  refreshing = false;
  loadError = false;
  savingRates = false;
  ratesOpen = false;

  board?: ExternalUsageResult;
  rates: ExternalUsageRates = {
    currency: "USD",
    whatsAppPerMessage: 0,
    aiPerRequest: 0,
    r2PerGbMonth: 0,
    bunnyStoragePerGbMonth: 0,
    bunnyStreamingPerGb: 0,
  };

  readonly serviceIcons: Record<string, string> = {
    WHATSAPP: "bxl-whatsapp",
    AI: "bx-brain",
    R2: "bx-cloud",
    BUNNY: "bx-video-recording",
  };

  constructor(
    private api: ExternalUsageApiService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    if (this.board) {
      this.refreshing = true;
    } else {
      this.loading = true;
    }

    this.api.get(this.days).subscribe({
      next: (board) => {
        this.board = board;
        this.rates = { ...board.rates };
        this.loadError = false;
        this.loading = false;
        this.refreshing = false;
      },
      error: () => {
        this.loading = false;
        this.refreshing = false;
        this.loadError = true;
      },
    });
  }

  selectPeriod(days: number): void {
    if (this.days === days) return;
    this.days = days;
    this.load();
  }

  saveRates(): void {
    this.savingRates = true;
    this.api.saveRates(this.rates).subscribe({
      next: () => {
        this.savingRates = false;
        this.ratesOpen = false;
        this.toastr.success(this.translate.instant("EXTERNAL_USAGE.RATES_SAVED"));
        this.load();
      },
      error: () => (this.savingRates = false),
    });
  }

  share(row: ExternalUsageRow): number {
    const top = this.board?.tenants[0]?.totalCost ?? 0;
    if (!top) return 0;
    return Math.round((row.totalCost / top) * 100);
  }

  get spendingTenants(): ExternalUsageRow[] {
    return (this.board?.tenants ?? []).filter(
      (t) => t.totalCost > 0 || t.whatsAppSent > 0 || t.aiRequests > 0
    );
  }

  get idleTenants(): ExternalUsageRow[] {
    return (this.board?.tenants ?? []).filter(
      (t) => t.totalCost === 0 && t.whatsAppSent === 0 && t.aiRequests === 0
    );
  }
}
