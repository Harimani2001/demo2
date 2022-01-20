import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CKEditorModule } from 'ng2-ckeditor';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { PdfChapterComponent } from './pdf-chapter.component';
import { QuillEditorModule } from 'ngx-quill-editor';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';

@NgModule({
  declarations: [PdfChapterComponent],
  imports: [
    SharedModule,
    FormsModule,
    UiSwitchModule,
    CKEditorModule,QuillEditorModule,
    SharedCommonModule,
    NgxDatatableModule
  ],
  exports:[PdfChapterComponent],
  providers:[Helper,ConfigService]
})
export class PdfChapterModule { }
