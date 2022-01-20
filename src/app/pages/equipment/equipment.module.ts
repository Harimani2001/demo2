import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TreeModule } from 'angular-tree-component';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { ConfigService } from '../../shared/config.service';
import { equipmentErrorTypes } from '../../shared/constants';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { LocationService } from '../location/location.service';
import { MasterControlService } from '../master-control/master-control.service';
import { EquipmentComponent } from './equipment.component';
import { EquipmentService } from './equipment.service';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { SqueezeBoxModule } from 'squeezebox';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DepartmentService } from '../department/department.service';
import { UserService } from '../userManagement/user.service';
import { SelectModule } from 'ng-select';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { FileUploadModule } from 'ng2-file-upload';
import { DataTableModule } from 'angular2-datatable';
export const EquipmentRoutes: Routes = [{
  path: '',
  component: EquipmentComponent,
  data: {
    breadcrumb: 'Equipment',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EquipmentRoutes),
    SharedModule,
    SelectModule,
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    UiSwitchModule,
    ReactiveFormsModule,
    SharedCommonModule,
    AuditTrailViewModule,
    SqueezeBoxModule,
    IndividualAuditModule,
    FlatpickrModule.forRoot(),
    FileUploadModule,
    DataTableModule
  ],
  declarations: [EquipmentComponent],
  providers: [EquipmentService, Helper, DepartmentService, UserService, ConfigService, LocationService, equipmentErrorTypes,
    MasterControlService, DatePipe, DynamicFormService, DatePipe, LookUpService, projectsetupService]
})
export class EquipmentModule { }
