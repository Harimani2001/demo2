import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '../../../../node_modules/@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '../../../../node_modules/@angular/http';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { ChangeControlFormComponent } from './change-control-form.component';
import { CCFService } from './change-control-form.service';
import { DepartmentService } from '../department/department.service';
import { SelectModule } from 'ng-select';
import { AngularMultiSelectModule } from 'angular2-multiselect-checkbox-dropdown/angular2-multiselect-dropdown';

import { TreeModule } from 'angular-tree-component';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SqueezeBoxModule } from 'squeezebox';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { MasterControlService } from '../master-control/master-control.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { stepperProgressModule } from '../stepperprogress/stepperprogress.module';
import { UserService } from '../userManagement/user.service';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { AuditTrailViewComponent } from '../audit-trail-view/audit-trail-view.component';

export const CCFRoutes: Routes = [
    {
        path: '',
        component: ChangeControlFormComponent,
        canActivate: [ AuthGuardService ],
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( CCFRoutes ),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule,
        SharedCommonModule,
        SelectModule,
        
        TreeModule,
        ReactiveFormsModule,
        UiSwitchModule,
        SqueezeBoxModule,
        AngularMultiSelectModule,stepperProgressModule,AuditTrailViewModule,IndividualAuditModule
    ],
    declarations: [ChangeControlFormComponent],
    providers: [AuditTrailViewComponent,UserService,MasterDynamicFormsService,Helper,CCFService,DepartmentService,projectsetupService,MasterControlService,DatePipe]
} )
export class CCFModule { }
