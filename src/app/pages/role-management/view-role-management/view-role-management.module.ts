import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { Helper } from '../../../shared/helper';
import { HttpModule } from '@angular/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SelectModule } from 'ng-select';
import { ViewRoleManagementComponent } from './view-role-management.component';
import { userRoleservice } from '../role-management.service';
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { UserService } from '../../userManagement/user.service';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { PermissionCategory } from '../../../models/permissioncategory';


export const viewRoleManagementRoutes: Routes = [
    {
        path: ' ', 
        component: ViewRoleManagementComponent
        
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( viewRoleManagementRoutes ),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        TagInputModule,
        HttpModule,
        NgxDatatableModule,
        SelectModule,
        SharedCommonModule
    ],
    
    providers: [Helper, userRoleservice,LookUpService,UserService,PermissionCategory]
} )
export class ViewRiskassesstemplateModule { }
