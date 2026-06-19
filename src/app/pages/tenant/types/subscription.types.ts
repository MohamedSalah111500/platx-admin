export enum LimitValueType {
  Number = 1,
  Boolean = 2,
}

export enum LimitPeriod {
  None = 0,
  Total = 1,
  Monthly = 2,
  Daily = 3,
}

export interface LimitDefinition {
  key: string;
  displayName: string;
  unit: string;
  valueType: LimitValueType;
  period: LimitPeriod;
  defaultValue: number;
  description?: string;
  sortOrder: number;
}

export interface PlanLimitDto {
  limitKey: string;
  value: number;
}

export interface TenantLimitOverride {
  limitKey: string;
  value: number;
  reason?: string;
}

export interface TenantLimitUsage {
  key: string;
  displayName: string;
  unit: string;
  period: LimitPeriod;
  limit: number;
  isUnlimited: boolean;
  isOverridden: boolean;
  used: number;
  remaining?: number;
}

export interface TenantLimitsDashboard {
  tenantId: string;
  planId?: number;
  planName?: string;
  items: TenantLimitUsage[];
}

export interface SetTenantOverridePayload {
  tenantId: string;
  limitKey: string;
  value: number;
  reason?: string;
}

export enum SubscriptionStatus {
  Active = 1,
  Grace = 2,
  Expired = 3,
  Cancelled = 4,
}

export enum RenewalRequestStatus {
  Pending = 1,
  Handled = 2,
  Rejected = 3,
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  originalPrice?: number;
  maxStudents: number;
  maxCourses: number;
  maxVideoSizeGB: number;
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  sortOrder: number;
}

export interface TenantSubscription {
  id: number;
  tenantId: string;
  subscriptionPlanId: number;
  subscriptionPlan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isTrialPeriod: boolean;
  status: SubscriptionStatus;
  amountPaid: number;
  currency: string;
  daysRemaining: number;
  isExpiringSoon: boolean;
  isExpired: boolean;
}

export interface AssignSubscriptionPayload {
  subscriptionPlanId: number;
  durationDays?: number | null;
  amount?: number | null;
  startDate?: string | null;
}

export interface ExtendSubscriptionPayload {
  days: number;
}

export interface RenewalRequest {
  id: number;
  tenantId: string;
  tenantTitle?: string;
  requestedBy: string;
  requestedAt: string;
  status: RenewalRequestStatus;
  adminNotes?: string;
  handledAt?: string;
  handledBy?: string;
}

export interface HandleRenewalRequestPayload {
  status: RenewalRequestStatus;
  adminNotes?: string;
}

export interface PagedRenewalResponse {
  items: RenewalRequest[];
  totalCount: number;
}
