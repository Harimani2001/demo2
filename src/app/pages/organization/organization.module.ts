import { SharedModule } from './../../shared/shared.module';
import { OrganizationComponent } from './organization.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';

export const organizationRoutes: Routes = [
    {
        path: '',
        canActivate: [ AuthGuardService ],
        data: {
            
            status: false
        },
        children: [
            {
                path: 'add-organization',
                loadChildren: './add-organization/add-organization.module#AddOrganizationModule'

            },
            {
                path: 'add-organization/:id',
                loadChildren: './add-organization/add-organization.module#AddOrganizationModule'

            },
            {
                path: 'view-organization',
                loadChildren: './view-organization/view-organization.module#ViewOrganizationModule'
            }
        ]
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( organizationRoutes ),
        SharedModule
    ],
    declarations: [OrganizationComponent]
} )
export class OrganizationModule { }
