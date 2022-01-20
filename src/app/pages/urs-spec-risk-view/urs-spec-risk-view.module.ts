import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { HttpModule } from '../../../../node_modules/@angular/http';
import { UrsSpecRiskViewComponent } from './urs-spec-risk-view.component';
import { Helper } from '../../shared/helper';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        HttpModule,
    ],
    exports: [UrsSpecRiskViewComponent],
    declarations: [UrsSpecRiskViewComponent],
    providers: [Helper]
})

export class UrsSpecRiskViewModule { }