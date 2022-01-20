import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeControlFormComponent } from './change-control-form.component';

describe('ChangeControlFormComponent', () => {
  let component: ChangeControlFormComponent;
  let fixture: ComponentFixture<ChangeControlFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeControlFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeControlFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
