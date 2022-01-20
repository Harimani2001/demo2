import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAcceptanceComponent } from './user-acceptance.component';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SqueezeBoxModule } from 'squeezebox';
import { NgxPaginationModule } from 'ngx-pagination';
import { Helper } from '../../shared/helper';
import { UrsService } from '../urs/urs.service';
import { ConfigService } from '../../shared/config.service';
import { traceabilitymatrixService } from '../traceabilitymatrix/traceabilitymatrix.service';
import { DataTableModule } from 'angular2-datatable';
import { FormEsignVerificationModule } from '../form-esign-verification/form-esign-verification.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';

export const TraceRoutes: Routes = [
  {
    path: '',
    component: UserAcceptanceComponent,
    canActivate: [AuthGuardService],
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TraceRoutes),
    SharedModule,
    NgxDatatableModule,
    FormsModule,
    HttpModule,
    SqueezeBoxModule,
    NgxPaginationModule,
    DataTableModule,
    FormEsignVerificationModule,
    IndividualAuditModule
  ],
  declarations: [UserAcceptanceComponent],
  providers: [Helper, UrsService, ConfigService, traceabilitymatrixService]
})
export class UserAcceptanceModule { }
