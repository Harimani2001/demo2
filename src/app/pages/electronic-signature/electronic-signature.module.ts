
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ElectronicSignatureComponent } from './electronic-signature.component';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignaturePadModule } from 'angular2-signaturepad';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentForumModule } from '../document-forum/document-forum.module';
import { ElectronicSignatureService } from './electronic-signature.service';


export const ElectronicSignatureRoutes: Routes = [
    {
        path: '',
        component: ElectronicSignatureComponent,
        canActivate: [AuthGuardService],
    }
];

@NgModule( {
    imports: [
        FormsModule,
        RouterModule.forChild(ElectronicSignatureRoutes),
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [ElectronicSignatureComponent],
    providers:[]
} )

export class ElectronicSignatureModule { }