import { CrmImportRow, CrmLeadPriority, CrmLeadStatus } from "./types";

const AVATAR_PALETTE = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#ec4899",
];

export function phoneDigits(phone?: string | null): string {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.startsWith("00") ? digits.substring(2) : digits;
}

export function waLink(phone?: string | null): string {
  return `https://wa.me/${phoneDigits(phone)}`;
}

export function initials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function avatarColor(seed?: string | null): string {
  if (!seed) return AVATAR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i)) % 997;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

export function normalizeServerDate(value?: string | null): string | null {
  if (!value) return null;
  if (/([zZ]|[+-]\d{2}:?\d{2})$/.test(value)) return value;
  return value + "Z";
}

export function relativeTime(iso?: string | null): string {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  const abs = Math.abs(ms);
  const future = ms < 0;
  const mins = Math.floor(abs / 60000);
  const format = (n: number, unit: string) =>
    future ? `in ${n} ${unit}${n > 1 ? "s" : ""}` : `${n} ${unit}${n > 1 ? "s" : ""} ago`;
  if (mins < 1) return "just now";
  if (mins < 60) return format(mins, "min");
  const hours = Math.floor(mins / 60);
  if (hours < 24) return format(hours, "hour");
  const days = Math.floor(hours / 24);
  if (days < 30) return format(days, "day");
  const months = Math.floor(days / 30);
  if (months < 12) return format(months, "month");
  return format(Math.floor(days / 365), "year");
}

export function toInputDateTime(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromInputDateTime(value?: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export type FollowUpState = "overdue" | "today" | "upcoming" | null;

export function followUpState(iso?: string | null): FollowUpState {
  if (!iso) return null;
  const due = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
  if (due < startOfToday) return "overdue";
  if (due < startOfTomorrow) return "today";
  return "upcoming";
}

const STATUS_ALIASES: Record<string, CrmLeadStatus> = {
  new: CrmLeadStatus.New,
  contacted: CrmLeadStatus.Contacted,
  interested: CrmLeadStatus.Interested,
  demo: CrmLeadStatus.DemoScheduled,
  demoscheduled: CrmLeadStatus.DemoScheduled,
  negotiation: CrmLeadStatus.Negotiation,
  won: CrmLeadStatus.Won,
  subscribed: CrmLeadStatus.Won,
  lost: CrmLeadStatus.Lost,
  notinterested: CrmLeadStatus.Lost,
};

const PRIORITY_ALIASES: Record<string, CrmLeadPriority> = {
  low: CrmLeadPriority.Low,
  medium: CrmLeadPriority.Medium,
  high: CrmLeadPriority.High,
};

const HEADER_ALIASES: Record<string, keyof CrmImportRow> = {
  name: "name",
  phone: "phone",
  mobile: "phone",
  whatsapp: "phone",
  number: "phone",
  email: "email",
  organization: "organization",
  org: "organization",
  company: "organization",
  academy: "organization",
  status: "status",
  stage: "status",
  priority: "priority",
  notes: "notes",
  note: "notes",
  summary: "notes",
};

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (!quoted && /[,;\t|]/.test(ch)) {
      out.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  out.push(current.trim());
  return out;
}

function parseStatus(value?: string | null): CrmLeadStatus | null {
  const key = (value || "").toLowerCase().replace(/[^a-z]/g, "");
  return key in STATUS_ALIASES ? STATUS_ALIASES[key] : null;
}

function parsePriority(value?: string | null): CrmLeadPriority | null {
  const key = (value || "").toLowerCase().replace(/[^a-z]/g, "");
  return key in PRIORITY_ALIASES ? PRIORITY_ALIASES[key] : null;
}

function detectHeader(line: string): (keyof CrmImportRow | null)[] | null {
  const cells = splitCsvLine(line).map((c) => c.toLowerCase().replace(/[^a-z]/g, ""));
  const mapped = cells.map((c) => HEADER_ALIASES[c] || null);
  const hasPhone = mapped.includes("phone");
  const known = mapped.filter((m) => !!m).length;
  return hasPhone && known >= 2 ? mapped : null;
}

function parseWithHeader(lines: string[], header: (keyof CrmImportRow | null)[]): CrmImportRow[] {
  const rows: CrmImportRow[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells = splitCsvLine(line);
    const row: CrmImportRow = { name: "", phone: "" };
    header.forEach((key, i) => {
      const value = cells[i] || "";
      if (!key || !value) return;
      if (key === "status") row.status = parseStatus(value);
      else if (key === "priority") row.priority = parsePriority(value);
      else row[key] = value;
    });
    const digits = phoneDigits(row.phone);
    if (digits.length < 7 || digits.length > 15 || seen.has(digits)) continue;
    seen.add(digits);
    if (!row.name) row.name = row.phone;
    rows.push(row);
  }
  return rows;
}

export function parseImportText(text: string): CrmImportRow[] {
  const allLines = (text || "").split(/\r?\n/);
  const firstLine = allLines.find((l) => l.trim());
  const header = firstLine ? detectHeader(firstLine) : null;
  if (header) return parseWithHeader(allLines.slice(allLines.indexOf(firstLine as string) + 1), header);

  const rows: CrmImportRow[] = [];
  const seen = new Set<string>();

  for (const rawLine of allLines) {
    const line = rawLine.trim();
    if (!line) continue;

    const tokens = splitCsvLine(line).filter((t) => !!t);
    if (!tokens.length) continue;

    let phone = "";
    let email: string | null = null;
    const rest: string[] = [];

    for (const token of tokens) {
      if (!phone && phoneDigits(token).length >= 7 && /^[\d\s()+\-.]+$/.test(token)) {
        phone = token;
      } else if (!email && token.includes("@")) {
        email = token;
      } else {
        rest.push(token);
      }
    }

    if (!phone) {
      const match = line.match(/(\+?\d[\d\s()\-.]{6,}\d)/);
      if (match) {
        phone = match[1].trim();
        const withoutPhone = line.replace(match[1], "").replace(/[,;\t|]+/g, " ").trim();
        rest.length = 0;
        if (withoutPhone) rest.push(withoutPhone);
      }
    }

    const digits = phoneDigits(phone);
    if (!phone || digits.length < 7 || digits.length > 15) continue;
    if (seen.has(digits)) continue;
    seen.add(digits);

    const name = rest.shift() || phone;
    const notes = rest.length ? rest.join(" · ") : null;

    rows.push({ name, phone, email, notes });
  }

  return rows;
}
