import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { silentRequest } from "src/app/core/helpers/http-context";
import { COMPANY_ANALYTICS_URLS } from "src/app/utiltis/urls";
import {
  EngagementSummary,
  PlatformActivityResult,
  SignInLogResult,
} from "./platform-activity.types";

@Injectable({ providedIn: "root" })
export class PlatformActivityService {
  constructor(private http: HttpClient) {}

  get(days: number): Observable<PlatformActivityResult> {
    return this.http.get<PlatformActivityResult>(
      COMPANY_ANALYTICS_URLS.PLATFORM_ACTIVITY(days),
      silentRequest()
    );
  }

  engagement(take = 10): Observable<EngagementSummary> {
    return this.http.get<EngagementSummary>(
      COMPANY_ANALYTICS_URLS.ENGAGEMENT(take, 5),
      silentRequest()
    );
  }

  signIns(days: number, page: number, size: number): Observable<SignInLogResult> {
    return this.http.get<SignInLogResult>(
      COMPANY_ANALYTICS_URLS.SIGN_INS(days, page, size),
      silentRequest()
    );
  }
}
