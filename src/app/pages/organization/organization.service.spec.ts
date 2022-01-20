import { TestBed, inject,ComponentFixture } from '@angular/core/testing';

import { OraganizationService } from './organization.service';
import { AddOrganizationComponent } from "./add-organization/add-organization.component";
let component: AddOrganizationComponent;
let fixture: ComponentFixture<AddOrganizationComponent>;
describe('CompanyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OraganizationService]
    }); 
  });
  beforeEach(() => {
      fixture = TestBed.createComponent(AddOrganizationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

  it('should be created', inject([OraganizationService], (service: OraganizationService) => {
    expect(service).toBeTruthy();
  }));
});
