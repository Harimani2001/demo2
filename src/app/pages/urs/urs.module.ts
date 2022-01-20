import { stepperProgressModule } from './../stepperprogress/stepperprogress.module';
import { DocumentsignComponentModule } from './../documentsign/documentsign.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { UrsComponent } from './urs.component';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { ComplianceAssesmentModalModule } from '../compliance-assesment-modal/compliance-assesment-modal.module';


export const ursRoutes: Routes =[{
        path:'',
        canActivate: [ AuthGuardService ],
        data: {
            status: false
        },
        children:[
            {
                path: 'add-urs',
                loadChildren: './add-urs/add-urs.module#AddUrsModule'

            },
             {
                path: 'view-urs',
                loadChildren: './view-urs/view-urs.module#ViewUrsModule'
            },
            {
                path: 'add-urs/:id',
                loadChildren: './add-urs/add-urs.module#AddUrsModule'

            },

        ]
    }
];

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild( ursRoutes ),
        SharedModule,
        DocumentsignComponentModule,
        stepperProgressModule,ComplianceAssesmentModalModule
    ],
    declarations:[UrsComponent]
})
export class URSModule {}
