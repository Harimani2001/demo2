import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TreeModule } from 'angular-tree-component';
import { AngularMultiSelectModule } from 'angular2-multiselect-checkbox-dropdown/angular2-multiselect-dropdown';
import { SelectModule } from 'ng-select';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { SqueezeBoxModule } from 'squeezebox';
import { QuillEditorModule } from '../../../../node_modules/ngx-quill-editor';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { AuditTrailViewComponent } from '../audit-trail-view/audit-trail-view.component';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { DocumentStatusCommentLog } from '../document-status-comment-log/document-status-comment-log.module';
import { DraftPdfModule } from '../draft-pdf/draft-pdf.module';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { FileUploadForDocService } from '../file-upload-for-doc/file-upload-for-doc.service';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { IndividualDocumentSummaryModule } from '../individual-document-summary/individual-document-summary.module';
import { IndividualDocumentWorkflowModule } from '../individual-document-workflow/individual-document-workflow.module';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { MasterControlService } from '../master-control/master-control.service';
import { Navigation } from '../navigation-bar/navigation-bar.module';
import { stepperProgressModule } from '../stepperprogress/stepperprogress.module';
import { UrsViewModule } from '../urs-view/urs-view.module';
import { SpecificationMasterComponent } from './specification-master.component';
import { SpecificationMasterService } from './specification-master.service';
import { IndividualDocumentForumModule } from '../individual-document-forum/individual-document-forum.module';
import { DocumentFormsModule } from '../document-forms/document-forms.module';

export const SpecifiMasterRoutes: Routes = [
    {
        path: '',
        component: SpecificationMasterComponent,
        canActivate: [ AuthGuardService ],
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( SpecifiMasterRoutes ),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule,
        SharedCommonModule,
        SelectModule,
        UrsViewModule,
        TreeModule,
        ReactiveFormsModule,
        IndividualDocumentForumModule,
        UiSwitchModule,QuillEditorModule,Navigation,DocumentStatusCommentLog,
        SqueezeBoxModule, DocumentForumModule,DraftPdfModule,
        IndividualDocumentWorkflowModule,IndividualDocumentSummaryModule,
        AngularMultiSelectModule,stepperProgressModule,AuditTrailViewModule,IndividualAuditModule,DocumentFormsModule
    ],
    declarations: [SpecificationMasterComponent],
    providers: [MasterControlService,Helper,ConfigService,LookUpService,FileUploadForDocService,SpecificationMasterService,AuditTrailViewComponent,DynamicFormService]
} )
export class SpecificationMasterModule { }
