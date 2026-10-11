import { HttpContext, HttpContextToken } from "@angular/common/http";

export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);

export function silentRequest(): { context: HttpContext } {
  return { context: new HttpContext().set(SKIP_LOADER, true) };
}
