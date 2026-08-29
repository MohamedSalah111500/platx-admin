import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { CRM_URLS } from "src/app/utiltis/urls";
import { IGeneralSuccessMessageResponse } from "src/app/shared/general-types";
import { normalizeServerDate } from "../crm-utils";
import {
  CrmActivity,
  CrmActivityPayload,
  CrmAgent,
  CrmAgentCreatePayload,
  CrmAgentUpdatePayload,
  CrmImportPayload,
  CrmImportResult,
  CrmLead,
  CrmLeadFilter,
  CrmLeadPayload,
  CrmPipelineColumn,
  CrmStats,
  CrmStatusPayload,
  Paged,
} from "../types";

@Injectable({ providedIn: "root" })
export class CrmService {
  constructor(private http: HttpClient) {}

  getLeads(filter: CrmLeadFilter): Observable<Paged<CrmLead>> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;
      params = params.set(key, String(value));
    });
    return this.http
      .get<Paged<CrmLead>>(CRM_URLS.LEADS, { params })
      .pipe(map((res) => ({ ...res, items: res.items.map(normalizeLead) })));
  }

  getLead(id: number): Observable<CrmLead> {
    return this.http.get<CrmLead>(CRM_URLS.LEAD(id)).pipe(map(normalizeLead));
  }

  createLead(payload: CrmLeadPayload): Observable<CrmLead> {
    return this.http.post<CrmLead>(CRM_URLS.LEADS, payload).pipe(map(normalizeLead));
  }

  updateLead(id: number, payload: CrmLeadPayload): Observable<CrmLead> {
    return this.http.put<CrmLead>(CRM_URLS.LEAD(id), payload).pipe(map(normalizeLead));
  }

  updateStatus(id: number, payload: CrmStatusPayload): Observable<CrmLead> {
    return this.http.patch<CrmLead>(CRM_URLS.LEAD_STATUS(id), payload).pipe(map(normalizeLead));
  }

  assign(id: number, assignedToUserId: string | null): Observable<CrmLead> {
    return this.http
      .patch<CrmLead>(CRM_URLS.LEAD_ASSIGN(id), { assignedToUserId })
      .pipe(map(normalizeLead));
  }

  deleteLead(id: number): Observable<IGeneralSuccessMessageResponse> {
    return this.http.delete<IGeneralSuccessMessageResponse>(CRM_URLS.LEAD(id));
  }

  importLeads(payload: CrmImportPayload): Observable<CrmImportResult> {
    return this.http.post<CrmImportResult>(CRM_URLS.IMPORT, payload);
  }

  getActivities(leadId: number, page: number, size: number): Observable<Paged<CrmActivity>> {
    const params = new HttpParams().set("page", page).set("size", size);
    return this.http
      .get<Paged<CrmActivity>>(CRM_URLS.LEAD_ACTIVITIES(leadId), { params })
      .pipe(map((res) => ({ ...res, items: res.items.map(normalizeActivity) })));
  }

  addActivity(leadId: number, payload: CrmActivityPayload): Observable<CrmActivity> {
    return this.http
      .post<CrmActivity>(CRM_URLS.LEAD_ACTIVITIES(leadId), payload)
      .pipe(map(normalizeActivity));
  }

  getStats(): Observable<CrmStats> {
    return this.http.get<CrmStats>(CRM_URLS.STATS);
  }

  getPipeline(perColumn = 25): Observable<CrmPipelineColumn[]> {
    const params = new HttpParams().set("perColumn", perColumn);
    return this.http
      .get<CrmPipelineColumn[]>(CRM_URLS.PIPELINE, { params })
      .pipe(map((cols) => cols.map((c) => ({ ...c, leads: c.leads.map(normalizeLead) }))));
  }

  getAgents(): Observable<CrmAgent[]> {
    return this.http
      .get<CrmAgent[]>(CRM_URLS.AGENTS)
      .pipe(map((agents) => agents.map((a) => ({ ...a, lastLoginAt: normalizeServerDate(a.lastLoginAt) }))));
  }

  createAgent(payload: CrmAgentCreatePayload): Observable<CrmAgent> {
    return this.http.post<CrmAgent>(CRM_URLS.AGENTS, payload);
  }

  updateAgent(id: string, payload: CrmAgentUpdatePayload): Observable<IGeneralSuccessMessageResponse> {
    return this.http.put<IGeneralSuccessMessageResponse>(CRM_URLS.AGENT(id), payload);
  }

  resetAgentPassword(id: string, newPassword: string): Observable<IGeneralSuccessMessageResponse> {
    return this.http.post<IGeneralSuccessMessageResponse>(CRM_URLS.AGENT_RESET_PASSWORD(id), { newPassword });
  }
}

function normalizeLead(lead: CrmLead): CrmLead {
  return {
    ...lead,
    creationTime: normalizeServerDate(lead.creationTime) as string,
    updateTime: normalizeServerDate(lead.updateTime),
    lastContactedAt: normalizeServerDate(lead.lastContactedAt),
    nextFollowUpAt: normalizeServerDate(lead.nextFollowUpAt),
  };
}

function normalizeActivity(activity: CrmActivity): CrmActivity {
  return { ...activity, creationTime: normalizeServerDate(activity.creationTime) as string };
}
