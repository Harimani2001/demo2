import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadForDocComponent } from './file-upload-for-doc.component';

describe('FileUploadForDocComponent', () => {
  let component: FileUploadForDocComponent;
  let fixture: ComponentFixture<FileUploadForDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadForDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadForDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
