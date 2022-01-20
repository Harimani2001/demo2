import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';

import { Helper } from '../../shared/helper';

import { TreeModule } from 'angular-tree-component';

import { UserService } from '../userManagement/user.service';
import { projectPlanService } from '../projectplan/projectplan.service';
import { DepartmentService } from '../department/department.service';
import { DashBoardService } from '../dashboard/dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { SelectModule } from '../../../../node_modules/ng-select';
import { WorkFlowDynamicFormComponent } from './work-flow-dynamic-form.component';
import { WorkFlowDynamicFormService } from './work-flow-dynamic-form.service';
import { ConfigService } from '../../shared/config.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SqueezeBoxModule } from 'squeezebox';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { userRoleservice } from '../role-management/role-management.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { EquipmentService } from '../equipment/equipment.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { WorkFlowConfigurationDynamicFormService } from '../work-flow-configuration-dynamic-form/work-flow-configuration-dynamic-form.service';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { FileUploadModule } from 'ng2-file-upload';
export const WorkFlowDynamicFormRoutes: Routes = [{
  path: '',
  component: WorkFlowDynamicFormComponent,
  data: {
    breadcrumb: 'Search',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(WorkFlowDynamicFormRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    HttpClientModule,
    SelectModule,
    NgxDatatableModule,
    SqueezeBoxModule,
    QuillEditorModule,
    SharedCommonModule,
    UiSwitchModule,AuditTrailViewModule,IndividualAuditModule,
    MyDatePickerModule,
    FileUploadModule
    
  ],
  declarations: [WorkFlowDynamicFormComponent],
  providers : [WorkFlowDynamicFormService,ConfigService,projectPlanService, DepartmentService, UserService,DatePipe,DashBoardService,projectsetupService,EquipmentService,
    Helper,
    UserService,    
    MasterDynamicFormsService,
    WorkFlowConfigurationDynamicFormService,
    userRoleservice,DynamicFormService]
})
export class DynamicFormModule { }
