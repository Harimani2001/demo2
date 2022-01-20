import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from '../../shared/helper';
import { ErrorLogsComponent } from './error-logs.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MyDatePickerModule } from 'mydatepicker';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';

export const ErrorLogsRoutes: Routes = [{
  path: '',
  component: ErrorLogsComponent,
  data: {
    breadcrumb: 'Error Logs',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    RouterModule.forChild(ErrorLogsRoutes),
    CommonModule,
    SharedModule, FormsModule, DataTableModule, NgxDatatableModule, HttpModule,
    FlatpickrModule.forRoot(), MyDatePickerModule,
  ],
  declarations: [ErrorLogsComponent],
  providers : [Helper,DateFormatSettingsService],
})
export class ErrorLogsModule { }
