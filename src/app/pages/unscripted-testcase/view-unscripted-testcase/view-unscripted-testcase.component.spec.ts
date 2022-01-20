import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewUnscriptedComponent } from './view-unscripted-testcase.component';


describe('ViewIqtcComponent', () => {
  let component: ViewUnscriptedComponent;
  let fixture: ComponentFixture<ViewUnscriptedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUnscriptedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUnscriptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
