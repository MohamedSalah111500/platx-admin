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
