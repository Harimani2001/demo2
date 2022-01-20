import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { ValidationSummaryReportComponent } from './validation-summary-report.component';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';


export const vsrRoutes: Routes =[{
        path:'',
        canActivate: [ AuthGuardService ],
        data: {
            status: false
        },
        children:[
            {
                path: 'create-summary-report',
                loadChildren: './create-summary-report/create-summary-report.module#CreateVsrModule'

            },
             {
                path: 'view-summary-report',
                loadChildren: './view-summary-report/view-summary-report.module#ViewVsrModule'
            },
            {
                path: 'create-summary-report/:id',
                loadChildren: './create-summary-report/create-summary-report.module#CreateVsrModule'

            },
            
        ]
    }
];

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild( vsrRoutes ),
        SharedModule
    ],
    declarations:[ValidationSummaryReportComponent]
})
export class VSRModule {}