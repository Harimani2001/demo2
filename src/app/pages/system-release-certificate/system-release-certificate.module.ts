import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { SystemCertificateComponent } from './system-release-certificate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { HttpModule } from '@angular/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SqueezeBoxModule } from 'squeezebox';
import { SelectModule } from '../../../../node_modules/ng-select';
import { UiSwitchModule } from '../../../../node_modules/ng2-ui-switch/dist';
import { DepartmentService } from '../department/department.service';
import { UserService } from '../userManagement/user.service';
import { CKEditorModule } from 'ng2-ckeditor';
import { ExpansionPanelsModule } from 'ng2-expansion-panels';
import { SystemCertificateService } from './system-release-certificate.service';
import { DataTableModule } from 'angular2-datatable';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { DocumentWorkflowHistoryModule } from '../document-workflow-history/document-workflow-history.module';
import { AddDocumentWorkflowModule } from '../add-document-workflow/add-document-workflow.module';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';


export const SystemCertificateRoutes: Routes = [
    {
      path: '',
      component: SystemCertificateComponent,
      data: {
        breadcrumb: 'SystemReleaseCertificate',
        icon: 'icofont icofont-file-document bg-c-pink'
      }
    }
  ];

  @NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SystemCertificateRoutes),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        TagInputModule,
        HttpModule,
        NgxDatatableModule,
        SqueezeBoxModule,
        SelectModule,
        UiSwitchModule,
        SharedCommonModule,
        CKEditorModule,
        ExpansionPanelsModule,
        FlatpickrModule.forRoot(),
        MyDatePickerModule,
        DataTableModule,
        DocumentWorkflowHistoryModule,
        AddDocumentWorkflowModule,
        AuditTrailViewModule
    ],
    declarations: [SystemCertificateComponent],
    providers: [Helper, SystemCertificateService, DepartmentService, UserService, DatePipe]
  })
  
  export class SystemCertificateModule { }