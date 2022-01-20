import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../location/location.service';
import { EquipmentService } from '../equipment/equipment.service';
import { SelectModule } from 'ng-select';
import { facilityErrorTypes, ApiConfigurationErrorTypes } from '../../shared/constants';
import { ApiConfigurationComponent } from './api-configuration.component';
import {ApiConfigurationService} from './api-configuration.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { ToastyModule } from 'ng2-toasty';
import { LookUpService } from '../LookUpCategory/lookup.service';
export const ApiConfigurationRoutes: Routes = [{
  path: '',
  component: ApiConfigurationComponent,
  data: {
    breadcrumb: 'ApiConfiguration',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ApiConfigurationRoutes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UiSwitchModule,
    SelectModule,
    ToastyModule.forRoot(),
  ],
  declarations: [ApiConfigurationComponent],
  providers : [ApiConfigurationService,Helper,ConfigService,ApiConfigurationErrorTypes,projectsetupService,LookUpService]
})
export class ApiConfigurationModule { }
