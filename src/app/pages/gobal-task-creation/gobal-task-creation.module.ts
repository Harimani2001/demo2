import { MyDatePickerModule } from 'mydatepicker/dist';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { TreeModule } from 'angular-tree-component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { DashBoardService } from '../dashboard/dashboard.service';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { SqueezeBoxModule } from 'squeezebox';
import { AngularMultiSelectModule } from 'angular2-multiselect-checkbox-dropdown/angular2-multiselect-dropdown';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { FileUploadForDocService } from '../file-upload-for-doc/file-upload-for-doc.service';
import { EquipmentService } from '../equipment/equipment.service';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { TaskCreationService } from '../task-creation/task-creation.service';
import { GobalTaskCreationComponent } from './gobal-task-creation.component';
import { FlatpickrModule } from '../../../../node_modules/angularx-flatpickr';

export const GobalTaskCreationRoutes: Routes = [{
  path: '',
  component: GobalTaskCreationComponent,
  data: {
    breadcrumb: 'Gobal Task Creation',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(GobalTaskCreationRoutes),
    SharedModule,
    FormsModule,
    TreeModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UiSwitchModule,
    SelectModule,
    SqueezeBoxModule,
    AngularMultiSelectModule,
    SharedCommonModule, AuditTrailViewModule, IndividualAuditModule,
    FlatpickrModule.forRoot(), MyDatePickerModule
  ],
  exports: [GobalTaskCreationComponent],
  declarations: [GobalTaskCreationComponent],
  providers: [DatePipe, EquipmentService, TaskCreationService, Helper, ConfigService, LookUpService, DashBoardService,
    CommonFileFTPService, FileUploadForDocService]
})

export class GobalTaskCreationModule { }