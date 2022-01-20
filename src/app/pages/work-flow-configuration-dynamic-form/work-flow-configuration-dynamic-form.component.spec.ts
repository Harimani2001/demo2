import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowConfigurationDynamicFormComponent } from './work-flow-configuration-dynamic-form.component';

describe('WorkFlowConfigurationDynamicFormComponent', () => {
  let component: WorkFlowConfigurationDynamicFormComponent;
  let fixture: ComponentFixture<WorkFlowConfigurationDynamicFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFlowConfigurationDynamicFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowConfigurationDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
