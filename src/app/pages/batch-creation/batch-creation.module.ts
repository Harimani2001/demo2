import { SqueezeBoxModule } from 'squeezebox';
import { stepperProgressModule } from './../stepperprogress/stepperprogress.module';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TreeModule } from 'angular-tree-component';
import { SelectModule } from 'ng-select';
import { FileUploadModule } from 'ng2-file-upload';

import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { ConfigService } from '../../shared/config.service';
import { batchCreationErrorTypes } from '../../shared/constants';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { EquipmentService } from '../equipment/equipment.service';
import { LocationService } from '../location/location.service';
import { MasterControlService } from '../master-control/master-control.service';
import { BatchCreationComponent } from './batch-creation.component';
import { BatchCreationService } from './batch-creation.service';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
export const BatchCreationRoutes: Routes = [{
  path: '',
  component: BatchCreationComponent,
  data: {
    breadcrumb: 'Batch Creation',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BatchCreationRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    UiSwitchModule,
    stepperProgressModule,
    SqueezeBoxModule,
    ReactiveFormsModule,SelectModule,FileUploadModule,SharedCommonModule,AuditTrailViewModule,IndividualAuditModule
  ],
  declarations: [BatchCreationComponent],
  providers: [BatchCreationService, Helper, ConfigService,
    LocationService, EquipmentService, batchCreationErrorTypes,
    MasterControlService, DatePipe]
})
export class BatchCreationModule { }
