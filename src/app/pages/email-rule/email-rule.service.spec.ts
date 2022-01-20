import { TestBed, inject } from '@angular/core/testing';

import { EmailRuleService } from './email-rule.service';

describe('EmailRuleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailRuleService]
    });
  });

  it('should be created', inject([EmailRuleService], (service: EmailRuleService) => {
    expect(service).toBeTruthy();
  }));
});
