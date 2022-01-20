import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnscriptedComponent } from './add-unscripted-testcase.component';

describe('AddIqtcComponent', () => {
  let component: AddUnscriptedComponent;
  let fixture: ComponentFixture<AddUnscriptedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUnscriptedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnscriptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
