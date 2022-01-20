import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { TreeModule } from 'angular-tree-component';
import { ShiftComponent } from './shift.component';
import { ShiftService } from './shift.service';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { shiftErrorTypes } from '../../shared/constants';
export const ShiftRoutes: Routes = [{
  path: '',
  component: ShiftComponent,
  data: {
    breadcrumb: 'Facility',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ShiftRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    AmazingTimePickerModule,
    NgxDatatableModule,
    UiSwitchModule,
    ReactiveFormsModule
  ],
  declarations: [ShiftComponent],
  providers : [ShiftService,Helper,ConfigService,shiftErrorTypes]
})
export class ShiftModule { }
