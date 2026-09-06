import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public languages: string[] = ['en', 'ar'];
  private readonly rtlLanguages: string[] = ['ar'];

  constructor(public translate: TranslateService, private cookieService: CookieService) {
    let browserLang;
    this.translate.addLangs(this.languages);
    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    } else {
      this.setLanguage('en');
      browserLang = translate.getBrowserLang();
    }
    const resolved = browserLang?.match(/en|ar/) ? browserLang : 'en';
    translate.use(resolved);
    this.applyDirection(resolved);
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
