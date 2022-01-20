import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { SqueezeBoxModule } from 'squeezebox';
import {DocumentStatusCommentLog} from '../../document-status-comment-log/document-status-comment-log.module'
import { Helper } from '../../../shared/helper';
import { SharedModule } from '../../../shared/shared.module';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { DocumentsignComponentModule } from '../../documentsign/documentsign.module';
import { stepperProgressModule } from '../../stepperprogress/stepperprogress.module';
import { AddDocumentComponent } from './add-document.component';
import { Navigation } from '../../navigation-bar/navigation-bar.module';
import { DocumentForumModule } from '../../document-forum/document-forum.module';
import { AuditTrailViewModule } from '../../audit-trail-view/audit-trail-view.module';
import { IndividualAuditModule } from '../../individual-audit-trail/individual-audit-trail.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { IndividualDocumentItemWorkflowModule } from '../../individual-document-item-workflow/individual-document-item-workflow.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';
import { eSignErrorTypes, EsignAgreementMessege, externalApprovalErrorTypes } from '../../../shared/constants';
import { IQTCService } from '../../iqtc/iqtc.service';

export const addDocumentRoutes: Routes = [
  {
    path: '',
    data: {
      status: true
    },
    component: AddDocumentComponent,
  }
];
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    DocumentsignComponentModule,
    SharedCommonModule,
    RouterModule.forChild(addDocumentRoutes),
    FileUploadModule,SqueezeBoxModule,
    stepperProgressModule,
    DocumentForumModule,
    NgxDatatableModule,PdfViewerModule,SignaturePadModule,
    DocumentStatusCommentLog,Navigation,AuditTrailViewModule,
    IndividualAuditModule,IndividualDocumentItemWorkflowModule
  ],
  declarations:[AddDocumentComponent],
  providers:[Helper,EsignAgreementMessege, eSignErrorTypes,externalApprovalErrorTypes,
    IQTCService]
})

export class AddDocumentModule { }