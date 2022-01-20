import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from "ng2-ui-switch/dist";
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { AuthGuardService } from '../../../layout/auth/AuthGuardService';
import { ConfigService } from '../../../shared/config.service';
import { Helper } from '../../../shared/helper';
import { SharedModule } from '../../../shared/shared.module';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { DashBoardService } from '../../dashboard/dashboard.service';
import { DepartmentService } from '../../department/department.service';
import { DynamicTemplateService } from '../../dynamic-templates/dynamic-template.service';
import { FileUploadForDocService } from '../../file-upload-for-doc/file-upload-for-doc.service';
import { IQTCService } from '../../iqtc/iqtc.service';
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { projectPlanService } from '../../projectplan/projectplan.service';
import { RiskAssessmentService } from '../../risk-assessment/risk-assessment.service';
import { UrlchecklistModule } from '../../urlchecklist/urlchecklist.module';
import { UrsService } from '../../urs/urs.service';
import { UserService } from '../../userManagement/user.service';
import { VendorService } from '../../vendor/vendor.service';
import { DiscrepancyFormRoutesService } from '../discrepancy-form.service';
import { AddDiscrepancyFormComponent } from './add-discrepancy-form.component';
import { MasterControlService } from '../../master-control/master-control.service';


export const discrepancyFormRoutes:Routes =[
    {

        path:'',
        component:AddDiscrepancyFormComponent,
        canActivate: [ AuthGuardService ],
    }

];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( discrepancyFormRoutes ),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule,
        SharedCommonModule,
        UiSwitchModule,
        SqueezeBoxModule, QuillEditorModule,UrlchecklistModule
    ],
    declarations: [AddDiscrepancyFormComponent],
    providers: [Helper,VendorService,ConfigService,LookUpService,UrsService,IQTCService,DiscrepancyFormRoutesService,
    RiskAssessmentService,DashBoardService,DynamicTemplateService,projectPlanService, DepartmentService, UserService,DatePipe,DashBoardService,FileUploadForDocService,MasterControlService]
} )


export class AddDiscrepancyFormModule{}
