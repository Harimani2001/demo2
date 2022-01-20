import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EquipmentService } from '../equipment/equipment.service';
import { SelectModule } from 'ng-select';
import { BatchCreationService } from '../batch-creation/batch-creation.service';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { EquipmentStatusUpdateComponent } from './equipment-status-update.component';
import { EquipmentStatusUpdateService } from './equipment-status-update.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { stepperProgressModule } from '../stepperprogress/stepperprogress.module';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
export const EquipmentStatusUpdateRoutes: Routes = [{
  path: '',
  component: EquipmentStatusUpdateComponent,
  data: {
    breadcrumb: 'EquipmentStatusUpdateComponent',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EquipmentStatusUpdateRoutes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UiSwitchModule,
    SelectModule,
    SharedCommonModule,
    stepperProgressModule,AuditTrailViewModule
  ],
  declarations: [EquipmentStatusUpdateComponent],
  providers : [ConfigService,DatePipe,MasterDynamicFormsService,LookUpService,DynamicFormService,EquipmentStatusUpdateService,BatchCreationService,Helper,ConfigService,EquipmentService]
})
export class EquipmentStatusUpdateModule { }
