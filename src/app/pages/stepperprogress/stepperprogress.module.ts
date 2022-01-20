import { DocumentsignComponentModule } from './../documentsign/documentsign.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormWizardModule } from 'angular2-wizard';
import { SelectModule } from 'ng-select';
import { QuillEditorModule } from 'ngx-quill-editor';
import { eSignErrorTypes, externalApprovalErrorTypes } from '../../shared/constants';
import { DashBoardService } from '../dashboard/dashboard.service';
import { individualWorkflowModuleModule } from '../individual-workflow/individual-workflow.module';
import { StepperprogressComponent } from './stepperprogress.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { IndividualDocumentWorkflowService } from '../individual-document-workflow/individual-document-workflow.service';





@NgModule( {
    imports: [
        FormsModule,
        SelectModule,
        CommonModule,
        NgbModule,
        QuillEditorModule,
        FormWizardModule,
        ReactiveFormsModule,individualWorkflowModuleModule,
        DocumentsignComponentModule,SharedModule
    ],
    exports:[StepperprogressComponent],
    declarations: [StepperprogressComponent],
    providers:[IndividualDocumentWorkflowService,externalApprovalErrorTypes]


} )
export class stepperProgressModule { }
