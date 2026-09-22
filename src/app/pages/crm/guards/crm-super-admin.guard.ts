import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { CrmAuthService } from "../services/crm-auth.service";

export const crmSuperAdminGuard: CanActivateFn = () => {
  const auth = inject(CrmAuthService);
  const router = inject(Router);
  // The team page is monitoring for a supervisor and management for the owner.
  return auth.canManageTeam ? true : router.createUrlTree(["/crm/leads"]);
};
