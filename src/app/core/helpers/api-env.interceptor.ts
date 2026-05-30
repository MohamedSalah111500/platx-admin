import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiEnvironmentService } from "../services/api-environment.service";

/**
 * Rewrites outgoing requests so they target the API base URL of the
 * currently selected environment (production / testing). Any URL that
 * begins with one of the known PlatX base URLs is rewritten to the
 * active one; everything else (assets, third-party APIs) is left alone.
 */
@Injectable()
export class ApiEnvInterceptor implements HttpInterceptor {
  constructor(private envService: ApiEnvironmentService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const target = this.envService.apiUrl;
    const knownBases = this.envService.knownBaseUrls;

    const matched = knownBases.find((base) => req.url.startsWith(base));
    if (!matched || matched === target) {
      return next.handle(req);
    }

    const rewritten = target + req.url.substring(matched.length);
    return next.handle(req.clone({ url: rewritten }));
  }
}
