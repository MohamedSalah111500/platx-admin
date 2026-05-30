import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import {
  ApiEnvMode,
  ApiEnvironmentService,
  API_URLS,
} from "src/app/core/services/api-environment.service";

@Component({
  selector: "platx-env-switcher",
  templateUrl: "./env-switcher.component.html",
  styleUrls: ["./env-switcher.component.scss"],
  // ngx-bootstrap renders the dropdown menu inside <body> (container="body"),
  // outside this component's encapsulated DOM. Disabling encapsulation lets
  // our menu styles reach it. All class names below are unique-prefixed
  // (.env-chip, .env-menu, .env-option) so they don't leak into other UI.
  encapsulation: ViewEncapsulation.None,
})
export class EnvSwitcherComponent implements OnInit {
  /** "chip" = compact pill for headers, "card" = full card for login screen. */
  @Input() variant: "chip" | "card" = "chip";

  apiMode: ApiEnvMode = "production";
  hosts = API_URLS;

  constructor(public apiEnv: ApiEnvironmentService) {}

  ngOnInit(): void {
    this.apiMode = this.apiEnv.current;
  }

  switchApiMode(mode: ApiEnvMode): void {
    if (mode === this.apiEnv.current) return;
    const label = mode === "production" ? "PRODUCTION" : "TESTING";
    const confirmed = window.confirm(
      `Switch to ${label} environment?\n\n` +
        `Your current session will be cleared and you will be redirected to the login page, ` +
        `because tokens issued by the other environment are not valid here.`
    );
    if (!confirmed) return;

    this.apiEnv.setMode(mode);
    this.apiMode = mode;

    try {
      window.sessionStorage.clear();
      localStorage.removeItem("currentUser");
      localStorage.removeItem("auth-token");
      localStorage.removeItem("token");
    } catch {
      // ignore storage errors
    }

    window.location.href = "/auth/login";
  }
}
