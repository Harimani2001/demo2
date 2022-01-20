import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentApprovalStatusComponent } from './document-approval-status.component';

describe('DocumentApprovalStatusComponent', () => {
  let component: DocumentApprovalStatusComponent;
  let fixture: ComponentFixture<DocumentApprovalStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentApprovalStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentApprovalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
