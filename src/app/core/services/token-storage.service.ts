import { Injectable } from "@angular/core";

const USER_KEY = "currentUser";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  public getToken(): string | null {
    return this.getUser()?.token ?? null;
  }

  public getUser(): any {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
