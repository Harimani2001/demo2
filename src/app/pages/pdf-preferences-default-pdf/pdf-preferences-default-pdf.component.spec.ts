import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfPreferencesDefaultPdfComponent } from './pdf-preferences-default-pdf.component';

describe('PdfPreferencesDefaultPdfComponent', () => {
  let component: PdfPreferencesDefaultPdfComponent;
  let fixture: ComponentFixture<PdfPreferencesDefaultPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfPreferencesDefaultPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfPreferencesDefaultPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
