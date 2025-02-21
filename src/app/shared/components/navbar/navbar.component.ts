import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  template: `
<nav class="bg-gray-800 p-4">
  <div class="container mx-auto flex justify-between items-center">
    <div class="text-white text-xl font-bold">
      <a routerLink="/" class="hover:text-gray-300">{{ 'NAV.TITLE' | translate }}</a>
    </div>
    <div class="flex items-center">
      <ul class="flex space-x-4 mr-6">
        <li><a routerLink="/airports" class="text-white hover:text-gray-300">{{ 'NAV.AIRPORTS' | translate }}</a></li>
        <li><a routerLink="/about" class="text-white hover:text-gray-300">{{ 'NAV.ABOUT' | translate }}</a></li>
        <li><a routerLink="/contact" class="text-white hover:text-gray-300">{{ 'NAV.CONTACT' | translate }}</a></li>
      </ul>
      <div class="flex space-x-2">
        <button 
          (click)="switchLanguage('en')" 
          [class.opacity-50]="currentLang !== 'en'"
          class="w-6 h-6 rounded overflow-hidden transition-opacity">
          <img src="/assets/flags/gb.svg" alt="English" class="w-full h-full object-cover">
        </button>
        <button 
          (click)="switchLanguage('et')" 
          [class.opacity-50]="currentLang !== 'et'"
          class="w-6 h-6 rounded overflow-hidden transition-opacity">
          <img src="/assets/flags/ee.svg" alt="Estonian" class="w-full h-full object-cover">
        </button>
      </div>
    </div>
  </div>
</nav>
  `
})
export class NavbarComponent implements OnInit {
  currentLang: string = 'en';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.addLangs(['en', 'et']);
    this.currentLang = translate.currentLang || translate.getDefaultLang();
  }

  ngOnInit() {
    this.translate.use(this.currentLang);
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }
}