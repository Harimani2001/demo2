import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDynamicTemplateComponent } from './add-dynamic-template.component';

describe('AddDynamicTemplateComponent', () => {
  let component: AddDynamicTemplateComponent;
  let fixture: ComponentFixture<AddDynamicTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDynamicTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDynamicTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
