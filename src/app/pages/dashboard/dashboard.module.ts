import { DataTableModule } from 'angular2-datatable';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Helper } from '../../shared/helper';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'angular2-chartjs';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { DashBoardService } from './dashboard.service';
import { SqueezeBoxModule } from '../../../../node_modules/squeezebox';
import { AuthenticationService } from '../authentication/authentication.service';
import { ConfigService } from '../../shared/config.service';
import { IQTCService } from '../iqtc/iqtc.service';
import { DocStatusService } from '../document-status/document-status.service';
import { ProjectSummaryService } from '../project-summary/project-summary.service';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { LocationService } from '../location/location.service';
import { TaskReportService } from '../task-report/task-report.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { ChartsModule } from 'ng2-charts';
export const DashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuardService],
        data: {
            status: false
        },
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        ReactiveFormsModule,
        ChartModule,
        SqueezeBoxModule,
        DataTableModule,
        Ng2GoogleChartsModule,
        ChartsModule,
    ],
    declarations: [DashboardComponent],
    providers: [ProjectSummaryService, Helper, LookUpService, DashBoardService, AuthenticationService, ConfigService,
        IQTCService, DatePipe, DocStatusService, LocationService, TaskReportService, projectsetupService,
        ProjectSummaryService, WorkflowConfigurationService]
})

export class DashboardModule { }
