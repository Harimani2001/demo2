import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleManagementComponent } from './add-role-management.component';

describe('AddRoleManagementComponent', () => {
  let component: AddRoleManagementComponent;
  let fixture: ComponentFixture<AddRoleManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoleManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
