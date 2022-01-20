import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEsignVerificationComponent } from './form-esign-verification.component';

describe('FormEsignVerificationComponent', () => {
  let component: FormEsignVerificationComponent;
  let fixture: ComponentFixture<FormEsignVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEsignVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEsignVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
