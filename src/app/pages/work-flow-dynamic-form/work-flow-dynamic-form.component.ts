import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMyDpOptions } from 'mydatepicker/dist';
import { IOption } from 'ng-select';
import { FileUploader } from 'ng2-file-upload';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { FormMappingChildList, FormMappingDTO, MasterDynamicForm, UserPrincipalDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { DepartmentService } from '../department/department.service';
import { LocationService } from '../location/location.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { UserService } from '../userManagement/user.service';
import { WorkFlowDynamicFormService } from './work-flow-dynamic-form.service';

const URL_For_Upload = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-work-flow-dynamic-form',
  templateUrl: './work-flow-dynamic-form.component.html',
  styleUrls: ['./work-flow-dynamic-form.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  providers: [WorkFlowDynamicFormService, ConfigService, Helper],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class WorkFlowDynamicFormComponent implements OnInit, AfterViewInit {
  @ViewChild('formGroupingModal') formGroupingModal: ModalBasicComponent
  @ViewChild('formImportModal') formImportModal: ModalBasicComponent
  @ViewChild('date') date: any;
  @ViewChild('date1') date1: any;
  @ViewChild('myTable') table: any;
  @ViewChild('masterFormTab') public tab: any;
  tabName
  modalSpinner = false;
  formCountFlag = false;
  finalStatus = "";
  rowsOnPage = 10;
  viewType: string = "";
  tableViewFlag = true;
  workFlowSettingFlag = false;
  spinnerFlag = false;
  newTemplateFlag = false;
  buttonValue = "Save";
  buttonFlag = false;
  submitted = false;
  permissionModel: Permissions = new Permissions(this.helper.MASTER_DYNAMIC_FORM, false);
  permissionData: any = new Array<Permissions>();
  templateList: any;
  unPublishedMasterFormList: any;
  publishedMasterFormList: any;
  allMasterFormList: any;
  formBuilder: any;
  viewData = false;
  dto: any;
  inputField: any;
  workFlowLog = [];
  presentLevel;
  presentStatus;
  presentCreatedBy;
  presentModifiedDate;
  validationMessage: string;
  validationMessageForForm: string = "";
  workFlowOptions: Array<IOption> = new Array<IOption>();
  formMapping = new FormMappingDTO();
  compeletedMasterForm = [];
  submittedFormMapping = false;
  mappingError = "";
  isTableFormMapping = true;
  viewIndividualDataFormMapping = false;
  formMappingList = [];
  popupdata: any = [];
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  formCountMsg = '';
  pdfSettingFlag = false;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
  };
  public uploader: FileUploader = new FileUploader({
    url: URL_For_Upload,
    isHTML5: true
  });
  templateOwnerList: any[] = new Array();
  public filterQuery = '';
  locationList: any = [];
  deptList:any =[];
  defaultLocation:any;
  defaultDepartment:any;
  effectiveDate:any;
  fileList:any;
  formDto:any;
  constructor(public permissionService: ConfigService, private adminComponent: AdminComponent, public router: Router,
    private service: WorkFlowDynamicFormService, public helper: Helper, public masterService: MasterDynamicFormsService,
    private projectService: projectsetupService, private userService: UserService, private dateFormatSettingsService: DateFormatSettingsService,
    public locationService: LocationService, public deptService: DepartmentService) {
    this.adminComponent.setUpModuleForHelpContent(this.helper.MASTER_DYNAMIC_FORM);
    this.permissionService.loadPermissionsBasedOnModule(this.helper.MASTER_DYNAMIC_FORM).subscribe(resp => {
      this.permissionModel = resp
    });
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    this.loadOrgDateFormatAndTime();
    let today = new Date();
    this.myDatePickerOptions = {
      dateFormat: 'dd-mm-yyyy',
      disableUntil: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() - 1 },
    };
    this.adminComponent.taskDocType = "";
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEnbleFlag = false;
    this.adminComponent.taskEquipmentId = 0;
    if (localStorage.getItem('masterFormId'))
      localStorage.removeItem('masterFormId');
    this.viewTable();
    this.permissionService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
      if(res.currentProjectLocationId === res.defaultProjectLocationId)
      this.defaultDepartment = res.defaultLocationDepartmentId;
      this.formCountMsg = '';
      this.service.canCreateForm().subscribe(res => {
        this.formCountFlag = res;
        this.formCountMsg = `*Note: <label class="messages text-danger">Form Creation Limit is crossed Please contact Admin if needed...!</label> `;
      });
      this.locationService.loadAllActiveLocations().subscribe(response => {
        this.locationList = response.result;
        this.defaultLocation =  this.currentUser.currentProjectLocationId;
        this.deptService.loadDepartmentOnLocation(this.defaultLocation).subscribe(jsonResp => {
          this.deptList = jsonResp.result
        });
       
        this.permissionService.getUserPreference("MasterForm").subscribe(res => {
          if (res.result){
            this.tab.activeId = res.result;
            this.tabName = this.tab.activeId;
          } 
          if(res.jasonData){
            let data=JSON.parse(res.jasonData);
            this.defaultLocation=data.location;
            this.defaultDepartment=data.department;
            this.loadMasterFormForWorkFlow(this.defaultDepartment);
          }else{
            if(this.defaultDepartment != undefined)
              this.loadMasterFormForWorkFlow(this.defaultDepartment);
          }
        });
      });
      this.projectService.loadWorkFlowLevels().subscribe(response => {
        this.workFlowOptions = response.list.map(option => ({ value: option.id, label: option.workFlowLevelName }));
      });
    });
    
  }

  ngAfterViewInit(): void {
    let setCount = setInterval(() => {
      if (this.tab) {
        this.permissionService.getUserPreference("MasterForm").subscribe(res => {
          if (res.result){
            this.tab.activeId = res.result;
            this.tabName = this.tab.activeId;
          }
        });
        clearInterval(setCount);
      }
    }, 60);
  }

  loadOrgDateFormatAndTime() {
    this.dateFormatSettingsService.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.myDatePickerOptions.dateFormat = result.datePattern.replace("YYYY", "yyyy");
        this.date.setOptions();
        this.date1.setOptions();
      }
    });
  }

  /*MASTER WORK FLOW*/
  loadMasterFormForWorkFlow(departmentId) {
    this.spinnerFlag = true;
    if (this.formGroupingModal)
      this.formGroupingModal.spinnerShow();
    this.compeletedMasterForm = [];
    this.service.loadMasterFormForWorkFlow(departmentId).subscribe(result => {
      this.allMasterFormList = result.unpublishedList;
      this.allMasterFormList.forEach(element => {
        element.isEditEffectiveDate = false;
        element.isEditReviewDate = false;
        element.isEditDocumentOwner = false;
        if (this.helper.isEmpty(element.masterDynamicFormDTO.version))
          element.masterDynamicFormDTO.version = "";
        if (this.helper.isEmpty(element.masterDynamicFormDTO.effectiveDate)) {
          this.editEffectiveDate(element);
          element.isEditEffectiveDate = true;
        }
        if (this.helper.isEmpty(element.masterDynamicFormDTO.nextReviewDate)) {
          this.editReviewDate(element);
          element.isEditReviewDate = true;
        }
      });
      this.unPublishedMasterFormList = result.pendingList.filter(f => f.masterDynamicFormDTO.activeFlag);
      this.unPublishedMasterFormList.forEach(element => {
        if (this.helper.isEmpty(element.masterDynamicFormDTO.version))
          element.masterDynamicFormDTO.version = "";
        if (this.helper.isEmpty(element.masterDynamicFormDTO.effectiveDate))
          element.masterDynamicFormDTO.effectiveDate = "";
        if (this.helper.isEmpty(element.masterDynamicFormDTO.nextReviewDate))
          element.masterDynamicFormDTO.nextReviewDate = "";
      });
      this.publishedMasterFormList = result.publishedList;
      this.publishedMasterFormList.forEach(element => {
        if (this.helper.isEmpty(element.masterDynamicFormDTO.version))
          element.masterDynamicFormDTO.version = "";
        if (this.helper.isEmpty(element.masterDynamicFormDTO.effectiveDate))
          element.masterDynamicFormDTO.effectiveDate = "";
        if (this.helper.isEmpty(element.masterDynamicFormDTO.nextReviewDate))
          element.masterDynamicFormDTO.nextReviewDate = "";
      });
      this.compeletedMasterForm = result.publishedList.filter(element => element.masterDynamicFormDTO && element.masterDynamicFormDTO.formType==='Project Specific').map(e => e.masterDynamicFormDTO);
      this.spinnerFlag = false;
      if (this.formGroupingModal)
        this.formGroupingModal.spinnerHide();
    });
    
    this.permissionService.saveUserPreference("MasterForm",this.tabName?this.tabName:"all-forms",{location:this.defaultLocation,department:this.defaultDepartment}).subscribe(res =>{});
  }

  viewRowDetails(row, viewType) {
    this.viewType = viewType;
    this.editEffectiveDate(row);
    this.editReviewDate(row);
    this.dto = row;
    this.viewData = true;
    this.tableViewFlag = false;
    this.inputField = JSON.parse(row['masterDynamicFormDTO'].formStructure);
    this.checkPdfSettingThere(row['masterDynamicFormDTO'].permissionConstant, false);
    
  }

  loadDocumentCommentLog(row) {
    this.service.loadLogOfMasterFormWorkFlow(row['masterDynamicFormDTO'].id).subscribe(resp => {
      this.presentLevel = row.levelName;
      this.presentStatus = "Pending"
      this.presentCreatedBy = row['masterDynamicFormDTO'].createByName;
      this.presentModifiedDate = row['masterDynamicFormDTO'].displayUpdatedTime;
      this.finalStatus = "Un Published"
      this.workFlowLog = [];
      if (resp != null) {
        this.workFlowLog = resp;
        if (this.workFlowLog.length > 0) {
          let finalResult = this.workFlowLog[this.workFlowLog.length - 1]
          this.presentLevel = finalResult.levelName;
          this.presentStatus = finalResult.status;
          this.presentCreatedBy = finalResult.user;
          this.presentModifiedDate = finalResult.displayCreatedTime;
          if (row['masterDynamicFormDTO'].publishedFlag) {
            this.finalStatus = "Published";
          } else {
            this.finalStatus = "In Workflow Level " + finalResult.levelName;
          }
        }
      }
    });
  }

  tabChange(tabName: any) {
    this.tabName = tabName;
    this.filterQuery = '';
    this.permissionService.saveUserPreference("MasterForm",this.tabName,{location:this.defaultLocation,department:this.defaultDepartment}).subscribe(res =>{});
  }

  changeStatus(row, status) {
    if (this.permissionModel.workFlowButtonFlag) {
      swal({
        title: 'Comments',
        input: 'textarea',
        confirmButtonText: 'Submit',
        showCancelButton: true,
        animation: false,
        showCloseButton: true,
        allowOutsideClick: false,
        allowEnterKey: true,
        inputPlaceholder: "Please Write Comments",
      }).then((comments) => {
        if (comments == "") {
          swal.showLoading();
          swal.showValidationError('Please Enter the Comments');
          swal.hideLoading();
        } else {
          this.dto.globalProjectId = this.currentUser.versionId;
          this.dto.comments = comments;
          this.dto.flag = status;
          this.spinnerFlag = true;
          this.service.levelApproveSubmit(this.dto).subscribe(res => {
            this.spinnerFlag = false;
            if (res.result == "success") {
              swal({
                title: status === 'true' ? 'Approved Successfully!' : 'Rejected Successfully!',
                text: ' ',
                type: 'success',
                timer: this.helper.swalTimer,
                showConfirmButton: false,
                onClose: () => {
                  this.viewTable();
                  this.loadMasterFormForWorkFlow(this.defaultDepartment);
                }
              });
            } else {
              swal({
                title: 'Error',
                text: 'Some Internal Issue has been occured .We will get back to You',
                type: 'error',
                timer: this.helper.swalTimer
              });
              this.viewData = false;
            }
          }
          );
        }
      }).catch(swal.noop);
    } else {
      swal({
        title: 'Warning',
        text: 'You don\'t have workflow permission, please contact admin!.',
        type: 'warning',
        timer: this.helper.swalTimer,
        showConfirmButton: false,
      });
    }
  }

  viewTable() {
    this.tableViewFlag = true;
    this.viewData = false
  }

  loadTemplateToEdit(id) {
    localStorage.setItem("masterFormId", window.btoa(id));
    this.tableViewFlag = false;
    this.viewData = false
  }

  exportFormJSON(json) {
    this.spinnerFlag = true;
    let fileName = "FORM-00" + json.id + ".json";
    this.permissionService.HTTPPostAPIFile('dynamicForm/exportDynamicForm', json).subscribe(res => {
      this.adminComponent.previewByBlob(fileName, res, false);
      this.spinnerFlag = false;
    }, error => {
      this.spinnerFlag = false;
    });
  }

  resetBulk() {
    this.validationMessage = "";
    this.uploader.queue = new Array();
  }

  extractFileJson(event: any) {
    this.formImportModal.spinnerShow();
    this.validationMessage = "";
    this.spinnerFlag = true;
    if (event.target.files[0].name.match('.json')) {
      this.fileList = event.target.files;
      if (this.uploader.queue.length > 1) {
        this.uploader.queue = new Array(this.uploader.queue[1]);
      }
      this.onClickOfUploadButton();
    } else {
      this.validationMessage = "Please upload .json file";
    }
    event.target.value = '';
  }

  onClickOfUploadButton() {
    if (this.fileList.length > 0) {
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.service.extractJSONFile(formData).subscribe(resp => {
        if (resp.result == "success") {
          this.formImportModal.hide();
          this.formDto = resp.masterDynamicFormDTO;
          this.validationMessage = file.name + " file read successfully done";
          this.loadImportToEdit();
        } else {
          this.validationMessage = file.name + " file cannot be read";
          this.spinnerFlag = false;
          this.formImportModal.spinnerHide();
        }
      }, err => {
        this.validationMessage = 'Error in JSON File';
        this.formImportModal.spinnerHide();
        this.spinnerFlag = false;
      }
      );
    } 
    this.formImportModal.spinnerHide();
  }

  loadImportToEdit() {
    let id = '0';
    this.spinnerFlag = false;
    this.formImportModal.spinnerHide();
    localStorage.removeItem('masterFormId');
    localStorage.removeItem('masterDynamicFormDTO');
    localStorage.setItem('masterFormId', window.btoa(id));
    localStorage.setItem('masterDynamicFormDTO', JSON.stringify(this.formDto));
    this.tableViewFlag = false;
    this.viewData = false;
  }

  cloneOfMasterForm(json) {
    this.masterService.cloneMasterForm(json).subscribe((resp) => {
      if (resp.result != 'failure') {
        swal({
          title: 'Copied Successfully!',
          text: ' ',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.ngOnInit();
          }
        });
      } else {
        swal({
          title: 'Error',
          text: 'Some Internal Issue has been occured. We will get back to You',
          type: 'error',
          timer: this.helper.swalTimer
        })
      }
    }, err => {
      swal({
        title: 'Error',
        text: 'Some Internal Issue has been occured. We will get back to You',
        type: 'error',
        timer: this.helper.swalTimer
      })
    });
  }

  deleteTemplate(row, value) {
    this.spinnerFlag = true;
    let masterDynamicForm = new MasterDynamicForm();
    masterDynamicForm.templateName = row.templateName;
    masterDynamicForm.id = row.id;
    masterDynamicForm.updatedBy = this.currentUser.id;
    masterDynamicForm.loginUserId = this.currentUser.id;
    masterDynamicForm.organizationOfLoginUser = this.currentUser.orgId;
    masterDynamicForm.globalProjectId = this.currentUser.projectId;
    masterDynamicForm.userRemarks = "Comments : " + value;
    this.masterService.deleteTemplate(masterDynamicForm)
      .subscribe((resp) => {
        this.spinnerFlag = false;
        let responseMsg: string = resp.result;
        if (responseMsg === "success") {
          swal({
            title: 'Deleted!',
            text: masterDynamicForm.templateName + ' record has been deleted.',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.viewTable();
              this.loadMasterFormForWorkFlow(this.defaultDepartment);
            }
          });
        } else {
          swal({
            title: 'Not Deleted!',
            text: masterDynamicForm.templateName + ' has  not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer
          });
        }
      }, (err) => {
        swal({
          title: 'Not Deleted!',
          text: masterDynamicForm.templateName + 'has  not been deleted.',
          type: 'error',
          timer: this.helper.swalTimer
        });
        this.spinnerFlag = false;
      });
  }

  deleteTemplateSwal(id) {
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
          this.deleteTemplate(id, value);
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

  newForm() {
    localStorage.removeItem('masterFormId');
    this.tableViewFlag = false;
  }

  loadAllFormMappingData() {
    this.formGroupingModal.spinnerShow();
    this.isTableFormMapping = true;
    this.viewIndividualDataFormMapping = false;
    this.service.loadAllMasterDynamicFormGrouping().subscribe(resp => {
      this.formMappingList = resp.result;
      this.formGroupingModal.spinnerHide();
    }, er => this.formGroupingModal.spinnerHide());
  }

  viewRowDetailsFormMapping(row) {
    this.viewIndividualDataFormMapping = true;
    this.mappingError = '';
    this.isTableFormMapping = false;
    this.popupdata = [];
    this.popupdata.push(row);
    this.checkPdfSettingThere(row.id, true);
  }

  viewForEditFormMapping(row) {
    this.formGroupingModal.spinnerShow();
    this.checkWorkFlowStarted(row.id).then(resp => {
      this.formGroupingModal.spinnerHide()
      if (resp) {
        swal({
          title: 'Info', type: 'warning', showConfirmButton: false, timer: 3000, allowOutsideClick: false,
          text: 'Cannot be edited as this group form is configured in workflow of project!!'
        });
      } else {
        this.viewIndividualDataFormMapping = false;
        this.mappingError = '';
        this.isTableFormMapping = false;
        this.formMapping = row;
      }
    }).catch(res => { this.formGroupingModal.spinnerHide() })
  }

  addNewFormMapping() {
    this.loadMasterFormForWorkFlow(this.defaultDepartment);
    this.isTableFormMapping = false;
    this.viewIndividualDataFormMapping = false;
    this.mappingError = '';
    this.formMapping = new FormMappingDTO();
    this.formMapping.mappingList.push(new FormMappingChildList(0, this.formMapping.mappingList.length + 1));
  }

  addFormMapping(list, flagToAdd) {
    var multipleEntryFlag = false;
    if (list.length >= 1) {
      multipleEntryFlag = this.compeletedMasterForm.filter(d => +list[0].formId == d.id)[0].multipleEntryFlag;
      this.compeletedMasterForm = this.compeletedMasterForm.filter(element => multipleEntryFlag == element.multipleEntryFlag);
    } else {
      this.loadMasterFormForWorkFlow(this.defaultDepartment);
    }
    let ids: any[] = list.map(f => f.formId);
    this.compeletedMasterForm.forEach(e => {
      e.disabled = false;
      if (ids.includes('' + e.id))
        e.disabled = true;
    })
    if (flagToAdd)
      list.push(new FormMappingChildList(0, list.length + 1));
  }

  removeFormMapping(list, index) {
    list.splice(index, 1);
    list.forEach((element, i) => {
      element.order = i + 1;
    });
    this.addFormMapping(list, false);
  }

  saveFormMapping(formValid) {
    this.mappingError = "";
    this.submittedFormMapping = true;
    this.formMapping.mappingList.forEach(element => {
      if (element.formId == 0) {
        this.mappingError = "Please select the form."
        return;
      }
    });
    if (formValid && this.formMapping.mappingList.length > 1 && this.mappingError == '') {
      this.formGroupingModal.spinnerShow();
      this.formMapping.loginUserId = +this.currentUser.id;
      this.formMapping.organizationOfLoginUser = this.currentUser.orgId;
      this.formMapping.globalProjectId = this.currentUser.projectId;
      if (this.formMapping.id == 0) {
        this.formMapping.createdBy = this.currentUser.id;
      }
      this.formMapping.updatedBy = this.currentUser.id;
      this.service.saveOrUpdateMasterDynamicFormGrouping(this.formMapping).subscribe(result => {
        let v = this.formMapping.id == 0 ? 'Saved' : 'Updated';
        if (result) {
          swal({
            title: 'Success',
            text: v + ' Successfully',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });
          this.loadAllFormMappingData();
          this.formGroupingModal.spinnerHide();
        } else {
          swal({
            title: 'Error',
            text: 'Error occur',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });
          this.formGroupingModal.spinnerHide();
        }
      }, er => { this.formGroupingModal.spinnerHide(); }
      );
    } else {
      if (this.mappingError == '')
        this.mappingError = "Add one or more forms to create group"
    }
  }

  openSuccessCancelSwalFormMapping(row, index) {
    var classObject = this;
    this.formGroupingModal.spinnerShow();
    this.checkWorkFlowStarted(row.id).then(resp => {
      this.formGroupingModal.spinnerHide();
      if (!resp) {
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
              row.userRemarks = value;
              this.deleteUser(row, index);
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
      } else {
        swal({
          title: 'Info', type: 'warning', showConfirmButton: false, useRejections: false, timer: 2000, allowOutsideClick: false,
          text: 'Cannot be deleted as this group form is configured in workflow of project!!'
        });
      }
    }).catch(re => this.formGroupingModal.spinnerHide());
  }

  deleteUser(dataObj, i): string {
    let status = '';
    dataObj.deleteFlag = true;
    dataObj.loginUserId = this.currentUser.id;
    this.service.saveOrUpdateMasterDynamicFormGrouping(dataObj).subscribe((resp) => {
      if (resp) {
        status = "success";
        swal({
          title: 'Deleted!',
          text: 'Record has been deleted.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        }).then(responseMsg => {
          this.formMappingList.splice(i, 1);
        });
        this.loadAllFormMappingData();
      } else {
        swal({
          title: 'Not Deleted!',
          text: 'Record has been deleted.',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        }).then(responseMsg => {
          this.loadAllFormMappingData();
        });
      }
    }, (err) => {
      swal({
        title: 'Not Deleted!',
        text: 'Record has been deleted.',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false,
      }).then(responseMsg => {
        this.loadAllFormMappingData();
      });
    });
    return status;
  }

  checkWorkFlowStarted(id): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.service.checkWorkFlowStartedForFOrmGroup(id).subscribe(resp => {
        resolve(resp.result);
      }, err => resolve(false))
    });
  }

  documentPreview(id, flag) {
    this.spinnerFlag = true;
    if (this.formGroupingModal)
      this.formGroupingModal.spinnerShow();
    var json = { 'flag': flag, 'key': id }
    this.permissionService.HTTPPostAPI(json, 'masterFormWorkFlow/previewFileIfAttached').subscribe(resp => {
      this.spinnerFlag = false;
      if (this.formGroupingModal)
        this.formGroupingModal.spinnerHide();
      if (resp.result == 'success') {
        if (resp.byte != null) {
          var binary = atob(resp.byte);
          var array = [];
          for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }
          this.adminComponent.previewByBlob('text.pdf', new Uint8Array(array), true, 'Preview Of Mapped File')
          this.spinnerFlag = false;
          this.formGroupingModal.spinnerHide();
        }
      } else {
        this.errorPdf(resp.result);
      }
    }, er => {
      this.errorPdf('Error in loading');
    });
  }

  errorPdf(msg) {
    swal({
      title: 'Info!',
      html: `<h4>` + msg + `</h4>`,
      type: 'info',
      timer: 2500,
      showConfirmButton: false,
    })
    this.spinnerFlag = false;
    if (this.formGroupingModal)
      this.formGroupingModal.spinnerHide();
  }

  checkPdfSettingThere(formKey, formOrGroupFlag) {
    this.pdfSettingFlag = false;
    var json = { 'flag': formOrGroupFlag, 'key': formKey }
    this.permissionService.HTTPPostAPI(json, 'masterFormWorkFlow/checkPreviewFileIfAttached').subscribe(resp => {
      this.pdfSettingFlag = resp;
    });
  }

  openBtnClicked() {
    if (!this.date.showSelector)
      this.date.openBtnClicked();
    if (!this.date1.showSelector)
      this.date1.openBtnClicked();
  }

  editEffectiveDate(row) {
    if (!this.helper.isEmpty(row.masterDynamicFormDTO.effectiveDate)) {
      row.masterDynamicFormDTO.newEffectiveDate = this.populateDate(row.masterDynamicFormDTO.effectiveDate);
    }
  }

  editReviewDate(row) {
    if (!this.helper.isEmpty(row.masterDynamicFormDTO.nextReviewDate))
      row.masterDynamicFormDTO.newReviewDate = this.populateDate(row.masterDynamicFormDTO.nextReviewDate);
  }

  populateDate(date: any): any {
    let result: any = new Object();
    if (!this.helper.isEmpty(date)) {
      let dateString = date.split("-");
      result.date = { year: dateString[0], month: dateString[1].charAt(0) === '0' ? dateString[1] = dateString[1].substr(1) : dateString[1], day: dateString[2].charAt(0) === '0' ? dateString[2] = dateString[2].substr(1) : dateString[2] };
    } else {
      result = "";
    }
    return result;
  }

  onChangeEffectiveDate(event, row) {
    if (!this.helper.isEmpty(event)) {
      var obj = this
      swal({
        title: 'Are you sure?',
        text: 'You want to update the Effective Date',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
        buttonsStyling: false
      }).then((result) => {
        obj.spinnerFlag = true;
        let masterDynamicForm: MasterDynamicForm = new MasterDynamicForm();
        masterDynamicForm.id = row.masterDynamicFormDTO.id;
        masterDynamicForm.effectiveDate = obj.helper.dateToSaveInDB(event.date);
        obj.service.saveMasterFormDates(masterDynamicForm).subscribe(resp => {
          obj.spinnerFlag = false;
          obj.loadMasterFormForWorkFlow(this.defaultDepartment);
        });
      }).catch(() => {
      });
    }
  }

  onChangeReviewDate(event, row) {
    if (!this.helper.isEmpty(event)) {
      var obj = this
      swal({
        title: 'Are you sure?',
        text: 'You want to update the Next Review Date',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
        buttonsStyling: false
      }).then((result) => {
        obj.spinnerFlag = true;
        let masterDynamicForm: MasterDynamicForm = new MasterDynamicForm();
        masterDynamicForm.id = row.masterDynamicFormDTO.id;
        masterDynamicForm.nextReviewDate = obj.helper.dateToSaveInDB(event.date);
        obj.service.saveMasterFormDates(masterDynamicForm).subscribe(resp => {
          obj.spinnerFlag = false;
          obj.loadMasterFormForWorkFlow(this.defaultDepartment);
        });
      }).catch(() => {
      });
    }
  }

  editDocumentOwner(row) {
    this.onChangeDept(row.masterDynamicFormDTO.departments);
  }

  onChangeDept(event) {
    this.userService.loadAllUserBasedOnDepartment(event).subscribe(resp => {
      this.templateOwnerList = resp.result;
    });
  }

  onChangeDocumentOwner(event, row) {
    if (!this.helper.isEmpty(event)) {
      var obj = this
      swal({
        title: 'Are you sure?',
        text: 'You want to update the Template Owner',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
        buttonsStyling: false
      }).then((result) => {
        obj.spinnerFlag = true;
        let masterDynamicForm: MasterDynamicForm = new MasterDynamicForm();
        masterDynamicForm.id = row.masterDynamicFormDTO.id;
        masterDynamicForm.templateOwnerId = event;
        obj.service.saveMasterFormDates(masterDynamicForm).subscribe(resp => {
          obj.spinnerFlag = false;
          obj.loadMasterFormForWorkFlow(this.defaultDepartment);
        });
      }).catch(() => {
      });
    }
  }

  onChangeLocation(locationId){
    this.defaultDepartment='';
    this.deptService.loadDepartmentOnLocation(locationId).subscribe(jsonResp => {
      this.deptList = jsonResp.result
    });
  }

}
