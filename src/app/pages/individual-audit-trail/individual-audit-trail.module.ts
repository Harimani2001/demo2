import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DataTableModule } from 'angular2-datatable';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { DashBoardService } from '../dashboard/dashboard.service';
import { IndividualAuditTrailComponent } from './individual-audit-trail.component';
import { AuditTrailService } from '../audit-trail/audit-trail.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,FormsModule,DataTableModule,NgxDatatableModule,HttpModule
  ],
  exports:[IndividualAuditTrailComponent],
  declarations: [IndividualAuditTrailComponent],
  providers:[Helper,AuditTrailService,DashBoardService]
  

})
export class IndividualAuditModule { }