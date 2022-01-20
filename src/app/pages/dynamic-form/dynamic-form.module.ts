import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectModule } from 'ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { UiSwitchModule } from 'ng2-ui-switch';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { DMSService } from '../dms/dms.service';
import { DocumentsignComponentModule } from '../documentsign/documentsign.module';
import { EquipmentStatusUpdateService } from '../equipment-status-update/equipment-status-update.service';
import { stepperProgressModule } from '../stepperprogress/stepperprogress.module';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormService } from './dynamic-form.service';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import {FocusModule} from 'angular2-focus';
import { FormEsignVerificationModule } from '../form-esign-verification/form-esign-verification.module';
import { ApiConfigurationService } from '../api-configuration/api-configuration.service';
import { PDFViewerModule } from '../pdf-viewer/pdf-viewer.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ExternalFormModalModule } from '../external-form-modal/external-form-modal.module';
export const CreateForm: Routes = [
  {
      path: '',
      component: DynamicFormComponent,
      canActivate: [ AuthGuardService ],
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( CreateForm ),
    SharedCommonModule,
    SharedModule,
    FormsModule,
    QuillEditorModule,
    NgxDatatableModule,
    SqueezeBoxModule,
    UiSwitchModule,
    DocumentsignComponentModule,
    SelectModule,
    CKEditorModule,
    stepperProgressModule,
    DocumentForumModule,
    IndividualAuditModule,
    FocusModule,
    ReactiveFormsModule,
    FormEsignVerificationModule,
    PDFViewerModule,PdfViewerModule,ExternalFormModalModule
  ],
  declarations: [DynamicFormComponent],
  providers:[DynamicFormService,Helper,ConfigService,DMSService,DatePipe,EquipmentStatusUpdateService,ApiConfigurationService],
  exports:[DynamicFormComponent],
})
export class DynamicFormModule { }
