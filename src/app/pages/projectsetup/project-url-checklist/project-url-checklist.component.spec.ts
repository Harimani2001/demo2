import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectUrlChecklistComponent } from './project-url-checklist.component';

describe('ProjectUrlChecklistComponent', () => {
  let component: ProjectUrlChecklistComponent;
  let fixture: ComponentFixture<ProjectUrlChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectUrlChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectUrlChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
