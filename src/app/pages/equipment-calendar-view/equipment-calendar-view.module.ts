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
import { CalendarModule } from 'angular-calendar';
import { FlatpickrModule } from 'angularx-flatpickr';
import { EquipmentCalendarViewComponent } from './equipment-calendar-view.component';
import { CalenderViewService } from '../calender-view/calender-view.service';
import { EquipmentService } from '../equipment/equipment.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { EquipmentStatusUpdateService } from '../equipment-status-update/equipment-status-update.service';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { SelectModule } from '../../../../node_modules/ng-select';
export const EquipmentCalenderViewRoutes: Routes = [{
  path: '',
  component: EquipmentCalendarViewComponent,
  data: {
    breadcrumb: 'CalenderView',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EquipmentCalenderViewRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    UiSwitchModule,
    ReactiveFormsModule,
    SelectModule,
    CalendarModule.forRoot(),
    FlatpickrModule.forRoot(),AuditTrailViewModule
  ],
  declarations: [EquipmentCalendarViewComponent],
  providers : [CalenderViewService,Helper,ConfigService,
              LocationService,DatePipe,EquipmentService,
              LookUpService,EquipmentStatusUpdateService]
})
export class EquipmentCalenderViewModule { }
