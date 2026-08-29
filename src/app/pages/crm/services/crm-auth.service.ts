import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CrmAuthService {
  get roles(): string[] {
    try {
      const roles = JSON.parse(localStorage.getItem("roles") || "[]");
      return Array.isArray(roles) ? roles : [];
    } catch {
      return [];
    }
  }

  get isSuperAdmin(): boolean {
    return this.roles.includes("SuperAdmin");
  }

  get userId(): string | null {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      return user?.userId || null;
    } catch {
      return null;
    }
  }
}
