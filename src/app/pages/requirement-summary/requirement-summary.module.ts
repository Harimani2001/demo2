import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { TreeModule } from 'angular-tree-component';
import { RequirementSummaryComponent } from './requirement-summary.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpansionPanelsModule } from 'ng2-expansion-panels';
import { UrsService } from '../urs/urs.service';
import { ImportUrsModule } from '../import-urs/import-urs.module';
import { HttpModule } from '@angular/http';
import { TagInputModule } from 'ngx-chips';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { MasterControlService } from '../master-control/master-control.service';
import { priorityService } from '../priority/priority.service';
import { CategoryService } from '../category/category.service';
import { NgDragDropModule } from 'ng-drag-drop';
import { DndModule } from 'ng2-dnd';
import { AddDocumentWorkflowModule } from '../add-document-workflow/add-document-workflow.module';
import { IndividualDocumentWorkflowModule } from '../individual-document-workflow/individual-document-workflow.module';
import { ComplianceAssesmentModalModule } from '../compliance-assesment-modal/compliance-assesment-modal.module';
export const RequirementSummaryRoutes: Routes = [{
  path: '',
  component: RequirementSummaryComponent,
  data: {
    breadcrumb: 'RequirementSummaryComponent',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RequirementSummaryRoutes),
    SharedModule,
    FormsModule,
    TreeModule,
    AmazingTimePickerModule,
    NgxDatatableModule,
    UiSwitchModule,
    ReactiveFormsModule,
    ExpansionPanelsModule,ImportUrsModule,
    SharedModule,
     HttpModule,
     UiSwitchModule,
     FormsModule,
     TagInputModule,
     QuillEditorModule,
     SharedCommonModule,
     NgDragDropModule.forRoot(),
     DndModule.forRoot(),
     AddDocumentWorkflowModule,
     IndividualDocumentWorkflowModule,ComplianceAssesmentModalModule

  ],
  declarations: [RequirementSummaryComponent],
  providers : [Helper,ConfigService,UrsService,MasterControlService,DatePipe,CategoryService,priorityService]
})
export class RequirementSummaryModule { }
