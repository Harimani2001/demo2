import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsReportComponent } from './documents-report.component';

describe('DocumentsReportComponent', () => {
  let component: DocumentsReportComponent;
  let fixture: ComponentFixture<DocumentsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
