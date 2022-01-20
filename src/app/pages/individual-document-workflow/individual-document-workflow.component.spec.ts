import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDocumentWorkflowComponent } from './individual-document-workflow.component';

describe('IndividualDocumentWorkflowComponent', () => {
  let component: IndividualDocumentWorkflowComponent;
  let fixture: ComponentFixture<IndividualDocumentWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualDocumentWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDocumentWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
