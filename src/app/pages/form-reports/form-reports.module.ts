import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

import { TreeModule } from 'angular-tree-component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EquipmentService } from '../equipment/equipment.service';
import { SelectModule } from 'ng-select';
import { FormReportsComponent } from './form-reports.component';
import { FormReportsService } from './form-reports.service';
import { ShiftService } from '../shift/shift.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { DocStatusService } from '../document-status/document-status.service';
import { SqueezeBoxModule } from 'squeezebox';
import { CKEditorModule } from 'ng2-ckeditor';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-checkbox-dropdown/angular2-multiselect-dropdown';
import {Ng2GoogleChartsModule} from 'ng2-google-charts';
import { stepperProgressModule } from '../stepperprogress/stepperprogress.module';
import { BatchCreationService } from '../batch-creation/batch-creation.service';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { DocumentStatusCommentLog } from '../document-status-comment-log/document-status-comment-log.module';
export const FormReportsRoutes: Routes = [{
  path: '',
  component: FormReportsComponent,
  data: {
    breadcrumb: 'Facility',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FormReportsRoutes),
    SharedModule,
    
    FormsModule,
    TreeModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UiSwitchModule,
    SelectModule,
    SqueezeBoxModule,
    CKEditorModule,
    AngularMultiSelectModule,
    Ng2GoogleChartsModule,
    stepperProgressModule,
    SharedCommonModule,
    DocumentStatusCommentLog
  ],
  declarations: [FormReportsComponent],
  providers : [ConfigService,DatePipe,BatchCreationService,DynamicFormService,DocStatusService,FormReportsService,Helper,ConfigService,EquipmentService,ShiftService,MasterDynamicFormsService]
})
export class FormReportsModule { }
