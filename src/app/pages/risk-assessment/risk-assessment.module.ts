import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SqueezeBoxModule } from 'squeezebox';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { DocumentsignComponentModule } from '../documentsign/documentsign.module';
import { stepperProgressModule } from '../stepperprogress/stepperprogress.module';
import { DocumentStatusCommentLog } from '../document-status-comment-log/document-status-comment-log.module'
import { SharedModule } from './../../shared/shared.module';
import { RiskAssessmentComponent } from './risk-assessment.component';
import { RiskAssessmentService } from './risk-assessment.service';
import { ViewRiskAssessmentComponent } from './view-risk-assessment/view-risk-assessment.component';
import { Navigation } from '../navigation-bar/navigation-bar.module';
import { UrsViewModule } from '../urs-view/urs-view.module';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { IndividualDocumentWorkflowModule } from '../individual-document-workflow/individual-document-workflow.module';
import { IndividualDocumentSummaryModule } from '../individual-document-summary/individual-document-summary.module';
import { DraftPdfModule } from '../draft-pdf/draft-pdf.module';
import { IndividualDocumentForumModule } from '../individual-document-forum/individual-document-forum.module';
import { UrsSpecRiskViewModule } from '../urs-spec-risk-view/urs-spec-risk-view.module';
import { DocumentFormsModule } from '../document-forms/document-forms.module';

export const RiskAssessmentRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuardService],
        data: {
            status: false
        },
        component: ViewRiskAssessmentComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(RiskAssessmentRoutes),
        SharedModule,
        IndividualDocumentWorkflowModule,
        IndividualDocumentSummaryModule,
        IndividualDocumentForumModule,
        NgxDatatableModule,
        SqueezeBoxModule,
        DocumentsignComponentModule,
        DraftPdfModule,
        stepperProgressModule,
        DocumentForumModule,
        SharedCommonModule,
        DocumentStatusCommentLog,
        Navigation,
        UrsViewModule,
        UrsSpecRiskViewModule,
        AuditTrailViewModule,
        IndividualAuditModule,
        DocumentFormsModule
    ],
    declarations: [RiskAssessmentComponent, ViewRiskAssessmentComponent],
    providers: [RiskAssessmentService, ConfigService, DynamicFormService]
})
export class RiskAssessmentModule { }
