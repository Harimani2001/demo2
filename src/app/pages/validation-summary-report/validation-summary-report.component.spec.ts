import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationSummaryReportComponent } from './validation-summary-report.component';

describe('ValidationSummaryReportComponent', () => {
  let component: ValidationSummaryReportComponent;
  let fixture: ComponentFixture<ValidationSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
