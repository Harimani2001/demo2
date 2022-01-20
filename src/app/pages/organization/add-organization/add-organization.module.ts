import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddOrganizationComponent } from './add-organization.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { Helper } from '../../../shared/helper';
import { OraganizationService } from '../organization.service';
import { HttpModule } from '@angular/http';
import { SharedCommonModule} from './../../../shared/SharedCommonModule';
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { locationValidationMsg } from '../../../shared/constants';

export const addCompanyRoutes: Routes = [
    {
        path: '',
        component: AddOrganizationComponent,
        data: {
            status: true
        }
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( addCompanyRoutes ),
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiSwitchModule,
        TagInputModule,
        HttpModule,
        SharedCommonModule
    ],
    declarations: [],
    providers: [Helper, AddOrganizationComponent, OraganizationService, LookUpService, locationValidationMsg]
} )
export class AddOrganizationModule { }
