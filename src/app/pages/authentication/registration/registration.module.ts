import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { WithSocialComponent } from './with-social/with-social.component';
import {SharedModule} from '../../../shared/shared.module';
import {FormWizardModule} from 'angular2-wizard';
import { HttpModule } from '@angular/http';
import { FormsModule} from '@angular/forms';
import { Helper } from '../../../shared/helper';
import { AuthenticationService } from '../authentication.service';

export const RegistrationRoutes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Registration'
    },
    children: [
       {
        path: 'with-social',
        component: WithSocialComponent,
        data: {
          breadcrumb: 'Registration'
        }
      } 
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RegistrationRoutes),
    HttpModule,
    SharedModule,
    FormWizardModule,FormsModule
  ],
  declarations: [WithSocialComponent],
  providers :[Helper,AuthenticationService]
})
export class RegistrationModule { }
