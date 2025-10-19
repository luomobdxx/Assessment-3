import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Search} from './search/search';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'search', component: Search },
];
