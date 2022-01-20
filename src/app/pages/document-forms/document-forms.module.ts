import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from '../../shared/helper';
import { DocumentFormsComponent } from './document-forms.component';
import { ConfigService } from '../../shared/config.service';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SelectModule } from 'ng-select';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { NgDragDropModule } from 'ng-drag-drop';
import { DndModule } from 'ng2-dnd';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { userRoleservice } from '../role-management/role-management.service';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { UserService } from '../userManagement/user.service';
import { EsignAgreementMessege } from '../../shared/constants';
import { LocationService } from '../location/location.service';
import { DepartmentService } from '../department/department.service';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    NgxDatatableModule,
    AngularMultiSelectModule,
    SharedModule,
    SharedCommonModule,
    NgDragDropModule.forRoot(),
    DndModule.forRoot(),
    SelectModule
  ],
  exports: [DocumentFormsComponent],
  declarations: [DocumentFormsComponent],
  providers: [Helper, ConfigService, EsignAgreementMessege, UserService, WorkFlowLevelsService, userRoleservice, DynamicFormService,
    WorkflowConfigurationService, DepartmentService, LocationService],
})
export class DocumentFormsModule { }
