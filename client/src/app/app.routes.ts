import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Search} from './search/search';
import {Event} from './event/event';
import {EventRegister} from './event-register/event-register';
import {Admin} from './admin/admin';
import {AdminEvents} from './admin-events/admin-events';
import {AdminOrganizations} from './admin-organizations/admin-organizations';
import {AdminRegistrations} from './admin-registrations/admin-registrations';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'search', component: Search },
  { path: 'event/:id', component: Event },
  { path: 'event-register/:id', component: EventRegister },
  {
    path: 'admin',
    component: Admin,
    children: [
      { path: '', redirectTo: 'events', pathMatch: 'full' },
      { path: 'events', component: AdminEvents },
      { path: 'organizations', component: AdminOrganizations },
      { path: 'registrations', component: AdminRegistrations },
    ]
  },
];
