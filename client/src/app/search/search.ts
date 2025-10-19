import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NGO} from '../interfaces/NGO';
import {EventItem} from '../interfaces/EventItem';
import {Category} from '../interfaces/Category';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
  ngos: NGO[] = [];
  categories: Category[] = [];

  dateTime: string = '';
  location: string = '';
  selectedNgo: string = '';
  selectedCategory: string = '';

  results: EventItem[] = [];
  resultCount: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNgos();
    this.loadCategories();
  }

  loadNgos() {
    this.http.get<NGO[]>('http://localhost:8080/api/ngos').subscribe(data => {
      this.ngos = data;
    }, err => {
      console.error('Failed to load NGOs', err);
    });
  }

  loadCategories() {
    this.http.get<Category[]>('http://localhost:8080/api/events/categories').subscribe(data => {
      this.categories = data;
    }, err => {
      console.error('Failed to load categories', err);
    });
  }

  formatMoney(n: number, currency: string = 'AUD') {
    return currency + ' ' + (Number(n) || 0).toFixed(2);
  }

  clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
  }

  calcProgress(e: EventItem) {
    return this.clamp(Math.round((e.progress_amount / e.goal_amount) * 100), 0, 100);
  }

  doSearch() {
    const date = this.dateTime ? new Date(this.dateTime) : null;

    this.http.post<EventItem[]>('http://localhost:8080/api/events/search', {
      date,
      location: this.location,
      ngo: this.selectedNgo,
      category: this.selectedCategory
    }).subscribe(data => {
      this.results = data;
      this.resultCount = data.length;
    }, err => {
      console.error('Failed to search events', err);
      this.results = [];
      this.resultCount = 0;
    });
  }

  resetForm() {
    this.dateTime = '';
    this.location = '';
    this.selectedNgo = '';
    this.selectedCategory = '';
    this.results = [];
    this.resultCount = 0;
  }
}
