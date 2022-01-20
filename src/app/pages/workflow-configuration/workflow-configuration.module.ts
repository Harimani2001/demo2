import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SelectModule } from 'ng-select';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SqueezeBoxModule } from 'squeezebox';
import { Helper } from '../../shared/helper';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { DepartmentService } from '../department/department.service';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { SharedModule } from './../../shared/shared.module';
import { userRoleservice } from './../role-management/role-management.service';
import { WorkflowConfigurationComponent } from './workflow-configuration.component';
import { WorkflowConfigurationService } from './workflow-configuration.service';

export const WorkflowConfigurationRoutes: Routes = [{
  path: '',
  component: WorkflowConfigurationComponent,
  data: {
    breadcrumb: 'Facility',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(WorkflowConfigurationRoutes),
    SharedModule,
    SelectModule,
    UiSwitchModule,
    SqueezeBoxModule,
    SharedCommonModule,
  ],
  exports: [],
  declarations: [],
  providers: [Helper, userRoleservice, WorkFlowLevelsService, WorkflowConfigurationService, DepartmentService]
})
export class WorkflowConfigurationModule { }
