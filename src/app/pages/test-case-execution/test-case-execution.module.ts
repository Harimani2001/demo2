import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectModule } from 'ng-select';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { IQTCService } from '../iqtc/iqtc.service';
import { AuditTrailViewModule } from './../audit-trail-view/audit-trail-view.module';
import { DocumentForumModule } from './../document-forum/document-forum.module';
import { DocumentStatusCommentLog } from './../document-status-comment-log/document-status-comment-log.module';
import { DynamicFormService } from './../dynamic-form/dynamic-form.service';
import { IndividualAuditModule } from './../individual-audit-trail/individual-audit-trail.module';
import { IndividualDocumentForumModule } from './../individual-document-forum/individual-document-forum.module';
import { IndividualDocumentSummaryModule } from './../individual-document-summary/individual-document-summary.module';
import { IndividualDocumentWorkflowModule } from './../individual-document-workflow/individual-document-workflow.module';
import { stepperProgressModule } from './../stepperprogress/stepperprogress.module';
import { TestCaseDetailModule } from './../test-case-detail/test-case-detail.module';
import { UrsViewModule } from './../urs-view/urs-view.module';
import { ViewTestcaseFileListModule } from './../view-testcase-file-list/view-testcase-file-list.module';
import { TestCaseExecutionComponent } from './test-case-execution.component';
import { DocumentFormsModule } from '../document-forms/document-forms.module';


export const executionRoutes: Routes = [{
  path: '',
  component: TestCaseExecutionComponent,
  data: {
    breadcrumb: 'Test Case Execution',
    icon: 'icofont icofont-blood-test bg-c-orange'
  }
}];

@NgModule({
  declarations: [TestCaseExecutionComponent],
  imports: [
    RouterModule.forChild(executionRoutes),
    FormsModule,
    SharedModule,
    SharedCommonModule,
    NgxDatatableModule,
    IndividualDocumentSummaryModule,
    AuditTrailViewModule, 
    IndividualDocumentWorkflowModule,
    stepperProgressModule,
    DocumentForumModule,
    DocumentStatusCommentLog,
    UrsViewModule,
    IndividualAuditModule,
    SqueezeBoxModule,
    UiSwitchModule,
    QuillEditorModule,
    SelectModule,
    TestCaseDetailModule,
    ViewTestcaseFileListModule,
    IndividualDocumentForumModule,DocumentFormsModule
  ],
  providers:[IQTCService,DynamicFormService]
})
export class TestCaseExecutionModule { }
