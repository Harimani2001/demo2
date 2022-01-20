import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FocusModule } from 'angular2-focus';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { DocumentForumComponent } from './document-forum.component';
import { DocumentForumService } from './document-forum.service';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FocusModule.forRoot()
  ],
  exports:[DocumentForumComponent],
  declarations: [DocumentForumComponent],
  providers : [DocumentForumService,Helper,ConfigService,],
})
export class DocumentForumModule { }
