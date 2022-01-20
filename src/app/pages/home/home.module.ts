import { AuthGuardService } from './../../layout/auth/AuthGuardService';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SqueezeBoxModule } from 'squeezebox';
import { HomeComponent } from './home.component';
import { ConfigService } from '../../shared/config.service';
import { HomeService } from './home.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { DataTableModule } from 'angular2-datatable';
import { TaskReportService } from '../task-report/task-report.service';
import { ExpansionPanelsModule } from 'ng2-expansion-panels';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ChartsModule } from 'ng2-charts';

export const docStatusRoutes:Routes =[
  {
      path:'',
      component:HomeComponent,
      canActivate: [ AuthGuardService ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( docStatusRoutes ),
    SharedCommonModule,
    SharedModule,
    SqueezeBoxModule,DataTableModule,ExpansionPanelsModule,ChartsModule,Ng2GoogleChartsModule

  ],
  declarations: [HomeComponent],
  providers:[ConfigService,HomeService,projectsetupService,TaskReportService]
})
export class HomeModule { }
