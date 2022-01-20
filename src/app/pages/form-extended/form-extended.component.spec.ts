import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExtendedComponent } from './form-extended.component';

describe('FormExtendedComponent', () => {
  let component: FormExtendedComponent;
  let fixture: ComponentFixture<FormExtendedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormExtendedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExtendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
