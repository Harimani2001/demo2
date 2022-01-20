import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { SqueezeBoxModule } from 'squeezebox';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { LocationService } from '../location/location.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { TaskCreationService } from '../task-creation/task-creation.service';
import { MyDatePickerModule } from 'mydatepicker';
import { NewTimeSheetReportComponent } from './time-sheet-report.component';

export const TimeSheetRoutes: Routes = [{
  path: '',
  component: NewTimeSheetReportComponent,
  data: {
    breadcrumb: 'TimeSheet Report',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TimeSheetRoutes),
    SharedModule,
    FormsModule,
    SharedCommonModule,
    HttpModule,
    NgxDatatableModule,
    AngularMultiSelectModule,
    SqueezeBoxModule,
    MyDatePickerModule,
  ],
  providers: [Helper, DatePipe, ConfigService, projectsetupService, LocationService, TaskCreationService],
  declarations: [NewTimeSheetReportComponent]
})

export class NewTimeSheetReportModule { }