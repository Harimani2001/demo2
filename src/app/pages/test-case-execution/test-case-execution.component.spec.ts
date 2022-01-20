import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseExecutionComponent } from './test-case-execution.component';

describe('TestCaseExecutionComponent', () => {
  let component: TestCaseExecutionComponent;
  let fixture: ComponentFixture<TestCaseExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCaseExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCaseExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
