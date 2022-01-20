import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterDynamicTemplateComponent} from './master-dynamic-template.component';



describe('DynamicFormsComponent', () => {
  let component: MasterDynamicTemplateComponent;
  let fixture: ComponentFixture<MasterDynamicTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterDynamicTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDynamicTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
