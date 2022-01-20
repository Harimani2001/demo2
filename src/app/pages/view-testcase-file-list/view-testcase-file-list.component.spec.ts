import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTestcaseFileListComponent } from './view-testcase-file-list.component';

describe('ViewTestcaseFileListComponent', () => {
  let component: ViewTestcaseFileListComponent;
  let fixture: ComponentFixture<ViewTestcaseFileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTestcaseFileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTestcaseFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
