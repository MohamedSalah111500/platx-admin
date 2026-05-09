import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  AssignSubscriptionPayload,
  ExtendSubscriptionPayload,
  HandleRenewalRequestPayload,
  PagedRenewalResponse,
  RenewalRequest,
  RenewalRequestStatus,
  SubscriptionPlan,
  TenantSubscription,
} from "../types/subscription.types";
import {
  RENEWAL_REQUESTS_URLS,
  SUBSCRIPTION_PLANS_URLS,
  TENANT_SUBSCRIPTIONS_URLS,
} from "src/app/utiltis/urls";

@Injectable({ providedIn: "root" })
export class SubscriptionService {
  constructor(private http: HttpClient) {}

  // Plans
  getAllPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(SUBSCRIPTION_PLANS_URLS.GET_ALL);
  }

  // Tenant subscriptions
  getCurrent(tenantId: string): Observable<TenantSubscription | null> {
    return this.http.get<TenantSubscription | null>(
      TENANT_SUBSCRIPTIONS_URLS.GET_CURRENT(tenantId)
    );
  }

  getHistory(tenantId: string): Observable<TenantSubscription[]> {
    return this.http.get<TenantSubscription[]>(
      TENANT_SUBSCRIPTIONS_URLS.GET_HISTORY(tenantId)
    );
  }

  assign(tenantId: string, payload: AssignSubscriptionPayload): Observable<TenantSubscription> {
    return this.http.post<TenantSubscription>(
      TENANT_SUBSCRIPTIONS_URLS.ASSIGN(tenantId),
      payload
    );
  }

  extend(subscriptionId: number, payload: ExtendSubscriptionPayload): Observable<TenantSubscription> {
    return this.http.post<TenantSubscription>(
      TENANT_SUBSCRIPTIONS_URLS.EXTEND(subscriptionId),
      payload
    );
  }

  // Renewal requests
  getRenewalRequests(
    status: RenewalRequestStatus | null,
    page: number,
    size: number
  ): Observable<PagedRenewalResponse> {
    let params = new HttpParams().set("page", page).set("size", size);
    if (status !== null && status !== undefined) {
      params = params.set("status", status);
    }
    return this.http.get<PagedRenewalResponse>(RENEWAL_REQUESTS_URLS.GET_PAGED, { params });
  }

  getRenewalRequest(id: number): Observable<RenewalRequest> {
    return this.http.get<RenewalRequest>(RENEWAL_REQUESTS_URLS.GET_BY_ID(id));
  }

  handleRenewalRequest(id: number, payload: HandleRenewalRequestPayload): Observable<unknown> {
    return this.http.put(RENEWAL_REQUESTS_URLS.HANDLE(id), payload);
  }
}
