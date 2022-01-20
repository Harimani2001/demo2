import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TemplateService } from './templates.service';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { TreeModule } from 'angular-tree-component';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { userRoleservice } from '../role-management/role-management.service';
import { UserService } from '../userManagement/user.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SelectModule } from 'ng-select';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SqueezeBoxModule } from 'squeezebox';
import { stepperProgressModule } from '../stepperprogress/stepperprogress.module';
import { DocumentStatusCommentLog } from '../document-status-comment-log/document-status-comment-log.module'
import { masterDataSetUpTemplates } from '../../shared/constants';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { DepartmentService } from '../department/department.service';
import { LocationService } from '../location/location.service';
export const TemplatesRoutes: Routes = [{
  path: '',
  component: TemplatesComponent,
  data: {
    breadcrumb: 'Templates',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TemplatesRoutes),
    SharedModule,
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    SelectModule,
    UiSwitchModule,
    SqueezeBoxModule,
    stepperProgressModule,
    DocumentStatusCommentLog, AuditTrailViewModule, IndividualAuditModule, MyDatePickerModule
  ],
  declarations: [TemplatesComponent],
  providers: [
    TemplateService, Helper, ConfigService, CommonFileFTPService, 
    projectsetupService, userRoleservice, UserService, masterDataSetUpTemplates, 
    DepartmentService, LocationService
  ]
})
export class TemplatesModule { }
