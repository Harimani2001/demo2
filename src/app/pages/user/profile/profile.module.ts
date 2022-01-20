import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTableModule } from 'angular2-datatable';
import { SignaturePadModule } from 'angular2-signaturepad';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { SelectModule } from 'ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { AngularEchartsModule } from 'ngx-echarts';
import { QuillEditorModule } from 'ngx-quill-editor';
import { PermissionCategory } from '../../../models/permissioncategory';
import { projectsetupService } from '../../../pages/projectsetup/projectsetup.service';
import { SharedModule } from '../../../shared/shared.module';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { AuditTrailService } from '../../audit-trail/audit-trail.service';
import { DateFormatSettingsService } from '../../date-format-settings/date-format-settings.service';
import { LocationService } from '../../location/location.service';
import { userRoleservice } from '../../role-management/role-management.service';
import { UservsEquipmentService } from '../../user-mapping/user-mapping.service';
import { UserService } from '../../userManagement/user.service';
import { ProfileComponent } from './profile.component';
export const profileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    data: {
      breadcrumb: 'User Profile',
      icon: 'icofont-justify-all bg-c-green',
      status: true
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(profileRoutes),
    SharedModule,
    FormsModule,
    QuillEditorModule,
    HttpModule,
    DataTableModule,
    AngularEchartsModule,
    NgxDatatableModule,
    SignaturePadModule,
    SharedCommonModule,
    CKEditorModule, SelectModule, MyDatePickerModule
  ],
  declarations: [ProfileComponent],
  providers: [UserService, projectsetupService, AuditTrailService, UservsEquipmentService, userRoleservice, PermissionCategory, DateFormatSettingsService, DatePipe, LocationService]
})
export class ProfileModule { }
