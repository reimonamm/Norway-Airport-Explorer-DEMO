import { Component, ElementRef, ViewChild, NgZone, AfterViewInit, HostListener } from '@angular/core';
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

  formData = {
    name: '',
    email: '',
    message: ''
  };
  
  showDemoMessage = false;

  
  ngAfterViewInit() {
    setTimeout(() => {
      const nameInput = document.getElementById('name');
      if (nameInput) {
        nameInput.focus();
      }
    }, 100);
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

  clearForm() {
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
    this.showDemoMessage = false;
    
    setTimeout(() => {
      const nameInput = document.getElementById('name');
      if (nameInput) {
        nameInput.focus();
      }
    }, 100);
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