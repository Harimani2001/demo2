import { ActivatedRoute } from '@angular/router';
import { StepperClass, WorkflowDocumentStatusDTO } from './../../models/model';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IOption } from 'ng-select';
import { FileUploader } from 'ng2-file-upload';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { BatchCreation } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { batchCreationErrorTypes } from '../../shared/constants';
import { Helper } from '../../shared/helper';
import { EquipmentService } from '../equipment/equipment.service';
import { FormExtendedComponent } from '../form-extended/form-extended.component';
import { MasterControlService } from '../master-control/master-control.service';
import { BatchCreationService } from './batch-creation.service';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
const URL_For_Upload = 'https://evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-batch-creation',
  templateUrl: './batch-creation.component.html',
  styleUrls: ['./batch-creation.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class BatchCreationComponent implements OnInit {
  @ViewChild('bulkBatchModal') public bulkBatchModal: ModalBasicComponent;
  @ViewChild('formExtendedId') private formExtendedComponent: FormExtendedComponent;
  @ViewChild('myTable') table: any;
  submitted: boolean = false;
  public inputField: any = [];
  public uploader: FileUploader = new FileUploader({
    url: URL_For_Upload,
    isHTML5: true
  });
  public onBatchForm: FormGroup;
  data: any;
  modal: BatchCreation = new BatchCreation();
  public rowsOnPage = 10;
  public filterQuery = '';
  spinnerFlag = false;
  iscreate: boolean = false;
  viewbatchrecord: boolean = false;
  isUpdate: boolean = false;
  isSave: boolean = false;
  public today: NgbDateStruct;
  public validDate: NgbDateStruct;
  equipment: Array<IOption> = new Array<IOption>();
  batchStatus: any = new Array();
  formsList: Array<IOption> = new Array<IOption>();
  permissionsfromlocalstorage: any;
  permissionModal: Permissions = new Permissions(this.helper.BATCH_CREATION_VALUE, false);
  public validationMessage: string = "";
  fileList: any;
  excelData: any[] = new Array();
  correctFile = false;
  isUploaded: boolean = false;
  isValidTableData: boolean = false;
  commonDocumentStatusValue: any;
  formExtendedColumns: any;
  completed: any;
  routeback: any = null;
  oldProductName: any;
  permissionValue: string = '';
  constructor(public route: ActivatedRoute, public permissionService: ConfigService, private comp: AdminComponent, public fb: FormBuilder, public helper: Helper,
    public Eservice: EquipmentService, public service: BatchCreationService, public batchCreationErrorTypes: batchCreationErrorTypes, public masterControlService: MasterControlService) {
    this.route.queryParams.subscribe(rep => {
      if (rep.id !== undefined) {
        this.routeback = rep.id
        if (rep.status != undefined) {
          this.commonDocumentStatusValue = rep.status;
        } else {
          this.routeback = null;
        }
        if (rep.testcase != undefined) {
          this.viewfromrecords(rep.id);
        } else {
          this.viewfromrecords(rep.id);
        }
      }
    });
    this.helper.listen().subscribe((m: any) => {
      this.viewfromrecords(m)
    })
  }

  ngOnInit() {
    this.comp.setUpModuleForHelpContent(this.helper.BATCH_CREATION_VALUE);
    this.loadEquipment();
    this.loadAll();
    this.onBatchForm = this.fb.group({
      batchNumber: ['', Validators.compose([
        Validators.required
      ])],
      productName: ['', Validators.compose([
        Validators.required
      ])],
      batchQuantity: ['', Validators.compose([
      ])],

      selectedEquipment: ['', Validators.compose([
        Validators.required
      ])],
      status: ['', Validators.compose([
      ])],
    });
    this.permissionService.loadPermissionsBasedOnModule("163").subscribe(resp => {
      this.permissionModal = resp
      this.permissionValue = 'ok';
    });
    this.comp.taskEquipmentId = 0;
    this.comp.taskDocType = "163";
    this.comp.taskDocTypeUniqueId = "";
  }

  onClickCreate() {
    this.isSave = true;
    this.iscreate = true;
    this.isUpdate = false;
    this.onBatchForm.reset();
    this.modal.id = 0;
    this.onBatchForm.get("status").setValue("");
    this.laodJsonStrucutre();
  }

  enableTableView() {
    this.isSave = false;
    this.iscreate = false;
    this.isUpdate = false;
    this.viewbatchrecord = false;
  }

  onClickCancel() {
    this.iscreate = false;
  }

  resetBulk() {
    this.validationMessage = "";
    this.uploader.queue = new Array();
  }

  onClickSave(onBatchForm) {
    this.submitted = false;
    if (onBatchForm.valid && this.formExtendedComponent.validateChildForm()) {
      this.spinnerFlag = true;
      this.modal.productName = this.onBatchForm.get("productName").value;
      this.modal.batchNumber = this.onBatchForm.get("batchNumber").value;
      this.modal.batchQuantity = this.onBatchForm.get("batchQuantity").value;
      this.modal.equipmentId = this.onBatchForm.get("selectedEquipment").value;
      this.modal.status = this.onBatchForm.get("status").value;
      this.modal.jsonExtraData = JSON.stringify(this.inputField);
      this.service.createBatch(this.modal).subscribe(jsonResp => {
        this.spinnerFlag = false;
        let responseMsg: string = jsonResp.result;
        let timerInterval
        if (responseMsg === "success") {
          this.loadEquipment();
          this.loadAll();
          let mes = this.modal.productName + ' Created Successfully';
          if (this.isUpdate) {
            mes = this.oldProductName + " Updated Successfully"
          }
          swal({
            title: '',
            text: mes,
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.iscreate = false;
              clearInterval(timerInterval)
            }
          });
        } else {
          swal({
            title: 'Error',
            text: 'Something went Wrong ...Try Again',
            type: 'error',
            timer: 2000
          }
          )
        }
      },
        err => {
          this.spinnerFlag = false
        }
      );
    } else {
      this.submitted = true;
      Object.keys(this.onBatchForm.controls).forEach(field => {
        const control = this.onBatchForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  sampleBatchDownload() {
    this.bulkBatchModal.spinnerShow();
    this.service.downloadSampleBatchFile().subscribe(res => {
      this.bulkBatchModal.spinnerHide();
      var blob: Blob = this.helper.b64toBlob(res.body, 'application/xls');
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, 'sampleBatchFile.xls');
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'sampleBatchFile.xls';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }, err => this.bulkBatchModal.spinnerHide());
  }

  extractFile(event: any) {
    this.loadBatchStatus();
    this.validationMessage = "";
    if (event.target.files[0].name.match('.xls')) {
      this.correctFile = true;
      this.fileList = event.target.files;
      if (this.uploader.queue.length > 1) {
        this.uploader.queue = new Array(this.uploader.queue[1]);
      }
      this.onClickOfUploadButton();
      event.target.value = '';
    } else {
      this.validationMessage = "Please upload .xls file";
    }
  }

  loadAll() {
    this.spinnerFlag = true;
    this.service.loadAll().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.data = response.result;
        this.completed = response.completed;
      }
    }, error => { this.spinnerFlag = false });
  }

  loadEquipment() {
    this.spinnerFlag = true;
    this.Eservice.loadEquipmentsByuser().subscribe(response => {
      this.spinnerFlag = false
      this.loadBatchStatus();
      if (response.result != null) {
        this.equipment = response.result.map(option => ({ value: option.id, label: option.name }));
      }
    }, error => { this.spinnerFlag = false });
  }

  onChangeEq(data: any) {
    this.service.loadForms(this.onBatchForm.get("selectedEquipment").value).subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.formsList = response.result.map(option => ({ value: option.key, label: option.value }));
      }
    }, error => { this.spinnerFlag = false });
  }

  editBatch(data: BatchCreation) {
    this.iscreate = true;
    this.isSave = false;
    this.isUpdate = true;
    this.modal = data;
    this.oldProductName = data.productName;
    this.submitted = false;
    if (this.modal.jsonExtraData != null && this.modal.jsonExtraData != '[]') {
      this.inputField = JSON.parse(this.modal.jsonExtraData);
    } else {
      this.laodJsonStrucutre();
    }
    this.onBatchForm.get("productName").setValue(this.modal.productName);
    this.onBatchForm.get("batchQuantity").setValue(this.modal.batchQuantity);
    this.onBatchForm.get("batchNumber").setValue(this.modal.batchNumber);
    this.onBatchForm.get("selectedEquipment").setValue(this.modal.equipmentId);
    this.onBatchForm.get("status").setValue(this.modal.status);
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
          this.deleteLocation(dataObj);
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

  deleteLocation(dataObj): string {
    let status = '';
    let batchCreation = new BatchCreation();
    batchCreation.id = dataObj.id;
    batchCreation.userRemarks = dataObj.userRemarks;
    this.service.deleteBatch(batchCreation)
      .subscribe((response) => {
        let responseMsg: string = response.result;
        let timerInterval;
        if (responseMsg === "success") {
          swal({
            title: 'Deleted!',
            text: dataObj.productName + ' Deleted Successfully',
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
            text: 'Batch ' + dataObj.productName + '  has not been Deleted.',
            type: 'error',
            timer: 2000
          });
        }
      }, (err) => {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: dataObj.productName + 'is not Deleted...Something went wrong',
          type: 'error',
          timer: 2000
        }
        );
      });
    return status;
  }

  loadBatchStatus() {
    this.service.loadBatchStatus().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.batchStatus = response.result
      }
    }, error => { this.spinnerFlag = false });
  }

  laodJsonStrucutre() {
    this.masterControlService.loadJsonOfDocumentIfActive(this.helper.BATCH_CREATION_VALUE).subscribe(res => {
      if (res != null)
        this.inputField = JSON.parse(res.jsonStructure);
    });
  }

  onClickOfUploadButton() {
    this.bulkBatchModal.spinnerShow();
    this.validationMessage = "";
    if (this.fileList.length > 0) {
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.service.extractExcelFile(formData).subscribe(resp => {
        this.bulkBatchModal.spinnerHide();
        this.spinnerFlag = false;
        this.excelData = resp.list;
        if (!this.helper.isEmpty(this.excelData)) {
          this.validationMessage = file.name + " file read successfully done";
          if (this.excelData.length > 0) {
            for (let data of this.excelData) {
              if (!this.helper.isEmpty(data.jsonExtraData) && data.jsonExtraData != []) {
                data.jsonExtraData = JSON.parse(data.jsonExtraData);
                this.formExtendedColumns = data.jsonExtraData;
              }
            }
          }
        }
        this.isUploaded = true;
      }, err => {
        this.validationMessage = 'Error in Excel File';
        this.bulkBatchModal.spinnerHide();
      }
      );
    }
  }

  importData() {
    if (this.excelData.length>0) {
      this.isValidTableData = false;
      for (let element of this.excelData) {
        if (this.helper.isEmpty(element.productName) || this.helper.isEmpty(element.batchNumber) || element.equipmentId.length == 0 || this.validateStaticDocumentJsonData(element.jsonExtraData)) {
          this.isValidTableData = true;
        }
      }
      if (!this.isValidTableData) {
        this.bulkBatchModal.spinnerShow();
        let list = JSON.parse(JSON.stringify(this.excelData));
        for (let json of list) {
          json.jsonExtraData = JSON.stringify(json.jsonExtraData);
        }
        this.service.saveBulk(list).subscribe(resp => {
          this.bulkBatchModal.spinnerHide();
          this.bulkBatchModal.hide();
          if (resp.result) {
            swal({
              title: '', text: 'Saved Successfully', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
              onClose: () => {
                this.isUploaded = false;
                this.excelData = new Array();
                this.ngOnInit();
              }
            });
          } else { swal({ title: 'Error', text: 'Something went Wrong ...Try Again', type: 'error', timer: 2000 }) }
        }, err => { this.bulkBatchModal.spinnerHide(); });
      }
    } else {
      this.isValidTableData = true;
    }
  }

  validateStaticDocumentJsonData(jsonData: any): boolean {
    let result: boolean = false;
    let enableUpload: any[] = jsonData.filter(field => field.fieldError == true);
    if (enableUpload.length > 0)
      result = true;
    else
      result = false;
    return result;
  }

  fieldValidation(jsonObject: any) {
    if (!this.helper.isEmpty(jsonObject.value))
      jsonObject.fieldError = false;
    else
      jsonObject.fieldError = true;
  }

  viewfromrecords(id: any) {
    this.service.editBatch(id).subscribe(u => {
      this.viewbatch(u.result);
    })
  }

  viewbatch(row: any) {
    this.viewbatchrecord = true;
    this.editBatch(row)
    this.stepperfunction(row);
    this.workflowfunction(row);
  }

  stepperfunction(jsonResp: any) {
    const stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = "163";
    stepperModule.code = jsonResp.productName;
    stepperModule.documentIdentity = jsonResp.id;
    stepperModule.publishedFlag = true;
    stepperModule.creatorId = 1;
    stepperModule.lastupdatedTime = jsonResp.updatedTime;
    stepperModule.displayCreatedTime = jsonResp.displayCreatedTime;
    stepperModule.displayUpdatedTime = jsonResp.displayUpdatedTime;
    stepperModule.documentTitle = jsonResp.projectName;
    stepperModule.createdBy = jsonResp.createdBy;
    stepperModule.updatedBy = jsonResp.updatedBy;
    this.helper.stepperchange(stepperModule);
  }

  workflowfunction(jsonResp: any) {
    if (jsonResp.result.publishedflag) {
      const workflowmodal: WorkflowDocumentStatusDTO = new WorkflowDocumentStatusDTO();
      workflowmodal.documentType = this.helper.DISCREPANCY_VALUE;
      workflowmodal.documentId = jsonResp.result.id;
      workflowmodal.currentLevel = jsonResp.result.currentCommonLevel;
      workflowmodal.documentCode = jsonResp.result.ursCode;
      workflowmodal.workflowAccess = jsonResp.result.workflowAccess;
      workflowmodal.docName = 'Discripancy form';
      workflowmodal.publishFlag = jsonResp.result.executionFlag;
      this.helper.setIndividulaWorkflowData(workflowmodal);
    }
  }

  closeBulkUserModel() {
    this.isUploaded = false;
    this.isValidTableData = false;
    this.excelData = new Array();
    this.ngOnInit();
  }

}
