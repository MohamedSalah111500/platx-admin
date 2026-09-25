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
  CustomDomain: "custom_domain",
  VideoProtection: "video_protection",
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

export const PLATFORM_BASE_LIMIT_KEYS = [
  LIMIT_KEY.CustomDomain,
  LIMIT_KEY.VideoProtection,
  LIMIT_KEY.TechnicalSupport,
];

export function platformRequestLimits(request: PlatformRequest): Record<string, number> {
  const limits: Record<string, number> = {
    [LIMIT_KEY.MaxStudents]: request.students,
    [LIMIT_KEY.OnlineCourses]: request.courses,
    [LIMIT_KEY.VideoUploadGb]: request.videoStorageGb,
    [LIMIT_KEY.FileStorageGb]: request.fileStorageGb,
    [LIMIT_KEY.AiCredits]: request.aiCredits,
  };
  for (const key of PLATFORM_BASE_LIMIT_KEYS) limits[key] = 1;
  for (const addon of Object.values(PLATFORM_ADDON)) {
    limits[PLATFORM_ADDON_LIMIT_KEY[addon]] = request.addons.includes(addon) ? 1 : 0;
  }
  return limits;
}

export function planColumnValue(value: number): number {
  return value === PLATFORM_UNLIMITED ? 0 : value;
}
