import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ComplianceReportComponent } from './compliance-report.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpModule } from '@angular/http';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { Navigation } from '../navigation-bar/navigation-bar.module';
import { SqueezeBoxModule } from 'squeezebox';
import { MyDatePickerModule } from 'mydatepicker';
import { TagInputModule } from 'ngx-chips';
import { SelectModule } from 'ng-select';
import { FormEsignVerificationModule } from '../form-esign-verification/form-esign-verification.module';
import { UrsService } from '../urs/urs.service';
import { externalApprovalErrorTypes } from '../../shared/constants';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { AddDocumentWorkflowModule } from '../add-document-workflow/add-document-workflow.module';
import { DocumentWorkflowHistoryModule } from '../document-workflow-history/document-workflow-history.module';

export const ComplianceReportRoutes: Routes = [{
  path: '',
  component: ComplianceReportComponent,
  data: {
    breadcrumb: 'Compliance Report',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComplianceReportRoutes),
    SharedModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SharedCommonModule,
    NgxDatatableModule,
    Navigation,
    SqueezeBoxModule,
    MyDatePickerModule,
    TagInputModule,
    SelectModule,
    FormEsignVerificationModule,
    AuditTrailViewModule,AddDocumentWorkflowModule,DocumentWorkflowHistoryModule
  ],
  declarations: [ComplianceReportComponent],
  providers: [Helper, DatePipe, ConfigService,UrsService,externalApprovalErrorTypes,LookUpService],
  exports: [ComplianceReportComponent]
})
export class ComplianceReportModule { }
