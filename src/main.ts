/**
 * main.ts - Application Entry Point
 * Bootstraps the Angular application using standalone component pattern.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);