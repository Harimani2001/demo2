import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceabilitymatrixComponent } from './traceabilitymatrix.component';

describe('TraceabilitymatrixComponent', () => {
  let component: TraceabilitymatrixComponent;
  let fixture: ComponentFixture<TraceabilitymatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceabilitymatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceabilitymatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
