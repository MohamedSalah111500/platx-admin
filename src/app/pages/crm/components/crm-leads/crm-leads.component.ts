import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ToastrService } from "ngx-toastr";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";
import { CrmService } from "../../services/crm.service";
import { CrmAuthService } from "../../services/crm-auth.service";
import { avatarColor, followUpState, initials, relativeTime, waLink } from "../../crm-utils";
import { CrmLeadFormComponent } from "../crm-lead-form/crm-lead-form.component";
import { CrmStatusModalComponent } from "../crm-status-modal/crm-status-modal.component";
import { CrmImportModalComponent } from "../crm-import-modal/crm-import-modal.component";
import {
  CrmAgent,
  CrmFollowUpFilter,
  CrmLead,
  CrmLeadFilter,
  CrmLeadStatus,
  CrmStats,
  EnumMeta,
  FOLLOW_UP_FILTERS,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  metaOf,
} from "../../types";

type KpiKey = "all" | "new" | "overdue" | "today" | "won" | "unassigned";

@Component({
  selector: "app-crm-leads",
  templateUrl: "./crm-leads.component.html",
  styleUrls: ["../../crm-shared.scss", "./crm-leads.component.scss"],
})
export class CrmLeadsComponent implements OnInit, OnDestroy {
  breadCrumbItems = [{ label: "CRM" }, { label: "Leads", active: true }];

  statuses = LEAD_STATUSES;
  sources = LEAD_SOURCES;
  priorities = LEAD_PRIORITIES;
  followUps = FOLLOW_UP_FILTERS;

  isSuperAdmin = this.auth.isSuperAdmin;
  filter: CrmLeadFilter = { page: 1, size: 20 };
  activeKpi: KpiKey = "all";

  leads: CrmLead[] = [];
  total = 0;
  loading = false;
  stats: CrmStats | null = null;
  agents: CrmAgent[] = [];
  deleteTarget: CrmLead | null = null;

  @ViewChild("leadForm") leadForm?: CrmLeadFormComponent;
  @ViewChild("statusModal") statusModal?: CrmStatusModalComponent;
  @ViewChild("importModal") importModal?: CrmImportModalComponent;
  @ViewChild("removeModal") removeModal?: ModalDirective;

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private crm: CrmService, private auth: CrmAuthService, private toastr: ToastrService) {}

  ngOnInit() {
    this.search$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());

    this.loadStats();
    this.loadAgents();
    this.load();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.loading = true;
    this.crm.getLeads(this.filter).subscribe({
      next: (res) => {
        this.leads = res.items;
        this.total = res.totalCount;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  loadStats() {
    this.crm.getStats().subscribe((stats) => (this.stats = stats));
  }

  loadAgents() {
    this.crm.getAgents().subscribe((agents) => (this.agents = agents));
  }

  refreshAll() {
    this.load();
    this.loadStats();
  }

  onSearch(term: string) {
    this.search$.next(term || "");
  }

  applyFilters() {
    this.filter.page = 1;
    this.activeKpi = this.detectKpi();
    this.load();
  }

  clearFilters() {
    this.filter = { page: 1, size: this.filter.size };
    this.activeKpi = "all";
    this.load();
  }

  get hasFilters(): boolean {
    const f = this.filter;
    return !!(f.status || f.source || f.priority || f.assignedToUserId || f.unassigned || f.search || f.followUp);
  }

  setKpi(key: KpiKey) {
    this.filter = { page: 1, size: this.filter.size, search: this.filter.search };
    switch (key) {
      case "new":
        this.filter.status = CrmLeadStatus.New;
        break;
      case "overdue":
        this.filter.followUp = CrmFollowUpFilter.Overdue;
        break;
      case "today":
        this.filter.followUp = CrmFollowUpFilter.Today;
        break;
      case "won":
        this.filter.status = CrmLeadStatus.Won;
        break;
      case "unassigned":
        this.filter.unassigned = true;
        break;
    }
    this.activeKpi = key;
    this.load();
  }

  pageChanged(event: PageChangedEvent) {
    if (event.page === this.filter.page) return;
    this.filter.page = event.page;
    this.load();
  }

  onPageSizeChange() {
    this.filter.page = 1;
    this.load();
  }

  openCreate() {
    this.leadForm?.open();
  }

  openEdit(lead: CrmLead) {
    this.leadForm?.open(lead);
  }

  openImport() {
    this.importModal?.open();
  }

  onSaved() {
    this.refreshAll();
  }

  onImported() {
    this.refreshAll();
  }

  onStatusChanged(lead: CrmLead) {
    this.replace(lead);
    this.loadStats();
  }

  quickStatus(lead: CrmLead, status: CrmLeadStatus) {
    if (status === lead.status) return;
    if (status === CrmLeadStatus.Lost || status === CrmLeadStatus.Won) {
      this.statusModal?.open(lead, status);
      return;
    }
    this.crm.updateStatus(lead.id, { status }).subscribe((updated) => {
      this.toastr.success(`Status set to ${this.statusMeta(updated.status).label}`, "CRM");
      this.onStatusChanged(updated);
    });
  }

  assign(lead: CrmLead, userId: string | null) {
    if ((lead.assignedToUserId || null) === userId) return;
    this.crm.assign(lead.id, userId).subscribe((updated) => {
      this.toastr.success(updated.assignedToName ? `Assigned to ${updated.assignedToName}` : "Unassigned", "CRM");
      this.replace(updated);
      this.loadStats();
    });
  }

  openDelete(lead: CrmLead) {
    this.deleteTarget = lead;
    this.removeModal?.show();
  }

  confirmDelete() {
    if (!this.deleteTarget) return;
    this.crm.deleteLead(this.deleteTarget.id).subscribe(() => {
      this.toastr.success("Lead deleted", "CRM");
      this.removeModal?.hide();
      this.deleteTarget = null;
      this.refreshAll();
    });
    this.removeModal?.hide();
  }

  statusMeta(status: CrmLeadStatus): EnumMeta {
    return metaOf(this.statuses, status);
  }

  sourceMeta(source: number): EnumMeta {
    return metaOf(this.sources, source);
  }

  priorityMeta(priority: number): EnumMeta {
    return metaOf(this.priorities, priority);
  }

  get activeAgents(): CrmAgent[] {
    return this.agents.filter((a) => a.isActive);
  }

  waLink = waLink;
  initials = initials;
  avatarColor = avatarColor;
  relativeTime = relativeTime;
  followUpState = followUpState;

  private replace(lead: CrmLead) {
    this.leads = this.leads.map((l) => (l.id === lead.id ? lead : l));
  }

  private detectKpi(): KpiKey {
    const f = this.filter;
    const only = (keys: (keyof CrmLeadFilter)[]) =>
      (["status", "source", "priority", "assignedToUserId", "unassigned", "followUp"] as (keyof CrmLeadFilter)[])
        .every((k) => keys.includes(k) || !f[k]);
    if (f.status === CrmLeadStatus.New && only(["status"])) return "new";
    if (f.status === CrmLeadStatus.Won && only(["status"])) return "won";
    if (f.followUp === CrmFollowUpFilter.Overdue && only(["followUp"])) return "overdue";
    if (f.followUp === CrmFollowUpFilter.Today && only(["followUp"])) return "today";
    if (f.unassigned && only(["unassigned"])) return "unassigned";
    return only([]) ? "all" : ("" as KpiKey);
  }
}
