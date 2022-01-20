import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUrsComponent } from './view-urs.component';

describe('ViewUrsComponent', () => {
  let component: ViewUrsComponent;
  let fixture: ComponentFixture<ViewUrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
