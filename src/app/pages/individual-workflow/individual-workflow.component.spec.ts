import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualWorkflowComponent } from './individual-workflow.component';

describe('IndividualWorkflowComponent', () => {
  let component: IndividualWorkflowComponent;
  let fixture: ComponentFixture<IndividualWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
