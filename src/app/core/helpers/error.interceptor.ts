import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthenticationService } from "../../account/auth/services/auth.service";
import { SpinnerService } from "../../shared/ui/spinner/spinner.service";
import { ToastrService } from "ngx-toastr";
import { errorMapper } from "src/app/utiltis/functions";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  errorMapper = errorMapper
  constructor(
    private authenticationService: AuthenticationService,
    public toastr: ToastrService,
    private spinnerService:SpinnerService
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
      catchError((err) => {
        if (err.status === 401) {
          this.toastr.error("you are not authruzed", "Error 401");
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          location.reload();
        }
        this.toastr.error(this.errorMapper(err.error.errors));
        return throwError(err);
      })
    );
  }
}
