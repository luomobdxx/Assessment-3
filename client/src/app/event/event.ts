import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {EventItem} from '../interfaces/EventItem';
import {CommonModule} from '@angular/common';
import {Registration} from '../interfaces/Registration';
import {Header} from '../header/header';
import {Footer} from '../footer/footer';

@Component({
  selector: 'app-event',
  imports: [CommonModule, RouterModule, Header, Footer],
  templateUrl: './event.html',
  styleUrl: './event.css'
})
export class Event implements OnInit {
  event: EventItem | null = null;
  registrations: Registration[] = [];
  progressPercent: number = 0;
  errorMessage: string = '';
  weather: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (!id) {
      this.errorMessage = 'Missing event id';
      return;
    }
    this.loadEvent(id);
    this.loadRegistrations(id);
  }

  loadEvent(id: string) {
    this.http.get<EventItem>('http://localhost:8080/api/events/' + id).subscribe(
      e => {
        this.event = e;
        this.progressPercent = this.calcProgress(e);
        this.loadWeather(e.latitude, e.longitude);
      },
      err => {
        console.error(err);
        this.errorMessage = 'Failed to load event';
      }
    );
  }

  loadRegistrations(id: string) {
    this.http.get<Registration[]>(`http://localhost:8080/api/events/${id}/registrations`).subscribe({
      next: regs => {
        this.registrations = regs
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to load registrations'
      }
    });
  }

  calcProgress(e: EventItem) {
    const prog = e.progress_amount || 0;
    const goal = e.goal_amount || 0;
    if (!goal) return 0;
    return Math.min(Math.max(Math.round((prog / goal) * 100), 0), 100);
  }

  formatMoney(n: number, currency: string = 'AUD') {
    return currency + ' ' + (Number(n) || 0).toFixed(2);
  }

  register() {
    // alert('This feature is currently under construction.');
    this.router.navigate(['/event-register', this.event?.event_id])
  }

  loadWeather(lat: string, lon: string) {
    this.http.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Australia%2FSydney`).subscribe({
      next: (data: any) => {
        this.weather = data.daily;
      },
      error: err => {
        console.error('Failed to load weather', err);
      }
    });
  }
}
