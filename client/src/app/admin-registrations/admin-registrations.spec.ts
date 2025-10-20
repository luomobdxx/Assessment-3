import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegistrations } from './admin-registrations';

describe('AdminRegistrations', () => {
  let component: AdminRegistrations;
  let fixture: ComponentFixture<AdminRegistrations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRegistrations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRegistrations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
