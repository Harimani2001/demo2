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
import { FormEquipmentComponent } from './form-equipment.component';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { EquipmentService } from '../equipment/equipment.service';
import { SelectModule } from 'ng-select';
import { FileUploadModule } from 'ng2-file-upload';
import { FormvsEquipmentService } from './form-equipment.service';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
export const FormEquipmentRoutes: Routes = [{
  path: '',
  component: FormEquipmentComponent,
  data: {
    breadcrumb: 'FormEquipment',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FormEquipmentRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    UiSwitchModule,
    ReactiveFormsModule,SelectModule,FileUploadModule,AuditTrailViewModule
  ],
  declarations: [FormEquipmentComponent],
  providers : [ConfigService,FormvsEquipmentService,EquipmentService,Helper,ConfigService,LocationService,MasterDynamicFormsService]
})
export class FormEquipmentModule { }
