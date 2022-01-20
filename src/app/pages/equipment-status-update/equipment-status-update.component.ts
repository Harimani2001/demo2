import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BatchCreationService } from '../batch-creation/batch-creation.service';
import { EquipmentService } from '../equipment/equipment.service';
import { EquipmentStatusUpdateService } from './equipment-status-update.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { Helper } from '../../shared/helper';
import { Equipment, BatchCreation, EquipmentStatus, StepperClass, UserPrincipalDTO } from '../../models/model';
import { LookUpService } from '../LookUpCategory/lookup.service';
import swal from 'sweetalert2';
import { Permissions } from './../../shared/config';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateISOParserFormatter } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import { AdminComponent } from '../../layout/admin/admin.component';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { IOption } from 'ng-select';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfigService } from '../../shared/config.service';
@Component({
  selector: 'app-equipment-status-update',
  templateUrl: './equipment-status-update.component.html',
  styleUrls: ['./equipment-status-update.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class EquipmentStatusUpdateComponent implements OnInit {
  @ViewChild('g') g: any;
  @ViewChild('myTable') table: any;
  spinnerFlag = false;
  equipmentList: any;
  equipmentData: any;
  statusList: any;
  batchList: any;
  equipmentDetails: Equipment = new Equipment();
  batchDetails: BatchCreation = new BatchCreation();
  public onStatusForm: FormGroup;
  modal: EquipmentStatus = new EquipmentStatus();
  data: any;
  completedData: any;
  public today: NgbDateStruct;
  public validDate: NgbDateStruct;
  permissionModal: Permissions = new Permissions('', false);
  permissionsfromlocalstorage: any;
  formOptionList: Array<IOption> = new Array<IOption>();
  selectedFormList: any[];
  selectedFormIds: any[];
  isLogEntry: boolean = false;
  selectedForm: any = "";
  selectedRow: any;
  dynamicFormData: any[] = new Array();
  publishedMandatoryFeildJson: any = {};
  commonDocumentStatusValue: any;
  popupdata = [];
  viewIndividualData: boolean = false;
  id: number = 0;
  selectedBatch: any = "";
  taskDescription: any;
  tableViewFlag: boolean = false;
  isFormDisable: boolean = false;
  isProduct: boolean = false;
  productName: any;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  submitted: boolean = false;
  datePipeFormat = 'yyyy-MM-dd';
  public filterQuery = '';
  constructor(private configService: ConfigService, private datePipe: DatePipe, public activeRouter: ActivatedRoute,
    private comp: AdminComponent, public lookUpService: LookUpService, public helper: Helper,
    public dynamicService: DynamicFormService, public service: EquipmentStatusUpdateService,
    public equipmentService: EquipmentService, public batchCreationService: BatchCreationService, public fb: FormBuilder,
    public masterDynamicFormService: MasterDynamicFormsService, private router: Router) {
    let completeURL = "" + location.href;
    let splitURL = completeURL.split("&");
    if (completeURL.includes("isLog")) {
      this.isLogEntry = true;
      this.selectedForm = parseInt(splitURL[splitURL.length - 1].replace(/[^0-9\.]/g, ''), 10);
      this.loadEquipmentStatusById(parseInt(splitURL[splitURL.length - 2].replace(/[^0-9\.]/g, ''), 10));
    }
  }

  ngOnInit() {
    this.spinnerFlag = true;
    this.configService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
    });
    this.onStatusForm = this.fb.group({
      equipmentId: ['', Validators.compose([
        Validators.required
      ])],
      batchId: ['', Validators.compose([
      ])],
      taskDescription: ['', Validators.compose([
        Validators.required
      ])],
      formEnable: [],
      status: ['', Validators.compose([
        Validators.required
      ])],
      forms: [],
      batchProductName: []
    });
    this.onStatusForm.get("equipmentId").setValue("");
    this.onStatusForm.get("status").setValue("");
    this.comp.setUpModuleForHelpContent("166");
    this.comp.taskDocType = "166";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    let now = new Date();
    let tempData = new NgbDateISOParserFormatter;
    this.today = tempData.parse(now.toISOString());
    this.tableViewFlag = true;
    this.loadAllEquipments();
    this.configService.loadPermissionsBasedOnModule("166").subscribe(resp => {
      this.permissionModal = resp
    });
    this.loadAll();
  }

  loadEquipmentStatusById(equipmentStatusId: any) {
    this.service.loadEquipmentStatusById(equipmentStatusId).subscribe(response => {
      if (response.result != null) {
        this.selectedRow = response.result;
        this.onStatusForm.get("equipmentId").setValue(response.result.equipmentId);
        this.onChangeEquipment(response.result.equipmentId);
        this.selectedFormList = response.result.dynamicFormsList;
        this.selectedFormIds = response.result.dynamicFormsList.map(d => d.key);
        this.isLogEntry = true;
        this.onChangeLog();
      }
    });
  }

  onClickCreate() {
    this.tableViewFlag = false;
    this.onStatusForm.reset();
    this.isFormDisable = false;
    this.onStatusForm.get("equipmentId").setValue("");
    this.onStatusForm.get("batchId").setValue("");
    this.onStatusForm.get("forms").setValue(new Array());
    this.onStatusForm.controls['equipmentId'].enable();
    this.onStatusForm.controls['batchId'].enable();
    this.submitted = false;
  }

  loadAllEquipments() {
    this.spinnerFlag = true;
    this.equipmentService.loadEquipmentsByuser().subscribe(response => {
      this.spinnerFlag = false;
      if (response.result != null) {
        this.equipmentList = response.result;
        this.equipmentData = response.result.map(option =>
          ({ "value": '' + option.id, "label": option.name + '-->' + option.code }));
      }
    }, error => { this.spinnerFlag = false });
  }

  onTaskDescription() {
    this.modal.taskDescription = this.onStatusForm.get("taskDescription").value;
    if (this.modal.taskDescription == 'other')
      this.onStatusForm.get("taskDescription").setValue("");
  }
  
  loadAll() {
    this.service.loadAllEquipmentStatus().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.data = response.result;
        this.completedData = response.completedList;
      }
    }, error => {
      this.spinnerFlag = false
      swal({
        title: '',
        text: 'Something went Wrong ...Try Again',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      }
      );
    });
  }

  onChangeCompletStatus(data: any) {
    if (data.executionFlag) {
      this.modal = data;
      swal({
        title: 'Are you sure?',
        text: 'You wont be able to revert',
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, complete it !',
        cancelButtonText: 'No, cancel !',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
        buttonsStyling: false,
        onClose: () => {
          this.loadAll();
        }
      }).then(responseMsg => {
        this.service.changeCompleteStatus(this.modal).subscribe(result => {
          if (result.result == "success") {
            swal({
              title: '',
              text: 'Equipment Status Completed Successfully',
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false
            }
            )
            this.loadAll();
          }
        });
      });
    }
  }

  onChangeEquipment(eqId: any) {
    this.onStatusForm.get("equipmentId").setValue(eqId);
    this.modal.id = 0;
    if (!this.helper.isEmpty(this.onStatusForm.get("equipmentId").value)) {
      this.spinnerFlag = true;
      this.loadAllStatus(this.onStatusForm.get("equipmentId").value);
      this.dynamicService.loadBatchBasedOnEquipmentId(this.onStatusForm.get("equipmentId").value).subscribe(result => {
        if (result != null) {
          this.batchList = result;
          this.populateDataEquipmentAlreadyData(this.onStatusForm.get("equipmentId").value)
        }
      });
      this.modal.equipmentId = this.onStatusForm.get("equipmentId").value;
      this.masterDynamicFormService.loadPublishedTemplateByEquipment(this.onStatusForm.get("equipmentId").value).subscribe(result => {
        if (result != null) {
          this.formOptionList = result.map(option => ({ value: option.key, label: option.value, mappingFlag: option.mappingFlag, mappingId: option.mappingId }));
        }
      });
      this.spinnerFlag = false;;
    } else {
      this.spinnerFlag = false;
    }
  }

  loadEquipmentDetails() {
    this.equipmentDetails = new Equipment();
    if (!this.helper.isEmpty(this.onStatusForm.get("equipmentId").value)) {
      this.equipmentList.forEach(element => {
        if (element.id === Number(this.onStatusForm.get("equipmentId").value))
          this.equipmentDetails = element;
      });
    } else {
      this.equipmentDetails = new Equipment();
    }
  }
  loadBatchDetails() {
    this.batchDetails = new BatchCreation();
    if (!this.helper.isEmpty(this.onStatusForm.get("batchId").value)) {
      this.batchCreationService.editBatch(this.onStatusForm.get("batchId").value).subscribe(response => {
        if (!this.helper.isEmpty(response.result))
          this.batchDetails = response.result
      });
    } else {
      this.batchDetails = new BatchCreation();
    }
  }

  onClickSave() {
    let form = true;
    if (this.isFormDisable) {
      form = false;
      if (this.onStatusForm.get("forms").value != "" && this.onStatusForm.get("forms").value.length > 0)
        form = true;
    }
    if (this.onStatusForm.valid && form) {
      this.submitted = false;
      this.spinnerFlag = true;
      this.modal.equipmentId = this.onStatusForm.get("equipmentId").value;
      this.modal.batchId = this.onStatusForm.get("batchId").value;
      this.modal.status = this.onStatusForm.get("status").value;
      this.modal.taskDescription = this.onStatusForm.get("taskDescription").value;
      this.modal.dynamicFormsList = [];
      if (this.onStatusForm.get("forms").value != "" && this.isFormDisable) {
        var listOfIds = this.onStatusForm.get("forms").value;
        if (!this.helper.isEmpty(listOfIds)) {
          this.formOptionList.forEach(element => {
            if (listOfIds.includes(element.value)) {
              let json = { key: element.value, value: element.label, mappingId: element["mappingId"], mappingFlag: element["mappingFlag"] };
              this.modal.dynamicFormsList.push(json);
            }
          });
        }
      }
      this.modal.id = this.id;
      this.service.saveEquipmentStatus(this.modal).subscribe(jsonResp => {
        this.loadAll();
        this.onStatusForm.reset();
        this.onStatusForm.get("batchId").setValue("");
        this.onStatusForm.get("status").setValue("");
        this.onStatusForm.get("equipmentId").setValue("");
        this.spinnerFlag = false;
        let responseMsg: string = jsonResp.result;
        if (responseMsg === "success") {
          this.tableViewFlag = true;
          swal({
            title: '',
            text: 'Equipment Status Saved Successfully',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          }
          )
        } else {
          swal({
            title: '',
            text: 'Something went Wrong ...Try Again',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false
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
      Object.keys(this.onStatusForm.controls).forEach(field => {
        const control = this.onStatusForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  populateDataEquipmentAlreadyData(equipmentId) {
    let dto = { equipmentId: equipmentId }
    this.spinnerFlag = true;
    this.service.loadByEquipmentId(dto).subscribe(result => {
      this.spinnerFlag = false;;
      if (result.result != '') {
        let row = result.result;
        if (row.batchId == null) {
          this.onStatusForm.get("batchId").setValue('');
        } else {
          this.onStatusForm.get("batchId").setValue(row.batchId);
        }
        this.selectedBatch = row.batchId;
        this.onStatusForm.get("taskDescription").setValue(row.taskDescription);
        this.onStatusForm.get("status").setValue(row.status);
        if (!this.helper.isEmpty(row.status))
          this.onStatusForm.controls['batchId'].disable();
        if (row.dynamicFormsList.length > 0) {
          this.onStatusForm.get("forms").setValue(row.dynamicFormsList.map(d => d.key));
          this.isFormDisable = true;
        } else {
          this.onStatusForm.get("forms").setValue(new Array());
          this.isFormDisable = false;
        }
        this.modal.id = row.id;
        this.id = row.id;
      }
    }, error => { this.spinnerFlag = false });
  }

  changeStatus(row) {
    this.submitted = false;
    this.tableViewFlag = false;
    this.onStatusForm.get("equipmentId").setValue(row.equipmentId);
    this.onStatusForm.get("batchId").setValue(row.batchId);
    this.onStatusForm.get("taskDescription").setValue(row.taskDescription);
    this.onChangeEquipment(row.equipmentId);
    this.onStatusForm.get("status").setValue(row.status);
    this.onStatusForm.get("forms").setValue(row.dynamicFormsList.map(d => d.key));
    this.onStatusForm.get("formEnable").setValue(true);
    this.isFormDisable = true;
    this.modal.id = row.id;
    this.id = row.id;
    this.onStatusForm.controls['equipmentId'].disable();
    this.onStatusForm.controls['batchId'].disable();
  }

  logEntry(row) {
    this.selectedRow = row;
    this.selectedForm = "";
    this.dynamicFormData = [];
    this.loadEquipmentStatusById(this.selectedRow.id)
    this.selectedFormList = row.dynamicFormsList;
    this.selectedFormIds = row.dynamicFormsList.map(option => option.key);
    this.isLogEntry = true;
  }

  populateDate(date: any): any {
    let result: any = "";
    if (!this.helper.isEmpty(date)) {
      let tempData = new NgbDateISOParserFormatter;
      let dateString = date.split("-");
      if (dateString.length == 3) {
        let validDate = new Date(dateString[0], dateString[1] - 1, dateString[2]);
        result = tempData.parse(validDate.toISOString());
      }
    } else {
      result = "";
    }
    return result;
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

  populateDayDate(date: any) {
    let result;
    if (!this.helper.isEmpty(date)) {
      this.validDate = date;
      result = this.validDate.day + "/" + this.validDate.month + "/" + this.validDate.year;
    } else {
      result = "";
    }
    return result;
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
    let timerInterval;
    let status = '';
    let equipment = new EquipmentStatus();
    equipment.id = dataObj.id;
    equipment.userRemarks = dataObj.userRemarks;
    this.service.delete(equipment)
      .subscribe((response) => {
        let responseMsg: string = response.result;
        if (responseMsg === "success") {
          swal({
            title: 'Deleted!',
            text: 'Equipment ' + dataObj.equipmentName + ' Status has been Deleted.',
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
            text: 'Equipment ' + dataObj.equipmentName + ' Status has not been Deleted.',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          }
          );
        }
      }, (err) => {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: dataObj.equipmentName + 'is not Deleted...Something went wrong',
          type: 'error',
          timer: this.helper.swalTimer
        });
      });
    return status;
  }

  onClickCancel() {
    this.ngOnInit();
  }

  cancelLogEntry() {
    this.isLogEntry = false;
    this.router.navigateByUrl(this.router.createUrlTree(['equipmentStatusUpdate']))
  }

  pdfdownload(data: any) {
    if (this.permissionModal.exportButtonFlag) {
      this.spinnerFlag = true;
      this.service.generatePdf(data).subscribe(res => {
        var blob: Blob = this.b64toBlob(res._body, 'application/pdf');
        let name = "EquipmentStatus" + new Date().toLocaleDateString(); +".pdf";
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, name);
        } else {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        this.spinnerFlag = false
      });
    }
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

  navigate() {
    const form = this.selectedFormList.filter(option => option.key == this.selectedForm);
    if (form.length != 0) {
      form.forEach(element => {
        var queryParams = {
          exists: false,
          id: element.mappingId,
          redirectUrl: location.href.replace(location.origin, "") + '?isLog:true&id:' + this.selectedRow.id + '&formId:' + element.mappingId,
          isMapping: element.mappingFlag,
          statusId: this.selectedRow.id,
        }
        this.router.navigate(['dynamicForm/' + this.selectedForm], { queryParams: queryParams, skipLocationChange: true })
      });
    }
  }

  onChangeLog() {
    this.dynamicFormData = [];
    if (!this.helper.isEmpty(this.selectedForm)) {
      this.spinnerFlag = true;
      let infoList = this.selectedFormList.filter(option => option.key == this.selectedForm);
      if (infoList.length != 0) {
        let info = infoList[0];
        let requestData = { "masterDynamicFormIdOrMappingId": info.mappingId, "equipmentStatusId": this.selectedRow.id, "isMapping": info.mappingFlag };
        this.service.loadAllEquipmentStatusFormData(requestData).subscribe(response => {
          this.spinnerFlag = false;
          this.publishedMandatoryFeildJson = {
            rows: new Array(),
            columns: new Array()
          }
          response.result.forEach((element, index) => {
            element.formData = JSON.parse(element.formData);
            this.createDyanamicColumn(element.formData, index, this.publishedMandatoryFeildJson);
            this.dynamicFormData.push(element)
          });
        }, error => { this.spinnerFlag = false });
      }
    }
  }

  createDyanamicColumn(formData: any[], index, mandatoryFeildJson) {
    let column = new Array();
    let row = new Array();
    formData.forEach(json => {
      if (json.required && (json.type == 'select' || json.type == 'time' || json.type == 'date' || json.type == 'number' || json.type == 'text' || json.type == 'datetime-local')) {
        if (index == 0) {
          column.push(json.label);
        }
        let value = json.value;
        if (json.type === 'datetime-local')
          value = this.datePipe.transform(json.value, 'dd-MM-yyyy HH:mm ');

        if (json.type === 'date')
          value = this.datePipe.transform(json.value, 'dd-MM-yyyy');

        if (json.type == 'select') {
          json.values.forEach(element => {
            if (element.value == json.value)
              value = element.label;
          });
        }
        row.push(value);
      }
    });
    if (index == 0)
      mandatoryFeildJson.columns = column;
    mandatoryFeildJson.rows.push(row)
  }

  onChangeOfBatch() {
    let data = { "batch": +this.onStatusForm.get("batchId").value, "equipmentId": +this.onStatusForm.get("equipmentId").value }
    this.service.loadBatch(data).subscribe(result => {
      if (result.data != "") {
        if (result.data.dynamicFormsList.length > 0) {
          this.onStatusForm.get("forms").setValue(result.data.dynamicFormsList.map(m => m.key));
          this.isFormDisable = true;
        } else {
          this.onStatusForm.get("forms").setValue(new Array());
          this.isFormDisable = false;
        }
      }
    });
  }

  newonChangeOfBatch() {
    let batchid = this.onStatusForm.get("batchId").value;
    if (batchid != "0") {
      this.service.loadBatchProduct(this.onStatusForm.get("batchId").value).subscribe(result => {
        if (result.result != '') {
          this.isProduct = true;
          this.productName = result.result.productName;
        }
      });
      this.onChangeOfBatch();
    } else {
      this.isProduct = false;
      this.productName = ""
    }
  }

  logsRequried() {
    this.isFormDisable = !this.isFormDisable;
  }

  loadAllStatus(equipmentId: any) {
    this.service.loadAllStatus(equipmentId).subscribe(result => {
      if (result.result != '') {
        this.statusList = result.result;
      }
    });
  }
  
  viewRowDetails(row: any, status) {
    this.commonDocumentStatusValue = status;
    this.popupdata = [];
    var queryParams = {
      exists: true,
      id: row.masterDynamicFormId,
      isMapping: row.mapping,
      versionId: + this.currentUser.versionId
    }
    if (row.mapping) {
      queryParams.id = row.formMappingId;
      queryParams["documentCode"] = row.dynamicFormCode;

    } else {
      queryParams.id = row.id;
    }
    this.dynamicService.loadDynamicFormForProject(queryParams).subscribe(jsonResp => {
      if (jsonResp != null) {
        if (!queryParams.isMapping) {
          jsonResp.formData = JSON.parse(jsonResp.formData);
        } else {
          jsonResp.formData = [];
          jsonResp.formDataList.forEach(element => {
            element.formDataArray = [{ formData: JSON.parse(element.formData) }];
          });
        }
        this.popupdata.push(jsonResp);
        this.viewIndividualData = true;
      }
      this.spinnerFlag = false;
      let stepperModule: StepperClass = new StepperClass();
      stepperModule.constantName = jsonResp.permissionConstant;
      stepperModule.documentIdentity = jsonResp.id;
      stepperModule.publishedFlag = jsonResp.publishedflag;
      this.helper.stepperchange(stepperModule);
    });
  }

  onClick(event) {
    let path = event.path;
    let a = false;
    for (var index = 0; index < path.length; index++) {
      if (this.g)
        if (path[index].id == this.g._elRef.nativeElement.name) {
          a = true;
          break;
        }
    }
    if (!a) {
      if (this.g)
        this.g.close();
    }
  }

}

