import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DraftPdfComponent } from './draft-pdf.component';

describe('DraftPdfComponent', () => {
  let component: DraftPdfComponent;
  let fixture: ComponentFixture<DraftPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DraftPdfComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
