import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Helper } from '../../shared/helper';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { ProjectplanComponent } from './projectplan.component';
import { DashBoardService } from '../dashboard/dashboard.service';
import { projectPlanService } from './projectplan.service';
export const ProjectPlanRoutes: Routes = [
    {
        path: '',
        canActivate: [ AuthGuardService ],
        data: {
            status: false
        },
        children: [
            {
                path: 'add-projectplan',
                loadChildren: './add-projectplan/add-projectplan.module#AddProjectplanModule'
            },
        ]
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild(ProjectPlanRoutes ),
        SharedModule
    ],
    declarations: [ProjectplanComponent],
    providers: [Helper,DashBoardService,projectPlanService]
} )
export class ProjectPlanModule { }
