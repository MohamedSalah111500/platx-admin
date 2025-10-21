import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CrudService } from "./crud.service";
import { SUBSCRIPTION_URLS } from "src/app/utiltis/urls";
import { SubscriptionPlan } from "src/app/core/data/subscription-plan";

@Injectable({ providedIn: "root" })
export class SubscriptionService {
  constructor(private http: HttpClient, private crud: CrudService) {}

  getPlans(): Observable<SubscriptionPlan[]> {
    return this.crud.fetchData(SUBSCRIPTION_URLS.GET_PLANS);
  }

  getPlan(id: string | number): Observable<SubscriptionPlan> {
    const url = SUBSCRIPTION_URLS.UPDATE(id); // reuse admin url pattern: GET by id uses same path with id
    return this.http.get<SubscriptionPlan>(url);
  }

  createPlan(plan: SubscriptionPlan): Observable<any> {
    return this.http.post<any>(SUBSCRIPTION_URLS.CREATE, plan);
  }

  updatePlan(id: string | number, plan: Partial<SubscriptionPlan>): Observable<any> {
    const url = SUBSCRIPTION_URLS.UPDATE(id);
    return this.http.put<any>(url, plan);
  }

  deletePlan(id: string | number): Observable<any> {
    const url = SUBSCRIPTION_URLS.DELETE(id);
    return this.http.delete<any>(url);
  }
}
