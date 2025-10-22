import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  currentLang = 'en';
  languages = ['es', 'en'];

  constructor(private translate: TranslateService) {
    this.currentLang = localStorage.getItem('language') || 'en';
    this.translate.use(this.currentLang);
  }

  useLanguage(language: string): void {
    this.currentLang = language;
    this.translate.use(language);
    localStorage.setItem('language', language);
  }
}