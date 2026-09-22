import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { CurrentUserService } from "../services/current-user.service";
import { CrmPage, CrmPageAccessService } from "../services/crm-page-access.service";

/**
 * A page the owner shares with the sales team: the owner always passes, and a CRM user passes only
 * when that page was granted to him. Anyone else lands back in the CRM.
 */
export const crmPageGuard =
  (page: CrmPage): CanActivateFn =>
  () => {
    const currentUser = inject(CurrentUserService);
    const pageAccess = inject(CrmPageAccessService);
    const router = inject(Router);

    const allowed = currentUser.isSuperAdmin || (currentUser.isCrmUser && pageAccess.has(page));
    return allowed ? true : router.createUrlTree(["/crm/leads"]);
  };
