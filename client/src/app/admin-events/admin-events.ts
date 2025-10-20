import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-admin-events',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-events.html',
  styleUrl: './admin-events.css'
})
export class AdminEvents implements OnInit {
  events: any[] = [];
  ngos: any[] = [];

  // modal state
  formVisible = false;
  formMode: 'add' | 'edit' = 'add';
  selectedEvent: any = null;

  eventForm: FormGroup;
  serverError = '';
  saving = false;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    // build form with all fields aligned to your API
    this.eventForm = this.fb.group({
      ngo_id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(160)]],
      purpose: ['', [Validators.maxLength(255)]],
      full_description: [''],
      location: ['', [Validators.maxLength(160)]],
      start_date: ['', [Validators.required]],
      end_date: [''],
      ticket_price: [0, [Validators.required, Validators.min(0)]],
      currency: ['AUD', [Validators.required, Validators.maxLength(3)]],
      goal_amount: [0, [Validators.min(0)]],
      progress_amount: [0, [Validators.min(0)]],
      image_url: [''],
      category: ['', [Validators.maxLength(80)]],
      status: ['draft', [Validators.required]],
      latitude: [null],
      longitude: [null]
    }, { validators: this.dateRangeValidator });
  }

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchNgos();
  }

  fetchEvents() {
    // get all admin events
    this.http.get<any>('http://localhost:8080/api/events/admin').subscribe({
      next: (res) => {
        this.events = res;
      },
      error: (err) => {
        console.error('Failed to load events', err);
        this.events = [];
      }
    });
  }

  fetchNgos() {
    this.http.get<any[]>('http://localhost:8080/api/ngos').subscribe({
      next: (res) => this.ngos = res || [],
      error: (err) => {
        console.error('Failed to load NGOs', err);
        this.ngos = [];
      }
    });
  }

  // show add form
  showAddForm() {
    this.formMode = 'add';
    this.selectedEvent = null;
    this.serverError = '';
    this.eventForm.reset({
      ngo_id: '',
      name: '',
      purpose: '',
      full_description: '',
      location: '',
      start_date: '',
      end_date: '',
      ticket_price: 0,
      currency: 'AUD',
      goal_amount: 0,
      progress_amount: 0,
      image_url: '',
      category: '',
      status: 'draft',
      latitude: null,
      longitude: null
    });
    this.formVisible = true;
  }

  // show edit form with data
  showEditForm(ev: any) {
    this.formMode = 'edit';
    this.selectedEvent = ev;
    this.serverError = '';

    // map backend fields to form and convert start/end date to datetime-local value if present
    const toInput = (dt: string | null) => {
      if (!dt) return '';
      const d = new Date(dt);
      // produce "yyyy-MM-ddTHH:mm"
      const pad = (n:number)=> n.toString().padStart(2,'0');
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth()+1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const min = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    };

    this.eventForm.patchValue({
      ngo_id: ev.ngo_id,
      name: ev.name,
      purpose: ev.purpose,
      full_description: ev.full_description,
      location: ev.location,
      start_date: toInput(ev.start_date),
      end_date: toInput(ev.end_date),
      ticket_price: Number(ev.ticket_price || 0),
      currency: ev.currency || 'AUD',
      goal_amount: Number(ev.goal_amount || 0),
      progress_amount: Number(ev.progress_amount || 0),
      image_url: ev.image_url || '',
      category: ev.category || '',
      status: ev.status || 'draft',
      latitude: ev.latitude,
      longitude: ev.longitude
    });

    this.formVisible = true;
  }

  // submit create or update
  saveEvent() {
    this.serverError = '';
    if (this.eventForm.invalid) {
      // touch all controls so errors show
      Object.values(this.eventForm.controls).forEach((c) => c.markAsTouched());
      return;
    }

    const payload = {
      ngo_id: this.eventForm.value.ngo_id,
      name: this.eventForm.value.name,
      purpose: this.eventForm.value.purpose,
      full_description: this.eventForm.value.full_description,
      location: this.eventForm.value.location,
      start_date: this.eventForm.value.start_date ? new Date(this.eventForm.value.start_date).toISOString().slice(0,19).replace('T',' ') : null,
      end_date: this.eventForm.value.end_date ? new Date(this.eventForm.value.end_date).toISOString().slice(0,19).replace('T',' ') : null,
      ticket_price: Number(this.eventForm.value.ticket_price || 0),
      currency: this.eventForm.value.currency,
      goal_amount: Number(this.eventForm.value.goal_amount || 0),
      progress_amount: Number(this.eventForm.value.progress_amount || 0),
      image_url: this.eventForm.value.image_url,
      category: this.eventForm.value.category,
      status: this.eventForm.value.status,
      latitude: this.eventForm.value.latitude !== null && this.eventForm.value.latitude !== '' ? Number(this.eventForm.value.latitude) : null,
      longitude: this.eventForm.value.longitude !== null && this.eventForm.value.longitude !== '' ? Number(this.eventForm.value.longitude) : null
    };

    this.saving = true;

    if (this.formMode === 'add') {
      this.http.post('http://localhost:8080/api/events', payload).subscribe({
        next: () => {
          this.saving = false;
          this.formVisible = false;
          this.fetchEvents();
        },
        error: (err) => {
          this.saving = false;
          console.error(err);
          this.serverError = err.error?.error || 'Failed to create event';
        }
      });
    } else if (this.formMode === 'edit' && this.selectedEvent) {
      this.http.put(`http://localhost:8080/api/events/${this.selectedEvent.event_id}`, payload).subscribe({
        next: () => {
          this.saving = false;
          this.formVisible = false;
          this.fetchEvents();
        },
        error: (err) => {
          this.saving = false;
          console.error(err);
          this.serverError = err.error?.error || 'Failed to update event';
        }
      });
    }
  }

  // delete with confirmation, backend checks registrations and returns 400 if exists
  deleteEvent(event_id: number) {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    this.http.delete(`http://localhost:8080/api/events/${event_id}`).subscribe({
      next: () => this.fetchEvents(),
      error: (err) => {
        console.error(err);
        if (err.status === 400) {
          alert(err.error?.error || 'Cannot delete event because there are registrations.');
        } else {
          alert(err.error?.error || 'Failed to delete event.');
        }
      }
    });
  }

  closeForm() {
    this.formVisible = false;
    this.serverError = '';
  }

  // custom validators
  dateRangeValidator(group: AbstractControl) {
    const s = group.get('start_date')?.value;
    const e = group.get('end_date')?.value;
    if (s && e) {
      const sd = new Date(s);
      const ed = new Date(e);
      if (sd > ed) {
        return { dateRange: 'end_date must be after start_date' };
      }
    }
    return null;
  }

  // helpers used in template
  hasError(controlName: string, error: string) {
    const c = this.eventForm.get(controlName);
    return c && c.touched && c.hasError(error);
  }
}
