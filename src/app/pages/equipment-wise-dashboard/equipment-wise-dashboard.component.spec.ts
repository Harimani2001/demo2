import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentWiseDashboardComponent } from './equipment-wise-dashboard.component';

describe('EquipmentWiseDashboardComponent', () => {
  let component: EquipmentWiseDashboardComponent;
  let fixture: ComponentFixture<EquipmentWiseDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentWiseDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentWiseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
