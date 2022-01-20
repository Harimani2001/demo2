import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDynamicTemplateComponent } from './view-dynamic-template.component';

describe('ViewDynamicTemplateComponent', () => {
  let component: ViewDynamicTemplateComponent;
  let fixture: ComponentFixture<ViewDynamicTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDynamicTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDynamicTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
