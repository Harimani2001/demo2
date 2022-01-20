import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { MasterControlService } from '../master-control/master-control.service';
import { EsignService } from './esign.service';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { LocationService } from '../location/location.service';;
import { EsignIndividualDocumentItemWorkflowModule } from './esign-individual-document-item-workflow/esign-individual-document-item-workflow.module';

export const documentRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    data: {
      status: false
    },
    children: [
      {
        path: 'add-esign',
        loadChildren: './add-document/add-document.module#AddDocumentModule'
      },
      {
        path: 'view-esign',
        loadChildren: './view-document/view-document.module#ViewDocumentModule'
      },
      {
        path: 'add-esign/:id',
        loadChildren: './add-document/add-document.module#AddDocumentModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(documentRoutes),
    SharedModule,
    SharedCommonModule, EsignIndividualDocumentItemWorkflowModule
  ],
  providers: [EsignService, Helper, ConfigService, MasterControlService, DatePipe, CommonFileFTPService, DynamicFormService, LocationService]
})

export class EsignModule { }