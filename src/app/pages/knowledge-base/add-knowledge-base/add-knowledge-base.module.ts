import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { SelectModule } from 'ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { FileUploadModule } from "ng2-file-upload";
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { QuillEditorModule } from 'ngx-quill-editor';
import { SqueezeBoxModule } from 'squeezebox';
import { NgxDatatableModule } from '../../../../../node_modules/@swimlane/ngx-datatable';
import { Helper } from '../../../shared/helper';
import { SharedModule } from '../../../shared/shared.module';
import { VendorService } from '../../vendor/vendor.service';
import { KnowledgeBaseService } from '../knowledge-base.service';
import { SharedCommonModule } from './../../../shared/SharedCommonModule';
import { FileUploadForDocService } from './../../file-upload-for-doc/file-upload-for-doc.service';
import { AddKnowledgeBaseComponent } from './add-knowledge-base.component';
export const AddKnowledgeBaseRoutes: Routes = [
    {
        path: '',
        component: AddKnowledgeBaseComponent
    }
];
@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( AddKnowledgeBaseRoutes ),
        SharedModule,
        FormsModule,
        
        ReactiveFormsModule,
        UiSwitchModule,
        TagInputModule,
        HttpModule,
        NgxDatatableModule,
        SqueezeBoxModule,
        FileUploadModule,
        QuillEditorModule,
        SelectModule,
        CKEditorModule,
        SharedCommonModule

    ],
    declarations: [AddKnowledgeBaseComponent],
    providers: [Helper, KnowledgeBaseService,VendorService,FileUploadForDocService]
} )
export class AddKnowledgeBaseModule { }
