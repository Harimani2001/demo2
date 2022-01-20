import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { FormEsignVerificationModule } from './../../form-esign-verification/form-esign-verification.module';
import { GxpComponent } from './gxp.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';



@NgModule({
  declarations: [GxpComponent],
  imports: [
    CommonModule,
    SharedCommonModule,
    SharedModule,
    FormEsignVerificationModule,NgxDatatableModule
  ],
  exports:[GxpComponent]
})
export class GxpModule { }
