import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { AdvencedSearchService } from './advanced-search.service';
import { Helper } from '../../shared/helper';
import { TreeModule } from 'angular-tree-component';
import { AdvancedSearchComponent } from './advanced-search.component';
import { UserService } from '../userManagement/user.service';
import { projectPlanService } from '../projectplan/projectplan.service';
import { DepartmentService } from '../department/department.service';
import { DashBoardService } from '../dashboard/dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { SelectModule } from '../../../../node_modules/ng-select';
import { FormPreviewModule } from '../form-preview/form-preview.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { ViewFormModule } from '../view-form/view-form.module';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
export const AdvencedSearchRoutes: Routes = [{
  path: '',
  component: AdvancedSearchComponent,
  data: {
    breadcrumb: 'Search',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdvencedSearchRoutes),
    SharedModule,
    FormsModule,
    TreeModule,
    HttpClientModule,
    SharedCommonModule,
    SelectModule
  ],
  declarations: [AdvancedSearchComponent],
  providers : [AdvencedSearchService,Helper, projectPlanService, DepartmentService, UserService,DatePipe,DashBoardService,DynamicFormService,DateFormatSettingsService]
})
export class AdvencedSearchModule { }
