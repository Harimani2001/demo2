import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { Helper } from '../../shared/helper';
import { HttpModule } from '@angular/http';

import { SelectModule } from 'ng-select';
import {QuillEditorModule} from 'ngx-quill-editor';
import { SharedCommonModule} from './../../shared/SharedCommonModule';
import {PdfPreferencesComponent} from '../pdf-preferences/pdf-preferences.component';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { pdfPreferencesServices } from './pdfPreferences.services';
import { ColorPickerModule } from 'ngx-color-picker';
import { VendorService } from '../vendor/vendor.service';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { MasterformLinkModule } from '../masterform-link/masterform-link.module';
import { ToastyModule } from 'ng2-toasty';
import { PdfPreferencesDefaultPdfModule } from '../pdf-preferences-default-pdf/pdf-preferences-default-pdf.module'
import { PdfChapterModule } from '../pdf-chapter/pdf-chapter.module';
export const pdfRoutes: Routes = [
    {
        path: '',
        component: PdfPreferencesComponent
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( pdfRoutes ),
        SharedModule,
        FormsModule,
        ToastyModule.forRoot(),
        ReactiveFormsModule,
        UiSwitchModule,
        TagInputModule,
        HttpModule,
        SelectModule,
        QuillEditorModule,
        SharedCommonModule,
        ColorPickerModule,
        MasterformLinkModule,
        PdfPreferencesDefaultPdfModule,
        PdfChapterModule
    ],
    declarations: [PdfPreferencesComponent],
    exports: [PdfPreferencesComponent],
    providers: [CommonFileFTPService, VendorService, Helper, LookUpService, pdfPreferencesServices]
} )
export class pdfPreferenceModule { }
