import { WorkFlowLevelsModule } from './../workflow-levels/workflow-levels.module';
import { userRoleservice } from './../role-management/role-management.service';
import { SelectModule } from 'ng-select';
import { UiSwitchModule } from 'ng2-ui-switch';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { TreeModule } from 'angular-tree-component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { CommonworkflowconfigurationComponent } from './commonworkflowconfiguration.component';
import { CwfService } from './commonworkflowconfiguration.service';
import { SharedModule } from '../../shared/shared.module';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DepartmentService } from '../department/department.service';

export const workflowconfigurationRoutes: Routes = [{
  path: '',
  component: CommonworkflowconfigurationComponent ,
  data: {
    breadcrumb: 'common workflow configuration',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(workflowconfigurationRoutes),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    
    FormsModule,
    TreeModule,
    SelectModule,
    AmazingTimePickerModule,
    NgxDatatableModule,
    UiSwitchModule,
    ReactiveFormsModule,
    WorkFlowLevelsModule,
    AngularMultiSelectModule
  ],
  declarations: [CommonworkflowconfigurationComponent],
  providers : [Helper, ConfigService, CwfService, userRoleservice, WorkFlowLevelsService, WorkflowConfigurationService,DepartmentService]
})
export class CommonWorkflowConfigurationModule { }
