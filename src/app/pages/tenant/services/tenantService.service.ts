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

@Injectable({
  providedIn: "root",
})
export class TenantService {
  constructor(private http: HttpClient) {}


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



  // getRoleById(id: number): Observable<Role> {
  //   return new Observable((observer: Observer<Role>) => {
  //     this.http.get<Role>(ROLES_URLS.GET_BY_ID(id)).subscribe(
  //       (responseData: Role) => {
  //         observer.next(responseData);
  //       },
  //       (error) => {
  //         observer.error(error);
  //       }
  //     );
  //   });
  // }

  // updateRole(payload: UpdateRoleRequest): Observable<Role> {
  //   return new Observable((observer: Observer<Role>) => {
  //     this.http.put<Role>(ROLES_URLS.UPDATE, payload).subscribe(
  //       (responseData: Role) => {
  //         observer.next(responseData);
  //       },
  //       (error) => {
  //         observer.error(error);
  //       }
  //     );
  //   });
  // }

  // deleteRole(id: number): Observable<void> {
  //   return new Observable((observer: Observer<void>) => {
  //     this.http.delete<void>(ROLES_URLS.DELETE(id)).subscribe(
  //       () => {
  //         observer.next();
  //       },
  //       (error) => {
  //         observer.error(error);
  //       }
  //     );
  //   });
  // }

  // deleteStaff(id: string): Observable<void> {
  //   return new Observable((observer: Observer<void>) => {
  //     this.http.delete<void>(STAFF_URLS.DELETE(id)).subscribe(
  //       () => {
  //         observer.next();
  //       },
  //       (error) => {
  //         observer.error(error);
  //       }
  //     );
  //   });
  // }
}
