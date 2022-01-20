import { stepperProgressModule } from './../../stepperprogress/stepperprogress.module';
import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ng2-ui-switch/dist';
import { TagInputModule } from 'ngx-chips';
import { Helper } from '../../../shared/helper';
import { HttpModule } from '@angular/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SqueezeBoxModule } from 'squeezebox';
import { FileUploadModule } from "ng2-file-upload";
import { ViewDiscrepancyFormComponent } from './view-discrepancy-form.component';
import { DiscrepancyFormRoutesService } from '../discrepancy-form.service';
import {ImageviewModule} from '../../imageview/imageview.module';
import {VideoViewerModule} from '../../video-viewer/video-viewer.module';
import { FileUploadForDocService } from '../../file-upload-for-doc/file-upload-for-doc.service';
import { SharedCommonModule } from '../../../shared/SharedCommonModule';
import { ViewTestcaseFileListModule } from '../../view-testcase-file-list/view-testcase-file-list.module';
import { AuditTrailViewModule } from '../../audit-trail-view/audit-trail-view.module';
import { IndividualAuditModule } from '../../individual-audit-trail/individual-audit-trail.module';
import { IndividualDocumentWorkflowModule } from '../../individual-document-workflow/individual-document-workflow.module';
import { DraftPdfModule } from '../../draft-pdf/draft-pdf.module';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ChartsModule } from 'ng2-charts';
import { ExpansionPanelsModule } from 'ng2-expansion-panels';
export const ViewDFRoutes: Routes = [
    {
        path: '',
        component: ViewDiscrepancyFormComponent
    }
];
@NgModule( {
    imports: [
        CommonModule,
        RouterModule.forChild( ViewDFRoutes ),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        UiSwitchModule,
        TagInputModule,
        HttpModule,
        NgxDatatableModule,
        SqueezeBoxModule,
        FileUploadModule,
        ImageviewModule,
        VideoViewerModule,
        SharedCommonModule,
        stepperProgressModule,DraftPdfModule,
        ViewTestcaseFileListModule,AuditTrailViewModule,IndividualAuditModule,IndividualDocumentWorkflowModule,
        ChartsModule,Ng2GoogleChartsModule,ExpansionPanelsModule
    ],
    declarations: [ViewDiscrepancyFormComponent],
    providers: [Helper, DiscrepancyFormRoutesService,FileUploadForDocService]
} )
export class ViewDFModule { }
