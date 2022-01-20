import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BulkUploadComponent } from './bulk-upload.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BulkUploadService } from './bulk-upload.service';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { FileUploadModule } from "ng2-file-upload";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CategoryService } from '../category/category.service';
import { priorityService } from '../priority/priority.service';
import { UrsService } from '../urs/urs.service';
import { SelectModule } from 'ng-select';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { SpecificationMasterService } from '../specification-master/specification-master.service';
import { UiSwitchModule } from 'ng2-ui-switch';
import { NgDragDropModule } from 'ng-drag-drop';
import { DndModule } from 'ng2-dnd';

export const BulkUploadRoutes: Routes = [{
  path: '',
  component: BulkUploadComponent,
  data: {
    breadcrumb: 'BulkUpload',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BulkUploadRoutes),
    SharedModule,
    FormsModule,
    FileUploadModule,
    NgxDatatableModule,
    SelectModule,
    UiSwitchModule,
    NgDragDropModule.forRoot(),
    DndModule.forRoot(),
  ],
  declarations: [BulkUploadComponent],
  providers: [DatePipe, RiskAssessmentService, LookUpService, BulkUploadService, Helper, ConfigService, projectsetupService,
    CategoryService, priorityService, UrsService, SpecificationMasterService]
})

export class BulkUploadModule { }