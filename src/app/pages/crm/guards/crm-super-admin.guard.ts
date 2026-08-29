import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { CrmAuthService } from "../services/crm-auth.service";

export const crmSuperAdminGuard: CanActivateFn = () => {
  const auth = inject(CrmAuthService);
  const router = inject(Router);
  return auth.isSuperAdmin ? true : router.createUrlTree(["/crm/leads"]);
};
