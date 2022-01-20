import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { MasterControlService } from '../master-control/master-control.service';
import { VendorService } from './vendor.service';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
export const vendorRoutes: Routes =[{
  path:'',
  canActivate: [ AuthGuardService ],
  data: {
      status: false
  },
  children:[
      {
          path: 'add-vendor',
          loadChildren: './add-vendor/add-vendor.module#AddVendorModule'

      },
       {
          path: 'view-vendor',
          loadChildren: './view-vendor/view-vendor.module#ViewVendorModule'
      }, {
        path: 'add-vendor/:id',
        loadChildren: './add-vendor/add-vendor.module#AddVendorModule'

    }
     
  ]
}
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(vendorRoutes),
    SharedModule,
    SharedCommonModule
  ],
  providers : [VendorService,Helper,ConfigService,MasterControlService,DatePipe,CommonFileFTPService,DynamicFormService]
})
export class VendorModule { }
