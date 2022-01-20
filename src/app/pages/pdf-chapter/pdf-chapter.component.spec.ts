import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfChapterComponent } from './pdf-chapter.component';

describe('PdfChapterComponent', () => {
  let component: PdfChapterComponent;
  let fixture: ComponentFixture<PdfChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
