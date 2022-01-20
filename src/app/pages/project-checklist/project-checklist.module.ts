import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { ProjectChecklistComponent } from './project-checklist.component';
import { Helper } from '../../shared/helper';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
   DocumentForumModule
  ],
  exports:[ProjectChecklistComponent],
  declarations: [ProjectChecklistComponent],
  providers : [Helper],
})
export class ProjectChecklistModule { }
