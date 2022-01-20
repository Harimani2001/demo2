import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { TreeModule } from 'angular-tree-component';
import { NewEquipmemtDashboardService } from './new-equipmemt-dashboard.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EquipmentService } from '../equipment/equipment.service';
import { SelectModule } from 'ng-select';
import { NewEquipmemtDashboardComponent } from './new-equipmemt-dashboard.component';
import { EquipmentDetailedDashboardService } from '../equipment-wise-dashboard/equipment-wise-dashboard.service';
export const FacilityRoutes: Routes = [{
  path: '',
  component: NewEquipmemtDashboardComponent,
  data: {
    breadcrumb: 'Facility',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FacilityRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UiSwitchModule,
    SelectModule
  ],
  declarations: [NewEquipmemtDashboardComponent],
  providers : [NewEquipmemtDashboardService,Helper,ConfigService,EquipmentService,EquipmentDetailedDashboardService]
})
export class NewEquipmemtDashboardModule { }
