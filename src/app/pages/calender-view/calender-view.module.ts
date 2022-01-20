import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CalendarModule } from 'angular-calendar';
import { TreeModule } from 'angular-tree-component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { LocationService } from '../location/location.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { CalenderViewComponent } from './calender-view.component';
import { CalenderViewService } from './calender-view.service';

export const CalenderViewRoutes: Routes = [{
  path: '',
  component: CalenderViewComponent,
  data: {
    breadcrumb: 'CalenderView',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CalenderViewRoutes),
    SharedModule,
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    UiSwitchModule,
    ReactiveFormsModule,
    CalendarModule.forRoot(),
    FlatpickrModule.forRoot(),
    MyDatePickerModule
  ],
  declarations: [CalenderViewComponent],
  providers : [ConfigService,CalenderViewService,Helper,ConfigService,
      LocationService,DatePipe,LookUpService]
})
export class CalenderViewModule { }
