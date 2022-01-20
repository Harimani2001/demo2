
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../layout/auth/AuthGuardService';
import { SharedModule } from '../../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from '../../../shared/helper';
import { DynamicTemplateService } from '../dynamic-template.service';
import { ViewDynamicTemplateComponent } from './view-dynamic-template.component';
import { SqueezeBoxModule } from 'squeezebox';
import { MasterControlService } from '../../master-control/master-control.service';
import { ConfigService } from '../../../shared/config.service';
 
import { QuillEditorModule } from 'ngx-quill-editor';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
export const ViewDynamicTemplateRoutes: Routes = [
  {
      path: '',
      component:ViewDynamicTemplateComponent,
      canActivate: [ AuthGuardService ],
      data: {        
          status: false
      },    
  }
];

@NgModule( {
  imports: [
      CommonModule,
      RouterModule.forChild( ViewDynamicTemplateRoutes ),
      SharedModule,
      NgxDatatableModule,
      FormsModule,
      ReactiveFormsModule,SqueezeBoxModule,QuillEditorModule,
      SharedCommonModule
  ],
  declarations: [ViewDynamicTemplateComponent],
  providers: [DynamicTemplateService]
} )
export class ViewDynamicTemplatesModule { }
