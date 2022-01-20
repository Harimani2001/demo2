import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowDynamicTemplateComponent } from './work-flow-dynamic-template.component';

describe('WorkFlowDynamicTemplateComponent', () => {
  let component: WorkFlowDynamicTemplateComponent;
  let fixture: ComponentFixture<WorkFlowDynamicTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkFlowDynamicTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowDynamicTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
