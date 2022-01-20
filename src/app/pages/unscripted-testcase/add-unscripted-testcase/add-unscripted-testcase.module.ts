import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { Helper } from '../../../shared/helper';
import { HttpModule } from '@angular/http';
import {UrsService} from '../../urs/urs.service';
import { SelectModule } from 'ng-select';
import { FileUploadModule } from 'ng2-file-upload';
import {QuillEditorModule} from 'ngx-quill-editor';
import { SharedCommonModule} from './../../../shared/SharedCommonModule';
import { FormWizardModule } from 'angular2-wizard';
import { MasterControlService } from '../../master-control/master-control.service';
import { FileUploadForDocService } from '../../file-upload-for-doc/file-upload-for-doc.service';
import { UrsViewModule } from '../../urs-view/urs-view.module';
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { AddUnscriptedComponent } from './add-unscripted-testcase.component';
import { UnscriptedService } from '../unscripted-testcase.service';
import { SpecificationMasterService } from '../../specification-master/specification-master.service';
import { RiskAssessmentService } from '../../risk-assessment/risk-assessment.service';
import { IQTCService } from '../../iqtc/iqtc.service';
import { UrlchecklistModule } from '../../urlchecklist/urlchecklist.module';
import { UrsSpecRiskViewModule } from '../../urs-spec-risk-view/urs-spec-risk-view.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgDragDropModule } from 'ng-drag-drop';
import { DndModule } from 'ng2-dnd';

export const addUnscriptedRoutes: Routes = [
    {
        path: '',
        component: AddUnscriptedComponent
        
    }
];

@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( addUnscriptedRoutes ),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        UiSwitchModule,
        TagInputModule,
        HttpModule,
        SelectModule,FileUploadModule,
        QuillEditorModule,
        SharedCommonModule,
        FormWizardModule,UrsViewModule,UrlchecklistModule,UrsSpecRiskViewModule,
        NgxDatatableModule,
    UiSwitchModule,
    QuillEditorModule,
    NgDragDropModule.forRoot(),
    DndModule.forRoot(),
    UrlchecklistModule,
    UrsSpecRiskViewModule
    ],
    declarations: [AddUnscriptedComponent],
    providers: [Helper, UrsService,SpecificationMasterService,
        MasterControlService,UnscriptedService, DatePipe, FileUploadForDocService, LookUpService,RiskAssessmentService,IQTCService]
})
export class AddUnscriptedModule { }
