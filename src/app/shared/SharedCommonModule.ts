import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormWizardModule } from 'angular2-wizard';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { NgDragDropModule } from 'ng-drag-drop';
import { SelectModule } from 'ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { DndModule } from 'ng2-dnd';
import { ExpansionPanelsModule } from 'ng2-expansion-panels';
import { FileUploadModule } from 'ng2-file-upload';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { ColorPickerModule } from 'ngx-color-picker';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { CategoryComponent } from '../pages/category/category.component';
import { EmailConfigForProjectComponent } from '../pages/email-config-for-project/email-config-for-project.component';
import { FormExtendMasterComponent } from '../pages/form-extend-master/form-extend-master.component';
import { FormExtendedComponent } from '../pages/form-extended/form-extended.component';
import { FormPreviewComponent } from '../pages/form-preview/form-preview.component';
import { ImportSettingModule } from '../pages/import-setting/import-setting.module';
import { MasterDynamicFormsComponent } from '../pages/master-dynamic-forms/master-dynamic-forms.component';
import { AddOrganizationComponent } from '../pages/organization/add-organization/add-organization.component';
import { PriorityComponent } from '../pages/priority/priority.component';
import { AddProjectplanComponent } from '../pages/projectplan/add-projectplan/add-projectplan.component';
import { AddRiskAssessmentComponent } from '../pages/risk-assessment/add-risk-assessment/add-risk-assessment.component';
import { ScreenShot } from '../pages/screen-shot/screen-shot.module';
import { stepperProgressModule } from '../pages/stepperprogress/stepperprogress.module';
import { UrsSpecRiskViewModule } from '../pages/urs-spec-risk-view/urs-spec-risk-view.module';
import { UrsViewModule } from '../pages/urs-view/urs-view.module';
import { AddUrsComponent } from '../pages/urs/add-urs/add-urs.component';
import { AddUserComponent } from '../pages/userManagement/add-user/add-user.component';
import { AddVendorComponent } from '../pages/vendor/add-vendor/add-vendor.component';
import { ViewFormComponent } from '../pages/view-form/view-form.component';
import { WorkFlowConfigurationDynamicFormComponent } from '../pages/work-flow-configuration-dynamic-form/work-flow-configuration-dynamic-form.component';
import { WorkflowConfigurationComponent } from '../pages/workflow-configuration/workflow-configuration.component';
import { WorkflowFlowchartComponent } from '../pages/workflow-flowchart/workflow-flowchart.component';
import { ProjectUrlChecklistComponent } from './../pages/projectsetup/project-url-checklist/project-url-checklist.component';
import { SharedModule } from './shared.module';
import { ComplianceAssesmentModalModule } from '../pages/compliance-assesment-modal/compliance-assesment-modal.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        UiSwitchModule,
        TagInputModule,
        HttpModule,
        NgxDatatableModule,
        RouterModule,
        QuillEditorModule,
        SelectModule,
        FileUploadModule,
        ColorPickerModule,
        SqueezeBoxModule,
        FormWizardModule,
        ExpansionPanelsModule,
        CKEditorModule,
        stepperProgressModule,
        ScreenShot,
        NgDragDropModule.forRoot(),
        DndModule.forRoot(),
        UrsViewModule,
        UrsSpecRiskViewModule,
        MyDatePickerModule,
        ImportSettingModule,
        ComplianceAssesmentModalModule
    ],
    declarations: [
        AddOrganizationComponent,
        AddUserComponent,
        CategoryComponent,
        PriorityComponent,
        AddUrsComponent,
        AddRiskAssessmentComponent,
        AddVendorComponent,
        AddProjectplanComponent,
        MasterDynamicFormsComponent,
        WorkFlowConfigurationDynamicFormComponent,
        FormPreviewComponent,
        ViewFormComponent,
        FormExtendedComponent,
        FormExtendMasterComponent,
        EmailConfigForProjectComponent,
        WorkflowConfigurationComponent,
        WorkflowFlowchartComponent,
        ProjectUrlChecklistComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        AddOrganizationComponent,
        AddUserComponent,
        CategoryComponent,
        PriorityComponent,
        AddUrsComponent,
        AddRiskAssessmentComponent,
        AddVendorComponent,
        AddProjectplanComponent,
        MasterDynamicFormsComponent,
        WorkFlowConfigurationDynamicFormComponent,
        FormPreviewComponent,
        ViewFormComponent,
        FormExtendedComponent,
        FormExtendMasterComponent,
        EmailConfigForProjectComponent,
        WorkflowConfigurationComponent,
        WorkflowFlowchartComponent,
        ProjectUrlChecklistComponent
    ]
})

export class SharedCommonModule { }