import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { IndividualDocumentForumComponent } from './individual-document-forum.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
   DocumentForumModule
  ],
  exports:[IndividualDocumentForumComponent],
  declarations: [IndividualDocumentForumComponent],
  providers : [],
})
export class IndividualDocumentForumModule { }
