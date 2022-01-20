import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentCalendarViewComponent } from './equipment-calendar-view.component';

describe('EquipmentCalendarViewComponent', () => {
  let component: EquipmentCalendarViewComponent;
  let fixture: ComponentFixture<EquipmentCalendarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentCalendarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
