import { Component, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { CookieService } from "ngx-cookie-service";
import { LanguageService } from "../../core/services/language.service";
import { TranslateService } from "@ngx-translate/core";
import { Store } from "@ngrx/store";
import { RootReducerState } from "src/app/store";
import { User } from "src/app/store/Authentication/auth.models";
import { AuthenticationService } from "src/app/auth/services/auth.service";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})
export class TopbarComponent implements OnInit {
  user: User;
  element: any;
  cookieValue: any;
  flagvalue: any;
  countryName: any;
  valueset: any;
  theme: any;

  /** First two letters of the user's name for the avatar bubble. */
  get userInitials(): string {
    const first = (this.user?.firstName || "").trim();
    const last = (this.user?.lastName || "").trim();
    if (first && last) return (first[0] + last[0]).toUpperCase();
    const only = first || last;
    if (only) return only.substring(0, 2).toUpperCase();
    return "?";
  }

  constructor(
    @Inject(DOCUMENT) private document: any,
    private authService: AuthenticationService,
    public languageService: LanguageService,
    public translate: TranslateService,
    public _cookiesService: CookieService,
    public store: Store<RootReducerState>
  ) {}

  listLang: any = [
    { text: "English", flag: "assets/images/flags/us.jpg", lang: "en" },
    { text: "العربية", flag: "assets/images/flags/ar.svg", lang: "ar" },
  ];

  openMobileMenu: boolean;

  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    this.user = this.authService.currentUser();
    this.store.select("layout").subscribe((data) => {
      this.theme = data.DATA_LAYOUT;
    });
    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this._cookiesService.get("lang");
    const val = this.listLang.filter((x) => x.lang === this.cookieValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = "assets/images/flags/us.jpg";
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  logout() {
    this.authService.logout();
  }

  fullscreen() {
    document.body.classList.toggle("fullscreen-enable");
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

}
