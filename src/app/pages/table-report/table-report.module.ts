import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableReportComponent } from './table-report.component';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { priorityService } from '../priority/priority.service';
import { SharedModule } from '../../shared/shared.module';
import { UrsService } from '../urs/urs.service';
import { CategoryService } from '../category/category.service';

@NgModule( {
    imports: [
        FormsModule,
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports:[TableReportComponent],
    declarations: [TableReportComponent],
    providers:[RiskAssessmentService,priorityService,UrsService,CategoryService]
} )

export class tableReportModule { }