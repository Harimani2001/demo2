import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { periodicReviewErrorTypes } from '../../shared/constants';
import { DashBoardService } from '../dashboard/dashboard.service';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { DocumentsReportComponent } from './documents-report.component';
export const ReportsRoutes: Routes = [{
  path: '',
  component: DocumentsReportComponent,
  data: {
    breadcrumb: 'Periodic Review',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutes),
    SharedModule,
    
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule
  ],
  declarations: [DocumentsReportComponent],
  providers : [Helper,ConfigService,DashBoardService,CommonFileFTPService,periodicReviewErrorTypes]
  
})
export class ReportsModule { }
