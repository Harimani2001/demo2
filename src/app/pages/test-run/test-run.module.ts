import { IndividualDocumentWorkflowModule } from './../individual-document-workflow/individual-document-workflow.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { FormWizardModule } from 'angular2-wizard';
import { MyDatePickerModule } from 'mydatepicker/dist';
import { NgDragDropModule } from 'ng-drag-drop';
import { CKEditorModule } from 'ng2-ckeditor';
import { DndModule } from 'ng2-dnd';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SqueezeBoxModule } from 'squeezebox';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { IndividualDocumentForumModule } from './../individual-document-forum/individual-document-forum.module';
import { PDFViewerModule } from './../pdf-viewer/pdf-viewer.module';
import { stepperProgressModule } from './../stepperprogress/stepperprogress.module';
import { TestRunComponent } from './test-run.component';

 

@NgModule({
  declarations: [TestRunComponent],
  imports: [
    SharedCommonModule,
    NgxDatatableModule,
    SharedModule,
    FormsModule,ReactiveFormsModule,
    NgxDatatableModule,
    CKEditorModule,
    UiSwitchModule,
    MyDatePickerModule,
    AngularMultiSelectModule,
    FormWizardModule,
    SqueezeBoxModule,
    NgDragDropModule.forRoot(),
    DndModule.forRoot(),
    stepperProgressModule,
    PDFViewerModule,
    IndividualDocumentForumModule,
     IndividualDocumentWorkflowModule
  ],
  exports: [TestRunComponent],
  providers: [Helper]
})
export class TestRunModule {}
