import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '@angular/http';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { SelectModule } from 'ng-select';
import { AngularMultiSelectModule } from 'angular2-multiselect-checkbox-dropdown/angular2-multiselect-dropdown';

import { TreeModule } from 'angular-tree-component';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { SqueezeBoxModule } from 'squeezebox';
import { stepperProgressModule } from '../stepperprogress/stepperprogress.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { AuditTrailViewModule } from '../audit-trail-view/audit-trail-view.module';
import { VendorMasterComponent } from './vendor-master.component';
import { TaskReportService } from '../task-report/task-report.service';
import { ConfigService } from '../../shared/config.service';
import { VendorMasterService } from './vendor-master.service';
import { vendorMasterErrorMes } from '../../shared/constants';

export const vendorMasterRoutes: Routes = [
    {
        path: '',
        component: VendorMasterComponent,
        canActivate: [ AuthGuardService ],
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( vendorMasterRoutes ),
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
    declarations: [VendorMasterComponent],
    providers: [Helper,VendorMasterService,ConfigService,vendorMasterErrorMes]
} )
export class vendorMasterModule { }
