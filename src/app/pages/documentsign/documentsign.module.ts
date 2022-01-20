import { NgModule } from '@angular/core';
import { SelectModule } from 'ng-select';
import { DocumentsignComponent } from './documentsign.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { QuillEditorModule } from 'ngx-quill-editor';
import { FormWizardModule } from 'angular2-wizard';
import { DashBoardService } from '../dashboard/dashboard.service';
import { EsignAgreementMessege, eSignErrorTypes } from '../../shared/constants';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule( {
    imports: [
        FormsModule,
        SelectModule,
        CommonModule,
        SharedModule,
        QuillEditorModule,
        FormWizardModule,
        ReactiveFormsModule,
        SignaturePadModule
    ],
    exports:[DocumentsignComponent],
    declarations: [DocumentsignComponent],
    providers:[DashBoardService,eSignErrorTypes,EsignAgreementMessege]
} )
export class DocumentsignComponentModule { }
