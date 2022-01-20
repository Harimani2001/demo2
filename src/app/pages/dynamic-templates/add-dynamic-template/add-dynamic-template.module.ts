
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../layout/auth/AuthGuardService';
import { SharedModule } from '../../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddDynamicTemplateComponent } from './add-dynamic-template.component';
import { Helper } from '../../../shared/helper';
import { DynamicTemplateService } from '../dynamic-template.service';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { FileUploadModule } from 'ng2-file-upload';
import { SelectModule } from 'ng-select';
import { QuillEditorModule } from 'ngx-quill-editor';
import { TagInputModule } from 'ngx-chips';
import { HttpModule } from '@angular/http';
import { MasterControlService } from '../../master-control/master-control.service';

export const AddDynamicTemplateRoutes: Routes = [
  {
      path: '',
      component:AddDynamicTemplateComponent,
      canActivate: [ AuthGuardService ],
      data: {        
          status: false
      },    
  }
];

@NgModule( {
  imports: [
      CommonModule,
      RouterModule.forChild( AddDynamicTemplateRoutes ),
    SharedCommonModule,
    QuillEditorModule,
        SelectModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        TagInputModule,
        HttpModule,
        NgxDatatableModule,
        UiSwitchModule, FileUploadModule
  ],
  declarations: [AddDynamicTemplateComponent],
  providers: [Helper, DynamicTemplateService,MasterControlService ]
} )
export class AddDynamicTemplatesModule { }
