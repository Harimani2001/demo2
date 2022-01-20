import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentForumComponent } from './document-forum.component';

describe('DocumentForumComponent', () => {
  let component: DocumentForumComponent;
  let fixture: ComponentFixture<DocumentForumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentForumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
