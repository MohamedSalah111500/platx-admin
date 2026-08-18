import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { COMPANY_ANALYTICS_URLS } from "src/app/utiltis/urls";
import {
  CompanyActivity,
  CompanyEngagement,
  CompanyGrowth,
  CompanyOverview,
  CompanyRevenue,
  TenantStats,
} from "./analytics.models";

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getOverview(): Observable<CompanyOverview> {
    return this.http.get<CompanyOverview>(COMPANY_ANALYTICS_URLS.OVERVIEW);
  }

  getGrowth(months = 12): Observable<CompanyGrowth> {
    return this.http.get<CompanyGrowth>(COMPANY_ANALYTICS_URLS.GROWTH(months));
  }

  getActivity(): Observable<CompanyActivity> {
    return this.http.get<CompanyActivity>(COMPANY_ANALYTICS_URLS.ACTIVITY);
  }

  getEngagement(recentTake = 8, topTake = 5): Observable<CompanyEngagement> {
    return this.http.get<CompanyEngagement>(
      COMPANY_ANALYTICS_URLS.ENGAGEMENT(recentTake, topTake)
    );
  }

  getRevenue(): Observable<CompanyRevenue> {
    return this.http.get<CompanyRevenue>(COMPANY_ANALYTICS_URLS.REVENUE);
  }

  getTenantStats(): Observable<TenantStats> {
    return this.http.get<TenantStats>(COMPANY_ANALYTICS_URLS.TENANT_STATS);
  }
}
