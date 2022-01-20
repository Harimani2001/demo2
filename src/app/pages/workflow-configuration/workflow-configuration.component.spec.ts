import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowConfigurationComponent } from './workflow-configuration.component';

describe('WorkflowConfigurationComponent', () => {
  let component: WorkflowConfigurationComponent;
  let fixture: ComponentFixture<WorkflowConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
