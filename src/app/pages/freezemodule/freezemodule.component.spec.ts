import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreezemoduleComponent } from './freezemodule.component';

describe('FreezemoduleComponent', () => {
  let component: FreezemoduleComponent;
  let fixture: ComponentFixture<FreezemoduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreezemoduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreezemoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
