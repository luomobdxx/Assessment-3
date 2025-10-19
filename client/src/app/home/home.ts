import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  upcomingEvents: any[] = [];
  pastEvents: any[] = [];
  allEvents: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents() {
    this.http.get<any>('http://localhost:8080/api/events').subscribe(data => {
      this.upcomingEvents = data.upcoming || [];
      this.pastEvents = data.past || [];
      this.allEvents = [...this.upcomingEvents, ...this.pastEvents];
    }, err => {
      console.error(err);
      this.upcomingEvents = [];
      this.pastEvents = [];
      this.allEvents = [];
    });
  }

  // Helpers
  formatMoney(n: string, currency: string = 'AUD') {
    return currency + ' ' + (Number(n) || 0).toFixed(2);
  }

  clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
  }

  calcProgress(event: any) {
    return this.clamp(Math.round((event.progress_amount / event.goal_amount) * 100), 0, 100);
  }

  activeCount() {
    return this.allEvents.filter(e => e.status === 'active').length;
  }

  totalRaised() {
    return this.allEvents.reduce((sum, e) => sum + (Number(e.progress_amount) || 0), 0);
  }

  totalGoal() {
    return this.allEvents.reduce((sum, e) => sum + (Number(e.goal_amount) || 0), 0);
  }

  progressPercent() {
    const goal = this.totalGoal();
    return goal ? Math.round((this.totalRaised() / goal) * 100) : 0;
  }
}
