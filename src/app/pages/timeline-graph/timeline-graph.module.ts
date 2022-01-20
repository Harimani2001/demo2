import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TimelineGraphComponent } from './timeline-graph.component';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { FormsModule } from '@angular/forms';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { DataTableModule } from 'angular2-datatable';

export const TimelineRoutes: Routes = [{
  path: '',
  component: TimelineGraphComponent,
  data: {
    breadcrumb: 'Timeline graph',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TimelineRoutes),
    SharedModule,
    FormsModule,
    SharedCommonModule,DataTableModule
  ],
  providers:[projectsetupService],
  declarations: [TimelineGraphComponent]
})
export class TimelineGraphModule { }
