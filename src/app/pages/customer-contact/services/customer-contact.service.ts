// roles.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Observer } from "rxjs";
import { GetAllCustomerContactsResponse } from "../types";
import { PLATX_CONTACT_URLS } from "src/app/utiltis/urls";
import { pagination } from "src/app/utiltis/functions";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class CustomerContactService {
  constructor(private http: HttpClient, public toastr: ToastrService) {}

  getAllPlatXContacts(
    pageNumber: number,
    pageSize: number
  ): Observable<GetAllCustomerContactsResponse> {
    return new Observable(
      (observer: Observer<GetAllCustomerContactsResponse>) => {
        this.http
          .post<GetAllCustomerContactsResponse>(
            pagination(PLATX_CONTACT_URLS.GET_CONTACT, pageNumber, pageSize),
            {}
          )
          .subscribe(
            (responseData: GetAllCustomerContactsResponse) => {
              observer.next(responseData);
            },
            (error) => {
              observer.error(error);
            }
          );
      }
    );
  }

  // deleteTenant(id: string): Observable<Tenant> {
  //   return new Observable((observer: Observer<Tenant>) => {
  //     this.http.delete<Tenant>(TENANT_URLS.DELETE(id)).subscribe(
  //       (responseData: Tenant) => {
  //         observer.next(responseData);
  //       },
  //       (error) => {
  //         observer.error(error);
  //       }
  //     );
  //   });
  // }
}
