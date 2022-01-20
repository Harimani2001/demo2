import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { MasterDynamicFormsService } from './master-dynamic-forms.service';
import { MasterDynamicFormsComponent } from './master-dynamic-forms.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { FormPreviewModule } from '../form-preview/form-preview.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { SharedModule } from '../../shared/shared.module';
import { QuillEditorModule } from 'ngx-quill-editor';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SqueezeBoxModule } from 'squeezebox';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SelectModule } from 'ng-select';
import { FormsModule } from '@angular/forms';
import { EquipmentService } from '../equipment/equipment.service';
import { DepartmentService } from '../department/department.service';
import { UserService } from '../userManagement/user.service';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
export const CreateForm: Routes = [
  {
      path: '',
      component: MasterDynamicFormsComponent,
      canActivate: [ AuthGuardService ],
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( CreateForm ),
    SharedCommonModule,
    FormPreviewModule,
    SharedModule,
    FormsModule,
    QuillEditorModule,
    NgxDatatableModule,
    SqueezeBoxModule,
    UiSwitchModule,
    SelectModule,
    CKEditorModule,
  ],
  declarations: [DynamicFormComponent],
  entryComponents: [DynamicFormComponent],
  providers:[MasterDynamicFormsService,EquipmentService,DepartmentService,UserService]
})
export class MasterDynamicFormsModule { }
