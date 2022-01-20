import { Component, OnInit, ViewChild, ViewEncapsulation, Injector } from '@angular/core';
import { Helper } from '../../../shared/helper';
import { ConfigService } from '../../../shared/config.service';
import { TemplateLibraryDTO, UserPrincipalDTO } from '../../../models/model';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterControlService } from '../../master-control/master-control.service';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { Permissions } from '../../../shared/config';
import { CommonFileFTPService } from '../../common-file-ftp.service';
import { TemplatelibraryService } from '../templatelibrary.service';
import { FileUploadForDocComponent } from '../../file-upload-for-doc/file-upload-for-doc.component';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./add-template.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})

export class AddTemplateComponent implements OnInit {
  @ViewChild('fileupload') private fileUploadForDocComponent: FileUploadForDocComponent;
  public inputField: any = []; 
  modelInput: TemplateLibraryDTO = new TemplateLibraryDTO();
  uploadSingleFile: any;
  permissionModel: Permissions = new Permissions(this.helper.TEMPLATE_LIBRARY_VALUE, false);
  spinnerFlag: boolean = false;
  fileValidationMessage: any = "";
  singleFileUploadFlag: boolean = false;
  singleImageUploadFlag: boolean = false;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  submitted: boolean = false;
  receivedId: string;
  dropdownSettings = {
    singleSelection: false,
    text: "Select",
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
  };
  projectTypeList: any;
  organizationlist: number[] = [];
  orgList: number[] = [];
  image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAQAAAGFCAYAAABqsyE1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAlqSURBVHhe7dgxAQAwEAOh+rcVYV8hx4AJ3rYDAAAAWoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIEgIAAAAQJAQAAAAgCAhAAAAAEFCAAAAAIKEAAAAAAQJAQAAAAgSAgAAABAkBAAAACBICAAAAECQEAAAAIAgIQAAAABBQgAAAACChAAAAAAECQEAAAAIEgIAAAAQJAQAAAAgSAgAAABAkBAAAACAICEAAAAAQUIAAAAAgoQAAAAABAkBAAAACBICAAAAECQEAAAAIGf3AdZHvfuTxzP1AAAAAElFTkSuQmCC";
  projectNameValidation: boolean = false;
  projectTypeValidation: boolean = false;
  organizationValidation: boolean = false;
  fileValidation: boolean = false;
  fileValidationMessage1: any;

  constructor(private adminComponent: AdminComponent, public templateService: TemplatelibraryService, public helper: Helper,
    public commonService: CommonFileFTPService, public router: ActivatedRoute, public masterControlService: MasterControlService,
    private configService: ConfigService, public routers: Router, private injector: Injector) {
    this.masterControlService.loadJsonOfDocumentIfActive(this.helper.TEMPLATE_LIBRARY_VALUE).subscribe(res => {
      if (res != null)
        this.inputField = JSON.parse(res.jsonStructure);
    });
  }

  ngOnInit() {
    setTimeout(() => {
      $('#projectName').focus();
    }, 200);
    this.modelInput.projectType = "Computer System Validation";
    this.templateService.getlookUpItemsBasedOnCategory("ProjectSetupType").subscribe(resp => {
      this.projectTypeList = resp.response;
    });
    this.templateService.loadOrganization().subscribe(response => {
      this.organizationlist = response.organizationList.map(option => ({ id: option.id, itemName: option.organizationName }));
    });
    this.configService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
    });
    this.receivedId = this.router.snapshot.params["id"];
    if (this.receivedId !== undefined) {
      if (this.receivedId) {
        this.modelInput.id = + this.receivedId;
      } else {
        this.modelInput.id = 0;
      }
      this.templateService.loadTemplateLibraryDetailsBasedOnId(this.receivedId).subscribe(response => {
        this.modelInput = response.data;
        if (this.modelInput.isActive == "Y") {
          this.modelInput.activeFlag = true;
        } else {
          this.modelInput.activeFlag = false;
        }
        this.fileUploadForDocComponent.loadFileListForEdit(this.receivedId, this.helper.TEMPLATE_LIBRARY_VALUE).then((result) => {});
      });
    }
    this.adminComponent.setUpModuleForHelpContent(this.helper.TEMPLATE_LIBRARY_VALUE);
    this.adminComponent.taskDocType = this.helper.TEMPLATE_LIBRARY_VALUE;
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEnbleFlag = true;
    this.configService.loadPermissionsBasedOnModule(this.helper.TEMPLATE_LIBRARY_VALUE).subscribe(resp => {
      this.permissionModel = resp;
    });
  }

  onFileUpload1(event) {
    this.fileValidationMessage = "";
    this.deletePDFView();
    if (event.target.files.length != 0) {
      let file = event.target.files[0];
      this.spinnerFlag = true;
      this.configService.checkIsValidFileSize(file.size).subscribe(fileRes => {
        if (fileRes) {
          let fileName = event.target.files[0].name;
          this.singleFileUploadFlag = true;
          if (fileName.toLocaleLowerCase().match('.xlx') || fileName.toLocaleLowerCase().match('.xls') || fileName.toLocaleLowerCase().match('.xlsx')) {
            let filePath = "IVAL/TemplateLibrary/" + this.modelInput.projectName + "/Attachments/";
            const formData: FormData = new FormData();
            formData.append('file', file, fileName);
            formData.append('filePath', filePath);
            formData.append('extension', fileName.split(".")[fileName.split(".").length - 1]);
            this.commonService.singleFileUpload(formData).subscribe(resp => {
              this.modelInput.attachmentPath = resp.path;
              this.modelInput.attachmentName = fileName;
              event.target.value = "";
              this.singleFileUploadFlag = false;
              this.spinnerFlag = false;
            }, error => {
              this.singleFileUploadFlag = false;
              this.spinnerFlag = false;
            })
          } else {
            this.spinnerFlag = false;
            this.singleFileUploadFlag = false;
            this.fileValidationMessage = "Upload .xlsx,.xlx file only";
          }
        } else {
          this.helper.fileSizeWarning();
          event.target.value = "";
          this.spinnerFlag = false;
        }
      })
    }
  }

  onImageUpload1(event) {
    this.fileValidationMessage1 = "";
    this.deletePDFView();
    if (event.target.files.length != 0) {
      let file = event.target.files[0];
      this.spinnerFlag = true;
      this.configService.checkIsValidFileSize(file.size).subscribe(fileRes => {
        if (fileRes) {
          let fileName = event.target.files[0].name;
          this.singleImageUploadFlag = true;
          if (fileName.toLocaleLowerCase().match('.jpeg') || fileName.toLocaleLowerCase().match('.png') || fileName.toLocaleLowerCase().match('.jpg')) {
            var myReader: FileReader = new FileReader();
            myReader.onloadend = (e) => {
              this.modelInput.bannerImage = myReader.result;
              this.modelInput.bannerName = fileName;
            }
            myReader.readAsDataURL(file);
            this.spinnerFlag = false;
          } else {
            this.spinnerFlag = false;
            this.singleImageUploadFlag = false;
            this.fileValidationMessage1 = "Upload .png,.jpeg file only";
          }
        } else {
          this.helper.fileSizeWarning();
          event.target.value = "";
          this.spinnerFlag = false;
        }
      })
    }
  }

  toogleFunc() {
    if (this.modelInput.activeFlag == true) {
      return "Y"
    }
    else {
      return "N"
    }
  }

  openSuccessUpdateSwal() {
    this.projectNameValidation = false;
    this.projectTypeValidation = false;
    this.organizationValidation = false;
    this.fileValidation = false;
    this.modelInput.isActive = this.toogleFunc();
    if (this.modelInput.projectName != '') {
      if (this.modelInput.projectType != undefined) {
        if (this.modelInput.orgsInfo != undefined) {
          if (this.modelInput.attachmentName != '') {
            if (this.modelInput.bannerName == "") {
              this.modelInput.bannerName = "Default_Image.jpg";
              this.modelInput.bannerImage = this.image;
            }
            for (let i = 0; i < this.modelInput.orgsInfo.length; i++) {
              let id = this.modelInput.orgsInfo[i].id;
              this.orgList.push(id);
              if (i == this.modelInput.orgsInfo.length - 1) {
                this.modelInput.orgsList = this.orgList;
                this.onUpdate();
              }
            }
          } else {
            this.fileValidation = true;
          }
        } else {
          this.organizationValidation = true;
        }
      } else {
        this.projectTypeValidation = true;
      }
    } else {
      this.projectNameValidation = true;
    }
  }

  onUpdate() {
    this.spinnerFlag = true;
    this.templateService.updateTemplateLibrary(this.modelInput).subscribe(result => {
      if (result) {
        let responseMsg = result;
        if(result.id != 0)
          this.fileUploadForDocComponent.uploadFileList(responseMsg, this.helper.TEMPLATE_LIBRARY_VALUE).then((res) => {
            swal({
              title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
              text: 'Template library Updated Successfully',
              onClose: () => {
                this.routers.navigate(["templatelibrary/view-template"]);
              }
            });
          });
        this.spinnerFlag = false;
      }
    }, err => {
      this.spinnerFlag = false;
    });
  }

  onSave() {
    this.projectNameValidation = false;
    this.projectTypeValidation = false;
    this.organizationValidation = false;
    this.fileValidation = false;
    this.modelInput.isActive = this.toogleFunc();
    if (this.modelInput.projectName != '') {
      if (this.modelInput.projectType != undefined) {
        if (this.modelInput.orgsInfo != undefined) {
          if (this.modelInput.attachmentName != '') {
            if (this.modelInput.bannerName == "") {
              this.modelInput.bannerName = "Default_Image.jpg";
              this.modelInput.bannerImage = this.image;
            }
            for (let i = 0; i < this.modelInput.orgsInfo.length; i++) {
              let id = this.modelInput.orgsInfo[i].id;
              this.orgList.push(id);
              if (i == this.modelInput.orgsInfo.length - 1) {
                this.modelInput.orgsList = this.orgList;
                this.saveAndGoto();
              }
            }
          } else {
            this.fileValidation = true;
          }
        } else {
          this.organizationValidation = true;
        }
      } else {
        this.projectTypeValidation = true;
      }
    } else {
      this.projectNameValidation = true;
    }
  }

  saveAndGoto() {
    this.spinnerFlag = true;
    this.templateService.saveTemplateLibrary(this.modelInput).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp) {
        if (!this.receivedId) {
          let responseMsg = resp;
          this.fileUploadForDocComponent.uploadFileList(responseMsg, this.helper.TEMPLATE_LIBRARY_VALUE).then((result) => {
            swal({
              title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
              text: 'Template Library Saved Successfully',
              onClose: () => {
                this.spinnerFlag = false;
                this.routers.navigate(["templatelibrary/view-template"]);
              }
            });
          });
        } else {
          let responseMsg = resp;
          this.fileUploadForDocComponent.uploadFileList(responseMsg, this.helper.TEMPLATE_LIBRARY_VALUE).then((result) => {
            swal({
              title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
              text: 'Template library Updated Successfully',
              onClose: () => {
                this.routers.navigate(["templatelibrary/view-template"]);
              }
            });
          });
        }
      } else {
        swal({
          title: 'Warning', type: 'warning', timer: this.helper.swalTimer, showConfirmButton: false,
          text: resp.result,
        }
        );
      }
    }, err => {
      this.spinnerFlag = false;
    });
  }

  onClickClose() {
    this.routers.navigate(["templatelibrary/view-template"]);
  }

  deleteUploadedFile(data) {
    data.attachmentPath = "";
    data.attachmentName = "";
    this.deletePDFView();
  }

  deleteUploadedImage(data) {
    data.bannertPath = "";
    data.bannerName = "";
    this.deletePDFView();
  }

  deletePDFView() {
    if (document.getElementById("fileUploadIdTemplate")) {
      document.getElementById("fileUploadIdTemplate").remove();
      document.getElementById("fileMainUploadId").setAttribute("class", "form-group row");
    }
  }

  onCloseData() {
    this.adminComponent.taskDocType = this.helper.TEMPLATE_VALUE;
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
  }

  downloadFileOrView(input) {
    if (this.permissionModel.exportButtonFlag) {
      let filePath = input.attachmentPath;
      let fileName = input.attachmentName;
      var admin = this.injector.get(AdminComponent);
      admin.downloadOrViewFile(fileName, filePath, false);
    }
  }

  createIFrame(blob_url, fileName) {
    this.spinnerFlag = true;
    var iframe;
    var elementExists = document.getElementById('fileUploadIdTemplate');
    if (elementExists)
      elementExists.remove();
    var mainDiv = document.createElement('div');
    mainDiv.setAttribute('id', 'fileUploadIdTemplate');
    mainDiv.setAttribute('class', 'well well-lg form-group');
    var strong = document.createElement('strong')
    strong.innerHTML = fileName;
    mainDiv.appendChild(strong);
    var button = document.createElement('button');
    button.setAttribute('class', 'btn btn-outline-danger btn-danger btn-round');
    button.setAttribute('style', 'float:right;');
    button.innerHTML = "Close";
    button.addEventListener('click', function (event) {
      if (document.getElementById('fileUploadIdTemplate')) {
        document.getElementById('fileUploadIdTemplate').remove();
        document.getElementById("#" + 'fileUploadIdTemplate').setAttribute("class", "");
      }
    });
    iframe = document.createElement('iframe');
    iframe.setAttribute('height', (window.innerHeight + 500) + 'px');
    iframe.setAttribute('width', (window.innerWidth - 500) + 'px');
    iframe.src = blob_url;
    mainDiv.appendChild(button);
    mainDiv.appendChild(document.createElement('br'));
    mainDiv.appendChild(iframe);
    let find = document.querySelector('#fileMainUploadId');
    find.appendChild(mainDiv);
    this.spinnerFlag = false;
  }

  sampleTemplateLibDownload() {
    this.spinnerFlag = true;
    this.templateService.downloadSampleTemplateLibFile().subscribe(res => {
      this.spinnerFlag = false;
      var blob: Blob = this.helper.b64toBlob(res.body, 'application/xls');
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, 'SampleTemplateLibrary.xls');
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'SampleTemplateLibrary.xls';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }, err => {
      this.spinnerFlag = false;
    });
  }

}