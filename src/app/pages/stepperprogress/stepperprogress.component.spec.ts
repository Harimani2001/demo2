import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperprogressComponent } from './stepperprogress.component';

describe('StepperprogressComponent', () => {
  let component: StepperprogressComponent;
  let fixture: ComponentFixture<StepperprogressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperprogressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
