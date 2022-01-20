import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentStatusUpdateComponent } from './equipment-status-update.component';

describe('EquipmentStatusUpdateComponent', () => {
  let component: EquipmentStatusUpdateComponent;
  let fixture: ComponentFixture<EquipmentStatusUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentStatusUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
