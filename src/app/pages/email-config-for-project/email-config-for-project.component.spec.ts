import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfigForProjectComponent } from './email-config-for-project.component';

describe('EmailConfigForProjectComponent', () => {
  let component: EmailConfigForProjectComponent;
  let fixture: ComponentFixture<EmailConfigForProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailConfigForProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConfigForProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
