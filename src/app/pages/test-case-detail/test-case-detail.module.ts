import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FileUploadModule } from 'ng2-file-upload';
import { SqueezeBoxModule } from 'squeezebox';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { UrsSpecRiskViewModule } from '../urs-spec-risk-view/urs-spec-risk-view.module';
import { UrsService } from '../urs/urs.service';
import { SharedModule } from './../../shared/shared.module';
import { DocumentForumModule } from './../document-forum/document-forum.module';
import { DocumentStatusCommentLog } from './../document-status-comment-log/document-status-comment-log.module';
import { DocumentsignComponentModule } from './../documentsign/documentsign.module';
import { IndividualAuditModule } from './../individual-audit-trail/individual-audit-trail.module';
import { IQTCService } from './../iqtc/iqtc.service';
import { stepperProgressModule } from './../stepperprogress/stepperprogress.module';
import { UrsViewModule } from './../urs-view/urs-view.module';
import { TestCaseDetailComponent } from './test-case-detail.component';

@NgModule({
  declarations: [TestCaseDetailComponent],
  imports: [
    RouterModule,
    SharedCommonModule,
    SharedModule,
    SqueezeBoxModule,
    FileUploadModule,
    DocumentsignComponentModule,
    stepperProgressModule,
    DocumentForumModule,
    DocumentStatusCommentLog,
    UrsViewModule,
    IndividualAuditModule,
    UrsSpecRiskViewModule
  ],
  exports: [TestCaseDetailComponent],
  providers: [IQTCService, UrsService]
})
export class TestCaseDetailModule { }
