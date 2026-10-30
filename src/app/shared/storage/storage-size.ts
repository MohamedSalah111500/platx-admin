import { TranslateService } from "@ngx-translate/core";

export const BYTES_PER_MB = 1024 * 1024;
export const BYTES_PER_GB = 1024 * BYTES_PER_MB;

export function isStorageKey(key: string): boolean {
  return key === "file_storage_gb" || key === "video_upload_gb";
}

export function gbToBytes(gb: number): number {
  return Math.round((gb || 0) * BYTES_PER_GB);
}

export function formatStorageSize(bytes: number, translate: TranslateService): string {
  const safeBytes = Math.max(0, bytes || 0);
  const inGb = safeBytes >= BYTES_PER_GB;
  const value = inGb ? safeBytes / BYTES_PER_GB : safeBytes / BYTES_PER_MB;
  const amount = value.toLocaleString("en-US", { maximumFractionDigits: inGb ? 2 : 1 });
  return `${amount} ${translate.instant(inGb ? "STORAGE_SIZE.GB" : "STORAGE_SIZE.MB")}`;
}
