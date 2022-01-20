import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTableModule } from 'angular2-datatable';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { AuditTrailService } from '../audit-trail/audit-trail.service';
import { DocumentsummaryComponent } from './documentsummary.component';
import { SelectModule } from 'ng-select';
import { UserService } from '../userManagement/user.service';
import { TemplateBuiderService } from '../templatebuilder/templatebuilder.service';
import { DashBoardService } from '../dashboard/dashboard.service';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';

export const documentsummaryRoutes: Routes = [
  {
      path: '',
      component: DocumentsummaryComponent,
      canActivate: [ AuthGuardService ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( documentsummaryRoutes ),
    SharedModule,
    DataTableModule,
    FormsModule,
    NgxDatatableModule,
    HttpModule,
    SelectModule,
    SharedCommonModule,AuditTrailViewModule

],
declarations: [DocumentsummaryComponent],
providers: [Helper, ConfigService,DashBoardService, AuditTrailService,UserService,TemplateBuiderService]

})
export class DocumentsummaryModule { }
