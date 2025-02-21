import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">{{ 'ABOUT.TITLE' | translate }}</h1>
      
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">{{ 'ABOUT.PROJECT_OVERVIEW' | translate }}</h2>
        <p class="mb-4">
          {{ 'ABOUT.PROJECT_DESCRIPTION' | translate }}
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">{{ 'ABOUT.FEATURES' | translate }}</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>{{ 'ABOUT.FEATURE_LIST.AIRPORTS' | translate }}</li>
          <li>{{ 'ABOUT.FEATURE_LIST.DEPARTURES' | translate }}</li>
          <li>{{ 'ABOUT.FEATURE_LIST.MAP' | translate }}</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">{{ 'ABOUT.TECHNICAL' | translate }}</h2>
        <p class="mb-4">
          {{ 'ABOUT.TECHNICAL_DESCRIPTION' | translate }}
        </p>
      </section>
    </div>
  `
})
export class AboutComponent {}