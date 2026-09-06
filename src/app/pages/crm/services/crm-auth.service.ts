import { Injectable } from "@angular/core";
import { CurrentUserService } from "src/app/core/services/current-user.service";

@Injectable({ providedIn: "root" })
export class CrmAuthService {
  constructor(private currentUser: CurrentUserService) {}

  get roles(): string[] {
    return this.currentUser.roles;
  }

  get isSuperAdmin(): boolean {
    return this.currentUser.isSuperAdmin;
  }

  get userId(): string | null {
    return this.currentUser.userId;
  }
}
