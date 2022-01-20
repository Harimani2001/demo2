import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTimeSheetReportComponent } from './time-sheet-report.component';

describe('NewTimeSheetReportComponent', () => {
  let component: NewTimeSheetReportComponent;
  let fixture: ComponentFixture<NewTimeSheetReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewTimeSheetReportComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTimeSheetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
