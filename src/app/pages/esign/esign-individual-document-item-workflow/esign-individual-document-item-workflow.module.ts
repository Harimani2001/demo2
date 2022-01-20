import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { externalApprovalErrorTypes } from '../../../shared/constants';
import { Helper } from '../../../shared/helper';
import { SharedModule } from '../../../shared/shared.module';
import { UserService } from '../../userManagement/user.service';
import { WorkFlowLevelsService } from '../../workflow-levels/workflow-levels.service';
import { WorkflowConfigurationService } from '../../workflow-configuration/workflow-configuration.service';
import { userRoleservice } from '../../role-management/role-management.service';
import { UiSwitchModule } from 'ng2-ui-switch';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SelectModule } from 'ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { SqueezeBoxModule } from 'squeezebox';
import { NgDragDropModule } from 'ng-drag-drop';
import { DndModule } from 'ng2-dnd';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { DepartmentService } from '../../department/department.service';
import { LocationService } from '../../location/location.service';
import { EsignIndividualDocumentItemWorkflowComponent } from './esign-individual-document-item-workflow.component';
import { ConfigService } from '../../../shared/config.service';
import { EsignService } from '../esign.service';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    QuillEditorModule,
    SelectModule,
    NgxDatatableModule,
    AngularMultiSelectModule,
    SqueezeBoxModule,
    SharedCommonModule,
    NgDragDropModule.forRoot(),
    DndModule.forRoot(),
  ],
  exports:[EsignIndividualDocumentItemWorkflowComponent],
  declarations: [EsignIndividualDocumentItemWorkflowComponent],
  providers : [Helper,ConfigService,DepartmentService,EsignService,externalApprovalErrorTypes,
    UserService,WorkFlowLevelsService,WorkflowConfigurationService,userRoleservice,LocationService],
})
export class EsignIndividualDocumentItemWorkflowModule { }
