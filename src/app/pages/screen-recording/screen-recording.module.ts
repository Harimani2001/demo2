import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { ScreenRecordingComponent } from './screen-recording.component';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '../../../../node_modules/@angular/http';
import { DocStatusService } from '../document-status/document-status.service';
import {IQTCService } from '../iqtc/iqtc.service';
import {ConfigService} from '../../shared/config.service';

@NgModule( {
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        HttpModule,
    ],
    exports:[],
    declarations: [],
    providers: [Helper,DocStatusService,IQTCService,ConfigService]
} )

export class ScreenRecordingModule{}