import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { UiSwitchModule } from 'ng2-ui-switch';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { SharedModule } from '../../shared/shared.module';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    QuillEditorModule,
    SqueezeBoxModule,
    UiSwitchModule,
    SelectModule,
    CKEditorModule,AuditTrailViewModule,IndividualAuditModule
  ],
  declarations: []
})
export class ViewFormModule { }
