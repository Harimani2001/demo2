import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { SqueezeBoxModule } from 'squeezebox';
import { DocumentStatusCommentLog } from '../../../pages/document-status-comment-log/document-status-comment-log.module'
import { Helper } from '../../../shared/helper';
import { SharedModule } from '../../../shared/shared.module';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { DocumentsignComponentModule } from '../../documentsign/documentsign.module';
import { stepperProgressModule } from './../../stepperprogress/stepperprogress.module';
import { ViewUrsComponent } from './view-urs.component';
import { FileUploadForDocService } from '../../file-upload-for-doc/file-upload-for-doc.service';
import { QuillEditorModule } from 'ngx-quill-editor';
import { Navigation } from '../../navigation-bar/navigation-bar.module';
import { AuditTrailViewModule } from '../../audit-trail-view/audit-trail-view.module';
import { AuditTrailViewComponent } from '../../audit-trail-view/audit-trail-view.component';
import { IndividualAuditModule } from '../../individual-audit-trail/individual-audit-trail.module';
import { DocumentForumModule } from '../../document-forum/document-forum.module';
import { DynamicFormService } from '../../dynamic-form/dynamic-form.service';
import { IndividualDocumentWorkflowModule } from '../../individual-document-workflow/individual-document-workflow.module';
import { IndividualDocumentSummaryModule } from '../../individual-document-summary/individual-document-summary.module';
import { projectsetupService } from '../../projectsetup/projectsetup.service';
import { DraftPdfModule } from '../../draft-pdf/draft-pdf.module';
import { IndividualDocumentForumModule } from '../../individual-document-forum/individual-document-forum.module';
import { NgDragDropModule } from 'ng-drag-drop';
import { DndModule } from 'ng2-dnd';
import { LocationService } from '../../location/location.service';
import { ImportUrsModule } from '../../import-urs/import-urs.module';
import { DocumentFormsModule } from '../../document-forms/document-forms.module';
import { ComplianceAssesmentModalModule } from '../../compliance-assesment-modal/compliance-assesment-modal.module';
export const viewUrsRoutes: Routes=[
    {
path:'',
data: {
    status: true
},
component:ViewUrsComponent
}
];

@NgModule({
 imports:[
     CommonModule,
     RouterModule.forChild(viewUrsRoutes),
     SharedModule,
     HttpModule,
     UiSwitchModule,
     FormsModule,
     TagInputModule,
     DocumentsignComponentModule,
     NgxDatatableModule,FileUploadModule,SqueezeBoxModule,
     SharedCommonModule,
     stepperProgressModule,
     DocumentForumModule,
     IndividualDocumentForumModule,NgDragDropModule.forRoot(),
     DndModule.forRoot(),ComplianceAssesmentModalModule,
     IndividualDocumentWorkflowModule,IndividualDocumentSummaryModule,DraftPdfModule,
     DocumentStatusCommentLog,QuillEditorModule,Navigation,AuditTrailViewModule,IndividualAuditModule,ImportUrsModule,DocumentFormsModule
 ],
 declarations:[ViewUrsComponent],
 providers:[Helper, FileUploadForDocService,AuditTrailViewComponent,DynamicFormService,projectsetupService,LocationService]
})


export class ViewUrsModule{}
