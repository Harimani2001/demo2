import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { WithSocialComponent } from './with-social/with-social.component';
import {SharedModule} from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthenticationService } from '../authentication.service';
import { Helper } from '../../../shared/helper';
import { ConfigService } from '../../../shared/config.service';
import { projectsetupService } from "../../projectsetup/projectsetup.service";
export const LoginRoutes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Login'
    },
    children: [
        {
        path: '',
        component: WithSocialComponent,
        data: {
          breadcrumb: 'Login'
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LoginRoutes),
    SharedModule,
    FormsModule,
    HttpModule 
  ],
  declarations: [ WithSocialComponent],
  providers:[Helper,AuthenticationService,ConfigService,projectsetupService]
})
export class LoginModule { }
