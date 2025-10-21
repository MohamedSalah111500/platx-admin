import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import {  tap } from "rxjs/operators";
import { SpinnerService } from "../../shared/ui/spinner/spinner.service";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "src/app/auth/services/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    public toastr: ToastrService,
    private spinnerService: SpinnerService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isSpecificApiRequest = request.url.includes("/api");
    if (isSpecificApiRequest) {
      this.spinnerService.show();
    }
    return next.handle(request).pipe(
      tap({
        next: (event) => {
          setTimeout(() => this.spinnerService.hide(), 1000);
        },
        error: (err) => {
          if (err.status === 401) {
            this.toastr.error("you are not authruzed", "Error 401");
            this.authenticationService.logout();
            location.reload();
            return
          }

          if (err.status === 403) {
            this.toastr.error("you are not authruzed", "Error 403");
            return

          }
          const errorMessage = err?.error?.message;
          this.toastr.error(errorMessage, "Error");
          return throwError(err);
        },
      })
    );
  }
}
