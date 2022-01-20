import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaillogsComponent } from './emaillogs.component';

describe('EmaillogsComponent', () => {
  let component: EmaillogsComponent;
  let fixture: ComponentFixture<EmaillogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaillogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaillogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
