import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CurrentUserService {
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

  get isCrmAgent(): boolean {
    return this.roles.includes("CrmAgent");
  }

  get userId(): string | null {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      return user?.userId || null;
    } catch {
      return null;
    }
  }

  hasAnyRole(roles?: string[]): boolean {
    return !!roles?.some((role) => this.roles.includes(role));
  }
}
