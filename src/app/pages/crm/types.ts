export enum CrmLeadStatus {
  New = 1,
  Contacted = 2,
  Interested = 3,
  DemoScheduled = 4,
  Negotiation = 5,
  Won = 6,
  Lost = 7,
}

export enum CrmLeadSource {
  WhatsApp = 1,
  Facebook = 2,
  Instagram = 3,
  Website = 4,
  Referral = 5,
  PhoneCall = 6,
  Other = 7,
}

export enum CrmLeadPriority {
  Low = 1,
  Medium = 2,
  High = 3,
}

export enum CrmActivityType {
  Note = 1,
  Call = 2,
  WhatsApp = 3,
  Meeting = 4,
  Email = 5,
  StatusChange = 6,
  Assignment = 7,
  FollowUp = 8,
}

export enum CrmFollowUpFilter {
  Overdue = 1,
  Today = 2,
  Upcoming = 3,
  NotScheduled = 4,
}

export interface EnumMeta {
  value: number;
  label: string;
  cls: string;
  icon: string;
}

export const LEAD_STATUSES: EnumMeta[] = [
  { value: CrmLeadStatus.New, label: "New", cls: "st-new", icon: "mdi-star-outline" },
  { value: CrmLeadStatus.Contacted, label: "Contacted", cls: "st-contacted", icon: "mdi-message-text-outline" },
  { value: CrmLeadStatus.Interested, label: "Interested", cls: "st-interested", icon: "mdi-heart-outline" },
  { value: CrmLeadStatus.DemoScheduled, label: "Demo Scheduled", cls: "st-demo", icon: "mdi-calendar-clock-outline" },
  { value: CrmLeadStatus.Negotiation, label: "Negotiation", cls: "st-negotiation", icon: "mdi-handshake-outline" },
  { value: CrmLeadStatus.Won, label: "Won", cls: "st-won", icon: "mdi-trophy-outline" },
  { value: CrmLeadStatus.Lost, label: "Lost", cls: "st-lost", icon: "mdi-close-circle-outline" },
];

export const LEAD_SOURCES: EnumMeta[] = [
  { value: CrmLeadSource.WhatsApp, label: "WhatsApp", cls: "src-whatsapp", icon: "mdi-whatsapp" },
  { value: CrmLeadSource.Facebook, label: "Facebook", cls: "src-facebook", icon: "mdi-facebook" },
  { value: CrmLeadSource.Instagram, label: "Instagram", cls: "src-instagram", icon: "mdi-instagram" },
  { value: CrmLeadSource.Website, label: "Website", cls: "src-website", icon: "mdi-web" },
  { value: CrmLeadSource.Referral, label: "Referral", cls: "src-referral", icon: "mdi-account-arrow-right-outline" },
  { value: CrmLeadSource.PhoneCall, label: "Phone Call", cls: "src-phone", icon: "mdi-phone-outline" },
  { value: CrmLeadSource.Other, label: "Other", cls: "src-other", icon: "mdi-dots-horizontal-circle-outline" },
];

export const LEAD_PRIORITIES: EnumMeta[] = [
  { value: CrmLeadPriority.Low, label: "Low", cls: "pr-low", icon: "mdi-arrow-down" },
  { value: CrmLeadPriority.Medium, label: "Medium", cls: "pr-medium", icon: "mdi-minus" },
  { value: CrmLeadPriority.High, label: "High", cls: "pr-high", icon: "mdi-arrow-up" },
];

export const ACTIVITY_TYPES: EnumMeta[] = [
  { value: CrmActivityType.Note, label: "Note", cls: "act-note", icon: "mdi-note-text-outline" },
  { value: CrmActivityType.Call, label: "Call", cls: "act-call", icon: "mdi-phone-outline" },
  { value: CrmActivityType.WhatsApp, label: "WhatsApp", cls: "act-whatsapp", icon: "mdi-whatsapp" },
  { value: CrmActivityType.Meeting, label: "Meeting", cls: "act-meeting", icon: "mdi-account-group-outline" },
  { value: CrmActivityType.Email, label: "Email", cls: "act-email", icon: "mdi-email-outline" },
  { value: CrmActivityType.StatusChange, label: "Status Change", cls: "act-status", icon: "mdi-swap-horizontal" },
  { value: CrmActivityType.Assignment, label: "Assignment", cls: "act-assign", icon: "mdi-account-switch-outline" },
  { value: CrmActivityType.FollowUp, label: "Follow-up", cls: "act-followup", icon: "mdi-bell-outline" },
];

export const LOGGABLE_ACTIVITY_TYPES: EnumMeta[] = ACTIVITY_TYPES.filter(
  (a) => a.value !== CrmActivityType.StatusChange && a.value !== CrmActivityType.Assignment
);

export const FOLLOW_UP_FILTERS: EnumMeta[] = [
  { value: CrmFollowUpFilter.Overdue, label: "Overdue", cls: "fu-overdue", icon: "mdi-alert-circle-outline" },
  { value: CrmFollowUpFilter.Today, label: "Due today", cls: "fu-today", icon: "mdi-calendar-today" },
  { value: CrmFollowUpFilter.Upcoming, label: "Upcoming", cls: "fu-upcoming", icon: "mdi-calendar-arrow-right" },
  { value: CrmFollowUpFilter.NotScheduled, label: "Not scheduled", cls: "fu-none", icon: "mdi-calendar-remove-outline" },
];

export function metaOf(list: EnumMeta[], value?: number | null): EnumMeta {
  return list.find((m) => m.value === value) || { value: 0, label: "—", cls: "", icon: "" };
}

export interface Paged<T> {
  items: T[];
  totalCount: number;
}

export interface CrmLead {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  organization?: string | null;
  country?: string | null;
  city?: string | null;
  source: CrmLeadSource;
  status: CrmLeadStatus;
  priority: CrmLeadPriority;
  interestedPlan?: string | null;
  notes?: string | null;
  assignedToUserId?: string | null;
  assignedToName?: string | null;
  createdByUserId: string;
  createdByName?: string | null;
  lastContactedAt?: string | null;
  nextFollowUpAt?: string | null;
  lostReason?: string | null;
  creationTime: string;
  updateTime?: string | null;
}

export interface CrmLeadPayload {
  name: string;
  phone: string;
  email?: string | null;
  organization?: string | null;
  country?: string | null;
  city?: string | null;
  source: CrmLeadSource;
  priority: CrmLeadPriority;
  interestedPlan?: string | null;
  notes?: string | null;
  assignedToUserId?: string | null;
  nextFollowUpAt?: string | null;
}

export interface CrmStatusPayload {
  status: CrmLeadStatus;
  note?: string | null;
  lostReason?: string | null;
  nextFollowUpAt?: string | null;
}

export interface CrmLeadFilter {
  status?: CrmLeadStatus | null;
  source?: CrmLeadSource | null;
  priority?: CrmLeadPriority | null;
  assignedToUserId?: string | null;
  unassigned?: boolean | null;
  search?: string | null;
  followUp?: CrmFollowUpFilter | null;
  page: number;
  size: number;
}

export interface CrmStats {
  total: number;
  new: number;
  contacted: number;
  interested: number;
  demoScheduled: number;
  negotiation: number;
  won: number;
  lost: number;
  overdueFollowUps: number;
  dueToday: number;
  newThisWeek: number;
  wonThisMonth: number;
  unassigned: number;
}

export interface CrmPipelineColumn {
  status: CrmLeadStatus;
  total: number;
  leads: CrmLead[];
}

export interface CrmActivity {
  id: number;
  leadId: number;
  type: CrmActivityType;
  content: string;
  createdByUserId: string;
  createdByName?: string | null;
  creationTime: string;
}

export interface CrmActivityPayload {
  type: CrmActivityType;
  content: string;
  nextFollowUpAt?: string | null;
  markAsContacted: boolean;
}

export interface CrmImportRow {
  name: string;
  phone: string;
  email?: string | null;
  organization?: string | null;
  notes?: string | null;
  status?: CrmLeadStatus | null;
  priority?: CrmLeadPriority | null;
}

export interface CrmImportPayload {
  rows: CrmImportRow[];
  source: CrmLeadSource;
  assignedToUserId?: string | null;
}

export interface CrmImportResult {
  created: number;
  skippedDuplicates: number;
  skippedInvalid: number;
}

export interface CrmAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  lastLoginAt?: string | null;
  leadsCount: number;
  openLeadsCount: number;
  wonLeadsCount: number;
}

export interface CrmAgentCreatePayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CrmAgentUpdatePayload {
  firstName: string;
  lastName: string;
  isActive: boolean;
}
