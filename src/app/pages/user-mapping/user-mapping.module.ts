import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { TreeModule } from 'angular-tree-component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../location/location.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { EquipmentService } from '../equipment/equipment.service';
import { SelectModule } from 'ng-select';
import { FileUploadModule } from 'ng2-file-upload';
import { UserMappingComponent } from './user-mapping.component';
import { UserService } from '../userManagement/user.service';
import { UservsEquipmentService } from './user-mapping.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { TemplateBuiderService } from '../templatebuilder/templatebuilder.service';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
export const UserEquipmentRoutes: Routes = [{
  path: '',
  component: UserMappingComponent,
  data: {
    breadcrumb: 'FormEquipment',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserEquipmentRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    UiSwitchModule,
    ReactiveFormsModule,SelectModule,FileUploadModule,AuditTrailViewModule
  ],
  declarations: [UserMappingComponent],
  providers: [UservsEquipmentService, UserService, EquipmentService, Helper,
    ConfigService, LocationService, MasterDynamicFormsService,
    TemplateBuiderService]
})
export class UserEquipmentModule { }
