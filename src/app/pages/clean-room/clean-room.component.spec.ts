import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CleanRoomComponent } from './clean-room.component';

describe(' CleanRoomComponent', () => {
  let component: CleanRoomComponent;
  let fixture: ComponentFixture<CleanRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CleanRoomComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
