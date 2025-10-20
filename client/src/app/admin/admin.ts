import { Component } from '@angular/core';
import {Header} from '../header/header';
import {Router, RouterModule, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [Header, RouterModule, RouterOutlet],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  constructor(public router: Router) {}

  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
