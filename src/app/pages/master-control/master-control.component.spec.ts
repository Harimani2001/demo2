import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterControlComponent } from './master-control.component';

describe('MasterControlComponent', () => {
  let component: MasterControlComponent;
  let fixture: ComponentFixture<MasterControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
