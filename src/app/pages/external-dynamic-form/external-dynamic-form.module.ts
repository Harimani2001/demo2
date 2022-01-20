import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ExternalDynamicFormComponent } from './external-dynamic-form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillEditorModule } from 'ngx-quill-editor';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SqueezeBoxModule } from 'squeezebox';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SelectModule } from 'ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { FocusModule } from 'angular2-focus';
import { ExternalDocumentApprovalComponentService } from '../external-document-approval/external-document-approval.service';
export const ExternalDynamicFormRoutes: Routes = [{
  path: '',
  component: ExternalDynamicFormComponent,
  data: {
    breadcrumb: 'ExternalDynamic Form',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    RouterModule.forChild(ExternalDynamicFormRoutes),
    SharedModule,
    FormsModule,
    QuillEditorModule,
    NgxDatatableModule,
    SqueezeBoxModule,
    UiSwitchModule,
    SelectModule,
    CKEditorModule,
    FocusModule,
    ReactiveFormsModule,
  ],
  declarations: [ExternalDynamicFormComponent],
  providers : [ExternalDocumentApprovalComponentService,Helper,DatePipe]
})
export class ExternalDynamicFormModule { }
