import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessvalidationComponent } from './process-validation.component';

describe('ProcessvalidationComponent', () => {
  let component: ProcessvalidationComponent;
  let fixture: ComponentFixture<ProcessvalidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessvalidationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessvalidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});