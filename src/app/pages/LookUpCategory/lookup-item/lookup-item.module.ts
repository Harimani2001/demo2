import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Helper } from '../../../shared/helper';
import { HttpModule } from '@angular/http';
import { LookupItemComponent } from './lookup-item.component';
import { LookUpService } from '../lookup.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTableModule } from 'angular2-datatable';
import { FormsModule } from '../../../../../node_modules/@angular/forms';

export const lookupRoutes: Routes = [
    {
        path: '',
        component: LookupItemComponent,
        data: {
            status: true
        }
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( lookupRoutes ),
        SharedModule,
        FormsModule,
        HttpModule,
        NgxDatatableModule,
        DataTableModule
    ],
    declarations: [LookupItemComponent],
    providers: [Helper, LookUpService] 
} )
export class LookUpItemModule { }
