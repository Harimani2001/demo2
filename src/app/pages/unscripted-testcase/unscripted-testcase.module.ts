import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
import { SharedModule } from '../../shared/shared.module';
import { DocumentsignComponentModule } from '../documentsign/documentsign.module';
import { UrsSpecRiskViewModule } from '../urs-spec-risk-view/urs-spec-risk-view.module';
import { UnscriptedComponent } from './unscripted-testcase.component';
import { UrlchecklistModule } from '../urlchecklist/urlchecklist.module';

export const unscripted: Routes = [
    {
        path: '',
        canActivate: [AuthGuardService],
        data: {
            status: false
        },
        children: [
            {
                path: 'add-Ad-hoc-testcase',
                loadChildren: './add-unscripted-testcase/add-unscripted-testcase.module#AddUnscriptedModule'
            },
            {
                path: 'view-Ad-hoc-testcase',
                loadChildren: './view-unscripted-testcase/view-unscripted-testcase.module#ViewUnscriptedModule'
            },
            {
                path: 'add-Ad-hoc-testcase/:id',
                loadChildren: './add-unscripted-testcase/add-unscripted-testcase.module#AddUnscriptedModule'
            },
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(unscripted),
        SharedModule,
        DocumentsignComponentModule,
        UrsSpecRiskViewModule,UrlchecklistModule
    ],
    declarations: [UnscriptedComponent],
    providers: [ConfigService]
})
export class UnscriptedModule { }
