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
 // To verify this test works:
 // - Change 'en' to any other language code (e.g., 'fr' or 'de') 
 // - Run 'ng test' - it should fail because default language is 'en'
 it('should initialize with English as default language', () => {
   expect(translateService.getDefaultLang()).toBe('en');
   expect(translateService.currentLang).toBe('en');
 });

 // Test 2: Supported languages check
 // To verify this test works:
 // - Change array length expectation from 2 to 3
 // - Or change 'en' to 'fr' in toContain()
 // - Run 'ng test' - it should fail because only 'en' and 'et' are supported
 it('should have correct supported languages', () => {
   const supportedLangs = translateService.getLangs();
   expect(supportedLangs).toContain('en');
   expect(supportedLangs).toContain('et');
   expect(supportedLangs.length).toBe(2);
 });

 // Test 3: Component structure check
 // To verify this test works:
 // - Change any of the selectors to a non-existent one (e.g., 'wrong-selector')
 // - Or add .querySelector('.non-existent-class')
 // - Run 'ng test' - it should fail because these elements don't exist
 it('should render app structure with navbar, main content, and footer', () => {
   const compiled = fixture.nativeElement as HTMLElement;
   expect(compiled.querySelector('app-navbar')).toBeTruthy();
   expect(compiled.querySelector('main')).toBeTruthy();
   expect(compiled.querySelector('app-footer')).toBeTruthy();
   expect(compiled.querySelector('router-outlet')).toBeTruthy();
 });
});