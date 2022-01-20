import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker/dist';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { MasterDynamicTemplate, MasterDynamicWorkFlowConfigDTO, UserPrincipalDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { DepartmentService } from '../department/department.service';
import { LocationService } from '../location/location.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { userRoleservice } from '../role-management/role-management.service';
import { UserService } from '../userManagement/user.service';
import { masterDataSetUpTemplates } from './../../shared/constants';
import { TemplateService } from './templates.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
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
export class TemplatesComponent implements OnInit {

  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  public templateList: any;
  public unPublishedTemplateList: any;
  public publishedTemplateList: any;
  formFlag = false;
  submitted = false;
  setupWorkFlowSubmitted: boolean = false;
  spinnerFlag = false;
  templateId = 0;
  fileValidationMessage: any = "";
  masterDynamicTemplate: MasterDynamicTemplate = new MasterDynamicTemplate();
  singleFileUploadFlag: boolean = false;
  uploadSingleFile: any;
  singleFile = "";
  validationMessage = "";
  workFlowOptions: Array<IOption> = new Array<IOption>();
  workFlowDto = new MasterDynamicWorkFlowConfigDTO();
  levelList: any[] = new Array();
  allLevelList: any[] = new Array();
  isEdited: boolean = false;
  roleList: Array<IOption> = new Array<IOption>();
  userList: Array<IOption> = new Array<IOption>();
  masterWorkFLowConfigData: any;
  roleIds = [];
  permissionModel: Permissions = new Permissions(this.helper.TEMPLATE_VALUE, false);
  permissionData: any;
  unPublishedMasterTemplateList: any;
  publishedMasterTemplateList: any;
  viewUnpublishedData = false;
  viewPublishedData = false;
  dto: any;
  workFlowLog = [];
  presentLevel;
  presentStatus;
  presentCreatedBy;
  presentModifiedDate;
  presentCreatedDate;
  isTemplateEdit: boolean = false;
  activeTabId: string = "";
  sourceFile: string = "";
  compareFile: string = "";
  revisionValidationMessage: string = "";
  modalSpinner: any = false;
  revisionArray: any[] = new Array<any>();
  leftRevisionArray: any[] = new Array<any>();
  rightRevisionArray: any[] = new Array<any>();
  search: boolean = true;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  simpleOptionDepartment: Array<IOption> = new Array<IOption>();
  @ViewChild('date') date: any;
  @ViewChild('date1') date1: any;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };
  templateOwnerList: any[] = new Array();
  @ViewChild('myTable') table: any;
  defaultLocation: any;
  defaultDepartment: any;
  locationList: any = [];
  deptList: any = [];

  constructor(public masterDataSetUpForTemplates: masterDataSetUpTemplates, public configService: ConfigService,
    private adminComponent: AdminComponent, public permissionService: ConfigService, public service: TemplateService,
    public helper: Helper, private commonService: CommonFileFTPService, private projectService: projectsetupService,
    private userService: UserService, private roleService: userRoleservice, public deptService: DepartmentService,
    private dateFormatSettingsService: DateFormatSettingsService, public locationService: LocationService) {
    this.permissionService.loadPermissionsBasedOnModule(this.helper.TEMPLATE_VALUE).subscribe(resp => {
      this.permissionModel = resp
    });
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
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskEnbleFlag = false;
    this.configService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res; this.adminComponent.setUpModuleForHelpContent(this.helper.TEMPLATE_VALUE);
      if(res.currentProjectLocationId === res.defaultProjectLocationId)
      this.defaultDepartment = res.defaultLocationDepartmentId;
      this.activeTabId = "createTemplate";
     // this.spinnerFlag = true;
      this.loadTemplate();
      this.projectService.loadWorkFlowLevels().subscribe(response => {
        this.workFlowOptions = response.list.map(option => ({ value: option.id, label: option.workFlowLevelName }));
      });
      this.loadRole();
      this.loadUser(this.roleIds);
      this.locationService.loadAllActiveLocations().subscribe(response => {
        this.locationList = response.result;
        this.defaultLocation = this.currentUser.currentProjectLocationId;
        this.deptService.loadDepartmentOnLocation(this.defaultLocation).subscribe(jsonResp => {
          this.deptList = jsonResp.result
        });
      });
      if(this.defaultDepartment != undefined)
      this.loadMasterFormForWorkFlow(this.defaultDepartment);
    });
    this.deptService.loadDepartment().subscribe(jsonResp => {
      this.simpleOptionDepartment = this.helper.cloneOptions(jsonResp.result);
    });


  }

  tabChange1(tabName: any) {
    if (tabName === 'audit') {
      this.search = false;
    } else {
      this.search = true;
    }
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

  /*START : MASTER DYNAMIC TEMPLATE*/
  loadTemplate() {
    this.activeTabId = "createTemplate";
    this.formFlag = false;
    this.isEdited = false;
    if(this.defaultDepartment!=undefined)
    this.loadMasterFormForWorkFlow(this.defaultDepartment);
    this.adminComponent.taskDocType = this.helper.TEMPLATE_VALUE;
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
  }

  loadMasterFormForWorkFlow(departmentId) {
    this.spinnerFlag = true;
    this.service.loadMasterTemplateForWorkFlow(departmentId).subscribe(result => {
      this.unPublishedTemplateList = result.unpublishedList;
      this.unPublishedTemplateList.forEach(element => {
        element.isEditEffectiveDate = false;
        element.isEditReviewDate = false;
        element.isEditDocumentOwner = false;
        if (this.helper.isEmpty(element.masterDynamicTemplateDTO.version))
          element.masterDynamicTemplateDTO.version = "";
        if (this.helper.isEmpty(element.masterDynamicTemplateDTO.effectiveDate)) {
          this.editEffectiveDate(element);
          element.isEditEffectiveDate = true;
          element.masterDynamicTemplateDTO.effectiveDate = "";
        }
        if (this.helper.isEmpty(element.masterDynamicTemplateDTO.nextReviewDate)) {
          this.editReviewDate(element);
          element.isEditReviewDate = true;
          element.masterDynamicTemplateDTO.nextReviewDate = "";
        }
      });
      this.unPublishedMasterTemplateList = result.pendingList;
      this.unPublishedMasterTemplateList.forEach(element => {
        if (this.helper.isEmpty(element.masterDynamicTemplateDTO.version))
          element.masterDynamicTemplateDTO.version = "";
        if (this.helper.isEmpty(element.masterDynamicTemplateDTO.effectiveDate))
          element.masterDynamicTemplateDTO.effectiveDate = "";
        if (this.helper.isEmpty(element.masterDynamicTemplateDTO.nextReviewDate))
          element.masterDynamicTemplateDTO.nextReviewDate = "";
      });
      this.publishedMasterTemplateList = result.publishedList;
      this.publishedMasterTemplateList.forEach(element => {
        if (this.helper.isEmpty(element.masterDynamicTemplateDTO.version))
          element.masterDynamicTemplateDTO.version = "";
        if (this.helper.isEmpty(element.masterDynamicTemplateDTO.effectiveDate))
          element.masterDynamicTemplateDTO.effectiveDate = "";
        if (this.helper.isEmpty(element.masterDynamicTemplateDTO.nextReviewDate))
          element.masterDynamicTemplateDTO.nextReviewDate = "";
      });
      this.spinnerFlag = false;
    })
  }

  loadTemplateToEdit(id) {
    this.activeTabId = "createTemplate";
    this.isTemplateEdit = true;
    this.spinnerFlag = true;
    this.deletePDFView();
    if (id != 0) {
      this.service.editDynamicTemplate(id).subscribe(result => {

        if (result != null) {
          this.masterDynamicTemplate = result;
          this.formFlag = true;
          this.masterDynamicTemplate.departments = this.masterDynamicTemplate.departments.map(d => '' + d);
          if (!this.helper.isEmpty(this.masterDynamicTemplate.effectiveDate))
            this.masterDynamicTemplate.effectiveDate = this.populateDate(this.masterDynamicTemplate.effectiveDate);
          if (!this.helper.isEmpty(this.masterDynamicTemplate.nextReviewDate))
            this.masterDynamicTemplate.nextReviewDate = this.populateDate(this.masterDynamicTemplate.nextReviewDate);
        }
        this.onChangeDept(this.masterDynamicTemplate.departments);
        this.spinnerFlag = false;
      }, error => {
        this.spinnerFlag = false;
      })
    } else {
      this.masterDynamicTemplate = new MasterDynamicTemplate();
      this.formFlag = false;
      this.spinnerFlag = false;
    }
    this.loadNumberOfLevelsForMasterDynamicTemplate(id);
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

  saveData() {
    this.submitted = true;
    if (this.masterDynamicTemplate.templateOwnerId == 0 || this.masterDynamicTemplate.templateName == "" || this.masterDynamicTemplate.workFlowLevels.length == 0 || this.masterDynamicTemplate.fileName == "" || this.validationMessage != "" || this.fileValidationMessage != "" || this.masterDynamicTemplate.departments.length === 0) {
      return
    } else {
      this.spinnerFlag = true;
      if (this.masterDynamicTemplate.id == 0) {
        this.masterDynamicTemplate.createdBy = this.currentUser.id;
      }
      if (!this.helper.isEmpty(this.masterDynamicTemplate.effectiveDate))
        this.masterDynamicTemplate.effectiveDate = this.helper.dateToSaveInDB(this.masterDynamicTemplate.effectiveDate.date);
      if (!this.helper.isEmpty(this.masterDynamicTemplate.nextReviewDate))
        this.masterDynamicTemplate.nextReviewDate = this.helper.dateToSaveInDB(this.masterDynamicTemplate.nextReviewDate.date);
      this.masterDynamicTemplate.departmentName = this.simpleOptionDepartment.filter(d => this.masterDynamicTemplate.departments.includes('' + d.value)).map(d => d.label).toString()
      this.masterDynamicTemplate.globalProjectId = this.currentUser.projectId;
      this.masterDynamicTemplate.updatedBy = this.currentUser.id;
      this.masterDynamicTemplate.loginUserId = this.currentUser.id;
      this.masterDynamicTemplate.organizationOfLoginUser = this.currentUser.orgId;
      this.service.createMasterDynamicTemplate(this.masterDynamicTemplate).subscribe(result => {
        if (result.result == "success") {
          let data = result.data;
          if (data.id != 0) {
            this.masterDynamicTemplate = data;
            this.loadNumberOfLevelsForMasterDynamicTemplate(data.id);
            // this.masterDynamicTemplate.workFlowLevels = this.levelList;
          }
          // let saveOrUpdate = (this.masterDynamicTemplate.id == 0) ? "Saved" : "Updated";
          this.spinnerFlag = false;
          swal({
            title: 'Saved Successfully!',
            text: this.masterDynamicTemplate.templateName + ' template has been saved.',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.isTemplateEdit = true;
              this.activeTabId = "setupWorkFlow";
            }
          });
        }
      }, error => {
        this.spinnerFlag = false;
        swal({
          title: 'Error in Saving',
          text: this.masterDynamicTemplate.templateName + ' template has not  been saved',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }
        );
      })
    }
  }

  showNext = (() => {
    var timer: any = 2;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.service.isTemplateExists(this.masterDynamicTemplate.templateName).subscribe(
          jsonResp => {
            let responseMsg: boolean = jsonResp;
            if (responseMsg == true) {
              this.validationMessage = "Dynamic template with this name already exist.";
            } else {
              this.validationMessage = "";
            }
          }
        );
      }, 600);
    }
  })();

  loadForm() {
    this.submitted = false;
    this.formFlag = true;
    this.masterDynamicTemplate = new MasterDynamicTemplate();
    this.validationMessage = "";
    this.isTemplateEdit = false;
  }

  deleteTemplate(id, value) {
    let timerInterval;
    this.spinnerFlag = true;
    let masterDynamicTemplate = new MasterDynamicTemplate();
    masterDynamicTemplate.id = id;
    masterDynamicTemplate.updatedBy = this.currentUser.id;
    masterDynamicTemplate.loginUserId = this.currentUser.id;
    masterDynamicTemplate.organizationOfLoginUser = this.currentUser.orgId;
    masterDynamicTemplate.globalProjectId = this.currentUser.projectId;
    masterDynamicTemplate.userRemarks = "Comments : " + value;
    this.service.deleteTemplate(masterDynamicTemplate)
      .subscribe((resp) => {
        this.spinnerFlag = false;
        let responseMsg: string = resp.result;
        if (responseMsg === "success") {
          swal({
            title: 'Deleted!',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.loadTemplate();
              clearInterval(timerInterval)
            }
          });
        } else {
          swal({
            title: 'Not Deleted!',
            text: this.masterDynamicTemplate.templateName + ' has  not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer
          }
          );
        }
      }, (err) => {
        swal({
          title: 'Not Deleted!',
          text: this.masterDynamicTemplate.templateName + 'has  not been deleted.',
          type: 'error',
          timer: this.helper.swalTimer
        }
        );
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
  /*END : MASTER DYNAMIC TEMPLATE*/

  /*START : MASTER DYNAMIC TEMPLATE WORK FLOW*/
  goToWorkFlowConfig(id) {
    document.getElementById("workFlowId").click();
    this.loadTemplate();
    this.loadNumberOfLevelsForMasterDynamicTemplate(id);
    this.loadTable(id);
    this.templateId = id;
  }

  editLevel(data) {
    this.isEdited = true;
    this.workFlowDto = data;
    this.roleIds = data.roleIds;
    this.loadUser(data.roleIds);
  }

  saveWorkFlowData(formValid) {
    this.setupWorkFlowSubmitted = true;
    if (!formValid) {
      return
    } else if (this.workFlowDto.workFlowLevelId != 0) {
      if (this.workFlowDto.id == 0) {
        this.workFlowDto.createdBy = this.currentUser.id;
      }
      this.workFlowDto.updatedBy = this.currentUser.id;
      this.workFlowDto.loginUserId = this.currentUser.id;
      this.workFlowDto.organizationOfLoginUser = this.currentUser.orgId;
      this.workFlowDto.globalProjectId = this.currentUser.projectId;
      this.service.saveWorkFlowData(this.workFlowDto).subscribe(respo => {
        this.spinnerFlag = false;
        if (respo.result == "success") {
          swal({
            title: 'Saved Successfully!',
            text: 'Configuration has been saved.',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.setupWorkFlowSubmitted = false;
              this.loadNumberOfLevelsForMasterDynamicTemplate(this.masterDynamicTemplate.id);
              this.roleIds = [];
              this.isEdited = false;
            }
          });
        } else {
          swal({
            title: 'Error in Saving',
            text: 'Configuration has not  been saved',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          }
          );
          this.isEdited = false;
        }
      }, error => {
        swal({
          title: 'Error in Saving',
          text: 'Configuration has not  been saved',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        }
        );
      });
    }
  }

  loadRole() {
    this.roleService.loadroles().subscribe(result => {
      for (let key in result) {
        let value = result[key];
        this.roleList.push({ "value": key, "label": value })
      }
      this.roleList = this.roleList.map(option => ({ value: option.value, label: option.label }));
    });
  }

  loadUser(roleIds: any[]) {
    if (roleIds.length > 0) {
      this.spinnerFlag = true;
      this.service.loadUserBasedOnRolesAndMasterTemplateDept(roleIds, this.masterDynamicTemplate.id).subscribe(resp => {
        this.userList = resp.map(option => ({ value: Number(option.key), label: option.value }));
        this.spinnerFlag = false;
      }, err => { this.spinnerFlag = false; });
    }
  }

  loadNumberOfLevelsForMasterDynamicTemplate(masterDynamicId) {
    this.spinnerFlag = true;
    this.workFlowDto = new MasterDynamicWorkFlowConfigDTO();
    this.workFlowDto.masterId = masterDynamicId;
    this.roleIds = [];
    this.service.loadNumberOfLevelsForMasterDynamicTemplate(masterDynamicId).subscribe(result => {
      this.allLevelList = result;
      this.loadTable(masterDynamicId);
      this.spinnerFlag = false;
    }, err => { this.spinnerFlag = false; });
  }

  loadTable(masterDynamicId) {
    this.spinnerFlag = true;
    this.service.loadAll(masterDynamicId).subscribe(result => {
      this.spinnerFlag = false;
      this.masterWorkFLowConfigData = result.list;
      let levelIds = this.masterWorkFLowConfigData.map(m => '' + m.workFlowLevelId);
      this.levelList = this.allLevelList.filter(f => !levelIds.includes(f.key));
    }, error => { this.spinnerFlag = false; });
  }

  /*END : MASTER DYNAMIC TEMPLATE WORK FLOW*/

  /* START:PDF OPERATIONS*/
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
      this.spinnerFlag = true;
      let file = event.target.files[0];
      this.configService.checkIsValidFileSize(file.size).subscribe(fileRes => {
        if (fileRes) {
          let fileName = event.target.files[0].name;
          this.singleFileUploadFlag = true;
          if (fileName.toLocaleLowerCase().match('.doc') || fileName.toLocaleLowerCase().match('.docx') || fileName.toLocaleLowerCase().match('.pdf')) {
            let filePath = "IVAL/" + this.currentUser.orgId + "/masterDynamicTemplate/";
            const formData: FormData = new FormData();
            formData.append('file', file, fileName);
            formData.append('filePath', filePath);
            formData.append('extension', fileName.split(".")[fileName.split(".").length - 1]);
            this.commonService.singleFileUpload(formData).subscribe(resp => {
              this.masterDynamicTemplate.filePath = resp.path;
              this.masterDynamicTemplate.fileName = fileName;
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
          this.commonService.downloadFileAudit(fileName, input.templateName, "138", ("TEMPLATE-00" + input.id)).subscribe(resp => {
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
  /* END:PDF OPERATIONS*/

  createIFrame(blob_url, fileName) {
    this.spinnerFlag = true;
    var iframe;
    var elementExists = document.getElementById('fileUploadIdTemplate');
    if (elementExists)
      elementExists.remove();
    /*Main DIV is created*/
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

  viewRowDetailsOfPublished(row) {
    this.dto = row;
    // let stepperModule: StepperClass = new StepperClass();
    // stepperModule.constantName = this.dto.masterDynamicTemplateDTO.permissionConstant;
    // stepperModule.documentIdentity = this.dto.masterDynamicTemplateDTO.id;
    // stepperModule.publishedFlag = this.dto.masterDynamicTemplateDTO.publishedFlag;
    // this.helper.stepperchange(stepperModule);
    this.viewUnpublishedData = false;
    this.viewPublishedData = true;
    this.downloadFileOrView(this.dto.masterDynamicTemplateDTO, true);
  }

  viewRowDetails(row) {
    this.viewUnpublishedData = true;
    this.dto = row;
    // let stepperModule: StepperClass = new StepperClass();
    // stepperModule.constantName = this.dto.masterDynamicTemplateDTO.permissionConstant;
    // stepperModule.documentIdentity = this.dto.masterDynamicTemplateDTO.id;
    // stepperModule.publishedFlag = this.dto.masterDynamicTemplateDTO.publishedFlag;
    // this.helper.stepperchange(stepperModule);
    this.downloadFileOrView(this.dto.masterDynamicTemplateDTO, true);
  }

  loadDocumentCommentLog(row) {
    this.service.loadLogOfMasterFormWorkFlow(row['masterDynamicTemplateDTO'].id).subscribe(resp => {
      this.presentLevel = ""
      this.presentStatus = ""
      this.presentCreatedBy = ""
      this.presentModifiedDate = ""
      this.presentLevel = row.levelName;
      this.presentStatus = row.levelName != null ? 'Pending' : 'Draft';
      this.presentCreatedBy = row['masterDynamicTemplateDTO'].createdByName;
      this.presentModifiedDate = row['masterDynamicTemplateDTO'].displayUpdatedTime;
      this.presentCreatedDate = row['masterDynamicTemplateDTO'].displayCreatedTime;
      this.workFlowLog = [];
      if (resp.length != 0) {
        this.workFlowLog = resp;
        this.presentLevel = this.workFlowLog[0].levelName;
        this.presentStatus = this.workFlowLog[0].status;
        this.presentCreatedBy = this.workFlowLog[0].user;
        this.presentModifiedDate = this.workFlowLog[0].displayCreatedTime;
      }
    });
  }

  changeStatus(row, status) {
    if (this.permissionModel.workFlowButtonFlag) {
      let timerInterval;
      status = status == "true" ? true : false;
      this.dto.flag = status;
      swal({
        title: 'Comments',
        input: 'textarea',
        confirmButtonText: 'Submit',
        showCancelButton: true,
        animation: false,
        showCloseButton: true,
        inputPlaceholder: "Please Write Comments",
        allowOutsideClick: false,
        allowEnterKey: true,
      }).then((comments) => {
        if (comments == "") {
          swal.showLoading();
          swal.showValidationError('Please Enter the Comments');
          swal.hideLoading();
        } else {
          this.dto.comments = comments;
          this.dto.loginUserId = this.currentUser.id;
          this.dto.globalProjectId = this.currentUser.projectId;
          this.spinnerFlag = true;
          this.service.levelApproveSubmit(this.dto).subscribe(res => {
            this.spinnerFlag = false;
            if (res.result == "success") {
              if (status) {
                swal({
                  title: 'Approved Successfully!',
                  text: ' ',
                  type: 'success',
                  timer: this.helper.swalTimer,
                  showConfirmButton: false,
                  onClose: () => {
                    this.viewUnpublishedData = false;
                    this.viewPublishedData = false;
                    this.loadMasterFormForWorkFlow(this.defaultDepartment);
                    clearInterval(timerInterval)
                  }
                });
              } else {
                swal({
                  title: 'Declined Successfully!',
                  text: ' ',
                  type: 'success',
                  timer: this.helper.swalTimer,
                  showConfirmButton: false,
                  onClose: () => {
                    this.viewUnpublishedData = false;
                    this.viewPublishedData = false;
                    this.loadMasterFormForWorkFlow(this.defaultDepartment);
                    clearInterval(timerInterval)
                  }
                });
              }
            } else {
              swal({
                title: 'Error',
                text: 'Some Internal Issue has been occured .We will get back to You',
                type: 'error',
                timer: this.helper.swalTimer,
                showConfirmButton: false,
              });
              this.viewUnpublishedData = false;
              this.viewPublishedData = false;
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

  /*START:REVISION FOR DOCUMENT*/
  revisionForDocument(dto) {
    var element = document.getElementById("overflowWorkFlowCompareId");
    element.setAttribute("style", "visibility:hidden");
    this.sourceFile = "";
    this.compareFile = "";
    this.modalSpinner = false;
    this.service.loadLogOfMasterFormWorkFlow(dto.id).subscribe(resp => {
      if (resp != null) {

        this.revisionArray = resp;
        this.leftRevisionArray = resp;
        this.rightRevisionArray = resp;
      }
    });
  }

  removeDataFromList(id, leftOrRightSideFlag) {
    if (leftOrRightSideFlag) {
      this.leftRevisionArray = this.revisionArray.filter(value => value.id != id);
    } else {
      this.rightRevisionArray = this.revisionArray.filter(value => value.id != id);
    }
  }
  /*END:REVISION FOR DOCUMENT*/

  tabChange(id) {
    if (id === "createTemplate") {
      this.submitted = false;
      this.loadTemplateToEdit(this.masterDynamicTemplate.id);
    } else {
      this.setupWorkFlowSubmitted = false;
      this.loadNumberOfLevelsForMasterDynamicTemplate(this.masterDynamicTemplate.id);
    }
    this.activeTabId = id;
  }

  openBtnClicked() {
    if (!this.date.showSelector)
      this.date.openBtnClicked();
    if (!this.date1.showSelector)
      this.date1.openBtnClicked();
  }

  openBtnClicked2(flag) {
    if (!this.date.showSelector && !flag)
      this.date.openBtnClicked();
  }

  openBtnClicked1(flag) {
    if (!this.date.showSelector && !flag)
      this.date.openBtnClicked();
  }

  editEffectiveDate(row) {
    if (!this.helper.isEmpty(row.masterDynamicTemplateDTO.effectiveDate))
      row.masterDynamicTemplateDTO.newEffectiveDate = this.populateDate(row.masterDynamicTemplateDTO.effectiveDate);
  }

  editReviewDate(row) {
    if (!this.helper.isEmpty(row.masterDynamicTemplateDTO.nextReviewDate))
      row.masterDynamicTemplateDTO.newReviewDate = this.populateDate(row.masterDynamicTemplateDTO.nextReviewDate);
  }

  editDocumentOwner(row) {
    this.onChangeDept(row.masterDynamicTemplateDTO.departments);
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
        let masterDynamicTemplate: MasterDynamicTemplate = new MasterDynamicTemplate();
        masterDynamicTemplate.id = row.masterDynamicTemplateDTO.id;
        masterDynamicTemplate.effectiveDate = obj.helper.dateToSaveInDB(event.date);
        obj.service.saveMasterTemplateDates(masterDynamicTemplate).subscribe(resp => {
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
        let masterDynamicTemplate: MasterDynamicTemplate = new MasterDynamicTemplate();
        masterDynamicTemplate.id = row.masterDynamicTemplateDTO.id;
        masterDynamicTemplate.nextReviewDate = obj.helper.dateToSaveInDB(event.date);
        obj.service.saveMasterTemplateDates(masterDynamicTemplate).subscribe(resp => {
          obj.spinnerFlag = false;
          obj.loadMasterFormForWorkFlow(this.defaultDepartment);
        });
      }).catch(() => {
      });
    }
  }

  onChangeDept(event) {
    this.userService.loadAllUserBasedOnDepartment(event).subscribe(resp => {
      this.templateOwnerList = resp.result;
      if (!this.templateOwnerList.map(m => +m.key).includes(this.masterDynamicTemplate.templateOwnerId))
        this.masterDynamicTemplate.templateOwnerId = 0;
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
        let masterDynamicTemplate: MasterDynamicTemplate = new MasterDynamicTemplate();
        masterDynamicTemplate.id = row.masterDynamicTemplateDTO.id;
        masterDynamicTemplate.templateOwnerId = event;
        obj.service.saveMasterTemplateDates(masterDynamicTemplate).subscribe(resp => {
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
