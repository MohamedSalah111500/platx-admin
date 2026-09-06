import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public languages: string[] = ['en', 'ar'];
  private readonly rtlLanguages: string[] = ['ar'];
  /** Default language for first-time visitors — Arabic. */
  private readonly defaultLang = 'ar';

  constructor(public translate: TranslateService, private cookieService: CookieService) {
    this.translate.addLangs(this.languages);

    // Respect a saved preference first; otherwise fall back to the app default
    // (Arabic). The browser language is intentionally ignored — the product is
    // Arabic-first, so an English-locale browser should still open in Arabic
    // until the user picks otherwise.
    let lang = this.cookieService.check('lang')
      ? this.cookieService.get('lang')
      : this.defaultLang;

    if (!lang?.match(/^(en|ar)$/)) lang = this.defaultLang;

    // Persist so subsequent visits skip the fallback branch.
    this.cookieService.set('lang', lang);
    this.translate.setDefaultLang(this.defaultLang);
    this.translate.use(lang);
    this.applyDirection(lang);
  }

  public setLanguage(lang) {
    this.translate.use(lang);
    this.cookieService.set('lang', lang);
    this.applyDirection(lang);
  }

  /**
   * Sets `<body dir>` (which is what the compiled RTL CSS bundle targets:
   * `body[dir="rtl"] …`) and mirrors it on `<html>` for browser primitives
   * like form controls. Also stamps `lang` for a11y.
   */
  private applyDirection(lang: string): void {
    if (typeof document === 'undefined') return;
    const dir = this.rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
    document.body.setAttribute('dir', dir);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }
}
