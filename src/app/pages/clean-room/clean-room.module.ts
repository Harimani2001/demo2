import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { LocationService } from '../location/location.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { FormWizardModule } from 'angular2-wizard';
import { SelectModule } from 'ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EquipmentService } from '../equipment/equipment.service';
import { CleanRoomService } from './clean-room.service';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ViewCleanRoomComponent } from './view-clean-room/view-clean-room.component';
import { AddCleanRoomComponent } from './add-clean-room/add-clean-room.component';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { IndividualDocumentWorkflowModule } from '../individual-document-workflow/individual-document-workflow.module';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { IndividualDocumentItemWorkflowModule } from '../individual-document-item-workflow/individual-document-item-workflow.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';
import { DocumentStatusCommentLog } from '../document-status-comment-log/document-status-comment-log.module';
import { DocumentFormsModule } from '../document-forms/document-forms.module';
import { DepartmentService } from '../department/department.service';
import { IndividualDocumentForumModule } from '../individual-document-forum/individual-document-forum.module';

export const cleanroom: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    data: {
      status: false
    },
    children: [
      {
        path: 'view-cleanroom',
        component: ViewCleanRoomComponent
      },
      {
        path: 'add-cleanroom',
        component: AddCleanRoomComponent
      },
      {
        path: 'add-cleanroom/:id',
        component: AddCleanRoomComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(cleanroom),
    SharedModule,
    FormsModule,
    SharedCommonModule,
    HttpModule,
    AngularMultiSelectModule,
    FormWizardModule,
    SelectModule,
    NgxDatatableModule,
    AuditTrailViewModule,
    IndividualAuditModule,
    IndividualDocumentWorkflowModule,
    DocumentForumModule,
    IndividualDocumentItemWorkflowModule,
    ReactiveFormsModule,
    SignaturePadModule,
    ChartsModule,
    FileUploadModule,
    DocumentStatusCommentLog,
    DocumentFormsModule,
    IndividualDocumentForumModule
  ],
  declarations: [ViewCleanRoomComponent, AddCleanRoomComponent],
  exports: [ViewCleanRoomComponent, AddCleanRoomComponent],
  providers: [Helper, ConfigService, projectsetupService, LocationService, EquipmentService, CleanRoomService, DateFormatSettingsService,
    DepartmentService]
})

export class CleanRoomModule { }