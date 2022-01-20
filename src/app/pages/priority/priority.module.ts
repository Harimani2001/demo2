import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PriorityComponent } from './priority.component';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { Helper } from '../../shared/helper';
import { priorityService } from './priority.service';
import { HttpModule } from '../../../../node_modules/@angular/http';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { SharedCommonModule } from '../../shared/SharedCommonModule';


export const PriorityRoutes: Routes = [
    {
        path: '',
        component: PriorityComponent,
        canActivate: [ AuthGuardService ],
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( PriorityRoutes ),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule,
        SharedCommonModule
    ],
    declarations: [],
    providers: [Helper,priorityService  ]
} )
export class PriorityModule { }
