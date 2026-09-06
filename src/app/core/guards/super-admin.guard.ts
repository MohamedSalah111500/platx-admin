import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { CurrentUserService } from "../services/current-user.service";

/** Keeps the sales team inside the CRM: every other admin area is owner-only. */
export const superAdminGuard: CanActivateFn = () => {
  const currentUser = inject(CurrentUserService);
  const router = inject(Router);
  return currentUser.isSuperAdmin ? true : router.createUrlTree(["/crm/leads"]);
};
