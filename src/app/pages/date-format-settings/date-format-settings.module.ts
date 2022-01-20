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
import { SelectModule } from 'ng-select';
import { DateFormatSettingsComponent } from './date-format-settings.component';
import {DateFormatSettingsService } from './date-format-settings.service';
import { OraganizationService } from '../organization/organization.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
export const DateFormatSettingsRoutes: Routes = [{
  path: '',
  component: DateFormatSettingsComponent,
  data: {
    breadcrumb: 'DateFormatSettingsRoutes',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DateFormatSettingsRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UiSwitchModule,
    SelectModule
  ],
  declarations: [DateFormatSettingsComponent],
  providers : [DateFormatSettingsService,Helper,ConfigService,OraganizationService,LookUpService,DatePipe]
})
export class DateFormatSettingsModule { }
