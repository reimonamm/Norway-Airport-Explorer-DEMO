import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
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
    this.focusFirstInput();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
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
    if (this.formData.name && this.formData.email && this.formData.message) {
      this.showDemoMessage = true;
      
      //Announce success to screen readers
      setTimeout(() => {
        this.clearForm();
      }, 3000);
    }
  }
}