import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsummaryComponent } from './documentsummary.component';

describe('DocumentsummaryComponent', () => {
  let component: DocumentsummaryComponent;
  let fixture: ComponentFixture<DocumentsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
