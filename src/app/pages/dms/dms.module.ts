import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DmsComponent } from './dms.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DMSService } from './dms.service';
import { Helper } from '../../shared/helper';
import { TreeModule } from 'angular-tree-component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProjectSummaryService } from '../project-summary/project-summary.service';

export const DmsRoutes: Routes = [{
  path: '',
  component: DmsComponent,
  data: {
    breadcrumb: 'Dms',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DmsRoutes),
    SharedModule,
    FormsModule,
    TreeModule,
    NgxDatatableModule
  ],
  declarations: [DmsComponent],
  providers: [DMSService, Helper, ProjectSummaryService]
})
export class DmsModule { }