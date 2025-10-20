import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-organizations',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-organizations.html',
  styleUrl: './admin-organizations.css'
})
export class AdminOrganizations {
  organizations: any[] = [];

  formVisible = false;
  formMode: 'add' | 'edit' = 'add';
  selectedOrg: any = null;
  orgForm: FormGroup;
  serverError = '';
  saving = false;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.orgForm = this.fb.group({
      ngo_name: ['', [Validators.required, Validators.maxLength(120)]],
      hq_location: ['', [Validators.maxLength(255)]],
      contact_email: ['', [Validators.email]],
    });
  }

  ngOnInit(): void {
    this.fetchOrganizations();
  }

  fetchOrganizations() {
    this.http.get<any[]>('http://localhost:8080/api/ngos').subscribe({
      next: (res) => (this.organizations = res || []),
      error: (err) => {
        console.error('Failed to load organizations', err);
        this.organizations = [];
      }
    });
  }

  showAddForm() {
    this.formMode = 'add';
    this.selectedOrg = null;
    this.serverError = '';
    this.orgForm.reset({
      ngo_name: '',
      hq_location: '',
      contact_email: '',
    });
    this.formVisible = true;
  }

  showEditForm(org: any) {
    this.formMode = 'edit';
    this.selectedOrg = org;
    this.serverError = '';
    this.orgForm.patchValue({
      ngo_name: org.ngo_name,
      hq_location: org.hq_location,
      contact_email: org.contact_email,
    });
    this.formVisible = true;
  }

  saveOrganization() {
    this.serverError = '';
    if (this.orgForm.invalid) {
      Object.values(this.orgForm.controls).forEach((c) => c.markAsTouched());
      return;
    }

    const payload = this.orgForm.value;
    this.saving = true;

    if (this.formMode === 'add') {
      this.http.post('http://localhost:8080/api/ngos', payload).subscribe({
        next: () => {
          this.saving = false;
          this.formVisible = false;
          this.fetchOrganizations();
        },
        error: (err) => {
          this.saving = false;
          console.error(err);
          this.serverError = err.error?.error || 'Failed to create organization';
        }
      });
    } else if (this.formMode === 'edit' && this.selectedOrg) {
      this.http.put(`http://localhost:8080/api/ngos/${this.selectedOrg.ngo_id}`, payload).subscribe({
        next: () => {
          this.saving = false;
          this.formVisible = false;
          this.fetchOrganizations();
        },
        error: (err) => {
          this.saving = false;
          console.error(err);
          this.serverError = err.error?.error || 'Failed to update organization';
        }
      });
    }
  }

  deleteOrganization(id: number) {
    if (!confirm('Are you sure you want to delete this organization?')) {
      return;
    }

    this.http.delete(`http://localhost:8080/api/ngos/${id}`).subscribe({
      next: () => this.fetchOrganizations(),
      error: (err) => {
        console.error(err);
        alert(err.error?.error || 'Failed to delete organization.');
      }
    });
  }

  closeForm() {
    this.formVisible = false;
    this.serverError = '';
  }

  hasError(controlName: string, error: string) {
    const c = this.orgForm.get(controlName);
    return c && c.touched && c.hasError(error);
  }
}
