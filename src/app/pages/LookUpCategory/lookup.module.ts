import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { LookupItemComponent } from './lookup-item/lookup-item.component';
import {LookUpFilterPipe} from '../../shared/element/lookup-filter.pipe'; 
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipe } from '../../shared/element/data-filter.pipe';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';
export const employeeRoutes: Routes = [
    {
        path: '',
        canActivate: [ AuthGuardService ],
        data: {
            status: false
        },
        children: [
            {
                path: 'lookup-item',
                loadChildren: './lookup-item/lookup-item.module#LookUpItemModule'
            }

        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(employeeRoutes),
        SharedModule,
        FormsModule,
        HttpModule,
        DataTableModule
    ],
    declarations: [],
    providers: [ModalBasicComponent , LookUpFilterPipe ]
})
export class LookUpModule { }


