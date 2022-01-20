import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '../../../../node_modules/@angular/http';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { TraceabilitymatrixComponent } from './traceabilitymatrix.component';
import { UrsService } from '../urs/urs.service';
import { IQTCService } from '../iqtc/iqtc.service';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { SqueezeBoxModule } from '../../../../node_modules/squeezebox';
import { NgxPaginationModule } from '../../../../node_modules/ngx-pagination';
import { traceabilitymatrixService } from './traceabilitymatrix.service';
import { ConfigService } from '../../shared/config.service';
import { FormEsignVerificationModule } from '../form-esign-verification/form-esign-verification.module';
import { AddDocumentWorkflowModule } from '../add-document-workflow/add-document-workflow.module';
import { DocumentWorkflowHistoryModule } from '../document-workflow-history/document-workflow-history.module';

export const TraceRoutes: Routes = [
    {
        path: '',
        component: TraceabilitymatrixComponent,
        canActivate: [AuthGuardService],
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TraceRoutes),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule, SqueezeBoxModule, NgxPaginationModule, FormEsignVerificationModule,AddDocumentWorkflowModule,DocumentWorkflowHistoryModule
    ],
    declarations: [TraceabilitymatrixComponent],
    providers: [Helper, UrsService, IQTCService, RiskAssessmentService, traceabilitymatrixService, ConfigService]
})
export class TraceModule { }
