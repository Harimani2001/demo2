import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSettingComponent } from './import-setting.component';

describe('ImportSettingComponent', () => {
  let component: ImportSettingComponent;
  let fixture: ComponentFixture<ImportSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
