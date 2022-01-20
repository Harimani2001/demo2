import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormWizardModule } from 'angular2-wizard';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { SelectModule } from 'ng-select';
import { FileUploadModule } from 'ng2-file-upload';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { projectPlanSetupErrorTypes } from '../../shared/constants';
import { Helper } from '../../shared/helper';
import { DashBoardService } from '../dashboard/dashboard.service';
import { DepartmentService } from '../department/department.service';
import { DocumentStatusCommentLog } from '../document-status-comment-log/document-status-comment-log.module';
import { EquipmentService } from '../equipment/equipment.service';
import { LocationService } from '../location/location.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { ManualVersionCreationModule } from '../manual-version-creation/manual-version-creation.module';
import { MasterControlService } from '../master-control/master-control.service';
import { UserService } from '../userManagement/user.service';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { SharedModule } from './../../shared/shared.module';
import { SharedCommonModule } from './../../shared/SharedCommonModule';
import { AuditTrailViewModule } from './../audit-trail-view/audit-trail-view.module';
import { DocumentForumModule } from './../document-forum/document-forum.module';
import { DynamicFormService } from './../dynamic-form/dynamic-form.service';
import { IndividualAuditModule } from './../individual-audit-trail/individual-audit-trail.module';
import { userRoleservice } from './../role-management/role-management.service';
import { stepperProgressModule } from './../stepperprogress/stepperprogress.module';
import { AddProjectsetupComponent } from './add-projectsetup/add-projectsetup.component';
import { CreateProjectWizardComponent } from './create-project-wizard/create-project-wizard.component';
import { GxpModule } from './gxp/gxp.module';
import { projectsetupService } from './projectsetup.service';
import { ViewProjectsetupComponent } from './view-projectsetup/view-projectsetup.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { DndModule } from 'ng2-dnd';
import { ProjectChecklistModule } from '../project-checklist/project-checklist.module';
import { VendorMasterService } from '../vendor-master/vendor-master.service';
import { veificationHistoryModule } from '../veification-history/veification-history.module';
import { TemplatelibraryService } from '../templatelibrary/templatelibrary.service';
import { AddDocumentWorkflowModule } from '../add-document-workflow/add-document-workflow.module';
import { DocumentWorkflowHistoryModule } from '../document-workflow-history/document-workflow-history.module';

export const projectsetup: Routes = [
    {
        path: '',
        canActivate: [AuthGuardService],
        data: {
            status: false
        },
        children: [
            {
                path: 'add-projectsetup',
                component: AddProjectsetupComponent
            },
            {
                path: 'view-projectsetup',
                component: ViewProjectsetupComponent
            },
            {
                path: 'add-projectsetup/:id',
                component: AddProjectsetupComponent
            },
            {
                path: 'create-projectWizard',
                component: CreateProjectWizardComponent
            },
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        HttpModule,
        SharedCommonModule,
        RouterModule.forChild(projectsetup),
        FormsModule,
        ReactiveFormsModule,
        MyDatePickerModule,
        GxpModule,
        TagInputModule,
        UiSwitchModule,
        FormWizardModule,
        SelectModule,
        SqueezeBoxModule,
        QuillEditorModule,
        FileUploadModule,
        NgxDatatableModule,
        DocumentForumModule,
        stepperProgressModule,
        AuditTrailViewModule,
        IndividualAuditModule,
        DocumentStatusCommentLog,
        ManualVersionCreationModule,
        NgDragDropModule.forRoot(),
        DndModule.forRoot(),
        ProjectChecklistModule,
        veificationHistoryModule,AddDocumentWorkflowModule,DocumentWorkflowHistoryModule
    ],
    declarations: [AddProjectsetupComponent, ViewProjectsetupComponent, CreateProjectWizardComponent],
    exports: [AddProjectsetupComponent, ViewProjectsetupComponent, CreateProjectWizardComponent],
    providers: [projectPlanSetupErrorTypes, DashBoardService, MasterControlService, userRoleservice, Helper, projectsetupService,
        DynamicFormService, DepartmentService, LookUpService, UserService, WorkflowConfigurationService, WorkFlowLevelsService,
        EquipmentService, LocationService, VendorMasterService, TemplatelibraryService]
})
export class ProjectSetupModule { }