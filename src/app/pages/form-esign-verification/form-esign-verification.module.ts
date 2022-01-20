import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FormEsignVerificationComponent } from './form-esign-verification.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { EsignAgreementMessege } from '../../shared/constants';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    SignaturePadModule
  ],
  declarations: [FormEsignVerificationComponent],
  exports:[FormEsignVerificationComponent],
  providers:[EsignAgreementMessege],
})
export class FormEsignVerificationModule { }
