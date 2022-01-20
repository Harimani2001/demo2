import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TagInputModule } from 'ngx-chips';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { DocumentStatusCommentLog } from '../../document-status-comment-log/document-status-comment-log.module'
import { SharedModule } from '../../../shared/shared.module';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { DocumentsignComponentModule } from '../../documentsign/documentsign.module';
import { stepperProgressModule } from '../../stepperprogress/stepperprogress.module';
import { RiskAssessmentService } from '../risk-assessment.service';
import { ViewRiskAssessmentComponent } from './view-risk-assessment.component';
import { UrsViewModule } from '../../urs-view/urs-view.module';
import { DocumentForumModule } from '../../document-forum/document-forum.module';
import { AuditTrailViewModule } from '../../audit-trail-view/audit-trail-view.module';
import { IndividualAuditModule } from '../../individual-audit-trail/individual-audit-trail.module';
import { projectsetupService } from '../../projectsetup/projectsetup.service';
import { IndividualDocumentForumModule } from '../../individual-document-forum/individual-document-forum.module';
import { UrsService } from '../../urs/urs.service';

export const viewRiskAssessmentRoutes: Routes = [
    {
        path: ' ',
        component: ViewRiskAssessmentComponent

    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(viewRiskAssessmentRoutes),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        TagInputModule,
        HttpModule,
        NgxDatatableModule,
        SqueezeBoxModule,
        QuillEditorModule,
        DocumentsignComponentModule,
        stepperProgressModule,
        DocumentForumModule,
        SharedCommonModule,
        DocumentStatusCommentLog,
        IndividualDocumentForumModule,
        UrsViewModule,
        AuditTrailViewModule,
        IndividualAuditModule
    ],
    providers: [RiskAssessmentService, projectsetupService, UrsService]
})
export class ViewRiskAssessmentModule { }
