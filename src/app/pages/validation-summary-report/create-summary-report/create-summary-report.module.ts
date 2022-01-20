import { DocumentsignComponentModule } from './../../documentsign/documentsign.module';
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { CreateSummaryReportComponent } from "./create-summary-report.component";
import { HttpModule } from "@angular/http";
import { UiSwitchModule } from "ng2-ui-switch/dist";
import { TagInputModule } from "ngx-chips";
import { FormsModule } from "@angular/forms";
import { Helper } from "../../../shared/helper";
import { VsrService } from '../validation-summary.service';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SharedCommonModule } from "../../../shared/SharedCommonModule";
import { FormWizardModule } from 'angular2-wizard';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SqueezeBoxModule } from 'squeezebox';
import { MasterControlService } from '../../master-control/master-control.service';
import { IndividualAuditModule } from '../../individual-audit-trail/individual-audit-trail.module';
import { DocumentForumModule } from '../../document-forum/document-forum.module';
import { DynamicFormService } from '../../dynamic-form/dynamic-form.service';
import { IndividualDocumentWorkflowModule } from '../../individual-document-workflow/individual-document-workflow.module';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { SelectModule } from 'ng-select';
import { UrlchecklistModule } from '../../urlchecklist/urlchecklist.module';
import { ProjectSummaryService } from '../../project-summary/project-summary.service';
import { DashBoardService } from '../../dashboard/dashboard.service';
import { WorkflowConfigurationService } from '../../workflow-configuration/workflow-configuration.service';
import { ProjectChecklistModule } from '../../project-checklist/project-checklist.module';
export const createVsrRoutes: Routes = [
    {
        path: '',
        data: {
            status: true
        },
        component: CreateSummaryReportComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(createVsrRoutes),
        SharedModule,
        HttpModule,
        UiSwitchModule,
        FormsModule,
        TagInputModule,
        QuillEditorModule,
        SharedCommonModule,
        FormWizardModule,
        NgxDatatableModule,
        SqueezeBoxModule,
        DocumentsignComponentModule, IndividualAuditModule,
        DocumentForumModule, IndividualDocumentWorkflowModule,
        MyDatePickerModule, SelectModule, UrlchecklistModule,
        ProjectChecklistModule
    ],
    declarations: [CreateSummaryReportComponent],
    providers: [Helper, VsrService, MasterControlService, DatePipe, DynamicFormService, ProjectSummaryService,
        DashBoardService, WorkflowConfigurationService]
})

export class CreateVsrModule { }
