import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddVendorComponent } from './add-vendor.component';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
export const addVendorRoutes: Routes = [
  {
    path: '',
    component: AddVendorComponent,
  }
]; 
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(addVendorRoutes),
    SharedCommonModule
  ],
  declarations: []
})
export class AddVendorModule { }
