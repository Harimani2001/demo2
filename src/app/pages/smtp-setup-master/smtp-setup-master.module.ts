import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { SmtpSetupMasterComponent } from './smtp-setup-master.component';
import { SmtpSetupMasterService } from './smtp-setup-master.service';
export const SmtpSetupMasterRoutes: Routes = [{
    path: '',
    component: SmtpSetupMasterComponent,
    data: {
    }
  }];

  @NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(SmtpSetupMasterRoutes),
      SharedModule,
      SharedCommonModule
    ],
    declarations: [SmtpSetupMasterComponent],
    providers : [DatePipe,SmtpSetupMasterService,Helper,ConfigService]
  })

  export class SmtpSetupMasterModule { }