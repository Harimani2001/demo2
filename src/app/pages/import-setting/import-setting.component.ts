import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ConfigService } from '../../shared/config.service';
import { AdminComponent } from './../../layout/admin/admin.component';
import { ModalBasicComponent } from './../../shared/modal-basic/modal-basic.component';
@Component({
  selector: 'app-import-setting',
  templateUrl: './import-setting.component.html',
  styleUrls: ['./import-setting.component.css']
})
export class ImportSettingComponent implements OnInit {
  @ViewChild('cloningConfig') cloningConfig:ModalBasicComponent;
  projectWithPDFSetting:any[]=new Array();
  projectId:any[]=new Array();
  documentListForConfig:any[]=new Array();
  dropdownSettings = {
    singleSelection: true,
    text: "Select Project",
    enableSearchFilter: true,
    classes: "myclass custom-class",
};
  toConeProjectId;
  constructor(private adminComponent: AdminComponent,public config: ConfigService) { }

  ngOnInit(): void {
  }

  cloneSetting(projectId?) {
    this.toConeProjectId=projectId;
    this.adminComponent.spinnerFlag = true;
    this.projectWithPDFSetting = new Array();
    this.projectId= new Array();
    this.documentListForConfig = new Array();
    this.config.HTTPPostAPI(projectId?projectId:0, 'pdfSetting/loadProjectHavingDefaultPdfSetting').subscribe(resp => {
      this.projectWithPDFSetting = resp;
      this.adminComponent.spinnerFlag = false;
      this.cloningConfig.show();
    }, err => {
      this.adminComponent.spinnerFlag = false;
    });
  }

  


  loadDocument() {
    this.cloningConfig.spinnerShow();
    this.documentListForConfig = new Array();
    if(this.projectId.length>0){
    this.config.HTTPPostAPI({'projectIdSeleted':this.projectId[0].id,'projectIdToConfig':this.toConeProjectId}, 'pdfSetting/loadDocumentForCloningConfig').subscribe(resp => {
      this.documentListForConfig = resp;
      this.cloningConfig.spinnerHide();
    }, err => {
      this.cloningConfig.spinnerHide();
    });
  }
  }

  applyClone() {
    var obj = this
    swal({
      title: 'Are you sure?', text: 'You wont be able to revert', type: 'warning',
      showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, apply it!', cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10', cancelButtonClass: 'btn btn-danger', allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      obj.applyCloneToDocument(obj.documentListForConfig);
    });
  }

  applyCloneToDocument(list) {
    this.cloningConfig.spinnerShow();
    this.config.HTTPPostAPI({list: list ,projectId:this.toConeProjectId}, 'pdfSetting/applyCloneToDocumentPdfConfig').subscribe(resp => {
      this.cloningConfig.spinnerHide();
      if (resp.result) {
        this.cloningConfig.hide(); 
        swal({
          title: 'Cloned Successfully!',
          text: '',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        swal({
          title: 'Error',
          text: 'oops something went wrong',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      }
    },e=>{
      this.cloningConfig.spinnerHide();
    });
  }
}
