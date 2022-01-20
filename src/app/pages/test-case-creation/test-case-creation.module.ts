import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectModule } from 'ng-select';
import { FileUploadModule } from 'ng2-file-upload';
import { UiSwitchModule } from "ng2-ui-switch/dist";
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { IQTCService } from '../iqtc/iqtc.service';
import { UrsViewModule } from '../urs-view/urs-view.module';
import { AuditTrailViewModule } from './../audit-trail-view/audit-trail-view.module';
import { DocumentStatusCommentLog } from './../document-status-comment-log/document-status-comment-log.module';
import { DraftPdfModule } from './../draft-pdf/draft-pdf.module';
import { DynamicFormService } from './../dynamic-form/dynamic-form.service';
import { IndividualDocumentForumModule } from './../individual-document-forum/individual-document-forum.module';
import { IndividualDocumentSummaryModule } from './../individual-document-summary/individual-document-summary.module';
import { TestCaseDetailModule } from './../test-case-detail/test-case-detail.module';
import { TestRunModule } from './../test-run/test-run.module';
import { ViewTestcaseFileListModule } from './../view-testcase-file-list/view-testcase-file-list.module';
import { TestCaseCreationComponent } from './test-case-creation.component';
import { DocumentFormsModule } from '../document-forms/document-forms.module';
import { DocumentForumModule } from '../document-forum/document-forum.module';

export const TestCaseCreationRoutes: Routes =[{
 
        path:'',
        component:TestCaseCreationComponent,
        canActivate: [ AuthGuardService ],
    }

];
 
@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( TestCaseCreationRoutes ),
        SharedCommonModule,
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule,
        SqueezeBoxModule,
        UiSwitchModule,
        UrsViewModule,
        SqueezeBoxModule,
        QuillEditorModule, 
        SelectModule,
        FileUploadModule,
        IndividualDocumentSummaryModule,
        AuditTrailViewModule, 
        TestRunModule,
        DocumentStatusCommentLog,
        TestCaseDetailModule,
        ViewTestcaseFileListModule,
        DraftPdfModule,
        IndividualDocumentForumModule,DocumentFormsModule,DocumentForumModule
    ],
    declarations: [TestCaseCreationComponent],
    
    providers: [IQTCService,DynamicFormService]
} )


export class TestCreationModule{}