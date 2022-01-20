import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { Helper } from '../../../shared/helper';
import { HttpModule } from '@angular/http';
import { NgxDatatableModule } from '../../../../../node_modules/@swimlane/ngx-datatable';
import { SqueezeBoxModule } from 'squeezebox';
import { FileUploadModule } from "ng2-file-upload";
import { DocumentsignComponentModule } from '../../documentsign/documentsign.module';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { DocumentStatusCommentLog } from '../../../pages/document-status-comment-log/document-status-comment-log.module'
import { QuillEditorModule } from 'ngx-quill-editor';
import { FileUploadForDocService } from '../../file-upload-for-doc/file-upload-for-doc.service';
import { UrsViewModule } from '../../urs-view/urs-view.module';
import { DocumentForumModule } from '../../document-forum/document-forum.module';
import { ChartsModule } from 'ng2-charts';
import { IndividualAuditModule } from '../../individual-audit-trail/individual-audit-trail.module';
import { AuditTrailViewModule } from '../../audit-trail-view/audit-trail-view.module';
import { DynamicFormService } from '../../dynamic-form/dynamic-form.service';
import { projectsetupService } from '../../projectsetup/projectsetup.service';
import { GobalTraceModule } from '../../gobal-traceability-matrix/gobal-traceability-matrix.module';
import { ViewUnscriptedComponent } from './view-unscripted-testcase.component';
import { UnscriptedService } from '../unscripted-testcase.service';
import { TaskCreationService } from '../../task-creation/task-creation.service';
import { SelectModule } from 'ng-select';
import { EsignAgreementMessege, eSignErrorTypes } from '../../../shared/constants';
import { UrsService } from '../../urs/urs.service';
import { UrsSpecRiskViewModule } from '../../urs-spec-risk-view/urs-spec-risk-view.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { IndividualDocumentItemWorkflowModule } from '../../individual-document-item-workflow/individual-document-item-workflow.module';
import { IndividualDocumentItemWorkflowComponent } from '../../individual-document-item-workflow/individual-document-item-workflow.component';
import { IndividualDocumentForumModule } from '../../individual-document-forum/individual-document-forum.module';
import { PDFViewerModule } from '../../pdf-viewer/pdf-viewer.module';
import { IndividualDocumentSummaryModule } from '../../individual-document-summary/individual-document-summary.module';
import { MyDatePickerModule } from 'mydatepicker';
import { PdfViewerModule } from 'ng2-pdf-viewer';
export const ViewUnscriptedRoutes: Routes = [
    {
        path: '',
        component: ViewUnscriptedComponent
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ViewUnscriptedRoutes),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        UiSwitchModule,
        TagInputModule,
        HttpModule,
        NgxDatatableModule,
        SqueezeBoxModule,
        FileUploadModule,
        DocumentsignComponentModule,
        DocumentForumModule,
        SharedCommonModule,
        DocumentStatusCommentLog,
        QuillEditorModule,
        UrsViewModule,
        GobalTraceModule,
        ChartsModule,
        IndividualAuditModule,
        AuditTrailViewModule,
        SelectModule,
        UrsSpecRiskViewModule,
        SignaturePadModule,
        IndividualDocumentItemWorkflowModule,
    IndividualDocumentForumModule,
    PDFViewerModule,IndividualDocumentSummaryModule,MyDatePickerModule,PdfViewerModule
    ],
    declarations: [ViewUnscriptedComponent],
    providers: [Helper, UnscriptedService, FileUploadForDocService, DynamicFormService, projectsetupService, TaskCreationService, EsignAgreementMessege, eSignErrorTypes,UrsService]
})
export class ViewUnscriptedModule { }
