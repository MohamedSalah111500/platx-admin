export const LIMIT_GROUP = {
  Usage: "usage",
  Core: "core",
  Addons: "addons",
} as const;
export type LimitGroup = (typeof LIMIT_GROUP)[keyof typeof LIMIT_GROUP];

export interface LimitMeta {
  group: LimitGroup;
  icon: string;
  presets?: number[];
}

export const LIMIT_META: Record<string, LimitMeta> = {
  max_students: { group: LIMIT_GROUP.Usage, icon: "mdi-account-school-outline", presets: [100, 500, 1000, 5000] },
  online_courses_count: { group: LIMIT_GROUP.Usage, icon: "mdi-book-open-page-variant-outline", presets: [5, 20, 50, 100] },
  file_storage_gb: { group: LIMIT_GROUP.Usage, icon: "mdi-folder-outline", presets: [5, 20, 50, 100] },
  video_upload_gb: { group: LIMIT_GROUP.Usage, icon: "mdi-video-outline", presets: [50, 100, 500, 1000] },
  ai_credits: { group: LIMIT_GROUP.Usage, icon: "mdi-robot-outline", presets: [100, 500, 1000, 5000] },
  whatsapp_messages: { group: LIMIT_GROUP.Usage, icon: "mdi-message-text-outline", presets: [100, 500, 1000, 5000] },
  live_minutes_per_day: { group: LIMIT_GROUP.Usage, icon: "mdi-timer-outline", presets: [60, 120, 240, 480] },
  live_max_participants: { group: LIMIT_GROUP.Usage, icon: "mdi-account-multiple-outline", presets: [50, 100, 300, 1000] },

  student_groups: { group: LIMIT_GROUP.Core, icon: "mdi-account-group-outline" },
  chat: { group: LIMIT_GROUP.Core, icon: "mdi-chat-outline" },
  realtime_notifications: { group: LIMIT_GROUP.Core, icon: "mdi-bell-ring-outline" },
  leaderboard: { group: LIMIT_GROUP.Core, icon: "mdi-trophy-outline" },
  ai_bot: { group: LIMIT_GROUP.Core, icon: "mdi-robot-happy-outline" },
  video_protection: { group: LIMIT_GROUP.Core, icon: "mdi-shield-lock-outline" },
  advanced_reports: { group: LIMIT_GROUP.Core, icon: "mdi-chart-box-outline" },
  custom_ui: { group: LIMIT_GROUP.Core, icon: "mdi-palette-outline" },
  custom_domain: { group: LIMIT_GROUP.Core, icon: "mdi-web" },
  technical_support: { group: LIMIT_GROUP.Core, icon: "mdi-headset" },

  quizzes: { group: LIMIT_GROUP.Addons, icon: "mdi-clipboard-check-outline" },
  completion_certificate: { group: LIMIT_GROUP.Addons, icon: "mdi-certificate-outline" },
  live_enabled: { group: LIMIT_GROUP.Addons, icon: "mdi-broadcast" },
  attendance: { group: LIMIT_GROUP.Addons, icon: "mdi-calendar-check-outline" },
  whatsapp_enabled: { group: LIMIT_GROUP.Addons, icon: "mdi-whatsapp" },
};

export const LIMIT_GROUPS: LimitGroup[] = [LIMIT_GROUP.Usage, LIMIT_GROUP.Core, LIMIT_GROUP.Addons];

const ORDER = Object.keys(LIMIT_META);

export function limitMeta(key: string, isBoolean: boolean): LimitMeta {
  return LIMIT_META[key] ?? { group: isBoolean ? LIMIT_GROUP.Core : LIMIT_GROUP.Usage, icon: "mdi-tune-variant" };
}

export function limitOrder(key: string): number {
  const index = ORDER.indexOf(key);
  return index === -1 ? ORDER.length : index;
}

export function limitName(key: string): string {
  return `LIMITS.${key}.NAME`;
}

export function limitHint(key: string): string {
  return `LIMITS.${key}.HINT`;
}

export function limitGroupTitle(group: LimitGroup): string {
  return `LIMITS.GROUP.${group}.TITLE`;
}

export function limitGroupHint(group: LimitGroup): string {
  return `LIMITS.GROUP.${group}.HINT`;
}
