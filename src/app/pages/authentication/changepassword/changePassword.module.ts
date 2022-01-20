import { ChangepasswordComponent } from './changepassword.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';
import {SelectModule} from 'ng-select';
import { FormsModule, NgForm } from '@angular/forms';
import { Helper } from '../../../shared/helper';
import { HttpModule } from '@angular/http';
import { AuthenticationService } from "../authentication.service";

export const ChangePasswordRoutes: Routes = [
{
    path: '',
    component: ChangepasswordComponent,
    data: {
      breadcrumb: 'changepassword',
      status: false,
    }
    
  }

];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ChangePasswordRoutes),
    SharedModule,
   FormsModule, 
   SelectModule,
   HttpModule
  ],
  declarations: [ ChangepasswordComponent],
  providers :[ Helper,AuthenticationService]
})
export class ChangePasswordModule { }
