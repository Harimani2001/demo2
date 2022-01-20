import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsignComponent } from './documentsign.component';

describe('DocumentsignComponent', () => {
  let component: DocumentsignComponent;
  let fixture: ComponentFixture<DocumentsignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
