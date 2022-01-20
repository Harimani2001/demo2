import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '../../../../node_modules/@angular/http';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';

import { UrsService } from '../urs/urs.service';
import { IQTCService } from '../iqtc/iqtc.service';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { SqueezeBoxModule } from '../../../../node_modules/squeezebox';
import { NgxPaginationModule } from '../../../../node_modules/ngx-pagination';

import { ConfigService } from '../../shared/config.service';
import { GobalTraceabilityMatrixComponent } from './gobal-traceability-matrix.component';
import { GobalTraceabilitymatrixService } from './gobal-traceability-matrix.service';
import { DataTableModule } from 'angular2-datatable';

export const GobalTraceRoutes: Routes = [
    {
        path: 'matrix',
        component: GobalTraceabilityMatrixComponent,
        canActivate: [ AuthGuardService ],
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild(GobalTraceRoutes ),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule,SqueezeBoxModule,NgxPaginationModule,DataTableModule
        
    ],
    exports:[GobalTraceabilityMatrixComponent],
    declarations: [GobalTraceabilityMatrixComponent],
    providers: [Helper,UrsService,IQTCService,RiskAssessmentService,GobalTraceabilitymatrixService,ConfigService]
} )
export class GobalTraceModule { }
