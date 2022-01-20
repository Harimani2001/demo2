import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEquipmemtDashboardComponent } from './new-equipmemt-dashboard.component';

describe('NewEquipmemtDashboardComponent', () => {
  let component: NewEquipmemtDashboardComponent;
  let fixture: ComponentFixture<NewEquipmemtDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEquipmemtDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEquipmemtDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
