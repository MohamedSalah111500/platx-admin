import { Component, OnInit, ViewChild } from "@angular/core";
import { CalendarOptions, EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import arLocale from "@fullcalendar/core/locales/ar";
import { ModalDirective } from "ngx-bootstrap/modal";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

import { CrmService } from "../../services/crm.service";
import { avatarColor, followUpState, initials, relativeTime, waLink } from "../../crm-utils";
import { CrmLead, EnumMeta, LEAD_PRIORITIES, LEAD_STATUSES, metaOf } from "../../types";

type FilterKey = "all" | "overdue" | "today" | "week";

@Component({
  selector: "app-crm-appointments",
  templateUrl: "./crm-appointments.component.html",
  styleUrls: ["../../crm-shared.scss", "./crm-appointments.component.scss"],
})
export class CrmAppointmentsComponent implements OnInit {
  breadCrumbItems = [
    { label: "MENUITEMS.CRM.TEXT" },
    { label: "MENUITEMS.CRM_APPOINTMENTS.TEXT", active: true },
  ];

  @ViewChild("detailsModal") detailsModal?: ModalDirective;

  appointments: CrmLead[] = [];
  loading = false;

  activeFilter: FilterKey = "all";
  selected: CrmLead | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    height: "auto",
    firstDay: 6, // Saturday — matches the region
    nowIndicator: true,
    dayMaxEvents: 3,
    eventClick: (arg) => this.onEventClick(arg),
    events: [],
  };

  constructor(
    private crm: CrmService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Apply Arabic locale to the calendar when the app is in Arabic.
    const lang = this.translate.currentLang || this.translate.defaultLang;
    if (lang === "ar") this.calendarOptions.locale = arLocale;
    this.load();
  }

  load(): void {
    // Fetch a wide-enough window so the calendar's month view is populated
    // for a couple of months in each direction. The server filters to leads
    // whose nextFollowUpAt falls in [from, to].
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();
    const to = new Date(now.getFullYear(), now.getMonth() + 3, 0, 23, 59, 59).toISOString();

    this.loading = true;
    this.crm.getAppointments(from, to).subscribe({
      next: (leads) => {
        this.appointments = (leads ?? []).filter((l) => !!l.nextFollowUpAt);
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.appointments.map((l) => this.toEvent(l)),
        };
        this.loading = false;
      },
      error: () => {
        this.appointments = [];
        this.loading = false;
      },
    });
  }

  private toEvent(lead: CrmLead): EventInput {
    const status = metaOf(LEAD_STATUSES, lead.status);
    const color = this.eventColor(lead);
    return {
      id: String(lead.id),
      title: lead.name,
      start: lead.nextFollowUpAt as string,
      backgroundColor: color,
      borderColor: color,
      textColor: "#ffffff",
      extendedProps: { lead, statusLabel: status.label },
    };
  }

  private eventColor(lead: CrmLead): string {
    const state = followUpState(lead.nextFollowUpAt);
    switch (state) {
      case "overdue":  return "#ef4444";
      case "today":    return "#f59e0b";
      case "upcoming": return "#6366f1";
      default:         return "#6b7280";
    }
  }

  onEventClick(arg: EventClickArg): void {
    const lead = arg.event.extendedProps?.["lead"] as CrmLead | undefined;
    if (!lead) return;
    this.selected = lead;
    this.detailsModal?.show();
  }

  openLead(): void {
    if (!this.selected) return;
    this.detailsModal?.hide();
    this.router.navigate(["/crm/leads", this.selected.id]);
  }

  closeDetails(): void {
    this.detailsModal?.hide();
    this.selected = null;
  }

  setFilter(f: FilterKey): void {
    this.activeFilter = f;
  }

  get filteredList(): CrmLead[] {
    const items = [...this.appointments].sort((a, b) => {
      const av = new Date(a.nextFollowUpAt as string).getTime();
      const bv = new Date(b.nextFollowUpAt as string).getTime();
      return av - bv;
    });
    if (this.activeFilter === "all") return items;
    return items.filter((l) => {
      const state = followUpState(l.nextFollowUpAt);
      if (this.activeFilter === "overdue") return state === "overdue";
      if (this.activeFilter === "today") return state === "today";
      if (this.activeFilter === "week") {
        const t = new Date(l.nextFollowUpAt as string).getTime();
        const now = Date.now();
        return t >= now && t <= now + 7 * 24 * 60 * 60 * 1000;
      }
      return true;
    });
  }

  get stats(): { total: number; overdue: number; today: number; week: number } {
    let overdue = 0, today = 0, week = 0;
    const now = Date.now();
    const weekEnd = now + 7 * 24 * 60 * 60 * 1000;
    for (const l of this.appointments) {
      const state = followUpState(l.nextFollowUpAt);
      if (state === "overdue") overdue++;
      if (state === "today") today++;
      const t = new Date(l.nextFollowUpAt as string).getTime();
      if (t >= now && t <= weekEnd) week++;
    }
    return { total: this.appointments.length, overdue, today, week };
  }

  statusMeta(status: number): EnumMeta { return metaOf(LEAD_STATUSES, status); }
  priorityMeta(priority: number): EnumMeta { return metaOf(LEAD_PRIORITIES, priority); }

  initials = initials;
  avatarColor = avatarColor;
  relativeTime = relativeTime;
  followUpState = followUpState;
  waLink = waLink;
}
