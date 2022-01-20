import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRiskAssessmentComponent } from './view-risk-assessment.component';

describe('ViewRiskAssessmentComponent', () => {
  let component: ViewRiskAssessmentComponent;
  let fixture: ComponentFixture<ViewRiskAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRiskAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRiskAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
