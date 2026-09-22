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

  get isSupervisor(): boolean {
    return this.currentUser.isCrmSupervisor;
  }

  /** Sees the whole team's work and hands leads out: the owner and a supervisor. */
  get canManageTeam(): boolean {
    return this.isSuperAdmin || this.isSupervisor;
  }

  get userId(): string | null {
    return this.currentUser.userId;
  }
}
