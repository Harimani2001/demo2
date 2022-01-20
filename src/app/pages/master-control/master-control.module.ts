import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedCommonModule } from "../../shared/SharedCommonModule";
import { SharedModule } from './../../shared/shared.module';
import { MasterControlComponent } from './master-control.component';
import { UiSwitchModule } from 'ng2-ui-switch';
import { MasterControlService } from './master-control.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SqueezeBoxModule } from 'squeezebox';


export const masterRoutes: Routes = [
    {
        path: '',
        component: MasterControlComponent,
        data: {
            status: true
        }
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(masterRoutes),
        SharedModule,
        FormsModule,
        SharedCommonModule,
        UiSwitchModule,
        NgxDatatableModule,
        SqueezeBoxModule,
    ],
    declarations: [MasterControlComponent],
    providers: [MasterControlService],
    
})
export class MasterControlModule { }


