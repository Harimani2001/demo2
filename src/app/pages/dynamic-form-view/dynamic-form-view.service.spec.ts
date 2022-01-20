import { TestBed, inject } from '@angular/core/testing';

import { DynamicFormViewService } from './dynamic-form-view.service';

describe('DynamicFormViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicFormViewService]
    });
  });

  it('should be created', inject([DynamicFormViewService], (service: DynamicFormViewService) => {
    expect(service).toBeTruthy();
  }));
});
