import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualVersionCreationComponent } from './manual-version-creation.component';

describe('ManualVersionCreationComponent', () => {
  let component: ManualVersionCreationComponent;
  let fixture: ComponentFixture<ManualVersionCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualVersionCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualVersionCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
