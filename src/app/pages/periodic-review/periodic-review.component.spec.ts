import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicReviewComponent } from './periodic-review.component';

describe('PeriodicReviewComponent', () => {
  let component: PeriodicReviewComponent;
  let fixture: ComponentFixture<PeriodicReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodicReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
