import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { DynamicTemplateComponent } from './dynamic-template.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { DynamicTemplateService } from './dynamic-template.service';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { TreeModule } from 'angular-tree-component';
import { DocumentsignComponentModule } from '../documentsign/documentsign.module';
import { stepperProgressModule } from '../stepperprogress/stepperprogress.module';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { IndividualAuditModule } from '../individual-audit-trail/individual-audit-trail.module';
import { TaskCreationService } from '../task-creation/task-creation.service';
import { FormEsignVerificationModule } from '../form-esign-verification/form-esign-verification.module';
import { projectPlanService } from '../projectplan/projectplan.service';
import { SelectModule } from 'ng-select';
import { DraftPdfModule } from '../draft-pdf/draft-pdf.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
export const DynamicTemplateRoutes: Routes = [{
  path: '',
  component: DynamicTemplateComponent,
  data: {
    breadcrumb: 'Dms',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DynamicTemplateRoutes),
    SharedModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    TreeModule,
    DocumentsignComponentModule,
    stepperProgressModule,DraftPdfModule,
    DocumentForumModule,IndividualAuditModule,FormEsignVerificationModule,PdfViewerModule
  ],
  declarations: [DynamicTemplateComponent],
  providers : [DynamicTemplateService,Helper,ConfigService,TaskCreationService,projectPlanService,DatePipe]
})
export class DynamicTemplateModule { }
