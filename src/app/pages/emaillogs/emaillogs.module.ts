import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'angular2-datatable';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { EmaillogsComponent } from './emaillogs.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AuditTrailService } from '../audit-trail/audit-trail.service';

export const emailLogsRoutes: Routes = [
  {
      path: '',
      component: EmaillogsComponent,
      canActivate: [ AuthGuardService ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( emailLogsRoutes ),
    SharedModule,
    DataTableModule,
    FormsModule,
    NgxDatatableModule,
    HttpModule,
    SharedCommonModule,

],
declarations: [EmaillogsComponent],
providers: [Helper, ConfigService,AuditTrailService]

})
export class EmailLogsModule { }
