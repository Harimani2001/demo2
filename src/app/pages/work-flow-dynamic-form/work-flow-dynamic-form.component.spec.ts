import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowDynamicFormComponent } from './work-flow-dynamic-form.component';

describe('WorkFlowDynamicFormComponent', () => {
  let component: WorkFlowDynamicFormComponent;
  let fixture: ComponentFixture<WorkFlowDynamicFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFlowDynamicFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
