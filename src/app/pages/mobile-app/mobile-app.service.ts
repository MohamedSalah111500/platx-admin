import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MOBILE_APP_URLS } from "src/app/utiltis/urls";
import { MobilePlatform, MobileUpdatePolicy } from "./mobile-app.types";

@Injectable({ providedIn: "root" })
export class MobileAppService {
  constructor(private http: HttpClient) {}

  getPolicy(): Observable<MobileUpdatePolicy[]> {
    return this.http.get<MobileUpdatePolicy[]>(MOBILE_APP_URLS.POLICY);
  }

  setForceUpdate(platform: MobilePlatform, forceUpdate: boolean): Observable<MobileUpdatePolicy[]> {
    return this.http.put<MobileUpdatePolicy[]>(MOBILE_APP_URLS.POLICY, { platform, forceUpdate });
  }
}
