import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import swal from 'sweetalert2';
import { FileUploader } from 'ng2-file-upload';
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { CodeValue, DynamicTemplateDto } from '../../../models/model';
import { MasterControlService } from '../../master-control/master-control.service';
import { Helper } from '../../../shared/helper';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicTemplateService } from '../dynamic-template.service';

const URL_For_Upload = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-add-dynamic-template',
  templateUrl: './add-dynamic-template.component.html',
  styleUrls: ['./add-dynamic-template.component.css','../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddDynamicTemplateComponent implements OnInit {
  spinnerFlag
  public editor;
  editorSwap:boolean = true;
  public uploader: FileUploader = new FileUploader({
    url: URL_For_Upload,
    isHTML5: true
});
dynamicTemplateModel: DynamicTemplateDto = new DynamicTemplateDto();
    dynamicMenu = new Array<CodeValue>();
    showButtonFlag: boolean = false;
    htmlContent: string = "";
    selectedFiles: any;
    currentFileUpload: any;
    public isFlag: boolean = false;
    receivedId: string;
    permissionId:any;


    public validationMessage: string = "";

  constructor(public router:Router,public helper:Helper,private route: ActivatedRoute,public lookUpService:LookUpService,public masterControlService:MasterControlService,public dynamicTemplateService:DynamicTemplateService) { }

  ngOnInit() {
    let codeValueMap = new CodeValue();
    codeValueMap.value = "Select";
    codeValueMap.code = "0";
    this.dynamicMenu.length =0;
    this.dynamicMenu.push(codeValueMap);
    this.lookUpService.getlookUpItemsBasedOnCategory("DynamicDocumentList").subscribe(result => {
      this.dynamicMenu.length =0;
      result.response.forEach(element => {
          let codeValueMap = new CodeValue();
          codeValueMap.value = element.value;
          codeValueMap.code = element.key;
         
          this.dynamicMenu.push(codeValueMap);
      });
  });
  this.receivedId = this.route.snapshot.params["id"];
  if ( !this.helper.isEmpty(this.receivedId) ) {

    this.showButtonFlag=true;
    this.dynamicTemplateModel.id = +this.receivedId;
    //this.dynamicMenuChanged(this.receivedId);
    this.dynamicTemplateService.loadDynamicTemplateDataBasedOnId(this.receivedId).subscribe(response => {
      this.dynamicTemplateModel=response.result;
      this.permissionId=response.result.permissionId;
      this.dynamicTemplateModel.updateFlag=true;
    });

  }
  }
  toggleEditordata() {
    if (this.editorSwap === true)
        this.editorSwap = false;
    else
        this.editorSwap = true;
}
onEditorBlured(quill) {
}

onEditorFocused(quill) {
}

onEditorCreated(quill) {
    this.editor = quill;
}

onContentChanged({ quill, html, text }) {
}

resetBulk() {
  this.validationMessage = "";
  this.uploader.queue = new Array();
}

extractURSFile(event) {
  this.validationMessage = "";
  this.selectedFiles = event.target.files[0];
  if (this.uploader.queue.length > 1) {
      this.uploader.queue = new Array(this.uploader.queue[1]);
  }
}

showCard() {
  this.showButtonFlag = true;
  let reset = new DynamicTemplateDto();
  this.dynamicTemplateModel = reset;

}

onUpdate(){
  this.dynamicTemplateModel.permissionId= this.permissionId;
  this.dynamicTemplateService.UpdateDynamicTemplateData(this.dynamicTemplateModel).subscribe(resp => {

    if (resp.result === "success") {           
      swal(
          'success',
          'Template updated successfully',
          'success'
      ).then(responseMsg => {
        let reset = new DynamicTemplateDto();
        this.dynamicTemplateModel = reset;
        this.router.navigate(['/dynamicTemplate/view-dynamicTemplate'])

      });
      
      this.lookUpService.getlookUpItemsBasedOnCategory("DynamicDocumentList").subscribe(result => {
          this.dynamicMenu.length =0;
          result.response.forEach(element => {
              let codeValueMap = new CodeValue();
              codeValueMap.value = element.value;
              codeValueMap.code = element.key;
              this.dynamicMenu.push(codeValueMap);
          });
      });
  }
  });
}

}
