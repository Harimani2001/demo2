import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { TreeModule } from 'angular-tree-component';
import { EquipmentDashboardService } from './equipment-dashboard.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { EquipmentDashboardComponent } from './equipment-dashboard.component';
import { BatchCreationService } from '../batch-creation/batch-creation.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { DocStatusService } from '../document-status/document-status.service';
import { FormReportsService } from '../form-reports/form-reports.service';
import { EquipmentService } from '../equipment/equipment.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
export const EquipmentDashboardRoutes: Routes = [{
  path: '',
  component: EquipmentDashboardComponent,
  data: {
    breadcrumb: 'Facility',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EquipmentDashboardRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UiSwitchModule,
    SelectModule
  ],
  declarations: [EquipmentDashboardComponent],
  providers : [EquipmentDashboardService,Helper,ConfigService,EquipmentService,MasterDynamicFormsService,DatePipe]
})
export class EquipmentDashboardModule { }
