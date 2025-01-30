import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "src/app/store/Authentication/auth.models";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  saveUserDataInLocalStorage(user: User) {
    if (!user) return;
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("roles", JSON.stringify(user.roles));
    localStorage.setItem("userType", JSON.stringify(user.roles[0]));
  }
}
