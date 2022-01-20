import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonworkflowconfigurationComponent } from './commonworkflowconfiguration.component';

describe('WokflowconfigurationComponent', () => {
  let component: CommonworkflowconfigurationComponent;
  let fixture: ComponentFixture<CommonworkflowconfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonworkflowconfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonworkflowconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
