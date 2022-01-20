import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { IQTCService } from '../iqtc/iqtc.service';
import { DiscrepancyFormComponent } from './discrepancy-form.component';

export const DfRoutes: Routes =[{
    path:'',
    canActivate: [ AuthGuardService ],
    data: {
        status: false
    },
    children:[
        {
            path: 'add-df',
            loadChildren: './add-discrepancy-form/add-discrepancy-form.module#AddDiscrepancyFormModule'

        },
         {
            path: 'view-df',
            loadChildren: './view-discrepancy-form/view-discrepancy-form.module#ViewDFModule'
        },
        {
            path: 'add-df/:id',
            loadChildren: './add-discrepancy-form/add-discrepancy-form.module#AddDiscrepancyFormModule'

        },
        
    ]
}
];

@NgModule({
imports:[
    CommonModule,
    RouterModule.forChild( DfRoutes ),
    SharedModule
],
declarations:[DiscrepancyFormComponent],
providers:[Helper,IQTCService]
})

export class DiscrepancyFormModule{}