import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { Helper } from '../../../shared/helper';
import { HttpModule } from '@angular/http';

import { SelectModule } from 'ng-select';
import { AddRiskAssessmentComponent } from './add-risk-assessment.component';
import { RiskAssessmentService } from '../risk-assessment.service';
import { UrsService } from '../../urs/urs.service';
import {AuthGuardService} from '../../../../app/layout/auth/AuthGuardService';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { MasterControlService } from '../../master-control/master-control.service';
import { riskAssessment } from '../../../shared/constants';
import { UrsViewModule } from '../../urs-view/urs-view.module';
import { SpecificationMasterService } from '../../specification-master/specification-master.service';
import { ConfigService } from '../../../shared/config.service';
export const addRiskAssessmentRoutesRoutes: Routes = [
    {
        path: '',
        component: AddRiskAssessmentComponent,
        canActivate: [ AuthGuardService ],
        
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( addRiskAssessmentRoutesRoutes ),
        SharedModule,
        FormsModule,
        
        ReactiveFormsModule,
        UiSwitchModule,
        TagInputModule,
        HttpModule,
        SelectModule,
        SharedCommonModule,
        UrsViewModule
    ],
    declarations: [],
   providers: [SpecificationMasterService,Helper, RiskAssessmentService,UrsService,
    LookUpService,DatePipe,MasterControlService,riskAssessment,ConfigService]
} )
export class AddRiskAssessmentModule { }
