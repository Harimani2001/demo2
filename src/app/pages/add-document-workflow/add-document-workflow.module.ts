import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from '../../shared/helper';
import { AddDocumentWorkflowComponent } from './add-document-workflow.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LocationService } from '../location/location.service';
import { UiSwitchModule } from 'ng2-ui-switch';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { DepartmentService } from '../department/department.service';
import { userRoleservice } from '../role-management/role-management.service';
import { ConfigService } from '../../shared/config.service';
import { SelectModule } from 'ng-select';
import { SqueezeBoxModule } from 'squeezebox';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { NgDragDropModule } from 'ng-drag-drop';
import { DndModule } from 'ng2-dnd';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,NgxDatatableModule,UiSwitchModule,
    FormsModule,
    CommonModule,
    SharedModule,
    SelectModule,
    UiSwitchModule,
    SqueezeBoxModule,
    SharedCommonModule,
    NgDragDropModule.forRoot(),
    DndModule.forRoot(),
  ],
  exports:[AddDocumentWorkflowComponent],
  declarations: [AddDocumentWorkflowComponent],
  providers : [Helper,WorkflowConfigurationService,WorkFlowLevelsService,DepartmentService,userRoleservice,ConfigService],
})
export class AddDocumentWorkflowModule { }
