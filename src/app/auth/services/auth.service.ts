import { Injectable } from "@angular/core";

import { User } from "src/app/store/Authentication/auth.models";
import { Observable, Observer, catchError, from, map, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AUTH_URLS } from "src/app/utiltis/urls";
import { LoginAPIResponse } from "../types";
import { Router } from "@angular/router";

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

  register(user: User): Observable<any> {
    return this.http.post(AUTH_URLS.REGISTRATION, user);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["/auth/login"]);
  }
}
