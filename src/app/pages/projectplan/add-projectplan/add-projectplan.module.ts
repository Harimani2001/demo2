import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { Helper } from '../../../shared/helper';
import { HttpModule } from '@angular/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SqueezeBoxModule } from 'squeezebox';
import { projectPlanService } from '../projectplan.service';
import { AddProjectplanComponent } from './add-projectplan.component';
import { SelectModule } from '../../../../../node_modules/ng-select';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { UiSwitchModule } from '../../../../../node_modules/ng2-ui-switch/dist';
import { DepartmentService } from '../../department/department.service';
import { UserService } from '../../userManagement/user.service';
import { CKEditorModule } from 'ng2-ckeditor';
import { ExpansionPanelsModule } from 'ng2-expansion-panels';

export const addProjectPlanRoutes: Routes = [
    {
        path: '',
        component: AddProjectplanComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(addProjectPlanRoutes),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        TagInputModule,
        HttpModule,
        NgxDatatableModule,
        SqueezeBoxModule,
        SelectModule,
        UiSwitchModule,
        SharedCommonModule,
        CKEditorModule,
        ExpansionPanelsModule
    ],
    declarations: [],
    providers: [Helper, projectPlanService, DepartmentService, UserService, DatePipe]
})

export class AddProjectplanModule { }