import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '../../../../node_modules/@angular/http';
import { OrgProfileComponent } from './org-profile.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ChartsModule } from 'ng2-charts';
import { ConfigService } from '../../shared/config.service';

export const OrgRoutes: Routes = [
    {
        path: '',
        component: OrgProfileComponent,
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild(OrgRoutes),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule, Ng2GoogleChartsModule,
        ChartsModule,
    ],
    declarations: [OrgProfileComponent],
    providers: [Helper,ConfigService]
} )
export class OrgProfileModule { }
