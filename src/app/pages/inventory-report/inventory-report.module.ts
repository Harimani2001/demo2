import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { InventoryReportComponent } from './inventory-report.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Navigation } from '../navigation-bar/navigation-bar.module';
import { SqueezeBoxModule } from 'squeezebox';
import { HttpModule } from '@angular/http';
import { Helper } from '../../shared/helper';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { TagInputModule } from 'ngx-chips';
import { SelectModule } from 'ng-select';
import { ConfigService } from '../../shared/config.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { VsrService } from '../validation-summary-report/validation-summary.service';
import { FormEsignVerificationModule } from '../form-esign-verification/form-esign-verification.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { LocationService } from '../location/location.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';

export const InventoryReportRoutes: Routes = [{
  path: '',
  component: InventoryReportComponent,
  data: {
    breadcrumb: 'Inventory Report',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InventoryReportRoutes),
    SharedModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SharedCommonModule,
    NgxDatatableModule,
    Navigation,
    SqueezeBoxModule,
    MyDatePickerModule,
    TagInputModule,
    SelectModule,
    AngularMultiSelectModule,
    FormEsignVerificationModule,
    AuditTrailViewModule
  ],
  declarations: [InventoryReportComponent],
  providers: [Helper, DatePipe, ConfigService, projectsetupService, VsrService, LocationService, LookUpService],
  exports: [InventoryReportComponent]
})
export class InventoryReportModule { }
