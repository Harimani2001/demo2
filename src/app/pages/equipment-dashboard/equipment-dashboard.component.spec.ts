import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentDashboardComponent } from './equipment-dashboard.component';

describe('EquipmentDashboardComponent', () => {
  let component: EquipmentDashboardComponent;
  let fixture: ComponentFixture<EquipmentDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
