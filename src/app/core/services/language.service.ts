import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public languages: string[] = ['en', 'es', 'de', 'it', 'ru', 'ar'];
  private readonly rtlLanguages: string[] = ['ar'];

  constructor(public translate: TranslateService, private cookieService: CookieService) {
    let browserLang;
    this.translate.addLangs(this.languages);
    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    }
    else {
      this.setLanguage('en');
      browserLang = translate.getBrowserLang();
    }
    const resolved = browserLang?.match(/en|es|de|it|ru|ar/) ? browserLang : 'en';
    translate.use(resolved);
    this.applyDirection(resolved);
  }

  public setLanguage(lang) {
    this.translate.use(lang);
    this.cookieService.set('lang', lang);
    this.applyDirection(lang);
  }

  /**
   * Sets <html dir="rtl"|"ltr"> and toggles a body-level `.rtl-mode` hook so
   * component styles can react without each one importing the language service.
   */
  private applyDirection(lang: string): void {
    if (typeof document === 'undefined') return;
    const isRtl = this.rtlLanguages.includes(lang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    document.body.classList.toggle('rtl-mode', isRtl);
  }
}
