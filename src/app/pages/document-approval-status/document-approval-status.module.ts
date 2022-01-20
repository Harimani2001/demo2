import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTableModule } from 'angular2-datatable';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { AdminComponent } from '../../layout/admin/admin.component';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { AuditTrailService } from '../audit-trail/audit-trail.service';
import { DashBoardService } from '../dashboard/dashboard.service';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { DocumentStatusCommentLog } from '../document-status-comment-log/document-status-comment-log.module';
import { DocumentsignComponentModule } from '../documentsign/documentsign.module';
import { IndividualDocumentWorkflowModule } from './../individual-document-workflow/individual-document-workflow.module';
import { stepperProgressModule } from './../stepperprogress/stepperprogress.module';
import { DocumentApprovalStatusComponent } from './document-approval-status.component';
import { DocumentApprovalSummaryModule } from '../document-approval-summary/document-approval-summary.module';

export const DocumentapprovalstatusRoutes: Routes = [
  {
      path: '',
      component: DocumentApprovalStatusComponent,
      canActivate: [ AuthGuardService ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( DocumentapprovalstatusRoutes ),
    SharedModule,
    DataTableModule,
    FormsModule,
    NgxDatatableModule,
    HttpModule,
    SharedCommonModule,
    DocumentsignComponentModule,
    DocumentStatusCommentLog,AuditTrailViewModule,DocumentForumModule,
    stepperProgressModule,
    IndividualDocumentWorkflowModule,DocumentApprovalSummaryModule
],
declarations: [DocumentApprovalStatusComponent],
providers: [Helper, ConfigService, AuditTrailService,DashBoardService,AdminComponent]

})
export class DocumentApprovalStatusModule { }
