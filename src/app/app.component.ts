import { Component, OnInit } from "@angular/core";
import { SpinnerService } from "./shared/ui/spinner/spinner.service";
import { CrmPageAccessService } from "./core/services/crm-page-access.service";
import { CurrentUserService } from "./core/services/current-user.service";
import { LanguageService } from "./core/services/language.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  isSpinnerVisible = false;

  // LanguageService is injected here, not only in the topbar, so the login
  // screen is translated too: it picks the language and direction on bootstrap.
  constructor(
    private spinnerService: SpinnerService,
    private pageAccess: CrmPageAccessService,
    private currentUser: CurrentUserService,
    private language: LanguageService
  ) {}

  ngOnInit() {
    this.spinnerService.visibility$.subscribe((isVisible) => {
      this.isSpinnerVisible = isVisible;
    });

    // Picks up a grant the owner changed while this session was open.
    if (this.currentUser.isCrmUser) {
      this.pageAccess.load().subscribe();
    }
  }
}
