import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  CreateInstallmentPayload,
  MarkPaidPayload,
  PagedInstallmentsResponse,
  TenantInstallment,
  UpdateInstallmentPayload,
} from "../types/installment.types";
import { TENANT_INSTALLMENTS_URLS } from "src/app/utiltis/urls";

@Injectable({ providedIn: "root" })
export class TenantInstallmentService {
  constructor(private http: HttpClient) {}

  getByTenant(tenantId: string): Observable<TenantInstallment[]> {
    return this.http.get<TenantInstallment[]>(TENANT_INSTALLMENTS_URLS.GET_BY_TENANT(tenantId));
  }

  create(tenantId: string, payload: CreateInstallmentPayload): Observable<TenantInstallment> {
    return this.http.post<TenantInstallment>(TENANT_INSTALLMENTS_URLS.CREATE(tenantId), payload);
  }

  update(id: number, payload: UpdateInstallmentPayload): Observable<TenantInstallment> {
    return this.http.put<TenantInstallment>(TENANT_INSTALLMENTS_URLS.UPDATE(id), payload);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(TENANT_INSTALLMENTS_URLS.DELETE(id));
  }

  markPaid(id: number, payload: MarkPaidPayload): Observable<TenantInstallment> {
    return this.http.put<TenantInstallment>(TENANT_INSTALLMENTS_URLS.MARK_PAID(id), payload);
  }

  markUnpaid(id: number): Observable<TenantInstallment> {
    return this.http.put<TenantInstallment>(TENANT_INSTALLMENTS_URLS.MARK_UNPAID(id), {});
  }

  getDue(unpaidOnly: boolean, page: number, size: number): Observable<PagedInstallmentsResponse> {
    const params = new HttpParams()
      .set("unpaidOnly", unpaidOnly)
      .set("page", page)
      .set("size", size);
    return this.http.get<PagedInstallmentsResponse>(TENANT_INSTALLMENTS_URLS.GET_DUE, { params });
  }
}
