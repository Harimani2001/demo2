import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { ErrorPage404Component } from './error-page404.component';

export const ErrorRoutes: Routes = [{
  path: '',
  component: ErrorPage404Component,
  data: {
    breadcrumb: 'ErrorPage404Component',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ErrorRoutes),
    SharedModule,
    
  ],
  declarations: [ErrorPage404Component],
  providers : [DatePipe,Helper,ConfigService]
})
export class ErrorPage404Module { }
