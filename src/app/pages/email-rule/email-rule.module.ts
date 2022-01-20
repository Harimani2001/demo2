import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTableModule } from 'angular2-datatable';
import { SelectModule } from 'ng-select';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SqueezeBoxModule } from 'squeezebox';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { TemplateBuiderService } from '../templatebuilder/templatebuilder.service';
import { EmailRuleComponent } from './email-rule.component';
import { EmailRuleService } from './email-rule.service';
export const EmailRuleComponentRoutes: Routes = [{
  path: '',
  component: EmailRuleComponent,
  data: {
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EmailRuleComponentRoutes),
    SharedModule,
    SharedCommonModule,
    FormsModule,
    DataTableModule,
    UiSwitchModule,
    NgxDatatableModule,
    SelectModule,SqueezeBoxModule,SelectModule
  ],
  declarations: [EmailRuleComponent],
  providers: [TemplateBuiderService, EmailRuleService, projectsetupService, LookUpService]
})

export class EmailRuleModule { }
