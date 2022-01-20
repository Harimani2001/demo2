import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRuleComponent } from './email-rule.component';

describe('EmailRuleComponent', () => {
  let component: EmailRuleComponent;
  let fixture: ComponentFixture<EmailRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
