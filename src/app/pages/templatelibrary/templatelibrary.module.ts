import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { MasterControlService } from '../master-control/master-control.service';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { TemplatelibraryService } from './templatelibrary.service';

export const templateLibraryRoutes: Routes =[{
  path:'',
  canActivate: [ AuthGuardService ],
  data: {
      status: false
  },
  children:[
       {
        path: 'add-template',
        loadChildren: './add-template/add-template.module#AddTemplateModule'

      },
      {
        path: 'view-template',
         loadChildren: './view-template/view-template.module#ViewTemplateModule'
       },
      {
        path: 'add-template/:id',
        loadChildren: './add-template/add-template.module#AddTemplateModule'
      }
     
  ]
}
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(templateLibraryRoutes),
    SharedModule,
    SharedCommonModule
  ],

  providers : [TemplatelibraryService,Helper,ConfigService,MasterControlService,DatePipe,CommonFileFTPService,DynamicFormService]
})
export class TemplatelibraryModule { }
