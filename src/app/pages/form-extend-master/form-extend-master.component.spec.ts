import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExtendMasterComponent } from './form-extend-master.component';

describe('FormExtendMasterComponent', () => {
  let component: FormExtendMasterComponent;
  let fixture: ComponentFixture<FormExtendMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormExtendMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExtendMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
