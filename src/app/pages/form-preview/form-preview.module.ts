import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { UiSwitchModule } from 'ng2-ui-switch';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    QuillEditorModule,
    SqueezeBoxModule,
    UiSwitchModule,
    SelectModule,
    CKEditorModule
  ],
  declarations: []
})
export class FormPreviewModule { }
