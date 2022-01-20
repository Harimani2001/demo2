import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationMasterComponent } from './specification-master.component';

describe('SpecificationMasterComponent', () => {
  let component: SpecificationMasterComponent;
  let fixture: ComponentFixture<SpecificationMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificationMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
