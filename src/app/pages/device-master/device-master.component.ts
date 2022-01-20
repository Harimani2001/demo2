import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IOption } from 'ng-select';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DeviceMaster, UserPrincipalDTO } from '../../models/model';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Helper } from '../../shared/helper';
import { Permissions } from '../../shared/config';
import { NgbDateISOParserFormatter } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import { DeviceMasterService } from './device-master.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import swal from 'sweetalert2';
import { VendorService } from '../vendor/vendor.service';
import { flatMap } from 'rxjs/operators';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { ConfigService } from '../../shared/config.service';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-device-master',
  templateUrl: './device-master.component.html',
  styleUrls: ['./device-master.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class DeviceMasterComponent implements OnInit {
  public deviceMasterForm: FormGroup;
  data: any;
  modal: DeviceMaster = new DeviceMaster();
  public rowsOnPage = 10;
  public filterQuery = '';
  spinnerFlag = false;
  iscreate: boolean = false;
  isUpdate: boolean = false;
  isSave: boolean = false;
  public today: NgbDateStruct;
  public validDate: NgbDateStruct;
  equipment: Array<IOption> = new Array<IOption>();
  deviceType: any;
  formsList: Array<IOption> = new Array<IOption>();
  permissionsfromlocalstorage: any;
  permissionModal: Permissions = new Permissions("176", false);
  public validationMessage: string = "";
  fileList: any;
  excelData: any;
  correctFile = false;
  isUploaded: boolean = false;
  operatingSysytem: any;
  selecetdFile: File;
  file: any;
  newFile = false;
  updateFlag = false;
  fileName = "";
  fileUrl: boolean = false;
  pdfSrc: any;
  fileExist: boolean = false;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  submitted: boolean = false;
  validation_messages = {
    'deviceMCID': [
      { type: 'required', message: 'Device MAC Id is Required' },
    ],
    'ipAddress': [
      { type: 'required', message: 'Device-IP Address is Required' },
    ],
    'deviceOS': [
      { type: 'required', message: 'Operating System is Required' },
    ],
    'deviceType': [
      { type: 'required', message: 'Type is Required' },
    ]
  }
  pattern = "d-m-Y";
  datePipeFormat = 'yyyy-MM-dd';
  @ViewChild('myTable') table: any;
  @ViewChild('fileuploaddiv')myInputVariable: ElementRef;
  constructor(public configService: ConfigService, public vendorService: VendorService,
    private commonService: CommonFileFTPService, public lookUpService: LookUpService,
    private service: DeviceMasterService, private comp: AdminComponent, public fb: FormBuilder,
    public helper: Helper, private servie: DateFormatSettingsService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.loadOrgDateFormat();
    this.loadOrgDateFormatAndTime();
    this.configService.loadCurrentUserDetails().subscribe(response => {
      this.currentUser = response;
      this.getDeviceTypes();
      this.loadAll();
      this.configService.loadPermissionsBasedOnModule("176").subscribe(resp => {
        this.permissionModal = resp
      });
    });
    let now = new Date();
    let tempData = new NgbDateISOParserFormatter;
    this.today = tempData.parse(now.toISOString());
    this.comp.setUpModuleForHelpContent("176");
    this.deviceMasterForm = this.fb.group({
      deviceMCID: ['', Validators.compose([
        Validators.required
      ])],
      asstId: [''],
      ipAddress: ['', Validators.compose([
        Validators.required
      ])],
      purchaseDate: [],
      activeflag: [],
      deviceOS: ['', Validators.compose([
        Validators.required
      ])],
      deviceType: ['', Validators.compose([
        Validators.required
      ])],
    });
  }

  getDeviceTypes() {
    this.spinnerFlag = true
    this.lookUpService.getlookUpItemsBasedOnCategory("deviceMaster").subscribe(response => {
      this.spinnerFlag = false
      if (response.result == "success") {
        this.deviceType = response.response
        this.getDeviceOS();
      }
    }, error => { this.spinnerFlag = false });
  }

  getDeviceOS() {
    this.spinnerFlag = true
    this.lookUpService.getlookUpItemsBasedOnCategory("operatingSystem").subscribe(response => {
      this.spinnerFlag = false
      if (response.result == "success") {
        this.operatingSysytem = response.response
      }
    }, error => { this.spinnerFlag = false });
  }

  editBatch(data: DeviceMaster) {
    this.iscreate = true;
    this.isSave = false;
    this.isUpdate = true;
    this.modal = data;
    this.deviceMasterForm.get("asstId").setValue(this.modal.assetId);
    this.deviceMasterForm.get("deviceType").setValue(this.modal.type);
    this.deviceMasterForm.get("ipAddress").setValue(this.modal.deviceIPaddress);
    this.deviceMasterForm.get("deviceMCID").setValue(this.modal.deviceMCid);
    this.deviceMasterForm.get("deviceOS").setValue(this.modal.deviceOS);
    if (!this.helper.isEmpty(this.modal.purchaseDate)) 
      this.deviceMasterForm.get("purchaseDate").setValue(this.modal.purchaseDate);
    else
      this.deviceMasterForm.get("purchaseDate").setValue(null);
    this.deviceMasterForm.get("activeflag").setValue(this.modal.activeFlage);
    this.fileExist = true;
  }

  populateDate(date: any): any {
    let result;
    if (!this.helper.isEmpty(date)) {
      let tempData = new NgbDateISOParserFormatter;
      let dateString = date.split("-");
      let validDate = new Date();
      validDate.setFullYear(dateString[0]);
      validDate.setMonth(dateString[1] - 1);
      validDate.setDate(dateString[2]);
      result = tempData.parse(validDate.toISOString());
    } else {
      result = "";
    }
    return result;
  }

  onClickSave() {
    this.submitted = true;
    if (this.deviceMasterForm.valid) {
      this.submitted = false;
      this.spinnerFlag = true;
      this.modal.type = this.deviceMasterForm.get("deviceType").value;
      this.modal.assetId = this.deviceMasterForm.get("asstId").value;
      this.modal.deviceIPaddress = this.deviceMasterForm.get("ipAddress").value;
      this.modal.deviceMCid = this.deviceMasterForm.get("deviceMCID").value;
      this.modal.deviceOS = this.deviceMasterForm.get("deviceOS").value;
      this.modal.purchaseDate = this.datePipe.transform(new Date(this.deviceMasterForm.get("purchaseDate").value), 'yyyy-MM-dd hh:mm:ss');
      this.modal.userId = this.currentUser.id;
      this.modal.orgId = this.currentUser.orgId;
      this.modal.activeFlage = this.deviceMasterForm.get("activeflag").value;
      let formData: FormData = new FormData();
      if (this.fileName != "") {
        this.modal.fileName = this.fileName;
        formData.append('file', this.file, this.file.name);
      }
      formData.append('deviceMasterDto', JSON.stringify(this.modal));
      let headers = new Headers();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"))
      if (this.fileName != "") {
        this.service.saveDevicDetails(formData, headers).subscribe(jsonResp => {
          this.spinnerFlag = false;
          let responseMsg: string = jsonResp.result;
          let timerInterval
          if (responseMsg === "success") {
            this.fileName = "";
            let mes = 'New Device for ' + this.modal.deviceOS + ' is created';
            if (this.isUpdate) {
              mes = this.modal.deviceOS + " updated"
            }
            swal({
              title: 'Save',
              text: mes,
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,

              onClose: () => {
                this.loadAll();
                this.iscreate = false;
                clearInterval(timerInterval)
              }
            });
          } else {
            swal({
              title: 'Error',
              text: 'Something went Wrong ...Try Again',
              type: 'error',
            }
            )
          }
        },
          err => {
            this.spinnerFlag = false
          }
        );
      } else {
        this.saveIfNotIsNotSelected(formData, headers);
      }
    }
  }

  saveIfNotIsNotSelected(formData, headers) {
    this.service.saveDevicDetailsWithOutFile(formData, headers).subscribe(jsonResp => {
      this.spinnerFlag = false;
      let responseMsg: string = jsonResp.result;
      let timerInterval;
      if (responseMsg === "success") {
        let msgType = 'Save';
        let mes = 'New Device for ' + this.modal.deviceOS + ' is created';
        if (this.isUpdate) {
          mes = this.modal.deviceOS + " updated";
          msgType = 'Update';
        }
        swal({
          title: msgType,
          text: mes,
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,

          onClose: () => {
            this.loadAll();
            this.iscreate = false;
            clearInterval(timerInterval)
          }
        });
      } else {
        swal({
          title: 'Error',
          text: 'Something went Wrong ...Try Again',
          type: 'error',
        }
        )
      }
    },
      err => {
        this.spinnerFlag = false
      }
    );
  }

  onClickCreate() {
    this.isSave = true;
    this.iscreate = true;
    this.isUpdate = false;
    this.deviceMasterForm.reset();
    this.modal.id = 0;
    this.deviceMasterForm.get("deviceType").setValue("");
    this.deviceMasterForm.get("deviceOS").setValue("");
    this.deviceMasterForm.get("activeflag").setValue(true);
  }

  openSuccessCancelSwal(dataObj, id) {
    swal({
      title: "Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    })
      .then((value) => {
        if (value) {
          dataObj.userRemarks = "Comments : " + value;
          this.deletedevice(dataObj);
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

  deletedevice(dataObj): string {
    let status = '';
    let deviceMaster = new DeviceMaster();
    deviceMaster.id = dataObj.id;
    deviceMaster.userId = this.currentUser.id;
    deviceMaster.userRemarks = dataObj.userRemarks;
    this.service.deleteDevice(deviceMaster)
      .subscribe((response) => {
        let responseMsg: string = response.result;
        let timerInterval;
        if (responseMsg === "success") {
          swal({
            title: 'Deleted!',
            text: 'Device data has been deleted.',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.loadAll();
              clearInterval(timerInterval)
            }
          });
        } else {
          status = "failure";
          swal({
            title: 'Not Deleted!',
            text: 'Device data has not been deleted.',
            type: 'error',
            timer: 2000
          });
        }
      }, (err) => {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: dataObj.ipAddress + 'is not deleted...Something went wrong',
          type: 'error',
          timer: 2000
        }
        );
      });
    return status;
  }

  fileDownload() {
    this.spinnerFlag = true;
    this.service.downloadFile(this.modal).subscribe((responce) => {
      let contentType = this.commonService.getContentType(this.modal.fileExtention);
      var blob: Blob = this.b64toBlob(responce._body, contentType);
      this.comp.previewByBlob(this.modal.fileName, blob, true);
      this.spinnerFlag = false;
    });
  }

  downloadFile(dataObj, id) {
    this.spinnerFlag = true;
    let deviceMaster = new DeviceMaster();
    deviceMaster.id = dataObj.id;
    let fileExtention = dataObj.fileExtention;
    let fileName = dataObj.fileName;
    this.service.downloadFile(deviceMaster).subscribe((responce) => {
      var blob: Blob = this.b64toBlob(responce._body, 'application/pdf');
      let name = fileName + "." + fileExtention;
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, name);
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.spinnerFlag = false;
      }
      this.spinnerFlag = false;
    });
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  onClickCancel() {
    this.iscreate = false;
  }

  onSelectFile(event) {
    this.configService.checkIsValidFileSize(event.target.files[0].size).subscribe(fileRes =>{
      if(fileRes){
        this.fileName = "";
        if (this.updateFlag) {
          this.newFile = true;
        }
        this.spinnerFlag = true;
        this.validationMessage = "";
        this.file = event.target.files[0];
        this.fileName = this.file.name.substring(0, this.file.name.indexOf('.'));
        if (this.file.name.match('.pdf')) {
          this.modal.fileName = this.fileName;
          this.newFile = true;
          this.spinnerFlag = false;
        } else if (this.file.name.match('.doc') || this.file.name.match('.docx')) {
          this.modal.selectedFile = this.fileName;
          let formData: FormData = new FormData();
          formData.append('file', this.file, this.file.name);
          this.vendorService.saveUploadedFile(formData).subscribe(resp => {
            if (resp.fileName != null)
              this.modal.uploadedFile = resp.fileName;
          });
          this.vendorService.convertToPDF(formData).subscribe(resp => {
            this.file = this.convertBase64ToPdfFile(resp._body);
            this.newFile = true;
            this.spinnerFlag = false;
          });
        } else {
          this.validationMessage = "Upload .pdf,.doc,.docx files only"
          this.spinnerFlag = false;
        }
      }else{
        this.helper.fileSizeWarning(event.target.files[0].name);
        this.myInputVariable.nativeElement.value = "";
      }
    });
    
  }

  convertBase64ToPdfFile(dataURI) {
    var binary = atob(dataURI);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'application/pdf'
    });
  }

  populateSaveDate(date: any): any {
    let result;
    if (!this.helper.isEmpty(date)) {
      this.validDate = date;
      result = this.validDate.year + "-" + this.validDate.month + "-" + this.validDate.day;
    } else {
      result = "";
    }
    return result;
  }

  loadAll() {
    this.spinnerFlag = true;
    this.service.loadAll(this.currentUser.orgId).subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.data = response.result;
      }
    }, error => { this.spinnerFlag = false });
  }

  loadOrgDateFormat() {
    this.servie.getOrgDateFormatForDatePicker().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.pattern = result.replace("y", "Y");
      }
    });
  }

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.datePipeFormat = result.datePattern.replace("mm", "MM")
        this.datePipeFormat = this.datePipeFormat.replace("YYYY", "yyyy");
      }
    });
  }

}
