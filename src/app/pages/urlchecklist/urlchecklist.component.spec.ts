import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlchecklistComponent } from './urlchecklist.component';

describe('UrlchecklistComponent', () => {
  let component: UrlchecklistComponent;
  let fixture: ComponentFixture<UrlchecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlchecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlchecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
