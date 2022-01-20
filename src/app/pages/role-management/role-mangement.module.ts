import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Helper } from '../../shared/helper';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { ViewRoleManagementComponent } from './view-role-management/view-role-management.component';
import { userRoleservice } from './role-management.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { UserService } from '../userManagement/user.service';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { RoleManagementComponent } from './role-management.component';
import { AddRoleManagementComponent } from './add-role-management/add-role-management.component';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { PermissionCategory } from '../../models/permissioncategory';
import { UiSwitchModule } from 'ng2-ui-switch';

export const roleManagementRoutes: Routes = [
    {
        path: '',
        data: {     
            status: false
        },
        component:ViewRoleManagementComponent
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( roleManagementRoutes ),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        SharedCommonModule,
        UiSwitchModule
    ],
    declarations: [AddRoleManagementComponent,RoleManagementComponent,ViewRoleManagementComponent],
    providers: [Helper, userRoleservice,LookUpService,UserService,PermissionCategory ]
} )
export class RoleManagementModule { }
