import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TreeModule } from 'angular-tree-component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ChartsModule } from 'ng2-charts';
import { QuillEditorModule } from 'ngx-quill-editor';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { AuditTrailService } from '../audit-trail/audit-trail.service';
import { DashBoardService } from '../dashboard/dashboard.service';
import { stepperProgressModule } from '../stepperprogress/stepperprogress.module';
import { traceabilitymatrixService } from '../traceabilitymatrix/traceabilitymatrix.service';
import { SharedModule } from './../../shared/shared.module';
import { SharedCommonModule } from './../../shared/SharedCommonModule';
import { WorkflowConfigurationService } from './../workflow-configuration/workflow-configuration.service';
import { ProjectSummaryComponent } from './project-summary.component';
import { ProjectSummaryService } from './project-summary.service';
import { ProjectChecklistModule } from '../project-checklist/project-checklist.module';
import { GxpModule } from '../projectsetup/gxp/gxp.module';
import { TaskCreationService } from '../task-creation/task-creation.service';
import { DataTableModule } from 'angular2-datatable';

export const ProjectSummaryRoutes: Routes = [{
  path: '',
  component: ProjectSummaryComponent,
  data: {
    breadcrumb: 'ProjectSummary',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProjectSummaryRoutes),
    SharedModule,
    SharedCommonModule,
    AngularMultiSelectModule,
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    stepperProgressModule,
    QuillEditorModule,
    ChartsModule,
    ProjectChecklistModule,
    GxpModule,
    DataTableModule
  ],
  declarations: [ProjectSummaryComponent],
  providers: [WorkflowConfigurationService, traceabilitymatrixService, AuditTrailService, DashBoardService, ProjectSummaryService,
    Helper, ConfigService, DashBoardService, DatePipe, TaskCreationService]
})
export class ProjectSummaryModule { }
