import { TestBed, inject } from '@angular/core/testing';

import { WorkFlowDynamicTemplateService } from './work-flow-dynamic-template.service';

describe('WorkFlowDynamicTemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkFlowDynamicTemplateService]
    });
  });

  it('should be created', inject([WorkFlowDynamicTemplateService], (service: WorkFlowDynamicTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
