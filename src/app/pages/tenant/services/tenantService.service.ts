// roles.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Observer } from "rxjs";
import { GetAllTenantsResponse, Tenant } from "../types";
import {
  ROLES_URLS,
  STAFF_URLS,
  STUDENTS_URLS,
  TENANT_URLS,
} from "src/app/utiltis/urls";
import { pagination } from "src/app/utiltis/functions";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class TenantService {
  constructor(private http: HttpClient, public toastr: ToastrService) {}

  getAllTenants(
    pageNumber: number,
    pageSize: number
  ): Observable<GetAllTenantsResponse> {
    return new Observable((observer: Observer<GetAllTenantsResponse>) => {
      this.http
        .get<GetAllTenantsResponse>(
          pagination(TENANT_URLS.GET_ALL, pageNumber, pageSize)
        )
        .subscribe(
          (responseData: GetAllTenantsResponse) => {
            observer.next(responseData);
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  getTenant(id: string): Observable<Tenant> {
    return new Observable((observer: Observer<Tenant>) => {
      this.http.get<Tenant>(TENANT_URLS.GET_BY_ID(id)).subscribe(
        (responseData: Tenant) => {
          let newResponseData = {
            ...responseData,
            logoFile: {
              ...responseData.logoFile,
              url: environment.apiURL.slice(0, -1) + responseData.logoFile.url,
              type:
                responseData.logoFile.fileType == 2
                  ? "image/png"
                  : responseData.logoFile.fileType,
            },
            coverFile: {
              ...responseData.coverFile,
              url: environment.apiURL.slice(0, -1) + responseData.coverFile.url,
              type:
                responseData.coverFile.fileType == 2
                  ? "image/png"
                  : responseData.coverFile.fileType,
            },
          };
          observer.next(newResponseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  postCreateTenant(payload: FormData): Observable<Tenant> {
    return new Observable((observer: Observer<Tenant>) => {
      this.http.post<Tenant>(TENANT_URLS.CREATE, payload).subscribe(
        (responseData: Tenant) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  putUpdateTenant(payload: FormData): Observable<Tenant> {
    return new Observable((observer: Observer<Tenant>) => {
      this.http.put<Tenant>(TENANT_URLS.UPDATE, payload).subscribe(
        (responseData: Tenant) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  deleteTenant(id: string): Observable<Tenant> {
    return new Observable((observer: Observer<Tenant>) => {
      this.http.delete<Tenant>(TENANT_URLS.DELETE(id)).subscribe(
        (responseData: Tenant) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  activateTenant(id: string): Observable<Tenant> {
    return this.http.put<Tenant>(TENANT_URLS.ACTIVATE(id), null);
  }

  deActivateTenant(id: string): Observable<Tenant> {
    return this.http.put<Tenant>(TENANT_URLS.DEACTIVATE(id), null);
  }
}
