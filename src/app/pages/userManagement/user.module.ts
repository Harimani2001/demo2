import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DepartmentService } from '../department/department.service';
import { userRoleservice } from '../role-management/role-management.service';
import { LocationService } from '../location/location.service';

export const userRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    data: {
      breadcrumb: 'User Components',
      status: false
    },
    children: [
      {
        path: 'add-user',
        loadChildren: './add-user/add-user.module#AddUserModule'
      },
      {
        path: 'view-user',
        loadChildren: './view-user/view-user.module#ViewUserModule'
      },
      {
        path: 'add-user/:id',
        loadChildren: './add-user/add-user.module#AddUserModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
    SharedModule,
    FormsModule,
    HttpModule,
    FileUploadModule,
    NgxDatatableModule
  ],
  declarations: [UserComponent],
  providers: [ModalBasicComponent, DepartmentService, userRoleservice, LocationService]
})
export class UserModule { }


