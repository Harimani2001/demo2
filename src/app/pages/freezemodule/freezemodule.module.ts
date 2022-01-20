import { freezeModuleService } from './freezemodule.service';
import { AuthGuardService } from './../../layout/auth/AuthGuardService';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { FreezemoduleComponent } from './freezemodule.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SqueezeBoxModule } from 'squeezebox';

export const docStatusRoutes:Routes =[
  {
      path:'',
      component:FreezemoduleComponent,
      canActivate: [ AuthGuardService ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( docStatusRoutes ),
    SharedCommonModule,
    SharedModule,
    SqueezeBoxModule

  ],
  declarations: [FreezemoduleComponent],
  providers:[freezeModuleService]
})
export class FreezeModule { }
