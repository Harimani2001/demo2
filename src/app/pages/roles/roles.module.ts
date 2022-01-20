import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '../../../../node_modules/@angular/http';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { RolesComponent } from './roles.component';
import { RolesService } from './roles.service';
import { userRoleservice } from '../role-management/role-management.service';

export const RolesRoutes: Routes = [
    {
        path: '',
        component: RolesComponent,
        canActivate: [ AuthGuardService ],
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild(RolesRoutes ),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule,
    ],
    declarations: [RolesComponent],
    providers: [Helper,RolesService,userRoleservice]
} )
export class RolesModule { }
