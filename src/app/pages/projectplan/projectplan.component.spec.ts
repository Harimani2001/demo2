import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectplanComponent } from './projectplan.component';

describe('ProjectplanComponent', () => {
  let component: ProjectplanComponent;
  let fixture: ComponentFixture<ProjectplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
