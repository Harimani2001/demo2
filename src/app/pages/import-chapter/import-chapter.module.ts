import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from '../../shared/helper';
import { ImportChapterComponent } from './import-chapter.component';
import { ConfigService } from '../../shared/config.service';
import { CKEditorModule } from 'ng2-ckeditor';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,CKEditorModule
  ],
  exports:[ImportChapterComponent],
  declarations: [ImportChapterComponent],
  providers : [Helper,ConfigService],
})
export class ImportChapterModule { }
