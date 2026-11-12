import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "src/app/auth/services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard {
  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authenticationService.currentUser()) return true;
    this.router.navigate(["/auth/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
