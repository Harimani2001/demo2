import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { SupportComponent } from './support.component';
import { Helper } from '../../shared/helper';

export const TimelineRoutes: Routes = [{
  path: '',
  component: SupportComponent,
  data: {
    breadcrumb: 'Support',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TimelineRoutes),
    SharedModule,
    SharedCommonModule,
  ],
  declarations: [SupportComponent],
  providers: [Helper]
})
export class SupportModule { }
