import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, tap } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

/** Admin-portal pages the owner can share with the sales team. Mirrors the backend CrmPage enum. */
export enum CrmPage {
  CustomerContact = 1,
  Plans = 2,
}

export const CRM_PAGES: CrmPage[] = [CrmPage.CustomerContact, CrmPage.Plans];

export const CRM_PAGE_LABELS: Record<CrmPage, string> = {
  [CrmPage.CustomerContact]: "CRM.PAGES.CUSTOMER_CONTACT",
  [CrmPage.Plans]: "CRM.PAGES.PLANS",
};

const STORAGE_KEY = "crmPages";

@Injectable({ providedIn: "root" })
export class CrmPageAccessService {
  constructor(private http: HttpClient) {}

  /** Read from storage so a page refresh keeps the menu right before the request comes back. */
  get pages(): CrmPage[] {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }

  has(page: CrmPage): boolean {
    return this.pages.includes(page);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  load(): Observable<CrmPage[]> {
    return this.http
      .get<CrmPage[]>(`${environment.apiURL}api/Crm/agents/me/pages`)
      .pipe(
        map((pages) => pages ?? []),
        tap((pages) => localStorage.setItem(STORAGE_KEY, JSON.stringify(pages))),
        catchError(() => of([] as CrmPage[]))
      );
  }

  setPages(userId: string, pages: CrmPage[]): Observable<unknown> {
    return this.http.put(
      `${environment.apiURL}api/Crm/agents/${userId}/pages`,
      { pages }
    );
  }
}
