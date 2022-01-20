import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterDynamicFormsComponent } from './master-dynamic-forms.component';



describe('DynamicFormsComponent', () => {
  let component: MasterDynamicFormsComponent;
  let fixture: ComponentFixture<MasterDynamicFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterDynamicFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDynamicFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
