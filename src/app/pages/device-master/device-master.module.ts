import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { TreeModule } from 'angular-tree-component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../location/location.service';
import { EquipmentService } from '../equipment/equipment.service';
import { SelectModule } from 'ng-select';
import { FileUploadModule } from 'ng2-file-upload';
import { DeviceMasterComponent } from './device-master.component';
import { DeviceMasterService } from './device-master.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { VendorService } from '../vendor/vendor.service';
import { FlatpickrModule } from 'angularx-flatpickr';

export const FacilityRoutes: Routes = [{
  path: '',
  component: DeviceMasterComponent,
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
    SelectModule,FileUploadModule,
    FlatpickrModule.forRoot()
  ],
  declarations: [DeviceMasterComponent],
  providers : [VendorService,LookUpService,DeviceMasterService,Helper,ConfigService,LocationService,EquipmentService,DatePipe]
})
export class DeviceMasterModule { }
