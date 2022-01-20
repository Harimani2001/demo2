import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { PeriodicReviewService } from './periodic-review.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PeriodicReviewComponent } from './periodic-review.component';
import { periodicReviewErrorTypes } from '../../shared/constants';
import { DashBoardService } from '../dashboard/dashboard.service';
import { CommonFileFTPService } from '../common-file-ftp.service';
export const PeriodicReviewRoutes: Routes = [{
  path: '',
  component: PeriodicReviewComponent,
  data: {
    breadcrumb: 'Periodic Review',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PeriodicReviewRoutes),
    SharedModule,
    
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule
  ],
  declarations: [PeriodicReviewComponent],
  providers : [PeriodicReviewService,Helper,ConfigService,DashBoardService,CommonFileFTPService,periodicReviewErrorTypes]
  
})
export class PeriodicReviewModule { }
