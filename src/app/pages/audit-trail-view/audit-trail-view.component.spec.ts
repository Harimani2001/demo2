import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrailViewComponent } from './audit-trail-view.component';

describe('AuditTrailViewComponent', () => {
  let component: AuditTrailViewComponent;
  let fixture: ComponentFixture<AuditTrailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
