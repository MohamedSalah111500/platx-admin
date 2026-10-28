import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { silentRequest } from "src/app/core/helpers/http-context";
import { EXTERNAL_USAGE_URLS } from "src/app/utiltis/urls";
import { ExternalUsageRates, ExternalUsageResult } from "./external-usage.types";

@Injectable({ providedIn: "root" })
export class ExternalUsageApiService {
  constructor(private http: HttpClient) {}

  get(days: number): Observable<ExternalUsageResult> {
    return this.http.get<ExternalUsageResult>(EXTERNAL_USAGE_URLS.USAGE(days), silentRequest());
  }

  saveRates(rates: ExternalUsageRates): Observable<ExternalUsageRates> {
    return this.http.put<ExternalUsageRates>(EXTERNAL_USAGE_URLS.RATES, rates);
  }
}
