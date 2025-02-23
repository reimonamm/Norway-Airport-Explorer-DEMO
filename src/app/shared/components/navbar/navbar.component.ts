import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './navbar.component.html'
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