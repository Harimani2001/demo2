import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectsetupComponent } from './add-projectsetup.component';

describe('AddProjectsetupComponent', () => {
  let component: AddProjectsetupComponent;
  let fixture: ComponentFixture<AddProjectsetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProjectsetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectsetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
