import { inject, TestBed } from '@angular/core/testing';
import { WorkFlowConfigurationDynamicFormService } from './work-flow-configuration-dynamic-form.service';


describe('WorkFlowConfigurationDynamicFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkFlowConfigurationDynamicFormService]
    });
  });

  it('should be created', inject([WorkFlowConfigurationDynamicFormService], (service: WorkFlowConfigurationDynamicFormService) => {
    expect(service).toBeTruthy();
  }));
});
