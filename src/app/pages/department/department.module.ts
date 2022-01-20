import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Helper } from '../../shared/helper';
import { DepartmentService } from './department.service';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DepartmentComponent } from './department.component';
import { HttpModule } from '@angular/http';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { TagInputModule } from 'ngx-chips';
import { SelectModule } from 'ng-select';
import { OraganizationService } from '../organization/organization.service';
import { departmentErrorTypes } from '../../shared/constants';
import { LocationService } from '../location/location.service';

export const DepartmentRoutes: Routes = [{
    path: '',
    component: DepartmentComponent,
    canActivate: [AuthGuardService],
}];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DepartmentRoutes),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedCommonModule,
        TagInputModule,
        SelectModule,
    ],
    declarations: [DepartmentComponent],
    providers: [Helper, DepartmentService, departmentErrorTypes, LocationService]
})

export class DepartmentModule { }