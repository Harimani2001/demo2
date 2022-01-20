import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IqtcComponent } from './iqtc.component';

describe('IqtcComponent', () => {
  let component: IqtcComponent;
  let fixture: ComponentFixture<IqtcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IqtcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IqtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
