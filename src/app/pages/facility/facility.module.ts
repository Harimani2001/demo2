import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { TreeModule } from 'angular-tree-component';
import { FacilityComponent } from './facility.component';
import { FacilityService } from './facility.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../location/location.service';
import { EquipmentService } from '../equipment/equipment.service';
import { SelectModule } from 'ng-select';
import { facilityErrorTypes } from '../../shared/constants';
export const FacilityRoutes: Routes = [{
  path: '',
  component: FacilityComponent,
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
  declarations: [FacilityComponent],
  providers : [FacilityService,Helper,ConfigService,LocationService,EquipmentService,facilityErrorTypes]
})
export class FacilityModule { }
