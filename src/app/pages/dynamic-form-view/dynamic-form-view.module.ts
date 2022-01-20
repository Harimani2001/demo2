import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { SelectModule } from 'ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { UiSwitchModule } from 'ng2-ui-switch';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { DMSService } from '../dms/dms.service';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { DocumentStatusCommentLog } from '../document-status-comment-log/document-status-comment-log.module';
import { DocumentsignComponentModule } from '../documentsign/documentsign.module';
import { DraftPdfModule } from '../draft-pdf/draft-pdf.module';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { FormEsignVerificationModule } from '../form-esign-verification/form-esign-verification.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { IndividualDocumentSummaryModule } from '../individual-document-summary/individual-document-summary.module';
import { PDFViewerModule } from '../pdf-viewer/pdf-viewer.module';
import { WorkFlowDynamicFormService } from '../work-flow-dynamic-form/work-flow-dynamic-form.service';
import { stepperProgressModule } from './../stepperprogress/stepperprogress.module';
import { DynamicFormViewComponent } from './dynamic-form-view.component';
import { DynamicFormViewService } from './dynamic-form-view.service';
import { IndividualDocumentForumModule } from '../individual-document-forum/individual-document-forum.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ExternalFormModalModule } from '../external-form-modal/external-form-modal.module';

export const FormView: Routes = [
  {
      path: '',
      component: DynamicFormViewComponent,
      canActivate: [ AuthGuardService ],
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FormView),
    SharedCommonModule,
    SharedModule,
    FormsModule,
    QuillEditorModule,
    NgxDatatableModule,
    SqueezeBoxModule,
    UiSwitchModule,
    DocumentsignComponentModule,
    SelectModule, CKEditorModule,
    stepperProgressModule,
    DocumentForumModule,
    DocumentStatusCommentLog, 
    AuditTrailViewModule, 
    IndividualAuditModule, 
    FormEsignVerificationModule,DraftPdfModule,IndividualDocumentForumModule,
    PDFViewerModule,IndividualDocumentSummaryModule,MyDatePickerModule,PdfViewerModule,ExternalFormModalModule
  ],
  declarations: [DynamicFormViewComponent],
  providers: [Helper,WorkFlowDynamicFormService, ConfigService, DynamicFormViewService,DynamicFormService,DMSService,DatePipe],

})
export class DynamicFormViewModule { }
