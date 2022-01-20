import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProjectsetupComponent } from './view-projectsetup.component';


describe('ViewProjectsetupComponent', () => {
  let component: ViewProjectsetupComponent;
  let fixture: ComponentFixture<ViewProjectsetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProjectsetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProjectsetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
