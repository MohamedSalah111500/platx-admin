export interface CompanyOverview {
  totalTenants: number;
  activeTenants: number;
  newTenantsThisMonth: number;
  totalUsers: number;
  totalStudents: number;
  totalStaff: number;
  activeUsers30d: number;
  newUsersThisMonth: number;
  totalCourses: number;
  totalEnrollments: number;
  enrollmentsThisMonth: number;
}

export interface GrowthPoint {
  year: number;
  month: number;
  label: string;
  newTenants: number;
  newUsers: number;
  newEnrollments: number;
}

export interface CompanyGrowth {
  points: GrowthPoint[];
  mostActiveMonthLabel: string;
  mostActiveMonthEnrollments: number;
}

export interface CompanyActivity {
  enrollments: number;
  examsTaken: number;
  homeworkSubmissions: number;
  lessonsCompleted: number;
  liveClasses: number;
  qrRedemptions: number;
  messagesSent: number;
}

export interface RecentActiveUser {
  name: string;
  email: string;
  tenantTitle: string;
  lastLoginAt: string | null;
}

export interface TopTenant {
  tenantId: string;
  title: string;
  students: number;
  enrollments: number;
}

export interface CompanyEngagement {
  totalUsers: number;
  activeUsers7d: number;
  activeUsers30d: number;
  recentActiveUsers: RecentActiveUser[];
  topTenants: TopTenant[];
}

export interface CurrencyAmount {
  currency: string;
  amount: number;
}

export interface PlanDistribution {
  planName: string;
  displayName: string;
  count: number;
}

export interface TenantRevenue {
  tenantId: string;
  tenantTitle: string;
  planDisplayName: string;
  amountPaid: number;
  currency: string;
  billingCycle: string;
  isTrialPeriod: boolean;
  endDate: string;
}

export interface CompanyRevenue {
  activeSubscriptions: number;
  trialSubscriptions: number;
  expiringSoon30d: number;
  pendingRenewalRequests: number;
  monthlyRecurringRevenue: CurrencyAmount[];
  totalRevenue: CurrencyAmount[];
  planDistribution: PlanDistribution[];
  tenantRevenues: TenantRevenue[];
}

export interface TenantStats {
  totalTenants: number;
  activeTenants: number;
  inactiveTenants: number;
  expiringSoon: number;
  expired: number;
}

export interface CollectionPoint {
  label: string;
  collected: number;
  due: number;
}

export interface TenantCollection {
  tenantId: string;
  tenantTitle: string;
  overdueAmount: number;
  overdueCount: number;
  maxDaysOverdue: number;
  outstandingAmount: number;
}

export interface CompanyCollections {
  contractedAmount: number;
  scheduledAmount: number;
  collectedAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  overdueCount: number;
  overdueTenants: number;
  dueThisMonthAmount: number;
  dueThisMonthCount: number;
  collectionRate: number;
  tenantsWithPlan: number;
  tenantsWithoutPlan: number;
  monthlyCollections: CollectionPoint[];
  topOverdueTenants: TenantCollection[];
}

export type TenantActivityState = 0 | 1 | 2 | 3;

export interface TenantActivity {
  tenantId: string;
  title: string;
  domain: string | null;
  isActive: boolean;
  adminEmail: string | null;
  adminName: string | null;
  students: number;
  activeUsers: number;
  newStudents: number;
  enrollments: number;
  lastLoginAt: string | null;
  lastEnrollmentAt: string | null;
  lastActivityAt: string | null;
  daysSinceActivity: number | null;
  state: TenantActivityState;
}

export interface TenantActivityResult {
  days: number;
  totalTenants: number;
  activeCount: number;
  quietCount: number;
  dormantCount: number;
  neverCount: number;
  tenants: TenantActivity[];
}
