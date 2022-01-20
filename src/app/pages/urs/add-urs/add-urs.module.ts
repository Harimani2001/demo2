import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { SharedModule } from "../../../shared/shared.module";
import { AddUrsComponent } from "./add-urs.component";
import { HttpModule } from "@angular/http";
import { UiSwitchModule } from "ng2-ui-switch/dist";
import { TagInputModule } from "ngx-chips";
import { FormsModule } from "@angular/forms";
import { Helper } from "../../../shared/helper";
import { UrsService } from '../urs.service';
import {QuillEditorModule} from 'ngx-quill-editor';
import { SharedCommonModule } from "../../../shared/SharedCommonModule";
import { MasterControlService } from "../../master-control/master-control.service";
import { FileUploadForDocService } from "../../file-upload-for-doc/file-upload-for-doc.service";
export const addUrsRoutes: Routes=[
    {
path:'',
data: {
    status: true
},
component:AddUrsComponent
}
];

@NgModule({
 imports:[
     CommonModule,
     RouterModule.forChild(addUrsRoutes),
     SharedModule,
     HttpModule,
     UiSwitchModule,
     FormsModule,
     TagInputModule,
     QuillEditorModule,
     SharedCommonModule,
 ],
 declarations:[],
 providers:[Helper,UrsService,MasterControlService,DatePipe,FileUploadForDocService]
})


export class AddUrsModule{}