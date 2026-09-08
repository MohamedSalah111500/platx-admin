import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { CurrentUserService } from "../services/current-user.service";

/**
 * Customer Contact is the incoming-website-leads page. It's owned by
 * SuperAdmin but the Sales team (CrmAgent) also needs to see + respond
 * to submissions, so we let both roles through. Any other role bounces
 * to /crm/leads (same fallback as the other admin guards).
 */
export const customerContactAccessGuard: CanActivateFn = () => {
  const currentUser = inject(CurrentUserService);
  const router = inject(Router);
  const allowed = currentUser.isSuperAdmin || currentUser.isCrmAgent;
  return allowed ? true : router.createUrlTree(["/crm/leads"]);
};
