import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GobalTaskCreationComponent } from './gobal-task-creation.component';

describe('GobalTaskCreationComponent', () => {
  let component: GobalTaskCreationComponent;
  let fixture: ComponentFixture<GobalTaskCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GobalTaskCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GobalTaskCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
