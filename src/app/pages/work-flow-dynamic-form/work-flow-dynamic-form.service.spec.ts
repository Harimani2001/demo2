import { TestBed, inject } from '@angular/core/testing';

import { WorkFlowDynamicFormService } from './work-flow-dynamic-form.service';

describe('WorkFlowDynamicFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkFlowDynamicFormService]
    });
  });

  it('should be created', inject([WorkFlowDynamicFormService], (service: WorkFlowDynamicFormService) => {
    expect(service).toBeTruthy();
  }));
});
