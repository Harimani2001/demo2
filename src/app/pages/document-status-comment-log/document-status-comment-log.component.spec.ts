import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentStatusCommentLogComponent } from './document-status-comment-log.component';

describe('DocumentStatusCommentLogComponent', () => {
  let component: DocumentStatusCommentLogComponent;
  let fixture: ComponentFixture<DocumentStatusCommentLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentStatusCommentLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentStatusCommentLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
