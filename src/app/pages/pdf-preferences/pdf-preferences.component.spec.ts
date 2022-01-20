import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfPreferencesComponent } from './pdf-preferences.component';

describe('PdfPreferencesComponent', () => {
  let component: PdfPreferencesComponent;
  let fixture: ComponentFixture<PdfPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
