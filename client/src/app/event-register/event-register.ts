import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {EventItem} from '../interfaces/EventItem';

@Component({
  selector: 'app-event-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-register.html',
  styleUrl: './event-register.css'
})
export class EventRegister implements OnInit {
  eventId!: number;
  event: EventItem | null = null;
  progressPercent: number = 0;
  eventData: any = {};
  registerForm!: FormGroup;
  errorMessage: string = '';
  successMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (!id) {
      this.errorMessage = 'Missing event id';
      return;
    }
    this.eventId = id;
    this.loadEvent(id);

    // 初始化表单
    this.registerForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
      tickets: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      payment_status: ['free', Validators.required]
    });
  }

  loadEvent(id: string) {
    this.http.get<EventItem>('http://localhost:8080/api/events/' + id).subscribe(
      e => {
        this.event = e;
        this.progressPercent = this.calcProgress(e);
      },
      err => {
        console.error(err);
        this.errorMessage = 'Failed to load event';
      }
    );
  }

  submit(): void {
    this.errorMessage = '';
    this.successMsg = '';

    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const payload = {
      event_id: this.eventId,
      ...this.registerForm.value
    };

    this.http.post(`http://localhost:8080/api/events/${this.eventId}/register`, payload).subscribe(
      res => {
        this.successMsg = 'Registration successful!';
        this.registerForm.reset({ tickets: 1, payment_status: 'free' });
      },
      err => {
        if (err.status === 409) {
          this.errorMessage = 'You have already registered for this event.';
        } else {
          this.errorMessage = 'Failed to register. Please try again.';
        }
      }
    );
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
}
