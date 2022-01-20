import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConfigService } from '../../shared/config.service';
import { externalApprovalErrorTypes } from '../../shared/constants';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { DocumentStatusCommentLog } from '../document-status-comment-log/document-status-comment-log.module';
import { DocumentsignComponentModule } from '../documentsign/documentsign.module';
import { PDFViewerModule } from './../pdf-viewer/pdf-viewer.module';
import { IndividualDocumentWorkflowComponent } from './individual-document-workflow.component';
import { IndividualDocumentWorkflowService } from './individual-document-workflow.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentsignComponentModule,
    DocumentStatusCommentLog,AuditTrailViewModule,
    DocumentForumModule,PdfViewerModule,NgxDatatableModule
  ],
  exports:[IndividualDocumentWorkflowComponent],
  declarations: [IndividualDocumentWorkflowComponent],
  providers : [Helper,ConfigService,IndividualDocumentWorkflowService,externalApprovalErrorTypes],
})
export class IndividualDocumentWorkflowModule { }
