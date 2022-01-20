import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { ConfigService } from '../../shared/config.service';
export const knowledgeBaseRoutes: Routes = [
    {
        path: '',
        canActivate: [ AuthGuardService ],
        data: {
            status: false
        },
        children: [
            {
                path: 'add-knowledgeBase',
                loadChildren: './add-knowledge-base/add-knowledge-base.module#AddKnowledgeBaseModule'

            },
            {
                path: 'view-knowledgeBase',
                loadChildren: './view-knowledge-base/view-knowledge-base.module#ViewKnowledgeBaseModule'

            },
        ]
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( knowledgeBaseRoutes ),
        SharedModule,
    ],
    declarations: [KnowledgeBaseComponent],
    providers:[ConfigService]
} )
export class KnowledgeBaseModule { }
