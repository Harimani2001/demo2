import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { SelectModule } from '../../../../node_modules/ng-select';
import { TableOfContentComponent } from './table-of-content.component';
import { pdfPreferencesServices } from '../pdf-preferences/pdfPreferences.services';
import { PdfChapterModule } from '../pdf-chapter/pdf-chapter.module';
import { PdfPreferencesDefaultPdfModule } from '../pdf-preferences-default-pdf/pdf-preferences-default-pdf.module';
import { FormEsignVerificationModule } from '../form-esign-verification/form-esign-verification.module';
import { IndividualDocumentForumModule } from '../individual-document-forum/individual-document-forum.module';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ImportChapterModule } from '../import-chapter/import-chapter.module';

export const TableOfContentRoutes: Routes = [{
  path: '',
  component: TableOfContentComponent,
  canActivate: [AuthGuardService],
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TableOfContentRoutes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SharedCommonModule,
    SelectModule,
    PdfChapterModule,
    PdfPreferencesDefaultPdfModule,
    FormEsignVerificationModule, IndividualDocumentForumModule,ImportChapterModule
  ],
  declarations: [TableOfContentComponent],
  providers: [Helper, ConfigService, pdfPreferencesServices]
})

export class TableOfContentModule { }