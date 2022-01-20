import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgDragDropModule } from 'ng-drag-drop';
import { SelectModule } from 'ng-select';
import { DndModule } from 'ng2-dnd';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { PdfPreferencesDefaultPdfComponent } from './pdf-preferences-default-pdf.component';
import { UiSwitchModule } from 'ng2-ui-switch';
import { ImportSettingModule } from '../import-setting/import-setting.module';

@NgModule({
  imports: [
    CommonModule,
    SharedCommonModule,
    SharedModule,
    SelectModule,
    UiSwitchModule,
    NgDragDropModule.forRoot(),
    DndModule.forRoot(),
    ImportSettingModule
  ],
  declarations: [PdfPreferencesDefaultPdfComponent],
  exports:[PdfPreferencesDefaultPdfComponent],
  providers:[]
})
export class PdfPreferencesDefaultPdfModule { }
