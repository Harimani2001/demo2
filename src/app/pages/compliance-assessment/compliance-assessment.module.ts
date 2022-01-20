import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { TreeModule } from 'angular-tree-component';
import { ComplianceAssessmentComponent } from './compliance-assessment.component';
import { ComplianceAssessmentService } from './compliance-assessment.service';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { complianceAssessmentErrorTypes, shiftErrorTypes } from '../../shared/constants';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';


export const ComplianceAssessmentRoutes: Routes = [
  {
      path: '',
      component: ComplianceAssessmentComponent,
      canActivate: [ AuthGuardService ],
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComplianceAssessmentRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    AmazingTimePickerModule,
    NgxDatatableModule,
    UiSwitchModule,
    ReactiveFormsModule
  ],
  declarations: [ComplianceAssessmentComponent],
  providers : [ComplianceAssessmentService,Helper,ConfigService,complianceAssessmentErrorTypes]
})
export class ComplianceAssessmentModule { }
