import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UiSwitchModule } from 'ng2-ui-switch';
import { PDFViewerComponent } from './pdf-viewer.component';


@NgModule({
  declarations: [PDFViewerComponent],
  imports: [
    CommonModule,
    PdfViewerModule,
    FormsModule,
    UiSwitchModule,
  ],
  exports:[PDFViewerComponent],
})
export class PDFViewerModule { }
