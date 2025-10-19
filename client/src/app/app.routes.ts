import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Search} from './search/search';
import {Event} from './event/event';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'search', component: Search },
  { path: 'event/:id', component: Event },
];
