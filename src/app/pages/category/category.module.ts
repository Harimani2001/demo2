import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '../../../../node_modules/@angular/http';
import { CategoryComponent } from './category.component';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { SharedCommonModule } from '../../shared/SharedCommonModule';

export const CategoryRoutes: Routes = [
    {
        path: '',
        component: CategoryComponent,
        canActivate: [ AuthGuardService ],
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( CategoryRoutes ),
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule,
        SharedCommonModule
    ],
    declarations: [],
    providers: [Helper]
} )
export class CategoryModule { }
