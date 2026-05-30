import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export type ApiEnvMode = "production" | "testing";

const STORAGE_KEY = "platx_api_env";

// Both base URLs are known up-front so the interceptor can rewrite outgoing
// requests to whichever mode the user has selected at runtime.
export const API_URLS: Record<ApiEnvMode, string> = {
  production: "https://platx-backend-prod.runasp.net/",
  testing: "https://platx.runasp.net/",
};

@Injectable({ providedIn: "root" })
export class ApiEnvironmentService {
  private mode$ = new BehaviorSubject<ApiEnvMode>(this.readInitialMode());

  /** Observable stream of the current mode. */
  readonly mode = this.mode$.asObservable();

  /** Synchronous getter for the current mode. */
  get current(): ApiEnvMode {
    return this.mode$.value;
  }

  /** Base URL for the currently selected mode (always ends with /). */
  get apiUrl(): string {
    return API_URLS[this.current];
  }

  /** Returns true when the currently selected mode is testing. */
  get isTesting(): boolean {
    return this.current === "testing";
  }

  /** All known base URLs — used by the interceptor to detect rewritable requests. */
  get knownBaseUrls(): string[] {
    return Object.values(API_URLS);
  }

  /**
   * Persist a new mode and emit it. Returns true when the mode actually changed.
   * Callers are responsible for clearing user data and forcing a re-login when
   * the mode flips, because tokens from one backend won't work in the other.
   */
  setMode(mode: ApiEnvMode): boolean {
    if (mode === this.current) return false;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore quota/permission errors — falling back to in-memory is fine
    }
    this.mode$.next(mode);
    return true;
  }

  /** Convenience for components that only need to watch the boolean. */
  isTesting$(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const sub = this.mode$.subscribe((m) => observer.next(m === "testing"));
      return () => sub.unsubscribe();
    });
  }

  private readInitialMode(): ApiEnvMode {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "production" || stored === "testing") return stored;
    } catch {
      // localStorage unavailable — fall through to default
    }
    return "production";
  }
}
