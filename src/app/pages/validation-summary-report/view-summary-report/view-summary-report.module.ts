import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { ViewSummaryReportComponent } from "./view-summary-report.component";
import { HttpModule } from "@angular/http";
import { UiSwitchModule } from "ng2-ui-switch/dist";
import { TagInputModule } from "ngx-chips";
import { FormsModule } from "@angular/forms";
import { NgxDatatableModule } from '../../../../../node_modules/@swimlane/ngx-datatable';
import { SqueezeBoxModule } from 'squeezebox';
import { Helper } from "../../../shared/helper";
import { VsrService } from '../validation-summary.service';
import {QuillEditorModule} from 'ngx-quill-editor';
import { SharedCommonModule } from "../../../shared/SharedCommonModule";
export const ViewVsrRoutes: Routes=[
    {
path:'',
data: {
    status: true
},
component:ViewSummaryReportComponent
}
];

@NgModule({
 imports:[
     CommonModule,
     RouterModule.forChild(ViewVsrRoutes),
     SharedModule,
     HttpModule,
     UiSwitchModule,
     FormsModule,
     TagInputModule,
     QuillEditorModule,
     SharedCommonModule,
     NgxDatatableModule,
     SqueezeBoxModule
 ],
 declarations:[ViewSummaryReportComponent],
 providers:[Helper,VsrService]
})


export class ViewVsrModule{}