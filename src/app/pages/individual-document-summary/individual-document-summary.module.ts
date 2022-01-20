import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { IndividualDocumentSummaryComponent } from './individual-document-summary.component';
import { DashBoardService } from '../dashboard/dashboard.service';
import { TaskCreationService } from '../task-creation/task-creation.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { ProjectSummaryService } from '../project-summary/project-summary.service';
import { ChartsModule } from 'ng2-charts';
import { tableReportModule } from '../table-report/table-report.module';
import { QuillEditorModule } from 'ngx-quill-editor';
import { UiSwitchModule } from 'ng2-ui-switch';
import { IQTCService } from '../iqtc/iqtc.service';
import { SelectModule } from 'ng-select';
import { UserService } from '../userManagement/user.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DocumentForumComponent } from '../document-forum/document-forum.component';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { AdminComponent } from '../../layout/admin/admin.component';
import { SqueezeBoxModule } from 'squeezebox';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { DndModule } from 'ng2-dnd';
import { NgDragDropModule } from 'ng-drag-drop';
import { userRoleservice } from '../role-management/role-management.service';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { IndividualDocumentSummaryService } from './individual-document-summary.service';
import { individualWorkflowModuleModule } from '../individual-workflow/individual-workflow.module';
import { DocumentsignComponentModule } from '../documentsign/documentsign.module';
import { EsignAgreementMessege } from '../../shared/constants';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    QuillEditorModule,
    SelectModule,
    NgxDatatableModule,DocumentForumModule,ChartsModule,tableReportModule,
    AngularMultiSelectModule,
    SharedModule,
    SqueezeBoxModule,
    SharedCommonModule,
    NgDragDropModule.forRoot(),
    DndModule.forRoot(),
    individualWorkflowModuleModule,
    DocumentsignComponentModule
  ],
  exports:[IndividualDocumentSummaryComponent],
  declarations: [IndividualDocumentSummaryComponent],
  providers : [IndividualDocumentSummaryService,Helper,ConfigService,projectsetupService,DashBoardService,TaskCreationService,ProjectSummaryService,IQTCService,TaskCreationService,DatePipe,UserService,DocumentForumComponent,DynamicFormService,AdminComponent,userRoleservice, WorkFlowLevelsService, WorkflowConfigurationService,EsignAgreementMessege],
})
export class IndividualDocumentSummaryModule { }
