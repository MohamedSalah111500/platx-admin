import { Injectable } from "@angular/core";

import { User } from "src/app/auth/types";
import { Observable, Observer, catchError, from, map, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AUTH_URLS } from "src/app/utiltis/urls";
import { LoginAPIResponse } from "../types";
import { Router } from "@angular/router";

export const PLATFORM_DOMAIN = "mohamed-salah";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  user: User;

  constructor(private http: HttpClient, private router: Router) {}

  public currentUser(): User {
    let currentUser: User = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser;
  }

  login(
    userName: string,
    password: string,
    domain: string
  ): Observable<LoginAPIResponse> {
    return new Observable((observer: Observer<LoginAPIResponse>) => {
      this.http
        .post<LoginAPIResponse>(AUTH_URLS.LOGIN, { userName, password, domain })
        .subscribe(
          (response) => {
            observer.next(response);
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  forgotPassword(email: string): Observable<unknown> {
    return this.http.post(AUTH_URLS.FORGOT_PASSWORD, { username: email, domain: PLATFORM_DOMAIN });
  }

  verifyResetCode(email: string, code: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(AUTH_URLS.VERIFY_RESET_CODE, { username: email, code, domain: PLATFORM_DOMAIN });
  }

  resetPassword(token: string, password: string, confirmPassword: string): Observable<unknown> {
    return this.http.post(
      AUTH_URLS.RESET_PASSWORD,
      { password, confirmPassword },
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    );
  }

  sendSensitiveActionOtp(): Observable<unknown> {
    return this.http.post(AUTH_URLS.SENSITIVE_ACTION_OTP, null);
  }

  register(user: User): Observable<any> {
    return this.http.post(AUTH_URLS.REGISTRATION, user);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["/auth/login"]);
  }
}
