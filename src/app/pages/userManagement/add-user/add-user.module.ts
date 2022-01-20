import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { Helper } from '../../../shared/helper';
import { HttpModule } from '@angular/http';
import { NgbDateISOParserFormatter } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import { DepartmentService } from '../../department/department.service';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { UserService } from '../user.service';
import { userRoleservice } from '../../role-management/role-management.service';
import { addUserErrorTypes } from '../../../shared/constants';

export const addUserRoutes: Routes = [
  {
    path: '',
    component: AddUserComponent,
    data: {
      breadcrumb: 'Add a Company',
      icon: 'icofont-file-code bg-c-blue',
      status: false
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(addUserRoutes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    TagInputModule,
    HttpModule,
    SharedCommonModule
  ],
  declarations: [],
  providers: [Helper, UserService, NgbDateISOParserFormatter, DepartmentService, userRoleservice, addUserErrorTypes]
})
export class AddUserModule { }
