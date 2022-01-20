import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SqueezeBoxModule } from 'squeezebox';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { MyTaskComponent } from './my-task.component';
import { TaskReportService } from '../task-report/task-report.service';
import { ConfigService } from '../../shared/config.service';
import { DataTableModule } from 'angular2-datatable';
import { ExpansionPanelsModule } from 'ng2-expansion-panels';

export const MyTaskRoutes: Routes = [{
  path: '',
  component: MyTaskComponent,
  data: {
    breadcrumb: 'My Task',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MyTaskRoutes),
    SharedModule,
    FormsModule,
    NgxDatatableModule,
    SqueezeBoxModule,SharedCommonModule,DataTableModule,ExpansionPanelsModule
  ],
  declarations: [MyTaskComponent],
  providers : [TaskReportService,ConfigService]
  
})
export class MyTaskModule { }
