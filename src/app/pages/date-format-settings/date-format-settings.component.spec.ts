import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFormatSettingsComponent } from './date-format-settings.component';

describe('DateFormatSettingsComponent', () => {
  let component: DateFormatSettingsComponent;
  let fixture: ComponentFixture<DateFormatSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateFormatSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFormatSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
