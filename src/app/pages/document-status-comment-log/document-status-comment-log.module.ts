import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { DocumentStatusCommentLogComponent } from './document-status-comment-log.component';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '../../../../node_modules/@swimlane/ngx-datatable';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '../../../../node_modules/@angular/http';
import { DocStatusService } from '../document-status/document-status.service';
import { SqueezeBoxModule } from 'squeezebox';
 
@NgModule( {
    imports: [
        CommonModule,
        SharedModule,
        NgxDatatableModule,
        FormsModule,
        HttpModule,
        SqueezeBoxModule
    ],
    exports:[DocumentStatusCommentLogComponent],
    declarations: [DocumentStatusCommentLogComponent],
    providers: [Helper,DocStatusService]
} )

export class DocumentStatusCommentLog{}