import { Injectable } from "@angular/core";

import { getFirebaseBackend } from "../../../authUtils";
import { User } from "src/app/store/Authentication/auth.models";
import { Observable, Observer, from, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AUTH_URLS } from "src/app/utiltis/urls";
import { LoginAPIResponse } from "../types";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  user: User;

  constructor(private http: HttpClient) {}

  /**
   * Returns the current user
   */
  public currentUser(): User {
    let currentUser: User = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser;
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(userName: string, password: string): Observable<LoginAPIResponse> {
    return new Observable((observer: Observer<LoginAPIResponse>) => {
      this.http
        .post(AUTH_URLS.LOGIN, { userName, password })
        .subscribe((responseData: LoginAPIResponse) => {
          observer.next(responseData);
        });
    });
  }

  /**
   * Performs the register
   * @param email email
   * @param password password
   */
  register(user: User): Observable<any> {
    // return from(getFirebaseBackend().registerUser(user));
    return this.http.post(AUTH_URLS.REGISTRATION, user);
  }

  /**
   * Reset password
   * @param email email
   */
  resetPassword(email: string): Observable<any> {
    return this.http.post(AUTH_URLS.REGISTRATION, email);
  }
  /**
   * Reset password
   * @param email email
   */
  forgetPassword(username: string): Observable<any> {
    return this.http.post(
      AUTH_URLS.FORGOT_PASSWORD + `?userName=${username}`,
      {}
    );
  }

  /**
   * Logout the user
   */
  logout() {
    // logout the user
    getFirebaseBackend().logout();
  }
}
