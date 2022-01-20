import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSummaryReportComponent } from './create-summary-report.component';

describe('CreateSummaryReportComponent', () => {
  let component: CreateSummaryReportComponent;
  let fixture: ComponentFixture<CreateSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
