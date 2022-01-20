import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConditionChildDTO, ConditionDTO, DynamicFormDTO, StepperClass, UserPrincipalDTO, User } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { EquipmentStatusUpdateService } from '../equipment-status-update/equipment-status-update.service';
import { DynamicFormService } from './dynamic-form.service';
import { isNullOrUndefined } from 'util';
import { FormEsignVerificationComponent } from '../form-esign-verification/form-esign-verification.component';
import { FormExtendedComponent } from '../form-extended/form-extended.component';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { ApiConfigurationService } from '../api-configuration/api-configuration.service';
import { NgForm } from '@angular/forms';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { EquipmentService } from '../equipment/equipment.service';
import { ExternalFormModalComponent } from '../external-form-modal/external-form-modal.component';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
})
export class DynamicFormComponent implements OnInit, AfterViewInit {
  groupFormPart: any;
  @ViewChild('formId') formValidation: any;
  @ViewChild('tableIdDivRefresh') table: any;
  @ViewChild('formDataListTab') tabSet: any;
  @ViewChild('masterFormSlection') masterFormSlectionModal: any;
  @ViewChild('ShowImageModal') showImageModal: any;
  @ViewChild('reasonForEditClosebutton') reasonForEditClosebutton;
  @ViewChild('formVerification') formVerification: FormEsignVerificationComponent;
  @ViewChild('alterMasterFormReference') alterMasterFormReference: ModalBasicComponent;
  @ViewChild('APIGetDataModal') apiGetDataModal: any;
  @ViewChild('auditSingleView') auditSingleView
  @ViewChild('formExtendedId') private formExtendedComponent: FormExtendedComponent;
  @ViewChild('selection') dropDownValidation: any;
  public inputFieldMasterReference: any = [];
  public submittedMasterReference = false;
  public masterReferenceForm;
  public inputField: any = [];
  public submitted = false;
  public parametersFormSubmitted = false;
  public spinnerFlag = false;
  public dynamicJsonTable = new Array();
  public dynamicJsonTableView = new Array();
  public masterFormList = new Array();
  public masterFormDataList = new Array();
  publishedFlag = false;
  dynamicForm = new DynamicFormDTO();
  permissionModel: Permissions = new Permissions("", false);
  multiFileUploadFlag: boolean = false;
  uploadSingleFile: File[];
  uploadMultipleFile: File[];
  singleFile = "";
  multipleFile = [] = new Array();
  equipmentList = new Array();
  batchList = new Array();
  routeback: any;
  redirectUrl: any;
  equipmentStatusId: string = "";
  ccfId: string = "";
  isEquipmentStatus: boolean = false;
  public individualconstants: any;
  public individualId: any;
  isCCFStatus: boolean = false;
  equipmentStatus: any;
  isMapping: boolean = false;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  public equipmentOptions: Array<IOption> = new Array<IOption>();
  isWorkflowDocumentOrderSequence: string;
  imageurl: any = "";
  isFormValid: any;
  formData: any;
  reasonForEdit: string = "";
  showModal: boolean = false;
  apiParameters: any[] = new Array();
  isAPIBackgroundJob: boolean = false;
  documentSpecifiedConstant: string = "";
  configOfCkEditior = {
    removeButtons: 'Save,Source,Preview,NewPage,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Language,CreateDiv,About,ShowBlocks,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Anchor,spellchecker,Link,Unlink',
    height: 100
  }
  public nextId = "0";
  pdfView = false;
  pdfURL: any;
  pdfName: string;
  pdfViewButton = false;
  commentsDocumentsList: any[] = new Array();
  forumFlag = true;
  outline: any[];
  pdf: any;
  error: any;
  height: any = "600px";
  heightOutline = '500px';
  public pageVariable: number = 1;
  rotation = 0;
  zoom = 1.1;
  originalSize = true;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  isOutlineShown = true;
  pdfQuery = '';
  outLineList = new Array();
  formType: any;
  summationArray = new Array();
  isFormulaCalculated: boolean = false;
  @ViewChild('fileuploaddiv') myInputVariable: ElementRef;
  enableCalculate: boolean = false;
  equipmentListBasedOnLocation = new Array();
  projectList = new Array();
  cleanRoomList = new Array();
  equipmentinfo: any;
  dropDownSelectionRequired: boolean = false;
  @ViewChild('externalFormModal') externalFormModal: ExternalFormModalComponent;

  constructor(private equipmentStatusUpdateService: EquipmentStatusUpdateService, private datePipe: DatePipe, private router: Router, public activeRouter: ActivatedRoute, public service: DynamicFormService, public helper: Helper, private adminComponent: AdminComponent,
    public permissionService: ConfigService, private commonService: CommonFileFTPService, private domSanitizer: DomSanitizer,
    private apiConfigurationService: ApiConfigurationService, public equipmentService: EquipmentService, public configService: ConfigService) { }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.permissionService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
      this.configService.loadprojectOfUserAndCreatorForLocation(this.currentUser.currentProjectLocationId).subscribe(response => {
        this.projectList = response.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
      });
      this.loadEquipmentsOnLocation(this.currentUser.currentProjectLocationId);
      this.loadCleanRoomForLocation(this.currentUser.currentProjectLocationId);
    });
    this.spinnerFlag = true;
    this.activeRouter.queryParams.subscribe(queryData => {
      this.equipmentStatusId = queryData.statusId;
      this.ccfId = queryData.ccfId;
      if (!this.helper.isEmpty(this.ccfId)) {
        this.isCCFStatus = true;
      }
      if (!this.helper.isEmpty(this.equipmentStatusId)) {
        this.loadEquipmentStatus();
        this.isEquipmentStatus = true;
      }
      if (queryData.status != undefined) {
        this.routeback = queryData.status;
        this.loadDynamicFormForProject(queryData);
        this.helper.changeMessageforId(queryData.id);
      } else {
        this.loadDynamicFormForProject(queryData);
        this.redirectUrl = queryData.redirectUrl;
      }
      if (queryData.documentSpecifiedConstant)
        this.documentSpecifiedConstant = queryData.documentSpecifiedConstant;
    });
    this.helper.listen().subscribe((m: any) => {
      this.spinnerFlag = true;
      this.service.getMinimalInfoBasedOnId(m).subscribe(resp => {
        this.isMapping = resp.mapping;
        const queryParams = {
          exists: true,
          id: resp.masterDynamicFormId,
          isMapping: '' + resp.mapping,
        };
        if (this.isMapping) {
          queryParams.id = resp.formMappingId;
          queryParams['documentCode'] = resp.dynamicFormCode;
        } else {
          queryParams.id = resp.id;
        }
        this.loadDynamicFormForProject(queryParams);
      }, error => this.spinnerFlag = false);
    })
  }

  loadEquipmentStatus() {
    this.equipmentStatusUpdateService.loadEquipmentStatusById(this.equipmentStatusId).subscribe(response => {
      if (response.result != null) {
        this.equipmentStatus = response.result;
        this.loadBatch(response.result.equipmentId);
      }
    });
  }

  loadDynamicFormForProject(queryData) {
    this.pdfViewButton = false;
    this.pdfView = false;
    this.isMapping = (queryData.isMapping == "true" ? true : false);
    this.service.loadDynamicFormForProject(queryData).subscribe(result => {
      if (result != null) {
        this.dynamicForm = result;
        if (this.dynamicForm.dynamicFormCode == null)
          this.dynamicForm.dynamicFormCode = ""
        this.dynamicForm.equipmentId = "" + result.equipmentId;
        this.dynamicForm.batchId = "" + result.batchId;
        this.loadFormLinkDropDown();
        this.addTableOnMasterFormSelection(true);
        if (this.isMapping) {
          if (queryData.partTab) {//for group form direct tab switch
            this.nextId = queryData.partTab;
            this.tabSwitch();
          }
          //for preview or edit 
          let publishCount = 0;
          this.dynamicForm.formDataList.forEach((element, i) => {
            if (element.publishedflag) {
              publishCount++;
            }
          });
          if (this.dynamicForm.formDataList.length != 0) {
            if (this.dynamicForm.formDataList.length == publishCount && !this.dynamicForm.workFlowCompletionFlag) {// both true direct PDF VIEW
              this.pdfView = true;
              this.documentPdfPreview(this.dynamicForm);
              this.pdfViewButton = true;
            }
          }
        } else {
          //for preview or edit 
          if (this.dynamicForm.publishedflag && !this.dynamicForm.workFlowCompletionFlag) {
            this.pdfView = true;
            this.pdfViewButton = true;
            this.documentPdfPreview(this.dynamicForm);
          }
        }
        this.toggleLoadFormData(this.nextId, this.isMapping);

      } else {
        this.spinnerFlag = false
      }
    }, error => {
      this.spinnerFlag = false;
    });
  }

  documentPdfPreview(data) {
    this.pdfURL = '';
    if (this.pdfView) {
      this.spinnerFlag = true;
      let dynamicForm = JSON.parse(JSON.stringify(data));
      this.service.loadPreviewDocument(dynamicForm).subscribe(resp => {
        this.spinnerFlag = false;
        if (resp != null) {
          const blob: Blob = new Blob([resp], { type: "application/pdf" });
          this.pdfURL = URL.createObjectURL(blob)
          this.pdfName = dynamicForm.dynamicFormCode + ".pdf";
        }
      }, err => {
        this.spinnerFlag = false;
      });
    }
  }

  saveDynamicFormData(valid, publishFlag, formDataOfMapping?) {
    this.dynamicForm.documentSpecifiedConstant = this.documentSpecifiedConstant
    this.spinnerFlag = true;
    this.submitted = true;
    let required = false;
    let checkBoxRequired = false;
    let fileRequiredTable = false;
    let checkBoxRequiredTable = false;
    if ((this.dynamicForm.projectEnabledFlag && this.dynamicForm.projectDropDownId == 0) || (this.dynamicForm.cleanRoomFlag && this.dynamicForm.cleanRoomId == 0) ||
      (this.dynamicForm.equipmentFlag && this.dynamicForm.equipmentId == 0)) {
      this.dropDownSelectionRequired = true;
    }
    for (let index = 0; index < this.inputField.length; index++) {
      const element = this.inputField[index];
      if (element.type == "file" && element.required == true) {
        if (element.values == undefined || element.values.length == 0) {
          required = true;
          break;
        }
      }
      if (element.type == "checkbox-group" && element.required == true) {
        if (element.values.filter(e => e.selected).length == 0) {
          if (element.other) {
            if (element.otherSelected) {
              element.value = new Array();
              if (element.otherValue != '')
                element.value.push(element.otherValue);
              else
                checkBoxRequired = true;
            } else {
              checkBoxRequired = true;
              break;
            }
          } else {
            checkBoxRequired = true;
            break;
          }
        } else {
          element.value = element.values.filter(e => e.selected).map(e => e.value);
        }
      }
      if (element.type == 'table') {
        for (let i = 0; i < element.rows.length; i++) {
          let row = element.rows[i];
          if (row.deleteFlag != 'Y') {
            for (let j = 0; j < row.row.length; j++) {
              const data = row.row[j];

              if (element.columns[j].type == "file" && element.columns[j].required) {
                if (data.values == undefined || data.values.length == 0) {
                  fileRequiredTable = true;
                  break;
                }
              }
              if (element.columns[j].type == "checkbox-group" && element.columns[j].required) {
                if (data.values.filter(e => e.selected).length == 0) {
                  element.checkBoxValidationFlag = false;
                  checkBoxRequiredTable = true;
                  break;
                } else {
                  element.checkBoxValidationFlag = true;
                }
              }
            }
          }
        }
      }
    }
    if (!valid || required || checkBoxRequired || fileRequiredTable || checkBoxRequiredTable || this.dropDownSelectionRequired) {
      this.spinnerFlag = false;
      return
    } else {
      let updateFlag = true;
      this.dynamicForm.publishedflag = publishFlag;
      if (formDataOfMapping == undefined) {
        this.dynamicForm.formData = JSON.stringify(this.inputField);
        if (this.dynamicForm.id == 0) {
          updateFlag = false;
        }
      } else {
        formDataOfMapping.formData = JSON.stringify(this.inputField);
        formDataOfMapping.flag = true;
        formDataOfMapping.publishedflag = publishFlag;
        if (formDataOfMapping.id == 0) {
          updateFlag = false;
        }
      }
      if (this.isEquipmentStatus)
        this.dynamicForm.equipmentStatusId = this.equipmentStatusId;
      if (this.isCCFStatus)
        this.dynamicForm.ccfId = Number(this.ccfId);
      this.dynamicForm.reasonForEdit = this.reasonForEdit;
      this.service.saveDynamicFormForProject(this.dynamicForm).subscribe(result => {
        if (result.result == "success") {
          let saveOrUpdateText = updateFlag ? 'Updated' : 'Saved';
          swal({
            title: (publishFlag ? (saveOrUpdateText + ' And Published') : saveOrUpdateText + ' Successfully!'),
            text: this.dynamicForm.templateName + ' Record has been ' + (updateFlag ? 'Updated.' : 'Saved.'),
            type: 'success',
            timer: 2000,
            showConfirmButton: false,
            onClose: () => {
              var queryParams = {
                exists: true,
                id: this.dynamicForm.masterDynamicFormId,
                isMapping: "" + this.isMapping,
              }
              if (this.isMapping) {
                queryParams.id = this.dynamicForm.formMappingId;
                queryParams["documentCode"] = result.documentCode;
              } else {
                queryParams.id = result.id;
              }
              this.adminComponent.loadNavBarForms();
              this.loadDynamicFormForProject(queryParams);
            }
          });
        } else {
          swal({
            title: 'Error in ' + (updateFlag ? 'Updating!' : 'Saving!'),
            text: this.dynamicForm.templateName + ' Record has not been ' + (updateFlag ? 'Updated' : 'Saved'),
            type: 'error',
            timer: 2000
          });
        }
        this.spinnerFlag = false;
      }, error => {
        this.spinnerFlag = false;
        swal({
          title: 'Error in ' + (updateFlag ? 'Updating' : 'Saving!'),
          text: this.dynamicForm.templateName + ' Record has not been ' + (updateFlag ? 'Updated' : 'Saved'),
          type: 'error',
          timer: 2000
        }
        );
      });
    }
  }

  setCheckedData(formJson, input) {
    input.value = formJson.filter(element => element.selected).map(element => element.value);
  }

  setCheckedAsRadio(formJson, event, value, input?) {
    event.srcElement.checked = true
    if (value == 'govalOther') {
      if (input.other) {
        if (!input.otherSelected) {
          input.otherSelected = true
        }
      }
    } else {
      if (input && input.other) {
        input.otherSelected = false;
        this.restValueOfOther(input);
      }
    }
    formJson.forEach(element => {
      element.selected = false;
      if (element.value == value) {
        element.selected = true;
      }
    });
  }

  deleteTemplateSwal(data) {
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
          data.userRemarks = "Comments : " + value;
          this.deleteTemplate(data);
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

  deleteTemplate(data) {
    this.spinnerFlag = true;
    let dynamicForm = data;
    this.service.deleteDynamicForm(dynamicForm)
      .subscribe((resp) => {
        this.spinnerFlag = false;
        let responseMsg: string = resp.result;
        if (responseMsg === "success") {
          swal({
            title: 'Deleted!',
            type: 'success',
            timer: 2000,
            showConfirmButton: false,
            onClose: () => {
              this.navigateDestination();
            }
          });
        } else {
          swal({
            title: 'Not Deleted!',
            text: this.dynamicForm.templateName + 'Record has not been Deleted',
            type: 'error',
            timer: 2000
          }
          );
        }
      }, (err) => {
        swal({
          title: 'Not Deleted!',
          text: this.dynamicForm.templateName + 'Record has not been Deleted',
          type: 'error',
          timer: 2000
        }
        );
        this.spinnerFlag = false;
      });
  }

  individualPermissions(typeId: any, uniqueConstant?) {
    this.permissionService.loadPermissionsBasedOnModule(typeId, uniqueConstant).subscribe(resp => {
      this.permissionModel = resp;
    });
  }

  onFileUpload(event, input, groupedFormName?) {
    input.value = ""
    if (document.getElementById("iframeView" + input.name)) {
      document.getElementById("iframeView" + input.name).remove();
      document.getElementById("#" + input.name).setAttribute("class", "form-group row");
    }
    const filePath = 'IVAL/' + this.currentUser.orgId + '/' + this.currentUser.projectName + '/' + this.currentUser.versionName + '/' + this.dynamicForm.permissionConstant + '/Attachments/';
    if (!input.values || !input.multiple)
      input.values = new Array();
    if (event.target.files.length != 0) {
      let totalFiles = event.target.files.length;
      for (let index = 0; index < totalFiles; index++) {
        this.spinnerFlag = true;
        let file = event.target.files[index];
        let fileName = file.name;
        this.permissionService.checkIsValidFileSize(file.size).subscribe(fileRes => {
          if (fileRes) {
            const formData: FormData = new FormData();
            formData.append('file', file, fileName);
            formData.append('filePath', filePath);
            formData.append('extension', fileName.split(".")[fileName.split(".").length - 1]);
            this.commonService.singleFileUpload(formData).subscribe(resp => {
              let date = Date.now();
              this.permissionService.getCurrentDate(date).subscribe(res => {
                var json = { path: resp.path, fileName: fileName, date: date, displayDate: res };
                input.values.unshift(json);
                this.spinnerFlag = false;
              }, error => { this.spinnerFlag = false; });

            }, error => {
              this.spinnerFlag = false;
            })
          } else {
            this.helper.fileSizeWarning(fileName);
            this.spinnerFlag = false;
            this.myInputVariable.nativeElement.value = "";
          }
        })
      }
    }
  }

  deleteUploadedFile(fileList, index, id) {
    fileList.splice(index, 1);
  }

  downloadFileOrView(fileName, filePath, viewFlag, id) {
    if (!viewFlag)
      this.commonService.downloadFileAudit(fileName, this.dynamicForm.templateName, "", this.dynamicForm.dynamicFormCode, "", this.dynamicForm.masterDynamicFormId);
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
    const parts = fileName.split('.');
    if (viewFlag && imageExtensions.includes(parts[parts.length - 1].toLowerCase())) {
      this.spinnerFlag = true;
      this.commonService.loadFile(filePath).subscribe(resp => {
        const STRING_CHAR = String.fromCharCode.apply(null, resp);
        let base64String = btoa(STRING_CHAR);
        this.imageurl = this.domSanitizer.bypassSecurityTrustUrl("data:image/jpeg;charset=utf-8;base64, " + base64String);
        this.spinnerFlag = false;
        this.showImageModal.show();
      }, err => {
        this.spinnerFlag = false;
      });
    } else {
      this.adminComponent.downloadOrViewFile(fileName, filePath, viewFlag);
    }
  }

  onlyNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyNumberWithDecimal(event, data) {
    const pattern = /[0-9]+(\.[0-9][0-9][0-9][0-9])?/;
    var char = data + String.fromCharCode(event.charCode);
    if (char.split(".").length > 2 && !/[0-9]/.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
    }
    if (event.keyCode != 5 && !pattern.test(char)) {
      event.preventDefault();
    }
  }

  navigateDestination() {
    if (this.routeback != null) {
      this.router.navigate([this.routeback]);
    } else {
      if (this.redirectUrl != null)
        this.adminComponent.redirect(this.redirectUrl)
      else
        this.adminComponent.redirect("/MainMenu");
    }
  }

  addRow(input) {
    this.inputField.forEach(element => {
      let jsonObject = {}
      if (element.id == input.id) {
        var labelViewNeeded = element.columns.filter(col => col.type == 'select' && col.multiple);
        var finalViewNeededData = labelViewNeeded;
        if (labelViewNeeded.length > 1) {
          var lengthList = labelViewNeeded.map(col => col.values.length)
          finalViewNeededData = labelViewNeeded.filter(col => lengthList.includes(col.values.length))
        }
        if (finalViewNeededData.length != 0) {
          if (finalViewNeededData[0].values.length != element.rows.length) {
            for (let index = 0; index < finalViewNeededData[0].values.length; index++) {
              let jsonArray = new Array();
              this.creatingRows(element, jsonArray, index, finalViewNeededData[0].values.length);
              jsonObject = {
                "row": jsonArray,
                "createdBy": this.currentUser.username,
                "createdTime": Date.now(),
                "id": 0,
                "deleteFlag": "N",
                'order': index
              }
              element.rows.push(jsonObject);
            }
          }
        } else {
          let jsonArray = new Array();
          this.creatingRows(element, jsonArray);
          jsonObject = {
            "row": jsonArray,
            "createdBy": this.currentUser.username,
            "createdTime": Date.now(),
            "id": 0,
            "deleteFlag": "N",
            'order': element.rows.length
          }
          element.rows.push(jsonObject);
        }
      }
      this.submitted = true;
    });
  }

  creatingRows(element, jsonArray, indexParent?, totalIndex?) {
    element.columns.forEach((col, index) => {
      let json = {}
      if (col.type != 'checkbox-group' && col.type != 'radio-group') {
        let values: any[];
        if (col.values)
          values = JSON.parse(JSON.stringify(col.values));//to keep source as it is
        if (col.multiple && values && values.length == totalIndex) {
          json = {
            name: (col.name + "-" + element.rows.length),
            value: values[indexParent] ? values[indexParent].label : ""
          }
        } else {
          this.switchForDefaultValue(col);
          if (col.type == 'select') {
            const defaultValue = col.values.filter(v => v.selected);
            if (defaultValue.length > 0) {
              col.value = defaultValue[0].value;
            }
          }
          json = {
            name: (col.name + "-" + element.rows.length),
            value: col.value
          }
        }
      } else {
        let values = JSON.parse(JSON.stringify(col.values));//to keep source as it is
        json = {
          name: (col.name + "-" + element.rows.length),
          values: values,
          checkBoxValidationFlag: false
        }
      }
      jsonArray.push(json)
    });
  }

  deleteRow(event, input, rowIndex) {
    let rows = input.rows;
    let fixedColumnFLag = true;
    for (const col in input.columns) {
      if (input.columns[col].type == 'select' && input.columns[col].multiple)
        fixedColumnFLag = false;
      break;

    }
    if (fixedColumnFLag) {
      if (event.srcElement.checked)
        rows[rowIndex].deleteFlag = "Y";
      else
        rows[rowIndex].deleteFlag = "N";
    } else {
      event.srcElement.checked = false;
    }
  }

  setCheckBoxValidation(tableJson) {
    tableJson.checkBoxValidationFlag = (tableJson.values.filter(e => e.selected).length != 0);
  }

  loadBatch(equipmentId) {
    this.spinnerFlag = true;
    this.batchList = new Array();
    this.service.loadBatchBasedOnEquipmentId(equipmentId).subscribe(result => {
      this.spinnerFlag = false;
      if (result != null) {
        this.batchList = result;
        if (this.isEquipmentStatus) {
          this.dynamicForm.batchId = this.equipmentStatus.batchId;
        } else {
          if (this.batchList.length != 0 && this.dynamicForm.id == 0)
            this.dynamicForm.batchId = this.batchList[0].key;
        }
      }
      this.batchList.push({ key: "0", value: "N/A" });
    }, err => { this.spinnerFlag = false; this.batchList.push({ key: "0", value: "N/A" }); })
  }

  switchForDefaultValue(json) {
    var d = new Date()
    if (!json.disabled)
      switch (json.type) {
        case 'date': json.value = (json.value == undefined || json.value == '') ? this.datePipe.transform(d, 'yyyy-MM-dd') : json.value;
          break;
        case 'time': json.value = (json.value == undefined || json.value == '') ? this.datePipe.transform(d, 'HH:mm') : json.value;
          break;
        case 'datetime-local': json.value = (json.value == undefined || json.value == '') ? (this.datePipe.transform(d, 'yyyy-MM-dd') + "T" + this.datePipe.transform(d, 'HH:mm')) : json.value;
          break;
        case 'select':
          if (!json.multiple && (json.value == undefined || json.value == '')) {
            let j = json.values.filter(j => j.selected);
            if (j.length > 0) {
              json.value = j[0].value;
            }
          }
          break;
        default: json.value = (json.value == undefined || json.value == '') ? "" : json.value;
          break;
      }
  }

  setDefaultValue(inputField) {
    this.inputField.filter(data => data.formulaCalculation).map(field => field["formulaCalculation"]);
    inputField.forEach(json => {
      if (json.formulaCalculation)
        json.disabled = true
      this.enableCalculate = (json.name === "viewFormula" && json.viewFormulaArr.length > 0) ? true : false;
      this.switchForDefaultValue(json);
    });
    // this.calculation(this.inputField);
  }

  reference(list) {
    let listOfReferences = new Array();
    list.filter(ele => ele.references).forEach(element => {
      listOfReferences.push(element);
    });
    listOfReferences.sort((a, b) => (+a.id) - (+b.id));
    listOfReferences.forEach(inputData => {
      if (inputData.references) {
        inputData.references.forEach(referenceElement => {
          let referenceValue = " ";
          list.forEach(jsonElement => {
            referenceElement.referenceId.forEach((refId, index) => {
              if (jsonElement.name == refId) {
                if ("select" === jsonElement.type) {
                  let value = "govalOther" === jsonElement.value ? jsonElement.otherValue : jsonElement.value;
                  if (!this.helper.isEmptyWithoutZeroCheck(value))
                    referenceValue = referenceValue + value + " " + (index != referenceElement.referenceId.length - 1 ? referenceElement.inBetween + " " : "");
                } else if (!this.helper.isEmptyWithoutZeroCheck(jsonElement.value))
                  referenceValue = referenceValue + jsonElement.value + " " + (index != referenceElement.referenceId.length - 1 ? referenceElement.inBetween + " " : "");
                else
                  referenceValue = referenceValue + jsonElement.value;
              }
            });
          });
          list.forEach(jsonElement => {
            if ("table" === jsonElement.type) {
              jsonElement.columns.forEach(e => {
                if (e.name === referenceElement.columnId) {
                  if ("suffix" === referenceElement.referenceType) {
                    e.label = e.dynamicLabel + referenceValue;
                  } else if ("prefix" === referenceElement.referenceType) {
                    e.label = referenceValue + e.dynamicLabel;
                  }
                }
              });
            }
          });
        });
      }
    });
  }

  /*START CALCULATION LOGIC*/
  calculation(list) {
    let listOfCalculation = new Array();
    list.filter(ele => ele.calculations).forEach(element => {
      listOfCalculation.push(element);
    });
    listOfCalculation.sort((a, b) => (+a.id) - (+b.id));
    listOfCalculation.forEach(inputData => {
      if (inputData.calculations) {
        inputData.calculations.forEach(calculation => {
          let y;
          let x;
          list.forEach(element => {
            if (element.name == calculation.operandTwoId) {
              y = element.value;
            }

            if (element.name == calculation.operandOneId) {
              x = element.value;
            }
          });
          if (calculation.operandTwoId == 'constant') {
            y = calculation.operandTwoConstant;
          }
          switch (inputData.type) {
            case 'number': this.numberCalculation(list, calculation, +x, +y);
              break;
            case 'date':
              this.dateCalculation(list, calculation, x, y);

              break;
            case 'datetime-local':
              this.dateTimeCalculation(list, calculation, x, y);
              break;
            case 'time': this.timeCalculation(list, calculation, x, y);
              break;
            case 'hidden': this.numberCalculation(list, calculation, +x, +y);
              break;
            default:
              break;
          }
        });
      }
    })
    this.conditionCheckFull(list);
  }

  calculationOfTableValue(list, tableId, fullJson) {
    let listOfCalculation = new Array();
    if (tableId) {
      let tableJSON = fullJson.filter(e => e.id == tableId)[0];
      tableJSON.columns.filter(ele => ele.calculations).forEach(element => {
        listOfCalculation.push(element);
      });
      fullJson.filter(ele => ele.calculations).forEach(element => {
        listOfCalculation.push(element);
      });
    }
    listOfCalculation.forEach(input => {
      if (input.calculations) {
        input.calculations.forEach(calculation => {
          let y;
          let x;
          list.forEach(element => {
            if (element.name.includes(calculation.operandTwoId))
              y = element.value;
            if (element.name.includes(calculation.operandOneId))
              x = element.value;
          });
          if (calculation.operandTwoId == 'constant') {
            y = calculation.operandTwoConstant;
          }
          if (!x) {
            let single = fullJson.filter(e => e.name != undefined && e.name.includes(calculation.operandOneId))
            if (single.length > 0)
              x = +single[0].value;
          }
          if (!y) {
            let single = fullJson.filter(e => e.name != undefined && e.name.includes(calculation.operandTwoId))
            if (single.length > 0)
              y = +single[0].value;
          }
          switch (input.type) {
            case 'number': this.numberCalculation(list, calculation, +x, +y);
              break;
            case 'date':
              this.dateCalculation(list, calculation, x, y);
              break;
            case 'datetime-local':
              this.dateTimeCalculation(list, calculation, x, y);
              break;
            case 'time': this.timeCalculation(list, calculation, x, y);
              break;
            case 'hidden': this.numberCalculation(list, calculation, +x, +y);
              break;
            default:
              break;
          }
        });
      }
    })
    this.conditionCheckForTableFull(tableId, fullJson, list);
    this.calculation(fullJson);
  }

  numberCalculation(list: any, calculation: any, x: number, y: number) {
    list.forEach(element => {
      if (element.name)
        if (element.name.includes(calculation.finalResultId)) {
          element.value = NaN;
          try {
            if (!isNaN(x) && !isNaN(y)) {
              var fixed = this.helper.getMaxDecimalPoint(x, y);
              switch (calculation.operator) {
                case "addition":
                  element.value = (x + y).toFixed(fixed);
                  break;
                case "subtraction":
                  element.value = (x - y).toFixed(fixed);
                  break;
                case "multiplication":
                  element.value = (x * y).toFixed(fixed);
                  break;
                case "division":
                  element.value = (x / y).toFixed(fixed == 0 ? 4 : fixed);
                  break;
                case "percentage":
                  element.value = (x * (y / 100)).toFixed(fixed);
                  break;
              }
            }
          } catch (error) {
            element.value = 0;
          }
        }
    });
  }

  dateCalculation(list: any, calculation: any, date1: any, date2OrConstant) {
    let finalResult;
    var date = new Date(Date.parse(date1));
    if (calculation.operandTwoId == 'constant') {
      if (calculation.operator == "addition") {
        finalResult = date.setDate(date.getDate() + date2OrConstant);
      } else {
        finalResult = date.setDate(date.getDate() - date2OrConstant);
      }
      finalResult = this.datePipe.transform(finalResult, 'yyyy-MM-dd');
    } else {
      var Difference_In_Time;
      if (calculation.operator == "addition") {
        Difference_In_Time = new Date(Date.parse(date2OrConstant)).getTime() + date.getTime();
      } else {
        Difference_In_Time = date.getTime() - new Date(Date.parse(date2OrConstant)).getTime();
      }
      finalResult = Difference_In_Time / (1000 * 3600 * 24);
    }

    list.forEach(element => {
      if (element.name)
        if (element.name.includes(calculation.finalResultId))
          element.value = finalResult;
    });
  }

  timeCalculation(list: any, calculation: any, time1: any, time2OrConstant: any) {
    let finalResult;
    var time = new Date(1970, 0, 0, time1.split(':')[0], time1.split(':')[1], 0);
    if (calculation.operandTwoId == 'constant') {
      if (calculation.operator == "addition") {
        finalResult = time.setTime(time.getTime() + (time2OrConstant * 60000));
      } else {
        finalResult = time.setTime(time.getTime() - (time2OrConstant * 60000));
      }

      finalResult = this.datePipe.transform(finalResult, 'HH:mm');
    } else {
      if (time2OrConstant) {
        var time2 = new Date(1970, 0, 0, time2OrConstant.split(':')[0], time2OrConstant.split(':')[1], 0);
        var Difference_In_Time;
        if (calculation.operator == "addition") {
          Difference_In_Time = time2.getTime() + time.getTime();
        } else {
          Difference_In_Time = time.getTime() - time2.getTime();
        }
        let diffMinutes = (Difference_In_Time / (60 * 1000)) % 60;
        let diffHours = (Difference_In_Time / (60 * 60 * 1000)) % 24;
        finalResult = ("" + diffHours).split(".")[0] + " hours," + ("" + diffMinutes).split(".")[0] + " minutes ";
      }
    }
    if (finalResult)
      list.forEach(element => {
        if (element.name)
          if (element.name.includes(calculation.finalResultId))
            element.value = finalResult;
      });
  }

  dateTimeCalculation(list: any, calculation: any, x: any, dateTime2OrConstant: any) {
    let finalResult;
    var dateTime = new Date(x);
    if (calculation.operandTwoId == 'constant') {
      if (calculation.operator == "addition") {
        finalResult = dateTime.setTime(dateTime.getTime() + (dateTime2OrConstant * 60000));
      } else {
        finalResult = dateTime.setTime(dateTime.getTime() - (dateTime2OrConstant * 60000));
      }
      finalResult = (this.datePipe.transform(dateTime, 'yyyy-MM-dd') + "T" + this.datePipe.transform(dateTime, 'HH:mm'));
    } else {
      if (dateTime2OrConstant) {
        var dateTime2 = new Date(dateTime2OrConstant);
        var Difference_In_Time;
        if (calculation.operator == "addition") {
          Difference_In_Time = dateTime.getTime() + dateTime2.getTime();
        } else {
          Difference_In_Time = dateTime.getTime() - dateTime2.getTime();
        }
        let diffDays = Difference_In_Time / (24 * 60 * 60 * 1000);
        let diffMinutes = (Difference_In_Time / (60 * 1000)) % 60;
        let diffHours = (Difference_In_Time / (60 * 60 * 1000)) % 24;
        finalResult = ("" + diffDays).split(".")[0] + " days, " + ("" + diffHours).split(".")[0] + " hours," + ("" + diffMinutes).split(".")[0] + " minutes ";
      }
    }
    if (finalResult)
      list.forEach(element => {
        if (element.name)
          if (element.name.includes(calculation.finalResultId))
            element.value = finalResult;
      });
  }
  /*END CALCULATION LOGIC*/

  toggleLoadFormData(nextId, isMapping) {
    if (isMapping) {
      this.nextId = nextId;
      try {
        this.groupFormPart = this.dynamicForm.formDataList[+nextId];
      } catch (error) {
        this.nextId = "0"
        this.groupFormPart = this.dynamicForm.formDataList[0];
      }
      if (this.groupFormPart) {
        this.inputField = JSON.parse(this.groupFormPart.formData);
        this.getIsWorkflowDocumentOrderSequence(this.groupFormPart.permissionUniqueConstant);
        this.individualconstants = this.groupFormPart.permissionUniqueConstant;
        this.individualId = this.groupFormPart.id;
        this.individualPermissions(this.groupFormPart.permissionConstant, this.groupFormPart.permissionUniqueConstant);
        this.adminComponent.setUpModuleForHelpContent(this.groupFormPart.permissionConstant);
        this.stepperfunction(this.groupFormPart.permissionUniqueConstant, this.dynamicForm.dynamicFormCode, this.groupFormPart.id, this.groupFormPart.publishedflag, this.groupFormPart.updatedTime, this.groupFormPart.displayCreatedTime, this.groupFormPart.displayUpdatedTime, this.groupFormPart.createdByName, this.groupFormPart.updatedByName)
      }
    } else {
      this.inputField = JSON.parse(this.dynamicForm.formData);
      this.getIsWorkflowDocumentOrderSequence(this.dynamicForm.permissionConstant);
      this.individualconstants = this.dynamicForm.permissionConstant;
      this.individualId = this.dynamicForm.id;
      this.individualPermissions(this.dynamicForm.permissionConstant, '');
      this.adminComponent.setUpModuleForHelpContent(this.dynamicForm.permissionConstant);
      this.stepperfunction(this.dynamicForm.permissionConstant, this.dynamicForm.dynamicFormCode, this.dynamicForm.id, this.dynamicForm.publishedflag, this.dynamicForm.updatedTime, this.dynamicForm.displayCreatedTime, this.dynamicForm.displayUpdatedTime, this.dynamicForm.createdByName, this.dynamicForm.updatedByName)
    }
    this.setDefaultValue(this.inputField);
    if (this.auditSingleView && this.auditSingleView.viewFlag)//when audit is in view and tab is changes need to update the audit
      this.auditSingleView.loadData(this.individualconstants, this.individualId);
    if (this.dynamicForm.equipmentId == 0) {
      this.service.loadEquipmentListForForm(this.dynamicForm.masterDynamicFormId, this.dynamicForm.formMappingId).subscribe(resp => {
        if (resp != null)
          this.equipmentList = resp;
        if (this.isEquipmentStatus) {
          this.dynamicForm.equipmentId = "" + this.equipmentStatus.equipmentId;
          this.dynamicForm.equipmentName = this.equipmentStatus.equipmentName;
        } else {
          if (this.equipmentList.length == 1) {
            this.dynamicForm.equipmentId = Number(this.equipmentList[0].key);
            this.dynamicForm.equipmentName = this.equipmentList[0].value;
            this.loadBatch(this.dynamicForm.equipmentId);
          } else {
            this.loadBatch(this.dynamicForm.equipmentId);
            this.spinnerFlag = false;
          }
        }
      }, err => { this.spinnerFlag = false; });
    }
    else {
      this.dynamicForm.equipmentId = Number(this.dynamicForm.equipmentId)
      this.loadBatch(this.dynamicForm.equipmentId);
    }
  }

  getIsWorkflowDocumentOrderSequence(constant: any) {
    this.permissionService.isWorkflowDocumentOrderSequence(constant).subscribe(resp => {
      this.isWorkflowDocumentOrderSequence = resp;
    });
  }

  documentPreview(formDataOfMapping) {
    this.spinnerFlag = true;
    if (formDataOfMapping == undefined) {
      this.dynamicForm.formData = JSON.stringify(this.inputField);
    } else {
      formDataOfMapping.formData = JSON.stringify(this.inputField);
      formDataOfMapping.flag = true;
    }
    if (this.isEquipmentStatus)
      this.dynamicForm.equipmentStatusId = this.equipmentStatusId;
    this.service.loadPreviewDocument(this.dynamicForm).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp != null) {
        this.adminComponent.previewByBlob(this.dynamicForm.dynamicFormCode + '_Preview.pdf', resp, true, 'Preview');
      }
    });
  }

  downloadTemplate(type) {
    this.spinnerFlag = true;
    let fileExtetsion = this.dynamicForm.previewFileExtention;
    if (type === "pdf")
      fileExtetsion = "pdf";
    let fileName = Date.now() + "." + type;
    this.dynamicForm.downloadDocType = type;
    this.service.downloadPreviewDocument(this.dynamicForm).subscribe(resp => {
      this.adminComponent.previewByBlob(fileName, resp, false, 'Preview');
      this.spinnerFlag = false;
    });
  }

  stepperfunction(documentConstant, code, id, publishedflag, updatedTime, displayCreatedTime, displayUpdatedTime, creatorId, updatedBy) {
    this.publishedFlag = publishedflag;
    const stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = documentConstant;
    stepperModule.code = code;
    stepperModule.documentIdentity = id;
    stepperModule.publishedFlag = publishedflag;
    stepperModule.creatorId = this.dynamicForm.createdBy;
    stepperModule.lastupdatedTime = updatedTime;
    stepperModule.displayCreatedTime = displayCreatedTime;
    stepperModule.displayUpdatedTime = displayUpdatedTime;
    stepperModule.createdBy = creatorId;
    stepperModule.updatedBy = updatedBy;
    this.helper.stepperchange(stepperModule);
  }

  // --------------------Condition Check-----------------------------//
  conditionCheckFull(inputFeild) {
    let conditionJsonForInput = new Array();
    // Add existing condition
    inputFeild.filter(e => e.conditions).forEach(element => {
      conditionJsonForInput.push({ 'input': element.name, 'conditions': element.conditions });
    });
    if (conditionJsonForInput.length > 0) {
      conditionJsonForInput.forEach(element => {
        this.conditionCheck(element.conditions, element.input, inputFeild);
      })
    }
  }

  conditionCheck(conditionList: any[], inputVariableName: string, inputFeilds) {
    let list = conditionList.filter(con => inputVariableName.includes(con.operandOneId) || inputVariableName.includes(con.operandTwoId));
    if (list.length > 0) {
      list.forEach(condition => {
        let result = this.getTheConditionValue(condition, inputFeilds, inputVariableName);
        inputFeilds.forEach(element => {
          if (element.name)
            if (element.name.includes(condition.resultOperandId)) {
              element.value = result['outPutValue'];
              element.color = result['outPutColor'];
            }
        });
      })
    }
  }

  conditionCheckForTableFull(tableId, fullJson, rows) {
    let conditionJsonForInput = new Array();
    if (tableId) {
      let tableJSON = fullJson.filter(e => e.id == tableId)[0];
      tableJSON.columns.filter(e => e.conditions).forEach(element => {
        conditionJsonForInput.push({ 'input': element.name, 'conditions': element.conditions });

      });
    }
    if (conditionJsonForInput.length > 0) {
      conditionJsonForInput.forEach(element => {
        this.conditionCheckForTable(element.conditions, element.input, rows, tableId, fullJson);
      });
    }
  }

  conditionCheckForTable(conditionList: any[], inputVariableName: string, inputFeilds, tableId, fullJson) {
    let list = conditionList.filter(con => inputVariableName.includes(con.operandOneId) || inputVariableName.includes(con.operandTwoId));
    if (list.length > 0) {
      list.forEach(condition => {
        let tableJSON;
        let withInJson: any[] = inputFeilds.map(e => e.name);
        if (tableId) {
          tableJSON = fullJson.filter(e => e.id == tableId)[0];
          withInJson = tableJSON.columns.map(e => e.name);
        }
        //json is there in list itself 
        if (withInJson.includes(condition.resultOperandId)) {
          let result = this.getTheConditionValue(condition, inputFeilds, inputVariableName, fullJson);
          inputFeilds.forEach(element => {
            if (element.name)
              if (element.name.includes(condition.resultOperandId)) {
                element.value = result['outPutValue'];
                element.color = result['outPutColor'];
              }
          });
        } else {
          // we need cumilative result
          if (tableJSON) {
            let result = new Array();
            for (let index = 0; index < tableJSON.rows.length; index++) {
              const element = tableJSON.rows[index];
              result.push(this.getTheConditionValue(condition, element.row, inputVariableName, fullJson));
              let finalResult = { 'outPutValue': condition.defaultValue, 'outPutColor': condition.defaultColor };
              let finalResultList = result.map(e => e.outPutValue);
              if (!finalResultList.includes(condition.defaultValue)) {
                finalResult = result[0];
              }
              fullJson.forEach(element => {
                if (element.name)
                  if (element.name.includes(condition.resultOperandId)) {
                    element.value = finalResult['outPutValue'];
                    element.color = finalResult['outPutColor'];
                  }
              });
            }
          }
        }
      })
    }
  }

  getTheConditionValue(condition: ConditionDTO, inputFeilds, inputName, fullJson?): object {
    let y;
    let x;
    let result;
    switch (condition.type) {
      case 'range':
        x = inputName
        result = this.rangeCalculation(condition, x, inputFeilds, fullJson);
        break;
      case 'comparator':
        inputFeilds.forEach(element => {
          if (element.name && element.name.includes(condition.operandTwoId))
            y = element.value;
          if (element.name && element.name.includes(condition.operandOneId))
            x = element.value;
        });
        if (condition.operandTwoId == 'constant') {
          y = condition.constantValue;
        }
        //out side of range
        if (fullJson) {
          if (!x) {
            let xValue = fullJson.filter(e => e.name && e.name.includes(condition.operandOneId))
            if (xValue.length > 0)
              x = xValue[0].value == '' ? NaN : xValue[0].value;
          }
          if (!y) {
            let yValue = fullJson.filter(e => e.name && e.name.includes(condition.operandTwoId));
            if (yValue.length > 0)
              y = yValue[0].value == '' ? NaN : yValue[0].value;
          }
        }
        result = this.comparatorCalculation(x, y, condition);
        break;
    }
    return result;
  }

  checkInputAndOutPutAreTable(): boolean {
    let result = false;
    return result;
  }

  comparatorCalculation(x: string, y: string, condition: ConditionDTO): object {
    let result = { outPutValue: '', outPutColor: '#ffffff' };
    let outPut = false;
    if (!isNullOrUndefined(x) && !isNullOrUndefined(y) && (x != '' || y != '')) {
      let typeNumber = false;
      try {
        typeNumber = !isNaN(Number.parseInt(x));
      } catch (error) {
        typeNumber = false;
      }
      switch (condition.operator) {
        case 'equals':
          if (typeNumber) {
            try {
              outPut = +x == +y
            } catch (error) {
              outPut = false;
            }
          } else {
            if (condition.caseSensitive) {
              outPut = ('' + x).toLocaleLowerCase() == ('' + y).toLocaleLowerCase();
            } else {
              outPut = x == y;
            }
          }
          break;
        case 'notEqualTo':
          if (typeNumber) {
            try {
              outPut = +x != +y
            } catch (error) {
              outPut = false;
            }
          } else {
            if (!condition.caseSensitive) {
              outPut = ('' + x).toLocaleLowerCase() != ('' + y).toLocaleLowerCase();
            } else {
              outPut = x != y;
            }
          }
          break;
        case 'greaterThan':
          if (typeNumber) {
            try {
              outPut = +x > +y
            } catch (error) {
              outPut = false;
            }
          } else {
            outPut = false;
          }
          break;
        case 'greaterThanEqual':
          if (typeNumber) {
            try {
              outPut = +x >= +y
            } catch (error) {
              outPut = false;
            }
          } else {
            outPut = false;
          }
          break;
        case 'lessThan':
          if (typeNumber) {
            try {
              outPut = +x < +y
            } catch (error) {
              outPut = false;
            }
          } else {
            outPut = false;
          }
          break;
        case 'lessThanEqual':
          if (typeNumber) {
            try {
              outPut = +x <= +y
            } catch (error) {
              outPut = false;
            }
          } else {
            outPut = false;
          }
          break;
      }
    } else {
      result['outPutValue'] = '';
      result['outPutColor'] = "#ffffff";
      return result;
    }
    if (outPut) {
      result['outPutValue'] = condition.outPutValue;
      result['outPutColor'] = condition.color;
    } else {
      result['outPutValue'] = condition.defaultValue;
      result['outPutColor'] = condition.defaultColor;
    }
    return result;
  }

  rangeCalculation(range: ConditionDTO, rangleToBeCheckFor, list, fullJson?): object {
    let result = { outPutValue: '', outPutColor: '#ffffff' };
    let outPutValue;
    let outPutColor;
    for (let index = 0; index < range.conditionChild.length; index++) {
      const rangeData: ConditionChildDTO = range.conditionChild[index];
      let lowerLimitValue;
      let upperLimitValue;
      let value;
      list.forEach(element => {
        if (element.name.includes(rangeData.lowerLimitValue))
          lowerLimitValue = element.value == '' ? NaN : element.value;
        if (element.name.includes(rangeData.upperLimitValue))
          upperLimitValue = element.value == '' ? NaN : element.value;
        if (element.name.includes(rangleToBeCheckFor))
          value = element.value == '' ? NaN : element.value;
      });
      if (rangeData.lowerLimitValue == 'constant') {
        lowerLimitValue = +rangeData.lowerConstantValue;
      }
      if (rangeData.upperLimitValue == 'constant') {
        upperLimitValue = +rangeData.upperConstantValue;
      }
      //If range is out side of table
      if (fullJson) {
        if (!upperLimitValue) {
          let ulv = fullJson.filter(e => e.name != undefined && e.name.includes(rangeData.upperLimitValue))
          if (ulv.length > 0)
            upperLimitValue = ulv[0].value == '' ? NaN : ulv[0].value;
        }
        if (!lowerLimitValue) {
          let llv = fullJson.filter(e => e.name != undefined && e.name.includes(rangeData.lowerLimitValue));
          if (llv.length > 0)
            lowerLimitValue = llv[0].value == '' ? NaN : llv[0].value;
        }
      }
      if (!isNaN(upperLimitValue) && !isNaN(lowerLimitValue) && !isNaN(value)) {
        value = +value;
        lowerLimitValue = +lowerLimitValue;
        upperLimitValue = +upperLimitValue;
        switch (rangeData.lowerLimitCondition + rangeData.upperLimitCondition) {
          case 'greaterThanlessThan':
            if (value > lowerLimitValue && value < upperLimitValue) {
              outPutValue = rangeData.outPutValue;
              outPutColor = rangeData.color;
            }
            break;
          case 'greaterThanlessThanEqual':
            if (value > lowerLimitValue && value <= upperLimitValue) {
              outPutValue = rangeData.outPutValue;
              outPutColor = rangeData.color;
            }
            break;
          case 'greaterThanEquallessThan':
            if (value >= lowerLimitValue && value < upperLimitValue) {
              outPutValue = rangeData.outPutValue;
              outPutColor = rangeData.color;
            }
            break;
          case 'greaterThanEquallessThanEqual':
            if (value >= lowerLimitValue && value <= upperLimitValue) {
              outPutValue = rangeData.outPutValue;
              outPutColor = rangeData.color;
            }
            break;
        }
      } else {
        outPutValue = '';
        outPutColor = "#ffffff";
      }
    }
    //No result found so set default value 
    if (!outPutValue && !outPutColor) {
      outPutValue = range.defaultValue;
      outPutColor = range.defaultColor;
    }
    result['outPutValue'] = outPutValue;
    result['outPutColor'] = outPutColor;
    return result;
  }
  // ---------------------------------------------

  generateQRCode() {
    this.spinnerFlag = true;
    this.service.generateQRCode(this.dynamicForm).subscribe(resp => {
      swal({
        title: 'QR Code!',
        html: '',
        type: undefined,
        showConfirmButton: true,
        imageAlt: "",
        imageUrl: 'data:image/png;base64,' + resp,
        imageHeight: 200,
        imageWidth: 200,
        timer: 20000,
        onClose: () => {
        }
      });
      this.spinnerFlag = false;
    })
  }

  addTableOnMasterFormSelection(editLoadFlag?) {
    this.service.loadFormDataOfMasterFormIds(this.dynamicForm.masterLinkIds, this.dynamicForm.permissionConstant).subscribe(resp => {
      this.masterFormDataList = resp;
      this.dynamicJsonTable = new Array();
      this.dynamicForm.masterLinkIds.forEach(id => {
        let masterData = this.masterFormList.filter(f => f.value == id)[0];
        if (masterData)
          this.dynamicJsonTable.push({
            master: id,
            tableData: {
              rows: resp.filter(json => json.masterId == id).map(json => json.jsonData),
              columns: this.createColumns(JSON.parse(masterData.jsonData))
            },
            masterName: masterData.label,
            filterQuery: ''
          })
      })
      if (!editLoadFlag) {
        this.dynamicForm.masterDataLinkIds = new Array();
      } else {
        this.viewSelectedMasterDetails()
      }

    });
  }

  createColumns(jsonArray: any[]): any[] {
    let columns = new Array();
    columns.push("Action");
    columns.push("Id");
    columns.push("Code");
    jsonArray.forEach(json => {
      if (json.type != 'table')
        columns.push(json.label);
    });
    return columns;
  }

  loadFormLinkDropDown() {
    let documentType = ""
    if (this.isMapping) {
      documentType = this.dynamicForm.formDataList[0].permissionUniqueConstant
    } else {
      documentType = this.dynamicForm.permissionConstant
    }
    this.service.loadLinkedFormAsDropDown(documentType).subscribe(resp => {
      this.masterFormList = resp;
    })
  }

  openModal() {
    this.setFlagTrue();
    this.masterFormSlectionModal.show();
  }

  setFlagTrue() {
    this.dynamicJsonTable.forEach(table => {
      table.tableData.rows.forEach(row => {
        if (this.dynamicForm.masterDataLinkIds.indexOf(row[1]) != -1) {
          row[0] = 'true';
        } else {
          row[0] = 'false';
        }
      })
    });
    this.viewSelectedMasterDetails();
  }

  closeMasterFormSlectionPopUp(flag) {
    this.masterFormSlectionModal.hide();
    if (flag) {
      this.dynamicJsonTable.forEach(table => {
        for (let index = 0; index < table.tableData.rows.length; index++) {
          table.filterQuery = '';
          if (table.tableData.rows[index][0] == 'true') {
            this.dynamicForm.masterDataLinkIds.push(table.tableData.rows[index][1]);
          } else {
            if (this.dynamicForm.masterDataLinkIds.indexOf(table.tableData.rows[index][1]) != -1)
              this.dynamicForm.masterDataLinkIds.splice(this.dynamicForm.masterDataLinkIds.indexOf(table.tableData.rows[index][1]), 1);
          }
        }
      })
      this.dynamicForm.masterDataLinkIds = this.dynamicForm.masterDataLinkIds.sort((a, b) => (+a - +b));
    }
    this.dynamicForm.masterDataLinkIds = this.dynamicForm.masterDataLinkIds.map(d => d);
    this.viewSelectedMasterDetails();
  }

  viewSelectedMasterDetails() {
    this.dynamicJsonTableView = JSON.parse(JSON.stringify(this.dynamicJsonTable))
    this.dynamicJsonTableView.forEach(table => {
      let newArray = new Array();
      for (let index = 0; index < table.tableData.rows.length; index++) {
        if (this.dynamicForm.masterDataLinkIds.indexOf(table.tableData.rows[index][1]) != -1) {
          newArray.push(table.tableData.rows[index]);
        }
      }
      table.tableData.rows = newArray;
    });
  }

  saveReasonForEdit(valid, formDataOfMapping?) {
    this.submitted = true;
    let required = false;
    let checkBoxRequired = false;
    let fileRequiredTable = false;
    let checkBoxRequiredTable = false;
    if((this.dynamicForm.projectEnabledFlag && this.dynamicForm.projectDropDownId == 0) || (this.dynamicForm.cleanRoomFlag && this.dynamicForm.cleanRoomId == 0) || 
    (this.dynamicForm.equipmentFlag && this.dynamicForm.equipmentId == 0)){
    this.dropDownSelectionRequired = true;
    }
    for (let index = 0; index < this.inputField.length; index++) {
      const element = this.inputField[index];
      if (element.type == "file" && element.required == true) {
        if (element.values == undefined || element.values.length == 0) {
          required = true;
          break;
        }
      }
      if (element.type == "checkbox-group" && element.required == true) {
        if (element.values.filter(e => e.selected).length == 0) {
          if (element.other) {
            if (element.otherSelected) {
              element.value = new Array();
              if (element.otherValue != '')
                element.value.push(element.otherValue);
              else
                checkBoxRequired = true;
            } else {
              checkBoxRequired = true;
              break;
            }
          } else {
            checkBoxRequired = true;
            break;
          }
        } else {
          element.value = element.values.filter(e => e.selected).map(e => e.value);
        }
      }
      if (element.type == 'table') {
        for (let i = 0; i < element.rows.length; i++) {
          let row = element.rows[i];
          if (row.deleteFlag != 'Y') {
            for (let j = 0; j < row.row.length; j++) {
              const data = row.row[j];

              if (element.columns[j].type == "file" && element.columns[j].required) {
                if (data.values == undefined || data.values.length == 0) {
                  fileRequiredTable = true;
                  break;
                }
              }
              if (element.columns[j].type == "checkbox-group" && element.columns[j].required) {
                if (data.values.filter(e => e.selected).length == 0) {
                  element.checkBoxValidationFlag = false;
                  checkBoxRequiredTable = true;
                  break;
                } else {
                  element.checkBoxValidationFlag = true;
                }
              }
            }
          }
        }
      }
    }
    //|| !this.isFormulaCalculated removed condition
    if (!valid || required || checkBoxRequired || fileRequiredTable || checkBoxRequiredTable || this.dropDownSelectionRequired) {
      return
    } else {
      this.showModal = true;
      this.isFormValid = valid;
      this.formData = formDataOfMapping;
    }
  }

  saveReasonData() {
    this.saveDynamicFormData(this.isFormValid, false, this.formData);
    this.showModal = false;
    this.reasonForEdit = "";
  }

  onCloseReasonForEditPopup() {
    this.showModal = false;
    this.reasonForEdit = "";
  }

  verify(documentType, documentCode, documentId) {
    this.formVerification.openMyModal(documentType, documentCode, documentId);
  }

  editMasterReference(id) {
    this.inputFieldMasterReference = new Array();
    this.submittedMasterReference = false;
    this.alterMasterFormReference.show();
    this.alterMasterFormReference.spinnerShow();
    this.service.loadDynamicFormBasedOnId(id).subscribe(resp => {
      this.masterReferenceForm = resp;
      this.inputFieldMasterReference = JSON.parse(this.masterReferenceForm.formData);
      this.alterMasterFormReference.spinnerHide();
    })
  }

  updateMasterReference() {
    this.alterMasterFormReference.spinnerShow();
    this.submittedMasterReference = true;
    if (!this.formExtendedComponent.validateChildForm()) {
      this.alterMasterFormReference.spinnerHide();
      return;
    } else {
      this.masterReferenceForm.urlHitFrom = "MasterReferenceEdit"
      this.masterReferenceForm.formData = JSON.stringify(this.inputFieldMasterReference)
      this.service.saveDynamicFormForProject(this.masterReferenceForm).subscribe(result => {
        this.alterMasterFormReference.spinnerHide();
        if (result.result == "success") {
          swal({
            title: 'Updated Successfully!',
            text: this.masterReferenceForm.templateName + ' Record has been Updated',
            type: 'success',
            timer: 2000,
            showConfirmButton: false,
            onClose: () => {
              this.addTableOnMasterFormSelection(true);
            }
          });
        } else {
          swal({
            title: 'Error in Updating!',
            text: this.dynamicForm.templateName + ' Record has not been Updated',
            type: 'error',
            timer: 2000
          });
        }
        this.spinnerFlag = false;
      }, error => {
        this.alterMasterFormReference.spinnerHide();
        swal({
          title: 'Error in Updating!',
          text: this.dynamicForm.templateName + ' Record has not been Updated',
          type: 'error',
          timer: 2000
        });
      });
    }
  }

  closeMasterFormRefrence() {
    this.submittedMasterReference = false;
    this.alterMasterFormReference.hide();
  }

  restValueOfOther(input) {
    input.otherValue = '';
  }

  getAPIData() {
    this.parametersFormSubmitted = false;
    this.spinnerFlag = true;
    this.apiConfigurationService.getAPIParameters(this.dynamicForm.formMappingId, this.dynamicForm.permissionConstant).subscribe(reponse => {
      this.apiParameters = reponse.parameters;
      this.isAPIBackgroundJob = reponse.backgroundJob;
      this.spinnerFlag = false;
      if (this.apiParameters.length > 0) {
        this.apiGetDataModal.show();
      } else {
        this.spinnerFlag = true;
        this.submitted = true;
        let required = false;
        let checkBoxRequired = false;
        let fileRequiredTable = false;
        let checkBoxRequiredTable = false;
        for (let index = 0; index < this.inputField.length; index++) {
          const element = this.inputField[index];
          if (element.type == "file" && element.required == true) {
            if (element.values == undefined || element.values.length == 0) {
              required = true;
              break;
            }
          }
          if (element.type == "checkbox-group" && element.required == true) {
            if (element.values.filter(e => e.selected).length == 0) {
              if (element.other) {
                if (element.otherSelected) {
                  element.value = new Array();
                  if (element.otherValue != '')
                    element.value.push(element.otherValue);
                  else
                    checkBoxRequired = true;
                } else {
                  checkBoxRequired = true;
                  break;
                }
              } else {
                checkBoxRequired = true;
                break;
              }
            } else {
              element.value = element.values.filter(e => e.selected).map(e => e.value);
            }
          }
          if (element.type == 'table') {
            for (let i = 0; i < element.rows.length; i++) {
              let row = element.rows[i];
              if (row.deleteFlag != 'Y') {
                for (let j = 0; j < row.row.length; j++) {
                  const data = row.row[j];
                  if (element.columns[j].type == "file" && element.columns[j].required) {
                    if (data.values == undefined || data.values.length == 0) {
                      fileRequiredTable = true;
                      break;
                    }
                  }
                  if (element.columns[j].type == "checkbox-group" && element.columns[j].required) {
                    if (data.values.filter(e => e.selected).length == 0) {
                      element.checkBoxValidationFlag = false;
                      checkBoxRequiredTable = true;
                      break;
                    } else {
                      element.checkBoxValidationFlag = true;
                    }
                  }
                }
              }
            }
          }
        }
        if (this.isAPIBackgroundJob && (!this.formValidation.valid || required || checkBoxRequired || fileRequiredTable || checkBoxRequiredTable)) {
          this.spinnerFlag = false;
          return
        } else {
          if (this.groupFormPart == undefined) {
            this.dynamicForm.formData = JSON.stringify(this.inputField);
          } else {
            this.groupFormPart.formData = JSON.stringify(this.inputField);
            this.groupFormPart.flag = true;
          }
          if (this.isEquipmentStatus)
            this.dynamicForm.equipmentStatusId = this.equipmentStatusId;
          if (this.isCCFStatus)
            this.dynamicForm.ccfId = Number(this.ccfId);
          this.dynamicForm.apiBackgroundJob = this.isAPIBackgroundJob;
          this.apiConfigurationService.getAPIDataForForm(this.dynamicForm).subscribe(reponse => {
            if (reponse.apiSuccessFlag) {
              swal(
                'API Success',
                reponse.apiMessage,
                'success'
              ).then(responseMsg => {
                this.dynamicForm = reponse;
                if (this.isMapping) {
                  this.toggleLoadFormData(this.nextId, this.isMapping)
                } else {
                  this.inputField = JSON.parse(this.dynamicForm.formData);
                  this.toggleLoadFormData("-1", this.isMapping)
                }
              });
            } else {
              swal(
                'API Error',
                reponse.apiMessage + ', Please Contact Administrator',
                'error'
              ).then(responseMsg => {
              });
            }
            this.spinnerFlag = false;
          });
        }
      }
    });
  }

  getparametersData(form: NgForm) {
    this.parametersFormSubmitted = true;
    if (!form.valid) {
      return
    } else {
      this.apiGetDataModal.hide();
      this.dynamicForm.parameters = this.apiParameters;
      this.dynamicForm.apiBackgroundJob = this.isAPIBackgroundJob;
      this.spinnerFlag = true;
      this.submitted = true;
      let required = false;
      let checkBoxRequired = false;
      let fileRequiredTable = false;
      let checkBoxRequiredTable = false;
      for (let index = 0; index < this.inputField.length; index++) {
        const element = this.inputField[index];
        if (element.type == "file" && element.required == true) {
          if (element.values == undefined || element.values.length == 0) {
            required = true;
            break;
          }
        }
        if (element.type == "checkbox-group" && element.required == true) {
          if (element.values.filter(e => e.selected).length == 0) {
            if (element.other) {
              if (element.otherSelected) {
                element.value = new Array();
                if (element.otherValue != '')
                  element.value.push(element.otherValue);
                else
                  checkBoxRequired = true;
              } else {
                checkBoxRequired = true;
                break;
              }
            } else {
              checkBoxRequired = true;
              break;
            }
          } else {
            element.value = element.values.filter(e => e.selected).map(e => e.value);
          }
        }
        if (element.type == 'table') {
          for (let i = 0; i < element.rows.length; i++) {
            let row = element.rows[i];
            if (row.deleteFlag != 'Y') {
              for (let j = 0; j < row.row.length; j++) {
                const data = row.row[j];

                if (element.columns[j].type == "file" && element.columns[j].required) {
                  if (data.values == undefined || data.values.length == 0) {
                    fileRequiredTable = true;
                    break;
                  }
                }
                if (element.columns[j].type == "checkbox-group" && element.columns[j].required) {
                  if (data.values.filter(e => e.selected).length == 0) {
                    element.checkBoxValidationFlag = false;
                    checkBoxRequiredTable = true;
                    break;
                  } else {
                    element.checkBoxValidationFlag = true;
                  }
                }
              }
            }
          }
        }
      }
      if (this.isAPIBackgroundJob && (!this.formValidation.valid || required || checkBoxRequired || fileRequiredTable || checkBoxRequiredTable)) {
        this.spinnerFlag = false;
        return
      } else {
        if (this.groupFormPart == undefined) {
          this.dynamicForm.formData = JSON.stringify(this.inputField);
        } else {
          this.groupFormPart.formData = JSON.stringify(this.inputField);
          this.groupFormPart.flag = true;
        }
        if (this.isEquipmentStatus)
          this.dynamicForm.equipmentStatusId = this.equipmentStatusId;
        if (this.isCCFStatus)
          this.dynamicForm.ccfId = Number(this.ccfId);
        this.dynamicForm.apiBackgroundJob = this.isAPIBackgroundJob;
        this.apiConfigurationService.getAPIDataForForm(this.dynamicForm).subscribe(reponse => {
          if (reponse.apiSuccessFlag) {
            swal(
              'API Success',
              'API Success',
              'success'
            ).then(responseMsg => {
              this.dynamicForm = reponse;
              if (this.isMapping) {
                this.toggleLoadFormData(this.nextId, this.isMapping)
              } else {
                this.inputField = JSON.parse(this.dynamicForm.formData);
                this.toggleLoadFormData("-1", this.isMapping)
              }
            });
          } else {
            swal(
              'API Error',
              reponse.apiMessage + ', Please Contact Administrator',
              'error'
            ).then(responseMsg => {
            });
          }
          this.spinnerFlag = false;
        });
      }
      form.resetForm();
    }
  }

  resetParameterForm(form: NgForm) {
    form.resetForm();
  }

  downloadRawPDF() {
    let fileName = this.dynamicForm.dynamicFormCode + "_RawData.pdf";
    if (this.dynamicForm.apiRawDataFilePath.includes(".xlsx"))
      fileName = this.dynamicForm.dynamicFormCode + "_RawData.xlsx";
    this.downloadFileOrView(fileName, this.dynamicForm.apiRawDataFilePath, false, "");
  }

  tabSwitch() {
    if (this.isMapping) {
      const interval = setInterval(() => {
        if (this.tabSet) {
          this.tabSet.activeId = this.nextId;
          clearInterval(interval);
        }
      }, 600);
    }
  }

  createTask(input, dynamicForm: DynamicFormDTO, groupPart?) {
    if (groupPart) {
      this.adminComponent.taskDocType = '' + dynamicForm.value;
      this.adminComponent.taskDocTypeUniqueId = '' + groupPart.id;
    } else {
      this.adminComponent.taskDocType = dynamicForm.permissionConstant;
      this.adminComponent.taskDocTypeUniqueId = '' + dynamicForm.id;
    }
    this.adminComponent.taskEquipmentId = +this.dynamicForm.equipmentId;
    var dueDate;
    if (input.type == 'date') {
      if (input.value)
        dueDate = input.value;
      let dateLocal = new Date(dueDate);
      dueDate = { year: dateLocal.getFullYear(), month: dateLocal.getMonth() + 1, day: dateLocal.getDate() };
    } else if (input.type == 'datetime-local') {
      if (input.value) {
        let splitDate = input.value.split("T")
        let dateLocal = new Date(splitDate[0]);
        dueDate = { year: dateLocal.getFullYear(), month: dateLocal.getMonth() + 1, day: dateLocal.getDate() };
      }
    }
    this.adminComponent.loadTaskDetails(dueDate, input.label ? (input.label).replace("\\<.*?\\>", "") : '');
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.loadOutline();
  }

  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
      if (this.outline)
        this.outLineList = this.outline.map(o => ({ id: o.title, value: o.title.replace(" ", ""), type: 'chapter' }));
      else {
        this.outLineList = new Array();
      }
    });
  }

  onError(error: any) {
    this.error = error; // set error
    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );
      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  setPassword(password: string) {
    let newSrc;
    if (this.pdfURL instanceof ArrayBuffer) {
      newSrc = { data: this.pdfURL };
    } else if (typeof this.pdfURL === 'string') {
      newSrc = { url: this.pdfURL };
    } else {
      newSrc = { ...this.pdfURL };
    }
    newSrc.password = password;
    this.pdfURL = newSrc;
  }

  onClickTableOfContent(formId: any) {
    this.router.navigate(['/table-of-content'], { queryParams: { docId: formId, status: document.location.pathname }, skipLocationChange: true });
  }

  onClickTableOfContentForOrgForm(formId: any) {
    this.router.navigate(['/pdfPreference'], { queryParams: { docId: formId, status: document.location.pathname }, skipLocationChange: true });
  }

  calculateFormula() {
    this.summationArray = [];
    console.log(this.inputField);
    let filtered = this.inputField.filter(data => data.formulaCalculation).map(field => field["formulaCalculation"]);
    filtered.forEach(element => {
      switch (element.operator) {
        case "summation":
          let tableArray = this.inputField.filter(data => data.type === 'table');
          tableArray.map(data => data.rows).forEach(rows => {
            rows.forEach(tableElement => {
              if (tableElement.row.filter(e => e.name.includes(element.columnId))[0] !== undefined)
                this.summationArray.push(tableElement.row.filter(e => e.name.includes(element.columnId))[0])
            });
          });
          if(this.summationArray.length > 0){
            let total = this.summationArray.map(data => Number(data.value)).reduce((sum, current) => sum + current);
            total = (!element.mathOperation) ? Number(total.toFixed(element.decimalPlaces)) : this.performMathOperations(element.mathFunction, total);
            this.inputField.filter(data => data.name === element.finalResultId)[0].value = total;
          }
          break;
        case "others":
          let result = Number(this.evaluateFormula(element.formula));
          result = (!element.mathOperation) ? Number(result.toFixed(element.decimalPlaces)) : this.performMathOperations(element.mathFunction, result);
          this.inputField.filter(data => data.name === element.finalResultId)[0].value = result;
      }
    });
    this.isFormulaCalculated = true;
   // this.calculation(this.inputField)
  }

  evaluateFormula(formulaCalcObj) {
    let formulaExpression;
    formulaExpression = formulaCalcObj.map(formula => {
      formula = (!(formula == '+' || formula == '-' || formula == '*' || formula == '/') && isNaN(+formula)) ?
        this.inputField.filter(field => field.name == formula)[0]['value'] : formula;
      return formula
    }).reduce((prev, current) => prev + current);

    return eval(formulaExpression);
  }

  performMathOperations(operation, value) {
    let finalValue = 0;
    switch (operation) {
      case "round":
        finalValue = Math.round(value);
        break;
      case "trunc":
        finalValue = Math.trunc(value);
        break;
    }
    return finalValue;
  }

  loadEquipmentsOnLocation(locId) {
    let ids = [];
    ids.push(locId);
    this.equipmentService.loadActiveEquipmentsForLocations(ids).subscribe(jsonResp => {
      this.equipmentListBasedOnLocation = jsonResp.result.map(m => ({ value: m.id, label: m.name }));
      this.equipmentinfo = jsonResp.result.filter(data => data.id == this.dynamicForm.equipmentId);
      console.log(this.equipmentinfo);
    });
  }

  loadCleanRoomForLocation(locationId) {
    this.permissionService.HTTPGetAPI("cleanroom/loadActiveCleanRoomBasedOnLocation/" + locationId).subscribe(jsonResp => {
      this.cleanRoomList = jsonResp.result.map(m => ({ value: m.id, label: m.cleanRoomCode }));
      console.log(this.cleanRoomList);

    })
  }

  loadEquipmentLog(equipmentId) {
    this.equipmentinfo = this.equipmentinfo.filter(data => data.id == equipmentId);
  }

  inviteUser(id) {
    this.externalFormModal.onClickExternalApproval(id);
  }

  isColumnsRequired(input): boolean {
    return (input.type === 'section' || input.type == 'table' || input.type == 'newline' || input.type == 'header');
  }

}