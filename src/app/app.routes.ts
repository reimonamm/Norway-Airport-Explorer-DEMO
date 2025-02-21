import { Routes } from '@angular/router';
import { AirportListComponent } from './features/airports/airport-list/airport-list.component';
import { AirportDetailsComponent } from './features/airports/airport-details/airport-details.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/airports',
    pathMatch: 'full'
  },
  {
    path: 'airports',
    component: AirportListComponent
  },
  {
    path: 'airports/:code',
    component: AirportDetailsComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: '**',
    redirectTo: '/airports'
  }
];