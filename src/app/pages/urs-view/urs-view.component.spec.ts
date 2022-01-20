import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrsViewComponent } from './urs-view.component';

describe('UrsViewComponent', () => {
  let component: UrsViewComponent;
  let fixture: ComponentFixture<UrsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
