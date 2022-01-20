import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DraftPdfComponent } from './draft-pdf.component';
import { PDFViewerModule } from '../pdf-viewer/pdf-viewer.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PDFViewerModule
  ],
  exports: [DraftPdfComponent],
  declarations: [DraftPdfComponent],
  providers: [Helper, ConfigService],
})

export class DraftPdfModule { }