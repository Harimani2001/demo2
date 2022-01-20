import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrsComponent } from './urs.component';

describe('UrsComponent', () => {
  let component: UrsComponent;
  let fixture: ComponentFixture<UrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
