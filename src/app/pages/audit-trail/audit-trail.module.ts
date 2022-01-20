import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DataTableModule } from 'angular2-datatable';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { DashBoardService } from '../dashboard/dashboard.service';
import { AuditTrailComponent } from './audit-trail.component';
import { AuditTrailService } from './audit-trail.service';
import { UserService } from '../userManagement/user.service';
import { LocationService } from '../location/location.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';

export const AuditTrailRoutes: Routes = [
  {
    path: '',
    component: AuditTrailComponent,
    canActivate: [AuthGuardService],
    data: {
      breadcrumb: 'Project Components',
      status: false
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuditTrailRoutes),
    SharedModule, FormsModule, DataTableModule, NgxDatatableModule, HttpModule,
    FlatpickrModule.forRoot(), MyDatePickerModule,
  ],
  declarations: [AuditTrailComponent],
  providers: [Helper, AuditTrailService, DashBoardService, DatePipe, UserService, LocationService, projectsetupService]


})
export class AuditTrailModule { }