import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUrsComponent } from './add-urs.component';

describe('AddUrsComponent', () => {
  let component: AddUrsComponent;
  let fixture: ComponentFixture<AddUrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
