import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-admin-registrations',
  imports: [CommonModule],
  templateUrl: './admin-registrations.html',
  styleUrl: './admin-registrations.css'
})
export class AdminRegistrations {
  registrations: any[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRegistrations();
  }

  fetchRegistrations() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8080/api/regs').subscribe({
      next: (res) => {
        this.registrations = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load registrations', err);
        this.registrations = [];
        this.loading = false;
      }
    });
  }

  deleteRegistration(registration_id: number) {
    if (!confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    this.http.delete(`http://localhost:8080/api/regs/${registration_id}`).subscribe({
      next: () => {
        this.fetchRegistrations();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.error || 'Failed to delete registration.');
      }
    });
  }
}
