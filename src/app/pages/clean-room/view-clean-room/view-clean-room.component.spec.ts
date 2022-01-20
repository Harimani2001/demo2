import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewCleanRoomComponent } from './view-clean-room.component';

describe(' ViewCleanRoomComponent', () => {
  let component: ViewCleanRoomComponent;
  let fixture: ComponentFixture<ViewCleanRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCleanRoomComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCleanRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
