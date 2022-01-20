import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDocumentSummaryComponent } from './individual-document-summary.component';

describe('IndividualDocumentSummaryComponent', () => {
  let component: IndividualDocumentSummaryComponent;
  let fixture: ComponentFixture<IndividualDocumentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualDocumentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDocumentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
