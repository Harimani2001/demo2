import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ExternalFormModalComponent } from './external-form-modal.component';
import { externalApprovalErrorTypes } from '../../shared/constants';

@NgModule({
  declarations: [ExternalFormModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[ExternalFormModalComponent],
  providers : [externalApprovalErrorTypes],
})
export class ExternalFormModalModule { }
