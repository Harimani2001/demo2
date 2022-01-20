import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectplanComponent } from './add-projectplan.component';

describe('AddProjectplanComponent', () => {
  let component: AddProjectplanComponent;
  let fixture: ComponentFixture<AddProjectplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProjectplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
