import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TreeModule } from 'angular-tree-component';
import { DataTableModule } from 'angular2-datatable';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { WorkflowLevelsComponent } from './workflow-levels.component';
import { WorkFlowLevelsService } from './workflow-levels.service';

export const WorkFlowLevelsRoutes: Routes = [{
  path: '',
  component: WorkflowLevelsComponent,
  data: {
    breadcrumb: 'WorkFlowLevel',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    DataTableModule
  ],
  exports: [WorkflowLevelsComponent],
  declarations: [WorkflowLevelsComponent],
  providers : [WorkFlowLevelsService,Helper,ConfigService]
})
export class WorkFlowLevelsModule { }
