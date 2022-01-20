import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenRecordingComponent } from './screen-recording.component';

describe('ScreenRecordingComponent', () => {
  let component: ScreenRecordingComponent;
  let fixture: ComponentFixture<ScreenRecordingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenRecordingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
