import { TestBed, inject } from '@angular/core/testing';

import { CommonFileFTPService } from './common-file-ftp.service';

describe('CommonServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonFileFTPService]
    });
  });

  it('should be created', inject([CommonFileFTPService], (service: CommonFileFTPService) => {
    expect(service).toBeTruthy();
  }));
});
