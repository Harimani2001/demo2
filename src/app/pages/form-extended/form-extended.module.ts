import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { DMSService } from '../dms/dms.service';
import { FormExtendedComponent } from './form-extended.component';

export const FormExtended: Routes = [
  {
      path: '',
      component: FormExtendedComponent,
      canActivate: [ AuthGuardService ],
  }
];
@NgModule({
  imports: [
    RouterModule.forChild( FormExtended ),
    SharedCommonModule,
  ],
  declarations: [],
  providers:[Helper,ConfigService,DMSService,DatePipe]
})
export class FormExtendedModule { }
