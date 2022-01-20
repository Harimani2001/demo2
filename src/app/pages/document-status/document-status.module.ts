import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SqueezeBoxModule } from 'squeezebox';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { HttpModule } from '../../../../node_modules/@angular/http';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { DashBoardService } from '../dashboard/dashboard.service';
import { DynamicTemplateService } from '../dynamic-templates/dynamic-template.service';
import { IQTCService } from '../iqtc/iqtc.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { UrsService } from '../urs/urs.service';
import { VendorService } from '../vendor/vendor.service';
import { DocumentStatusComponent } from './document-status.component';
import { DocStatusService } from './document-status.service';

export const docStatusRoutes:Routes =[
    {
 
        path:'',
        component:DocumentStatusComponent,
        canActivate: [ AuthGuardService ],
    }

];
 
@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( docStatusRoutes ),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule,
        SqueezeBoxModule
    ],
    declarations: [DocumentStatusComponent],
    providers: [Helper,VendorService,ConfigService,LookUpService,UrsService,DocStatusService,IQTCService,
    RiskAssessmentService,DashBoardService,DynamicTemplateService]
} )


export class DocumentStatusModule{}