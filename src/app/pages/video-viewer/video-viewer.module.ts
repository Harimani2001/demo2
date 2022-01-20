import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { VideoViewerComponent } from './video-viewer.component';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '../../../../node_modules/@angular/http';

@NgModule( {
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        HttpModule,
    ],
    exports:[VideoViewerComponent],
    declarations: [VideoViewerComponent],
    providers: [Helper]
} )

export class VideoViewerModule{}