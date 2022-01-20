import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { EsignExternalDocumentApprovalComponent } from './esign-external-document-approval.component';
import { EsignExternalDocumentApprovalComponentService } from './esign-external-document-approval.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentForumModule } from '../document-forum/document-forum.module';

export const EsignExternalDocumentApprovalComponentRoutes: Routes = [{
  path: '',
  component: EsignExternalDocumentApprovalComponent,
  data: {
    breadcrumb: 'EsignExternalDocumentApprovalComponent',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    RouterModule.forChild(EsignExternalDocumentApprovalComponentRoutes),
    SharedModule,SignaturePadModule,DocumentForumModule,PdfViewerModule
  ],
  declarations: [EsignExternalDocumentApprovalComponent],
  providers : [EsignExternalDocumentApprovalComponentService,Helper]
})
export class EsignExternalDocumentApprovalModule { }
