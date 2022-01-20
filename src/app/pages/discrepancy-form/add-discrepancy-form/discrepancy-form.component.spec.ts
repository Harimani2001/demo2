import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscrepancyFormComponent } from './add-discrepancy-form.component';

describe('DiscrepancyFormComponent', () => {
  let component: DiscrepancyFormComponent;
  let fixture: ComponentFixture<DiscrepancyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscrepancyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscrepancyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
