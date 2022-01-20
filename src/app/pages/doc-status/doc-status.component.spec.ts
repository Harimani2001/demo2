import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocStatusComponent } from './doc-status.component';

describe('DocStatusComponent', () => {
  let component: DocStatusComponent;
  let fixture: ComponentFixture<DocStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
