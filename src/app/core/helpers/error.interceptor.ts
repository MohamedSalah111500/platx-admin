import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { SpinnerService } from "../../shared/ui/spinner/spinner.service";
import { AuthenticationService } from "src/app/auth/services/auth.service";
import { SKIP_LOADER } from "./http-context";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    public toastr: ToastrService,
    private spinnerService: SpinnerService,
    private translate: TranslateService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const showLoader = request.url.includes("/api") && !request.context.get(SKIP_LOADER);
    if (showLoader) {
      this.spinnerService.show();
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.spinnerService.reset();
          this.authenticationService.logout();
          location.reload();
          return throwError(() => err);
        }

        this.toastr.error(this.messageOf(err), this.translate.instant("HTTP.TITLE"));
        return throwError(() => err);
      }),
      finalize(() => {
        if (showLoader) {
          this.spinnerService.hide();
        }
      })
    );
  }

  private messageOf(err: HttpErrorResponse): string {
    const fromServer = err?.error?.message;
    if (typeof fromServer === "string" && fromServer.trim()) {
      return fromServer;
    }

    if (err.status === 0) {
      return this.translate.instant("HTTP.OFFLINE");
    }
    if (err.status === 403) {
      return this.translate.instant("HTTP.FORBIDDEN");
    }
    if (err.status === 404) {
      return this.translate.instant("HTTP.NOT_FOUND");
    }
    if (err.status >= 500) {
      return this.translate.instant("HTTP.SERVER_ERROR");
    }
    return this.translate.instant("HTTP.GENERIC");
  }
}
