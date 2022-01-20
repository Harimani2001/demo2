import { FileUploadForDocService } from './../../file-upload-for-doc/file-upload-for-doc.service';
import { SharedCommonModule } from './../../../shared/SharedCommonModule';
import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { Helper } from '../../../shared/helper';
import { HttpModule } from '@angular/http';

import { ViewKnowledgeBaseComponent } from './view-knowledge-base.component';
import { NgxDatatableModule } from '../../../../../node_modules/@swimlane/ngx-datatable';
import { KnowledgeBaseService } from '../knowledge-base.service';
import { SqueezeBoxModule } from 'squeezebox';
import { FileUploadModule } from "ng2-file-upload";
import { DocumentsignComponentModule } from '../../documentsign/documentsign.module';
import { CommonFileFTPService } from '../../common-file-ftp.service';
export const ViewKnowledgeBaseRoutes: Routes = [
    {
        path: '',
        component: ViewKnowledgeBaseComponent
    }
];
@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( ViewKnowledgeBaseRoutes ),
        SharedModule,
        FormsModule,
        
        ReactiveFormsModule,
        UiSwitchModule,
        TagInputModule,
        HttpModule,
        NgxDatatableModule,
        SqueezeBoxModule,
        FileUploadModule,
        DocumentsignComponentModule,
        SharedCommonModule
    ],
    declarations: [ViewKnowledgeBaseComponent],
    providers: [Helper, KnowledgeBaseService,CommonFileFTPService,FileUploadForDocService]
} )
export class ViewKnowledgeBaseModule { }
