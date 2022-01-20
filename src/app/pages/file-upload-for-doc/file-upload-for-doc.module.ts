import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IQTCService } from '../iqtc/iqtc.service';
import { FileUploadForDocService } from './file-upload-for-doc.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [FileUploadForDocService, IQTCService],
})
export class FileUploadForDocModule { }
