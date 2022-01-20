import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCleanRoomComponent } from './add-clean-room.component';

describe(' AddCleanRoomComponent', () => {
  let component: AddCleanRoomComponent;
  let fixture: ComponentFixture<AddCleanRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCleanRoomComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCleanRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
