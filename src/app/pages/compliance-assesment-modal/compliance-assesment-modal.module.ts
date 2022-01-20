import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ComplianceAssesmentModalComponent } from './compliance-assesment-modal.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [ComplianceAssesmentModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,NgxDatatableModule
  ],
  exports:[ComplianceAssesmentModalComponent],
  providers : []
})
export class ComplianceAssesmentModalModule { }
