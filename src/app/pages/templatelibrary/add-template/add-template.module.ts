import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { AddTemplateComponent } from './add-template.component';
import { FileUploadModule } from 'ng2-file-upload';
import { Helper } from '../../../shared/helper';
import { SharedModule } from '../../../shared/shared.module';
import { stepperProgressModule } from '../../stepperprogress/stepperprogress.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplatelibraryService } from '../templatelibrary.service';

export const addTemplateRoutes: Routes = [{
  path: '',
  data: { status: true },
  component: AddTemplateComponent,
}];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    SharedCommonModule,
    RouterModule.forChild(addTemplateRoutes),
    FileUploadModule,
    stepperProgressModule,
    PdfViewerModule
  ],
  declarations: [AddTemplateComponent],
  providers: [Helper, TemplatelibraryService]
})

export class AddTemplateModule { }