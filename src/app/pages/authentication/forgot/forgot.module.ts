import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotComponent } from './forgot.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';
import { AuthenticationService } from '../authentication.service';
import { Helper } from '../../../shared/helper';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'; 

export const forgotRoutes: Routes = [
  {
    path: '',
    component: ForgotComponent,
    data: {
      breadcrumb: 'Forgot'
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(forgotRoutes),
    SharedModule,
    FormsModule,
    HttpModule
    
  ],
  declarations: [ForgotComponent],
  providers:[Helper,AuthenticationService]
})
export class ForgotModule { }
