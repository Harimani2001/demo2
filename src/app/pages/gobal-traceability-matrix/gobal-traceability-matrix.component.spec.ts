import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GobalTraceabilityMatrixComponent } from './gobal-traceability-matrix.component';

describe('GobalTraceabilityMatrixComponent', () => {
  let component: GobalTraceabilityMatrixComponent;
  let fixture: ComponentFixture<GobalTraceabilityMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GobalTraceabilityMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GobalTraceabilityMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
