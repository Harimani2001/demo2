import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualAuditTrailComponent } from './individual-audit-trail.component';

describe('IndividualAuditTrailComponent', () => {
  let component: IndividualAuditTrailComponent;
  let fixture: ComponentFixture<IndividualAuditTrailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualAuditTrailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualAuditTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
