import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { EmailTemplateConfigComponent } from './email-template-config.component';
import { EmailTemplateConfigService } from './email-template-config.service';
export const EmailTemplateConfigRoutes: Routes = [{
    path: '',
    component: EmailTemplateConfigComponent,
    data: {
    }
  }];

  @NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(EmailTemplateConfigRoutes),
      SharedModule,
      SharedCommonModule
      
    ],
    declarations: [EmailTemplateConfigComponent],
    providers : [DatePipe,EmailTemplateConfigService,Helper,ConfigService]
  })

  export class EmailTemplateConfigModule { }
