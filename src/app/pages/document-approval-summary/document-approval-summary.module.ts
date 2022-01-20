import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { DocumentApprovalSummaryComponent } from './document-approval-summary.component';
import { Helper } from '../../shared/helper';
import { DocumentsignComponentModule } from '../documentsign/documentsign.module';
import { IndividualDocumentWorkflowModule } from '../individual-document-workflow/individual-document-workflow.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
   DocumentsignComponentModule,IndividualDocumentWorkflowModule
  ],
  exports:[DocumentApprovalSummaryComponent],
  declarations: [DocumentApprovalSummaryComponent],
  providers : [Helper],
})
export class DocumentApprovalSummaryModule { }
