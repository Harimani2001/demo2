import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '../../../../node_modules/@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '../../../../node_modules/@angular/http';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { TreeModule } from 'angular-tree-component';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { SelectModule } from 'ng-select';
import { FileUploadModule } from "ng2-file-upload";
import { UserService } from '../userManagement/user.service';
import { MyDatePickerModule } from 'mydatepicker';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ProcessvalidationComponent } from './process-validation.component';
import { ShiftService } from '../shift/shift.service';
import { EquipmentService } from '../equipment/equipment.service';
import { ProcessValidationService } from './process-validation.service';

export const ProcessValidationRoutes: Routes = [
    {
        path: '',
        component: ProcessvalidationComponent,
        canActivate: [AuthGuardService],
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProcessValidationRoutes),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedCommonModule,
        TreeModule,
        UiSwitchModule,
        SelectModule,
        FileUploadModule,
        MyDatePickerModule,
        ChartsModule
    ],
    declarations: [ProcessvalidationComponent],
    providers: [Helper, UserService, DatePipe, ShiftService, EquipmentService, ProcessValidationService]
})
export class ProcessValidationModule { }