import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrsSpecRiskViewComponent } from './urs-spec-risk-view.component';

describe('UrsSpecRiskViewComponent', () => {
  let component: UrsSpecRiskViewComponent;
  let fixture: ComponentFixture<UrsSpecRiskViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrsSpecRiskViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrsSpecRiskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
