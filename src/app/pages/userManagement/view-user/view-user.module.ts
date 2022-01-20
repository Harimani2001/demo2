import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewUserComponent } from './view-user.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DataTableModule } from 'angular2-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { UserService } from '../user.service';
import { Helper } from '../../../shared/helper';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { IndividualAuditModule } from '../../individual-audit-trail/individual-audit-trail.module';
import { projectsetupService } from '../../projectsetup/projectsetup.service';

export const viewCompanyRoutes: Routes = [
  {
    path: '',
    component: ViewUserComponent,
    data: {
      breadcrumb: 'View Company',
      icon: 'icofont-file-code bg-c-blue',
      status: false
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(viewCompanyRoutes),
    SharedModule,
    FormsModule,
    DataTableModule,
    HttpModule,
    UiSwitchModule,
    TagInputModule,
    NgxDatatableModule,
    IndividualAuditModule
  ],
  declarations: [ViewUserComponent],
  providers: [UserService, Helper, projectsetupService]
})
export class ViewUserModule { }
