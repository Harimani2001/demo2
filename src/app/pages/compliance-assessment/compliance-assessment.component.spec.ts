import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceAssessmentComponent } from './compliance-assessment.component';

describe('ComplianceAssessmentComponent', () => {
  let component: ComplianceAssessmentComponent;
  let fixture: ComponentFixture<ComplianceAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
