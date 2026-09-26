export const PLATFORM_UNLIMITED = -1;

export const PLATFORM_ADDON = {
  Exams: "exams",
  Certificates: "certificates",
  Live: "live",
  Attendance: "attendance",
} as const;
export type PlatformAddon = (typeof PLATFORM_ADDON)[keyof typeof PLATFORM_ADDON];

export const PLATFORM_BILLING_CYCLE = {
  SemiAnnual: "semiannual",
  Annual: "annual",
} as const;
export type PlatformBillingCycle = (typeof PLATFORM_BILLING_CYCLE)[keyof typeof PLATFORM_BILLING_CYCLE];

export const PLATFORM_BILLING_MONTHS: Record<PlatformBillingCycle, { months: number; paidMonths: number }> = {
  [PLATFORM_BILLING_CYCLE.SemiAnnual]: { months: 6, paidMonths: 6 },
  [PLATFORM_BILLING_CYCLE.Annual]: { months: 12, paidMonths: 11 },
};

export interface PlatformRequest {
  students: number;
  courses: number;
  videoStorageGb: number;
  fileStorageGb: number;
  aiCredits: number;
  addons: PlatformAddon[];
  billingCycle: PlatformBillingCycle;
  monthlyTotal: number;
}

export const LIMIT_KEY = {
  MaxStudents: "max_students",
  OnlineCourses: "online_courses_count",
  VideoUploadGb: "video_upload_gb",
  FileStorageGb: "file_storage_gb",
  AiCredits: "ai_credits",
  Quizzes: "quizzes",
  CompletionCertificate: "completion_certificate",
  LiveEnabled: "live_enabled",
  Attendance: "attendance",
  TechnicalSupport: "technical_support",
  CustomUi: "custom_ui",
  DocumentsMedia: "documents_media",
  AdvancedReports: "advanced_reports",
} as const;

export const PLATFORM_ADDON_LIMIT_KEY: Record<PlatformAddon, string> = {
  [PLATFORM_ADDON.Exams]: LIMIT_KEY.Quizzes,
  [PLATFORM_ADDON.Certificates]: LIMIT_KEY.CompletionCertificate,
  [PLATFORM_ADDON.Live]: LIMIT_KEY.LiveEnabled,
  [PLATFORM_ADDON.Attendance]: LIMIT_KEY.Attendance,
};

export const ADDON_LIMIT_KEYS: ReadonlySet<string> = new Set(Object.values(PLATFORM_ADDON_LIMIT_KEY));

export const FEATURE_ENABLED = 1;
export const FEATURE_DISABLED = 0;

export function platformRequestLimits(request: PlatformRequest): Record<string, number> {
  const limits: Record<string, number> = {
    [LIMIT_KEY.MaxStudents]: request.students,
    [LIMIT_KEY.OnlineCourses]: request.courses,
    [LIMIT_KEY.VideoUploadGb]: request.videoStorageGb,
    [LIMIT_KEY.FileStorageGb]: request.fileStorageGb,
    [LIMIT_KEY.AiCredits]: request.aiCredits,
  };
  for (const addon of Object.values(PLATFORM_ADDON)) {
    limits[PLATFORM_ADDON_LIMIT_KEY[addon]] = request.addons.includes(addon) ? FEATURE_ENABLED : FEATURE_DISABLED;
  }
  return limits;
}


export const SUBSCRIPTION_TERM = {
  Monthly: "monthly",
  SemiAnnual: PLATFORM_BILLING_CYCLE.SemiAnnual,
  Annual: PLATFORM_BILLING_CYCLE.Annual,
} as const;
export type SubscriptionTerm = (typeof SUBSCRIPTION_TERM)[keyof typeof SUBSCRIPTION_TERM];

export const SUBSCRIPTION_TERM_DETAILS: Record<SubscriptionTerm, { days: number; paidMonths: number; billingCycle: number }> = {
  [SUBSCRIPTION_TERM.Monthly]: { days: 30, paidMonths: 1, billingCycle: 1 },
  [SUBSCRIPTION_TERM.SemiAnnual]: { days: 182, paidMonths: 6, billingCycle: 6 },
  [SUBSCRIPTION_TERM.Annual]: { days: 365, paidMonths: 11, billingCycle: 12 },
};

export const AI_UNLIMITED_QUOTA = 1_000_000;

export const PLATFORM_MAX_QUANTITY = 1_000_000;
export const LIMIT_VALUE_PATTERN = /^(-1|\d+)$/;
