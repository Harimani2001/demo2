import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EsignService } from '../esign.service';
import { Helper } from '../../../shared/helper';
import { ConfigService } from '../../../shared/config.service';
import { VendorValidationDTO, UserPrincipalDTO } from '../../../models/model';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterControlService } from '../../master-control/master-control.service';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { Permissions } from '../../../shared/config';
import { CommonFileFTPService } from '../../common-file-ftp.service';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./add-document.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})

export class AddDocumentComponent implements OnInit {

  model: VendorValidationDTO = new VendorValidationDTO();
  uploadSingleFile: any;
  permissionModel: Permissions = new Permissions(this.helper.E_SIGNATURE_VALUE, false);
  spinnerFlag: boolean = false;
  fileValidationMessage: any = "";
  singleFileUploadFlag: boolean = false;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  submitted: boolean = false;
  receivedId: string;

  constructor(private adminComponent: AdminComponent, public esignService: EsignService, public helper: Helper,
    public commonService: CommonFileFTPService, public router: ActivatedRoute, public masterControlService: MasterControlService,
    private configService: ConfigService, public routers: Router) {
  }

  ngOnInit() {
    this.configService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
    });
    this.receivedId = this.router.snapshot.params["id"];
    if (this.receivedId !== undefined) {
      this.esignService.loadVendorValidationDetailsBasedOnId(this.receivedId).subscribe(response => {
        if (response.result.id != null)
          this.model = response.result;
      });
    }
    this.adminComponent.setUpModuleForHelpContent(this.helper.E_SIGNATURE_VALUE);
    this.adminComponent.taskDocType = this.helper.E_SIGNATURE_VALUE;
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEnbleFlag = true;
    this.configService.loadPermissionsBasedOnModule(this.helper.E_SIGNATURE_VALUE).subscribe(resp => {
      this.permissionModel = resp
    });
    setTimeout(() => {
      $('#documentName').focus();
    }, 600);
  }

  openSuccessUpdateSwal(formIsValid) {
    if (formIsValid) {
      swal({
        title: "Write your comments here:",
        input: 'textarea',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Update',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
      })
        .then((value) => {
          if (value) {
            let userRemarks = "Comments : " + value;
            this.saveAndGoto(formIsValid, userRemarks);
          } else {
            swal({
              title: '',
              text: 'Comments is requried',
              type: 'info',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            });
          }
        });
    }
  }

  saveAndGoto(formIsValid, userRemarks?) {
    this.spinnerFlag = true;
    if (!formIsValid) {
      this.submitted = true;
      this.spinnerFlag = false;
      return;
    }
    else {
      if (this.receivedId) {
        this.model.id = +this.receivedId;
      } else {
        this.model.id = 0;
      }
      this.model.userRemarks = userRemarks;
      this.esignService.saveVendorValidation(this.model).subscribe(result => {
        this.submitted = false;
        this.spinnerFlag = false;
        if (result.success) {
          if (!this.receivedId) {
            swal({
              title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
              text: 'E-sign Documents Saved Successfully',
              onClose: () => {
                this.spinnerFlag = true;
                this.routers.navigate(["esign/view-esign"], {
                  queryParams: { documentId: result.id }
               });
                this.spinnerFlag = false;
              }
            });
          } else {
            swal({
              title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
              text: 'E-sign Documents Updated Successfully',
              onClose: () => {
                this.routers.navigate(["esign/view-esign"], {
                  queryParams: { documentId: result.id }
                });
              }
            });
          }
        } else {
          swal({
            title: 'Warning', type: 'warning', timer: this.helper.swalTimer, showConfirmButton: false,
            text: result.result,
          }
          );
        }
      }, err => {
        this.submitted = false;
        this.spinnerFlag = false;
      });
    }
  }

  
  onClickClose() {
    this.routers.navigate(["esign/view-esign"]);
  }

  deleteUploadedFile(data) {
    data.filePath = "";
    data.fileName = "";
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

  onSingleFileUpload(event) {
    this.fileValidationMessage = "";
    this.deletePDFView();
    if (event.target.files.length != 0) {
      let file = event.target.files[0];
      this.spinnerFlag = true;
      this.configService.checkIsValidFileSize(file.size).subscribe(fileRes => {
        if (fileRes) {
          let fileName = event.target.files[0].name;
          this.singleFileUploadFlag = true;
          if (fileName.toLocaleLowerCase().match('.docx') || fileName.toLocaleLowerCase().match('.pdf')) {
            let filePath = "IVAL/" + this.currentUser.orgId + "/ESign/" + this.currentUser.id + "/Attachments/";
            const formData: FormData = new FormData();
            formData.append('file', file, fileName);
            formData.append('filePath', filePath);
            formData.append('extension', fileName.split(".")[fileName.split(".").length - 1]);
            this.commonService.singleFileUpload(formData).subscribe(resp => {
              this.model.filePath = resp.path;
              this.model.fileName = fileName;
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
            this.fileValidationMessage = "Upload .pdf,.doc,.docx file only";
          }
        } else {
          this.helper.fileSizeWarning();
          event.target.value = "";
          this.spinnerFlag = false;
        }
      })
    }
  }

  downloadFileOrView(input, viewFlag) {
    if (this.permissionModel.exportButtonFlag || viewFlag) {
      this.spinnerFlag = true;
      let filePath = input.filePath;
      let fileName = input.fileName;
      this.commonService.loadFile(filePath).subscribe(resp => {
        let contentType = this.commonService.getContentType(fileName.split(".")[fileName.split(".").length - 1]);
        var blob: Blob = new Blob([resp], { type: contentType });
        if (viewFlag) {
          if (!contentType.match(".pdf")) {
            this.commonService.convertFileToPDF(blob, fileName).then((respBlob) => {
              this.createIFrame(URL.createObjectURL(respBlob), input.fileName);
              this.spinnerFlag = false;
            });
          } else {
            this.createIFrame(URL.createObjectURL(blob), input.fileName);
            this.spinnerFlag = false;
          }
        } else {
          this.commonService.downloadFileAudit(fileName,
            input.templateName, "138", ("TEMPLATE-00" + input.id)).subscribe(resp => {
            });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
          this.spinnerFlag = false;
        }
      })
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
}
