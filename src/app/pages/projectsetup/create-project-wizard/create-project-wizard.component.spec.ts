import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectWizardComponent } from './create-project-wizard.component';

describe('CreateProjectWizardComponent', () => {
  let component: CreateProjectWizardComponent;
  let fixture: ComponentFixture<CreateProjectWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProjectWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
