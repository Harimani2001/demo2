import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ExternalDocumentApprovalComponent } from './external-document-approval.component';
import { ExternalDocumentApprovalComponentService } from './external-document-approval.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentForumModule } from '../document-forum/document-forum.module';
export const ExternalDocumentApprovalComponentRoutes: Routes = [{
  path: '',
  component: ExternalDocumentApprovalComponent,
  data: {
    breadcrumb: 'ExternalDocumentApprovalComponent',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    RouterModule.forChild(ExternalDocumentApprovalComponentRoutes),
    SharedModule,SignaturePadModule,DocumentForumModule,PdfViewerModule
  ],
  declarations: [ExternalDocumentApprovalComponent],
  providers : [ExternalDocumentApprovalComponentService,Helper]
})
export class ExternalDocumentApprovalModule { }
