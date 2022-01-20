import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoleManagementComponent } from './view-role-management.component';

describe('ViewRoleManagementComponent', () => {
  let component: ViewRoleManagementComponent;
  let fixture: ComponentFixture<ViewRoleManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRoleManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
