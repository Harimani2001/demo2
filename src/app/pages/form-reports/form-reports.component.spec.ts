import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReportsComponent } from './form-reports.component';

describe('FormReportsComponent', () => {
  let component: FormReportsComponent;
  let fixture: ComponentFixture<FormReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
