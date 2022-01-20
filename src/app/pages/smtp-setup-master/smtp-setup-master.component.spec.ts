import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtpSetupMasterComponent } from './smtp-setup-master.component';

describe('SmtpSetupMasterComponent', () => {
  let component: SmtpSetupMasterComponent;
  let fixture: ComponentFixture<SmtpSetupMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmtpSetupMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtpSetupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
