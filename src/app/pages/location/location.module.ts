import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { TreeModule } from 'angular-tree-component';
import { LocationComponent } from './location.component';
import { LocationService } from './location.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { SelectModule } from '../../../../node_modules/ng-select';
import { locationValidationMsg } from '../../shared/constants';
import { FileUploadForDocService } from '../file-upload-for-doc/file-upload-for-doc.service';
export const LocationRoutes: Routes = [{
  path: '',
  component: LocationComponent,
  data: {
    breadcrumb: 'Facility',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LocationRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    UiSwitchModule,
    ReactiveFormsModule,
    SharedCommonModule,
    SelectModule,
  ],
  declarations: [LocationComponent],
  providers : [LocationService,Helper,ConfigService,locationValidationMsg,FileUploadForDocService]
})
export class LocationModule { }
