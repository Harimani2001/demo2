import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { periodicReviewErrorTypes } from '../../shared/constants';
import { DashBoardService } from '../dashboard/dashboard.service';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { TaskReportComponent } from './task-report.component';
import { SqueezeBoxModule } from 'squeezebox';
import { SelectModule } from 'ng-select';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { TaskReportService } from './task-report.service';
import { MyDatePickerModule } from '../../../../node_modules/mydatepicker/dist';

export const TaskReportsRoutes: Routes = [{
  path: '',
  component: TaskReportComponent,
  data: {
    breadcrumb: 'Task Report',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TaskReportsRoutes),
    SharedModule,
    MyDatePickerModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,SqueezeBoxModule,SelectModule,SharedCommonModule
  ],
  declarations: [TaskReportComponent],
  providers : [DatePipe,TaskReportService,projectsetupService,LookUpService,Helper,ConfigService,DashBoardService,CommonFileFTPService,periodicReviewErrorTypes]
  
})
export class TaskReportsModule { }
