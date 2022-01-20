import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKnowledgeBaseComponent } from './add-knowledge-base.component';

describe('AddKnowledgeBaseComponent', () => {
  let component: AddKnowledgeBaseComponent;
  let fixture: ComponentFixture<AddKnowledgeBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddKnowledgeBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKnowledgeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
