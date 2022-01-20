import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiscrepancyFormComponent } from './view-discrepancy-form.component';

describe('ViewDiscrepancyFormComponent', () => {
  let component: ViewDiscrepancyFormComponent;
  let fixture: ComponentFixture<ViewDiscrepancyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDiscrepancyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiscrepancyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
