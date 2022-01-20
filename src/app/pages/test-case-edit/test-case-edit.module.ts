import { Helper } from './../../shared/helper';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgDragDropModule } from 'ng-drag-drop';
import { SelectModule } from 'ng-select';
import { DndModule } from 'ng2-dnd';
import { FileUploadModule } from 'ng2-file-upload';
import { UiSwitchModule } from 'ng2-ui-switch';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { SharedModule } from './../../shared/shared.module';
import { DocumentStatusCommentLog } from './../document-status-comment-log/document-status-comment-log.module';
import { DocumentsignComponentModule } from './../documentsign/documentsign.module';
import { DynamicFormService } from './../dynamic-form/dynamic-form.service';
import { IQTCService } from './../iqtc/iqtc.service';
import { stepperProgressModule } from './../stepperprogress/stepperprogress.module';
import { UrsViewModule } from './../urs-view/urs-view.module';
import { UrsService } from './../urs/urs.service';
import { TestCaseEditComponent } from './test-case-edit.component';
import { UrlchecklistModule } from '../urlchecklist/urlchecklist.module';
import { UrsSpecRiskViewModule } from '../urs-spec-risk-view/urs-spec-risk-view.module';
import { LocationService } from '../location/location.service';

export const detailEditRoutes: Routes = [{
  path: '',
  component: TestCaseEditComponent,
  data: {
    breadcrumb: 'Test Case Edit',
    icon: 'icofont icofont-blood-test bg-c-orange'
  }
}];

@NgModule({
  declarations: [TestCaseEditComponent],
  imports: [
    RouterModule.forChild(detailEditRoutes),
    SharedModule,
    SharedCommonModule,
    SelectModule,
    FileUploadModule,
    DocumentsignComponentModule,
    stepperProgressModule,
    DocumentStatusCommentLog,
    UrsViewModule,
    FormsModule,
    NgxDatatableModule,
    UiSwitchModule,
    QuillEditorModule,
    NgDragDropModule.forRoot(),
    DndModule.forRoot(),
    UrlchecklistModule,
    UrsSpecRiskViewModule
  ],
  exports: [TestCaseEditComponent],
  providers: [IQTCService, RiskAssessmentService, UrsService, DynamicFormService, Helper,LocationService]
})
export class TestCaseEditModule { }
