import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowLevelsComponent } from './workflow-levels.component';

describe('WorkflowLevelsComponent', () => {
  let component: WorkflowLevelsComponent;
  let fixture: ComponentFixture<WorkflowLevelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowLevelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
