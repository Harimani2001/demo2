import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Helper } from '../../shared/helper';
import { DynamicTemplateService } from './dynamic-template.service';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {DynamicTemplatesComponent} from './dynamic-templates.component';
import { SharedCommonModule } from '../../shared/SharedCommonModule';


export const DynamicTemplateRoutes: Routes = [
  {
      path: '',
      canActivate: [ AuthGuardService ],
      data: {
          
          status: false
      },
      children: [
        {
            path: 'add-dynamicTemplate',
            loadChildren: './add-dynamic-template/add-dynamic-template.module#AddDynamicTemplatesModule'

        },
        {
            path: 'view-dynamicTemplate',
            loadChildren: './view-dynamic-template/view-dynamic-template.module#ViewDynamicTemplatesModule'
        },
        {
            path: 'add-dynamicTemplate/:id',
            loadChildren: './add-dynamic-template/add-dynamic-template.module#AddDynamicTemplatesModule'

        },
    ]
      
  }
];

@NgModule( {
  imports: [
      CommonModule,
      RouterModule.forChild( DynamicTemplateRoutes ),
      SharedModule,
      NgxDatatableModule,
      FormsModule,
      ReactiveFormsModule,
      SharedCommonModule
  ],
  declarations: [DynamicTemplatesComponent]
} )
export class DynamicTemplatesModule { }
