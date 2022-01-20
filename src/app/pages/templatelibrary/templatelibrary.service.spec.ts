import { TestBed, inject } from '@angular/core/testing';

import { TemplatelibraryService } from './templatelibrary.service';

describe('VendorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplatelibraryService]
    });
  });

  it('should be created', inject([TemplatelibraryService], (service: TemplatelibraryService) => {
    expect(service).toBeTruthy();
  }));
});
