import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch';
import { TagInputModule } from 'ngx-chips';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { userRoleservice } from '../role-management/role-management.service';
import { UserService } from '../userManagement/user.service';
import { WorkFlowConfigurationDynamicFormService } from './work-flow-configuration-dynamic-form.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    TagInputModule,
    NgxDatatableModule,
    UiSwitchModule,
    SharedCommonModule
  ],
  providers: [MasterDynamicFormsService,WorkFlowConfigurationDynamicFormService,UserService,Helper,userRoleservice,]
})
export class WorkFlowConfigurationDynamicFormModule { }
