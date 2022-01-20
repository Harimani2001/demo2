import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiskAssessmentComponent } from './add-risk-assessment.component';

describe('AddRiskAssessmentComponent', () => {
  let component: AddRiskAssessmentComponent;
  let fixture: ComponentFixture<AddRiskAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRiskAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRiskAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
