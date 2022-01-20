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
import { EquipmentWiseDashboardComponent } from './equipment-wise-dashboard.component';
import { EquipmentService } from '../equipment/equipment.service';
import { EquipmentDetailedDashboardService } from './equipment-wise-dashboard.service';
import { SelectModule } from '../../../../node_modules/ng-select';
export const EquipmentWiseDashboardRoutes: Routes = [{
  path: '',
  component: EquipmentWiseDashboardComponent,
  data: {
    breadcrumb: 'Equipment Dashboard',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EquipmentWiseDashboardRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    UiSwitchModule,
    ReactiveFormsModule,
    SelectModule
  ],
  declarations: [EquipmentWiseDashboardComponent],
  providers : [EquipmentService,Helper,ConfigService,LocationService,EquipmentDetailedDashboardService]
})
export class EquipmentWiseDashboardModule { }
