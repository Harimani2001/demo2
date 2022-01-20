import { ViewOrganizationComponent } from './view-organization.component';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Helper } from '../../../shared/helper';
import { OraganizationService } from '../organization.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { QuillEditorModule } from 'ngx-quill-editor';
import { HttpModule } from '@angular/http';
import { DataTableModule } from 'angular2-datatable';
import { AngularEchartsModule } from 'ngx-echarts';
import { TagInputModule } from 'ngx-chips';
//import { CompanyFilterPipe } from '../../../shared/element/company-filter.pipe';

export const viewCompanyRoutes: Routes = [
    {
        path: '',
        component: ViewOrganizationComponent,
        data: {
            status: true
        }
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( viewCompanyRoutes ),
        SharedModule,
        CommonModule,
        FormsModule,
        QuillEditorModule,
        HttpModule,
        DataTableModule,
        AngularEchartsModule,
        TagInputModule,
        NgxDatatableModule,

    ],
    declarations: [ViewOrganizationComponent],
    providers: [OraganizationService, Helper]
} )
export class ViewOrganizationModule { }
