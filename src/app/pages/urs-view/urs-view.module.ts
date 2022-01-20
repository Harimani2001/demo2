import {AuthGuardService} from '../../layout/auth/AuthGuardService';
import { UrsViewComponent } from './urs-view.component';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { HttpModule } from '../../../../node_modules/@angular/http';

@NgModule( {
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        HttpModule,
    ],
    exports:[UrsViewComponent],
    declarations: [UrsViewComponent],
    providers: []
} )

export class UrsViewModule{}