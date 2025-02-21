import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

describe('AppComponent', () => {
 let component: AppComponent;
 let fixture: ComponentFixture<AppComponent>;
 let translateService: TranslateService;

 beforeEach(async () => {
   await TestBed.configureTestingModule({
     imports: [
       TranslateModule.forRoot(),
       NavbarComponent,
       FooterComponent
     ],
     providers: [
       provideRouter([])
     ]
   }).compileComponents();

   fixture = TestBed.createComponent(AppComponent);
   component = fixture.componentInstance;
   translateService = TestBed.inject(TranslateService);
   fixture.detectChanges();
 });

 // Test 1: Default language check
 it('should initialize with English as default language', () => {
   expect(translateService.getDefaultLang()).toBe('en');
   expect(translateService.currentLang).toBe('en');
 });

 // Test 2: Supported languages check
 it('should have correct supported languages', () => {
   const supportedLangs = translateService.getLangs();
   expect(supportedLangs).toContain('en');
   expect(supportedLangs).toContain('et');
   expect(supportedLangs.length).toBe(2);
 });

 // Test 3: Component structure check
 it('should render app structure with navbar, main content, and footer', () => {
   const compiled = fixture.nativeElement as HTMLElement;
   expect(compiled.querySelector('app-navbar')).toBeTruthy();
   expect(compiled.querySelector('main')).toBeTruthy();
   expect(compiled.querySelector('app-footer')).toBeTruthy();
   expect(compiled.querySelector('router-outlet')).toBeTruthy();
 });
});