import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCaseCreationComponent } from './test-case-creation.component';

describe('TestCaseCreationComponent', () => {
  let component: TestCaseCreationComponent;
  let fixture: ComponentFixture<TestCaseCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCaseCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCaseCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
