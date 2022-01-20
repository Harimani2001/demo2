import { TestBed, inject } from '@angular/core/testing';
import { MasterDynamicTemplateService } from './master-dynamic-template.service';


describe('DynamicFormsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterDynamicTemplateService]
    });
  });

  it('should be created', inject([MasterDynamicTemplateService], (service: MasterDynamicTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
