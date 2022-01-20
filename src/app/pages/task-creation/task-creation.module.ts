import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TreeModule } from 'angular-tree-component';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { SelectModule } from 'ng-select';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { SqueezeBoxModule } from 'squeezebox';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { DashBoardService } from '../dashboard/dashboard.service';
import { EquipmentService } from '../equipment/equipment.service';
import { FileUploadForDocService } from '../file-upload-for-doc/file-upload-for-doc.service';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { TaskCreationComponent } from './task-creation.component';
import { TaskCreationService } from './task-creation.service';

export const TaskCreationRoutes: Routes = [{
  path: '',
  component: TaskCreationComponent,
  data: {
    breadcrumb: 'Task Creation',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TaskCreationRoutes),
    SharedModule,
    FormsModule,
    TreeModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UiSwitchModule,
    SelectModule,
    SqueezeBoxModule,
    SharedCommonModule,AuditTrailViewModule,IndividualAuditModule,
    MyDatePickerModule
  ],
  exports:[TaskCreationComponent],
  declarations: [TaskCreationComponent],
  providers : [EquipmentService,TaskCreationService,Helper,ConfigService,LookUpService,DashBoardService,CommonFileFTPService,FileUploadForDocService,DatePipe]
})
export class TaskCreationModule { }
