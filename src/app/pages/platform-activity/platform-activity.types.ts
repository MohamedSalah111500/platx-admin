export enum PlatformState {
  Never = 0,
  Active = 1,
  Quiet = 2,
  Dormant = 3,
}

export interface PlatformActivityRow {
  tenantId: string;
  title: string;
  domain: string | null;
  isActive: boolean;
  adminEmail: string | null;
  adminName: string | null;
  students: number;
  signInsToday: number;
  signInsInWindow: number;
  usersInWindow: number;
  newStudents: number;
  enrollments: number;
  lessonsCompleted: number;
  examsTaken: number;
  homeworkSubmissions: number;
  liveClasses: number;
  messagesSent: number;
  openedToday: boolean;
  actions: number;
  lastActivityAt: string | null;
  daysSinceActivity: number | null;
  state: PlatformState;
  topActivity: string;
}

export interface PlatformActivityResult {
  days: number;
  generatedAt: string;
  totalPlatforms: number;
  openedToday: number;
  signInsToday: number;
  activeCount: number;
  quietCount: number;
  dormantCount: number;
  neverCount: number;
  newStudents: number;
  enrollments: number;
  platforms: PlatformActivityRow[];
}

export interface PlatformGroup {
  key: string;
  icon: string;
  tone: string;
  rows: PlatformActivityRow[];
}
