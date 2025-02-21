import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  template: `
    <div 
      class="container mx-auto px-4 py-8" 
      role="region" 
      aria-labelledby="contact-heading"
    >
      <h1 
        id="contact-heading" 
        class="text-3xl font-bold mb-6" 
        tabindex="0"
      >
        {{ 'CONTACT.TITLE' | translate }}
      </h1>
      
      <div 
        class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 max-w-lg" 
        role="note"
      >
        <p>
          <span class="font-bold">{{ 'CONTACT.DEMO_NOTICE' | translate }}:</span> 
          {{ 'CONTACT.DEMO_TEXT' | translate }}
        </p>
      </div>
      
      <form 
        (ngSubmit)="onSubmit()" 
        class="max-w-lg"
        #contactForm="ngForm"
        aria-labelledby="contact-heading"
      >
        <div class="mb-4">
          <label 
            for="name" 
            class="block text-gray-700 text-sm font-bold mb-2"
          >
            {{ 'CONTACT.NAME' | translate }}
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            [(ngModel)]="formData.name"
            #nameInput="ngModel"
            required
            aria-required="true"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [attr.aria-invalid]="nameInput.invalid && nameInput.touched"
            (blur)="validateField(nameInput)"
          >
          <p 
            *ngIf="nameInput.invalid && nameInput.touched" 
            class="text-red-500 text-xs mt-1"
            role="alert"
          >
            {{ 'CONTACT.NAME_REQUIRED' | translate }}
          </p>
        </div>
        
        <div class="mb-4">
          <label 
            for="email" 
            class="block text-gray-700 text-sm font-bold mb-2"
          >
            {{ 'CONTACT.EMAIL' | translate }}
          </label>
          <input 
            type="email" 
            id="email" 
            name="email"
            [(ngModel)]="formData.email" 
            #emailInput="ngModel"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            aria-required="true"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [attr.aria-invalid]="emailInput.invalid && emailInput.touched"
            (blur)="validateField(emailInput)"
          >
          <p 
            *ngIf="emailInput.invalid && emailInput.touched" 
            class="text-red-500 text-xs mt-1"
            role="alert"
          >
            {{ 'CONTACT.EMAIL_INVALID' | translate }}
          </p>
        </div>
        
        <div class="mb-6">
          <label 
            for="message" 
            class="block text-gray-700 text-sm font-bold mb-2"
          >
            {{ 'CONTACT.MESSAGE' | translate }}
          </label>
          <textarea 
            id="message" 
            name="message"
            [(ngModel)]="formData.message" 
            #messageInput="ngModel"
            rows="4" 
            required
            aria-required="true"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [attr.aria-invalid]="messageInput.invalid && messageInput.touched"
            (blur)="validateField(messageInput)"
          ></textarea>
          <p 
            *ngIf="messageInput.invalid && messageInput.touched" 
            class="text-red-500 text-xs mt-1"
            role="alert"
          >
            {{ 'CONTACT.MESSAGE_REQUIRED' | translate }}
          </p>
        </div>
        
        <div class="flex items-center justify-between">
        <button 
        type="submit" 
        [disabled]="!contactForm.form.valid"
        [attr.aria-label]="'CONTACT.SEND' | translate"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
               focus:outline focus:outline-blue-600 focus:outline-offset-2
               disabled:opacity-90 transition-all duration-300"
      >
        {{ 'CONTACT.SEND' | translate }}
      </button>
          
          <div 
            *ngIf="showDemoMessage" 
            class="text-green-500 ml-4"
            aria-live="polite"
            role="status"
          >
            {{ 'CONTACT.SUCCESS' | translate }}
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    /* Enhanced focus styles */
    button:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); /* Tailwind blue-400 with opacity */
      border-radius: 0.25rem;
      transition: all 0.3s ease;
    }
  `]
})
export class ContactComponent implements AfterViewInit {
  @ViewChildren('nameInput, emailInput, messageInput') formInputs!: QueryList<ElementRef>;

  formData = {
    name: '',
    email: '',
    message: ''
  };
  
  showDemoMessage = false;
  
  ngAfterViewInit() {
    // Ensure first input is focused when component loads
    this.focusFirstInput();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Escape key to clear form
    if (event.key === 'Escape') {
      this.clearForm();
    }
  }

  validateField(input: any) {
    input.control.markAsTouched();
  }

  focusFirstInput() {
    if (this.formInputs && this.formInputs.first) {
      this.formInputs.first.nativeElement.focus();
    }
  }

  clearForm() {
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
    this.showDemoMessage = false;
    this.focusFirstInput();
  }
  
  onSubmit() {
    // Form validation
    if (this.formData.name && this.formData.email && this.formData.message) {
      this.showDemoMessage = true;
      
      // Announce success to screen readers
      setTimeout(() => {
        this.clearForm();
      }, 3000);
    }
  }
}