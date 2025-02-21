import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="w-full py-4 bg-transparent mt-auto">
      <p class="text-center">&copy; {{ currentYear }} Norway Airports Explorer</p>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}