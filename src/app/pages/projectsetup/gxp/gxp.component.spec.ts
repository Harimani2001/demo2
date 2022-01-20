import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GxpComponent } from './gxp.component';

describe('GxpComponent', () => {
  let component: GxpComponent;
  let fixture: ComponentFixture<GxpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GxpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GxpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
