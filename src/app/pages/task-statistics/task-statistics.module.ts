import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { FormsModule } from '@angular/forms';
import { TaskStatisticsComponent } from './task-statistics.component';
import { HttpModule } from '@angular/http';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { LocationService } from '../location/location.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { TaskCreationService } from '../task-creation/task-creation.service';

export const TaskStatisticsRoutes: Routes = [{
  path: '',
  component: TaskStatisticsComponent,
  data: {
    breadcrumb: 'Task Statistics',
    icon: 'icofont icofont-file-document bg-c-orenge'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TaskStatisticsRoutes),
    SharedModule,
    FormsModule,
    SharedCommonModule,
    HttpModule,
    AngularMultiSelectModule,
  ],
  providers: [Helper, ConfigService, projectsetupService, LocationService, TaskCreationService],
  declarations: [TaskStatisticsComponent]
})

export class TaskStatisticsModule { }