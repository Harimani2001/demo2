import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTemplatesComponent } from './dynamic-templates.component';

describe('DynamicTemplatesComponent', () => {
  let component: DynamicTemplatesComponent;
  let fixture: ComponentFixture<DynamicTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
