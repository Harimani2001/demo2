import { TestBed, inject } from '@angular/core/testing';
import { MasterDynamicFormsService } from './master-dynamic-forms.service';


describe('DynamicFormsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterDynamicFormsService]
    });
  });

  it('should be created', inject([MasterDynamicFormsService], (service: MasterDynamicFormsService) => {
    expect(service).toBeTruthy();
  }));
});
