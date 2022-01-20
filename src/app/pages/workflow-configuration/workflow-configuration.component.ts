import { ImportSettingComponent } from './../import-setting/import-setting.component';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CommonModel, FlowFormGroupSettingsDTO, flowMasterDto, flowNotificationDto, ProjectUserPermissionsDTO, RolePermissions, WorkFlowLevelDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { DepartmentService } from '../department/department.service';
import { AddProjectsetupComponent } from '../projectsetup/add-projectsetup/add-projectsetup.component';
import { userRoleservice } from '../role-management/role-management.service';
import { WorkflowFlowchartComponent } from '../workflow-flowchart/workflow-flowchart.component';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { WorkflowConfigurationService } from './workflow-configuration.service';

@Component({
  selector: 'app-workflow-configuration',
  templateUrl: './workflow-configuration.component.html',
  styleUrls: ['./workflow-configuration.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkflowConfigurationComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('staticDocumentClosebutton') staticDocumentClosebutton;
  @Input('projectId') projectId;
  @Input('projectName') projectName;
  @ViewChild('modalWorkFlowSetting') modalWorkFlowSetting: ModalBasicComponent;
  @ViewChild('emailNotificationSettings') emailNotificationSettings: any;
  @ViewChild('userPermissionsSettings') userPermissionsSettings: any;
  @ViewChild('workFlowChart') workFlowChart: WorkflowFlowchartComponent;
  @ViewChild('copyConfigurationModal') copyConfigurationModal: any;
  @ViewChild('copyLevelConfigurationModal') copyLevelConfigurationModal: any;
  @ViewChild('freezemodal') freezemodal: any;
  @ViewChild('importPDFSetting') importPDFSetting:ImportSettingComponent;
  public droppedItems: any[] = new Array();
  public documentList: any[] = new Array();
  public formList: any[] = new Array();
  public templateList: any[] = new Array();
  public formGroupList: any[] = new Array();
  public workflowLevelList: any[] = new Array();
  public workflowConfigurationformGroup = null;
  public workflowLevelDto: WorkFlowLevelDTO = new WorkFlowLevelDTO();
  public flowFormGroupSettingsDTO: FlowFormGroupSettingsDTO = new FlowFormGroupSettingsDTO();
  public staticDocumentSettingsDTO: FlowFormGroupSettingsDTO = new FlowFormGroupSettingsDTO();
  public levelId: any[] = new Array();
  public add: Boolean = false;
  public value1: any;
  public value2: any;
  public createLevel: Boolean = false;
  public workflowSettingsList: any[] = new Array();
  public levelName: any;
  public roles: any[] = new Array();
  public departments: any[] = new Array();
  public users: any[] = new Array();
  public usersData: any[] = new Array();
  public rolesId: any[] = new Array();
  public departmentId: any[] = new Array();
  public usersId: any[] = new Array();
  public notificationModalList: flowNotificationDto[] = new Array();
  public userPermissionsModalList: RolePermissions[] = new Array();
  public validSave: Boolean;
  public saveModal: flowMasterDto = new flowMasterDto();
  public documentNumber: any = null;
  public documentConstant: any = null;
  public documentDisplayOrder = 0;
  public documentName: any;
  public freezeComments: any;
  public freezeData: any;
  map = new Map<string, any>();
  isLoading = false;
  spinnerFlag = false;
  copyConfigurationList: any = new Array();
  documentConfigurationNeedToBeApplied = "";
  copyLevelConfigurationList: any = new Array();
  levelConfigurationToBeApplied: any = null;
  freezeFlagForLevel = false;
  switchButtonColorFlag = false;
  documentlockData: any;
  documentlockDataLogs: any[] = new Array();
  isVsrPublished: boolean = false;
  addButtonFlag: boolean = true;
  applyCopy = false;
  isFormGroupLevelsEqual: boolean = false;
  dropdownSettings = {
    singleSelection: false,
    text: "Select Users",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
    maxHeight: 200,
    position: 'top'
  };
  dropdownSettingsRole = {
    singleSelection: false,
    text: "Select Roles",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
    maxHeight: 200,
    position: 'top'
  };
  dropdownSettingsDept = {
    singleSelection: false,
    text: "Select Departments",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
    maxHeight:200,
    position: 'bottom'
  };
  userDropdownSettings = {
    text: "Select Users",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    classes: "myclass custom-class",
    primaryKey: "id",
    labelKey: "itemName",
    noDataLabel: "Search Users",
    enableSearchFilter: true,
    searchBy: ['itemName','id'],
};
newUserDropdownSettings = {
  text: "Select Users",
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  classes: "myclass custom-class",
  primaryKey: "id",
  labelKey: "itemName",
  noDataLabel: "Search Users",
  enableSearchFilter: true,
  searchBy: ['itemName','id'],
  position: 'bottom'
};
  dataIncompleteFlag: false;
  updateFlag: boolean = false;
  createLevelPermission: boolean = false;
  selectedDocumentConstant:string="";
  isEditLevelOfDocument:boolean=false;
  editLevelData:any;
  selectedUsersForEdit:any=new Array();
  configFlag=false;
  @ViewChild('revisionDocs') revisionDocs: any;
  viewList=new Array();
  documentForms:any[]=new Array();
  newUsers:any=new Array();
  addNewUsers:any=new Array();
  selectredNewUsers:any=new Array();
  newLevel:number=0;
  newUserInput:string="";
  userInput:string="";
  constructor(public service: WorkflowConfigurationService, public levelService: WorkFlowLevelsService, public deptService: DepartmentService,
    private helper: Helper, private rolesService: userRoleservice, private adminComponent: AdminComponent,private configService:ConfigService,private addProjectsetupComponent: AddProjectsetupComponent) { }

  ngOnInit() {
    this.service.permissionForDocLock("Y", this.projectId).subscribe(rsp => {
      this.isVsrPublished = rsp.result;
    });
    this.loadData(this.projectId);
    this.workflowConfigurationformGroup = new FormGroup({
      levelname: new FormControl(this.workflowLevelDto.workFlowLevelName, [Validators.required]),
      password: new FormControl(this.workflowLevelDto.value, [Validators.required]),
    });
  }

  toggleClick(event: Event) {
    var list: any = document.getElementsByClassName('sb-item-body');
    var list1: any = document.getElementsByClassName('sb-item');
    for (let item of list) {
      if (item.style.height != '0px') {
        for (let item1 of list1) {
          if (!item1.classList.contains("is-collapsed"))
            item1.classList.add("is-collapsed")
        }
        item.style.height = '0px';
      }
    }
    event.preventDefault();
  }

  loadData(projectId) {
    this.spinnerFlag = true;
    this.adminComponent.loadProjects();
    this.service.loadDocumentsFormsTemplates(projectId).subscribe(response => {
      this.droppedItems = response['selectedList'];
      this.configFlag =this.droppedItems.filter(f=>f.configuration).length>0;
      let needToAddInProjectSetUpDraftIds = new Array();
      let needToAddInProjectSetUpDraftData = new Array();
      if (localStorage.getItem(this.helper.PERMISSION_CATEGORY_DOCUMENT)) {
        let draftList = JSON.parse(atob(localStorage.getItem(this.helper.PERMISSION_CATEGORY_DOCUMENT))).map(d => d.key);
        needToAddInProjectSetUpDraftIds.push(...draftList);
        needToAddInProjectSetUpDraftData.push(...JSON.parse(atob(localStorage.getItem(this.helper.PERMISSION_CATEGORY_DOCUMENT))));
        response[this.helper.PERMISSION_CATEGORY_DOCUMENT] = response[this.helper.PERMISSION_CATEGORY_DOCUMENT].filter(d => !draftList.includes(d.key));
      }
      if (localStorage.getItem(this.helper.PERMISSION_CATEGORY_FORM)) {
        let draftList = JSON.parse(atob(localStorage.getItem(this.helper.PERMISSION_CATEGORY_FORM))).map(d => d.key);
        needToAddInProjectSetUpDraftIds.push(...draftList);
        needToAddInProjectSetUpDraftData.push(...JSON.parse(atob(localStorage.getItem(this.helper.PERMISSION_CATEGORY_FORM))));
        response[this.helper.PERMISSION_CATEGORY_FORM] = response[this.helper.PERMISSION_CATEGORY_FORM].filter(d => !draftList.includes(d.key));
      }
      if (localStorage.getItem(this.helper.PERMISSION_CATEGORY_TEMPLATE)) {
        let draftList = JSON.parse(atob(localStorage.getItem(this.helper.PERMISSION_CATEGORY_TEMPLATE))).map(d => d.key);
        needToAddInProjectSetUpDraftIds.push(...draftList);
        needToAddInProjectSetUpDraftData.push(...JSON.parse(atob(localStorage.getItem(this.helper.PERMISSION_CATEGORY_TEMPLATE))));
        response[this.helper.PERMISSION_CATEGORY_TEMPLATE] = response[this.helper.PERMISSION_CATEGORY_TEMPLATE].filter(d => !draftList.includes(d.key));
      }
      if (localStorage.getItem(this.helper.PERMISSION_CATEGORY_FORM_GROUP)) {
        let draftList = JSON.parse(atob(localStorage.getItem(this.helper.PERMISSION_CATEGORY_FORM_GROUP))).map(d => d.key);
        needToAddInProjectSetUpDraftIds.push(...draftList);
        needToAddInProjectSetUpDraftData.push(...JSON.parse(atob(localStorage.getItem(this.helper.PERMISSION_CATEGORY_FORM_GROUP))));
        response[this.helper.PERMISSION_CATEGORY_FORM_GROUP] = response[this.helper.PERMISSION_CATEGORY_FORM_GROUP].filter(d => !draftList.includes(d.key));
      }
      if (needToAddInProjectSetUpDraftIds.length != 0) {
        let alreadythere = this.droppedItems.map(d => d.key);
        needToAddInProjectSetUpDraftIds = needToAddInProjectSetUpDraftIds.filter(d => !alreadythere.includes(d));
        this.droppedItems.push(...needToAddInProjectSetUpDraftData.filter(d => needToAddInProjectSetUpDraftIds.includes(d.key)));
      }
      this.documentList = response[this.helper.PERMISSION_CATEGORY_DOCUMENT].sort((a, b) => (a.displayOrder > b.displayOrder));
      this.formList = response[this.helper.PERMISSION_CATEGORY_FORM].sort((a, b) => a.value.localeCompare(b.value));
      this.templateList = response[this.helper.PERMISSION_CATEGORY_TEMPLATE].sort((a, b) => a.value.localeCompare(b.value));
      this.formGroupList = response[this.helper.PERMISSION_CATEGORY_FORM_GROUP].sort((a, b) => a.value.localeCompare(b.value));

      this.workFlowChart.workFlowChartData = null;
      this.adminComponent.loadNavBarForms();
      this.adminComponent.loadNavBarTemplates();
      this.adminComponent.loadNavBarForDocuments();
    });
    this.spinnerFlag = false;
  }

  loadLevels(list?: any[]) {
    this.workflowLevelList = new Array();
    this.levelService.loadWorkFlow().subscribe((resp) => {
      this.workflowLevelList = resp.list;
      if (list) {
        let levelIdsArray: any[] = list.map(df => df.levelId);
        this.workflowLevelList = this.workflowLevelList.filter(d => !levelIdsArray.includes(d.id));
      }
      this.workflowLevelList = this.workflowLevelList.map(option => ({ value: option.id, label: option.workFlowLevelName }));
    });
  }

  addAll(list, addFlag) {
    list.forEach(element => {
      this.addORRemove({ 'dragData': element }, addFlag);
    });
  }

  checkForcommonworkflowChanges(data) {
    let modal = new CommonModel();
    modal.projectSetupProjectId = this.projectId;
    if (data)
      modal.workFlowDocs.push(data.key);
    this.service.addCommonWorkflowIntoProject(modal).subscribe((resp) => {
      this.loadData(this.projectId);
      if (resp.message) {
        swal({ title: 'Warning!', text: resp.message, type: 'warning', timer: 3000, showConfirmButton: false });
      }
    });
  }

  moveUpOrDown(list: any[], index, upFlag) {
    this.switchButtonColorFlag = true;
    let i
    if (upFlag) {
      i = index - 1;
    } else {
      i = index + 1;
    }
    if (i !== undefined) {
      let element = list[index];
      list[index] = list[i];
      list[i] = element;
      if (element.child && element.child.length > 0)
        element.child[0].displayOrder = element.displayOrder;
    }
  }

  addORRemove(e: any, addFlag) {
    if (addFlag) {
      e.dragData.displayOrder = this.droppedItems.length + 1
      this.droppedItems.push(e.dragData);
      switch (e.dragData.mappingId) {
        case this.helper.PERMISSION_CATEGORY_DOCUMENT:
          this.documentList = this.documentList.filter(data => data.key !== e.dragData.key);
          break;
        case this.helper.PERMISSION_CATEGORY_FORM:
          this.formList = this.formList.filter(data => data.key !== e.dragData.key);
          break;
        case this.helper.PERMISSION_CATEGORY_TEMPLATE:
          this.templateList = this.templateList.filter(data => data.key !== e.dragData.key);
          break;
        default:
          this.formGroupList = this.formGroupList.filter(data => data.key !== e.dragData.key);
          break;
      }
      this.addToLocalStorage(e.dragData.mappingFlag ? this.helper.PERMISSION_CATEGORY_FORM_GROUP : e.dragData.mappingId, e.dragData);
    } else {
      this.deleteLevelOfDocumentSwal(e.dragData, false, e.dragData.freezeFlag, e.dragData.dataIncompleteFlag)
    }
  }

  createWorkflowLevel() {
    
    this.isLoading = true;
    this.workflowLevelDto.workFlowLevelName = this.levelName;
    this.levelService.saveWorkFlow(this.workflowLevelDto).subscribe((resp) => {
      this.isLoading = false;
      let responseMsg: string = resp.result;
      let data: any = resp.dto;
      if (responseMsg === "success") {
        if (data.id != 0) {
          this.loadLevels(this.saveModal.documentFlows);
          this.createLevel = false;
          this.levelId = new Array();
          this.levelId.push(data.id);
          this.validateSave();
          swal({ title: 'Success', text: 'Level Saved Successfully', type: 'success', timer: 2000, showConfirmButton: false });
        } else {
          swal({ title: 'Warning', text: data.errorMessage, type: 'warning', timer: 2000, showConfirmButton: false });
        }
      } else {
        swal({ title: 'Not Saved!', text: 'Level has  not been saved', type: 'error', timer: 2000, showConfirmButton: false });
      }
    },
      err => {
        this.isLoading = false;
        swal({ title: 'Not Saved!', text: 'Level has  not been saved', type: 'error', timer: 2000, showConfirmButton: false });
      });
  }

  loadSettingsAndUsers(flowId: any) {
    this.loadDepartmentsOnProject().then(()=>{
      const commonmodal: CommonModel = new CommonModel();
      commonmodal.currentCommonLevel = flowId;
      this.service.loadworkFlowSettingsAndUsers(commonmodal).subscribe((resp) => {
        this.workflowSettingsList = resp.data;
        this.notificationModalList = resp.users;
        if (this.notificationModalList && this.notificationModalList.length != 0) {
          this.rolesId = this.notificationModalList.map(u => ({ id: u.roleIdOfUser, itemName: u.roleName }));
          this.departmentId = this.notificationModalList.map(u => ({ id: u.deptIdOfUser, itemName: u.deptName }));
          let newArr = [];
          let newArr1 = [];
          this.rolesId.forEach((item) => {
            if (newArr.findIndex(i => i.id == item.id) === -1) {
              newArr.push(item);
            }
          });
          this.departmentId.forEach(item => {
            this.departments.forEach(e2 =>{
              if(item.id === e2.id && newArr1.findIndex(i => i.id == item.id) === -1)
              newArr1.push(e2);
            });
          });
          this.rolesId = newArr;
          this.departmentId = newArr1;
          this.loadUser(this.departmentId, false).then(resp => {
            this.usersId = this.notificationModalList.map(u => ({ id: u.userId, itemName: u.userName }));
            this.selectedUsersForEdit= this.notificationModalList.map(u => ({id: u.userId, itemName: u.userName,roleIdOfUser: u.roleIdOfUser, roleName: u.roleName,deptIdOfUser: u.deptIdOfUser, deptName: u.deptName}));
            let list = this.notificationModalList.map(u => ({ id: u.userId, itemName: u.userName, notification: u.notification, email: u.email, followUp: u.followUp }));
            this.loadNotification(list, false);
            this.validateSave();
          })
          this.add = true;
        } else {
          this.add = true;
        }
      });
    });
  }

  removeoptions(item: any) {
    this.workflowSettingsList.forEach(element => {
      if (element.settingsName === item.settingsName && !item.check) {
        element.flowSubSettings.forEach(e => {
          e.blocked = true;
        });
      }
      if (element.settingsName === item.settingsName && item.check) {
        element.flowSubSettings.forEach(e => {
          e.blocked = false;
        });
      }
    });
  }

  loadUserPermissions(userList, flag) {
    let userIds = userList.map(m => m.id);
    const data: ProjectUserPermissionsDTO = new ProjectUserPermissionsDTO();
    data.userIds = userIds;
    data.projectId = this.projectId;
    data.permissionConstant = this.documentConstant;
    this.service.loadUserPermissionsForProject(data).subscribe((resp) => {
      this.userPermissionsModalList = resp;
      if (flag)
        this.userPermissionsSettings.show();
    });
  }

  loadDepartmentsOnProject()  {
    return new Promise<boolean>((resolve)=>{
      this.deptService.loadDepartmentOnProjectId(this.projectId).subscribe(jsonResp => {
        this.departments = jsonResp.result.map(option => ({ id: +option.key, itemName: option.value }));
        resolve(true);
      },err=> resolve(true));

    })
   
  }

  onChangeRoles(rolesId) {
    let ids = rolesId.map(m => m.id);
    this.users = this.usersData.filter(f => ids.includes(+f.mappingId)).map(option => ({ id: +option.key, itemName: option.value }));
    this.usersId = this.users.filter(f => this.usersId.map(m => m.id).includes(f.id));
  }

  loadNotification(userList, viewFlag) {
    let ids = userList.map(m => m.id);
    let notificationList = [];
    if (userList.length > 0) {
      for (let index = 0; index < userList.length; index++) {
        const element = userList[index];
        if (ids.includes(element.id)) {
          let data: flowNotificationDto = new flowNotificationDto();
          data.userId = element.id;
          data.userName = element.itemName;
          data.displayOrder = index + 1;
          data.notification = this.notificationModalList.filter(f => f.userId === element.id).length > 0 ? ((this.notificationModalList.filter(f => f.userId === element.id).map(m => m.notification)).toString() == 'true' ? true : false) : false;
          data.email = this.notificationModalList.filter(f => f.userId === element.id).length > 0 ? ((this.notificationModalList.filter(f => f.userId === element.id).map(m => m.email)).toString() == 'true' ? true : false) : false;
          data.followUp = this.notificationModalList.filter(f => f.userId === element.id).length > 0 ? ((this.notificationModalList.filter(f => f.userId === element.id).map(m => m.followUp)).toString() == 'true' ? true : false) : false;
          let check = this.notificationModalList.filter(f => f.userId === element.id).map(m => m.notification).toString();
          if(this.helper.isEmpty(check))
            data.email=true;
          notificationList.push(data);
        }
      }
      this.notificationModalList = notificationList;
    }
    this.notificationModalList.sort((a, b) => ('' + a.displayOrder).localeCompare('' + b.displayOrder));
    if (viewFlag)
      this.emailNotificationSettings.show();
  }

  loadUser(deptIds: any[], flag): Promise<void> {
    return new Promise<void>(resolve => {
      let deptId = deptIds.map(m => m.id);
      if (deptId) {
        this.rolesService.loadUsersForWorkFlowConfig(deptId,this.projectId,this.selectedDocumentConstant,this.levelId).subscribe((resp) => {
          this.usersData = resp.result;
          let roles = resp.result.map(option => ({ id: +option.mappingId, itemName: option.documentNumber }));
          this.roles = roles.filter((v, i) => roles.findIndex(item => item.id == v.id) === i);
          this.rolesId = this.roles.filter(f => this.rolesId.map(m => m.id).includes(f.id));
          this.onChangeRoles(this.rolesId);
          let usersList = [];
          this.usersId.forEach(el1 => {
            this.users.forEach(el2 => {
              if (el1.id === el2.id)
                usersList.push({ id: el1.id, itemName: el1.itemName });
            })
          })
          this.usersId = usersList;
          if (flag)
            this.loadNotification(this.usersId, false);
          resolve();
        }, err => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  validateSave() {
    const data = this.workflowSettingsList.filter(element =>
      element.mainPageCheck && true === element.check
    );
    if (data.length > 0 && this.rolesId.length > 0 && this.usersId.length > 0 && this.levelId.length != 0) {
      this.validSave = true;
    } else {
      this.validSave = false;
    }
  }

  onChangeusers(event) {
    const data = this.workflowSettingsList.filter(element =>
      element.mainPageCheck && true === element.check
    );
    if (data.length > 0 && event.length > 0) {
      this.validSave = true;
    } else {
      this.validSave = false;
    }
  }

  loadFlowDatasOfDocument(data): Promise<void> {
    return new Promise<void>(resolve => {
      const modal: CommonModel = new CommonModel();
      modal.projectSetupconstantName = data.key;
      modal.projectSetupProjectId = this.projectId
      this.saveModal = new flowMasterDto();
      this.saveModal.projectName = this.projectName;
      this.saveModal.documentName = data.value;
      this.saveModal.type
      this.service.loadFlowData(modal).subscribe((resp) => {
        if (resp.result != null)
          this.saveModal = resp.result
        
        this.loadLevels(this.saveModal.documentFlows);
        this.documentName = data.value;
        this.documentConstant = data.key;
        this.documentDisplayOrder = data.displayOrder;
        this.documentNumber = this.saveModal.documentNumber;
        this.workFlowChart.loadAllDataForDocumentForProject(this.projectId, data.key);
        resolve();
      }, er => {
        resolve();
      });
    })
  }

  openSuccessUpdateSwal(flag) {
    this.modalWorkFlowSetting.spinnerShow();
    if (flag) {
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
            this.saveLevelData(userRemarks);
          } else {
            this.modalWorkFlowSetting.spinnerHide();
            swal({
              title: '',
              text: 'Comments is requried',
              type: 'info',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            });
          }
        }).catch(err=>{
          this.modalWorkFlowSetting.spinnerHide();
        });
    } else{
      this.saveLevelData();
    }
     
  }

  saveLevelData(userRemarks?) {
    if (this.validSave) {
      this.saveModal.documentNumber = this.documentNumber;
      this.saveModal.documentConstantName = this.documentConstant;
      this.saveModal.projectId = this.projectId;
      this.saveModal.projectName = this.projectName;
      this.saveModal.levelId = Number(this.levelId);
      this.saveModal.flowNotificationDto = this.notificationModalList;
      this.saveModal.userPermissionsList = this.userPermissionsModalList;
      this.saveModal.settings = this.workflowSettingsList;
      this.saveModal.documentDisplayOrder = this.documentDisplayOrder;
      this.saveModal.userRemarks = userRemarks;
      this.service.saveWorkFlowData(this.saveModal).subscribe((resp) => {
        this.modalWorkFlowSetting.spinnerHide();
        if (resp.result === 'success') {
          this.saveModal = resp;
          this.loadDataForFlow(0, { key: this.documentConstant, value: this.documentName, 'freezeFlag': this.freezeFlagForLevel });
          swal({ title: 'Success', text: 'Workflow Level Saved Successfully', type: 'success', timer: 2000, showConfirmButton: false });
        } else {
          swal({ title: 'Not Saved!', text: 'Workflow Level has not been saved', type: 'error', timer: 2000, showConfirmButton: false });
        }
        this.addProjectsetupComponent.loadDataOnEdit(this.projectId);
      }, err => {
        this.modalWorkFlowSetting.spinnerHide();
        swal({ title: 'Not Saved!', text: 'Workflow Level has not been saved', type: 'error', timer: 2000, showConfirmButton: false });
      });
    }else{
      this.modalWorkFlowSetting.spinnerHide();
    }
  }

  checkWorkFlowForDF(index, item, freezeFlag) {
    var obj = this;
    if (freezeFlag) {
      swal({ title: 'Info', text: 'Cannot be created as workflow has started', type: 'warning', timer: 3000, allowOutsideClick: false });
    } else {
      this.loadDataForFlow(index, item);
    }
  }

  loadDataForFlow(index, item) {
    this.selectedDocumentConstant=item.key;
    this.spinnerFlag = true;
    this.switchButtonColorFlag = false;
    this.freezeFlagForLevel = item.freezeFlag;
    this.dataIncompleteFlag = item.dataIncompleteFlag;
    this.add = false;
    this.addButtonFlag = true;
   
    this.loadFlowDatasOfDocument(item).then(resp => {
      this.getLevelPermission();
      this.modalWorkFlowSetting.show();
      this.spinnerFlag = false;
    }, er => { this.spinnerFlag = false; })
  }

  addNewLevelForDocument(alreadyFlowList: any[]) {
    this.updateFlag = false;
    this.workFlowChart.workFlowChartData = null;
    this.loadLevels(alreadyFlowList);
    this.loadSettingsAndUsers(0);
    this.rolesId = new Array();
    this.usersId = new Array();
    this.departmentId=new Array();
    this.loadDepartmentsOnProject();
    this.levelId = new Array();
    this.levelName = null;
    this.createLevel = false;
    this.addButtonFlag = false;
    let levelOrder = 1;
    if (alreadyFlowList.length != 0)
      levelOrder = alreadyFlowList.length + 1;
    this.saveModal = new flowMasterDto();
    this.saveModal.projectName = this.projectName;
    this.saveModal.levelOrder = levelOrder;
    this.saveModal.allUserApproval = false;
    this.validateSave();
    this.add = true;
    this.isEditLevelOfDocument=false;
    this.selectedUsersForEdit=[];
  }

  editLevelOfDocument(item) {
    this.editLevelData=item;
    this.isEditLevelOfDocument=true;
    this.loadLevels(this.saveModal.documentFlows.filter(df => df.levelId !== item.levelId));
    this.loadSettingsAndUsers(item.id);
    this.updateFlag = true;
    this.saveModal.flowId = item.id;
    this.saveModal.levelId = item.levelId;
    this.levelId = [];
    this.levelId.push(item.levelId);
    this.saveModal.levelOrder = item.orderId;
    this.saveModal.documentCurrentFlowId = item.documentMasterId;
    this.saveModal.allUserApproval = item.allUserApproval;
    
  }

  diableOtherSetting(item, workflowSettingsList: any[]) {
    item.check = !item.check;
    workflowSettingsList.forEach(element => {
      if (element.settingsName !== item.settingsName)
        element.check = false;
    })
    setTimeout(() => this.removeoptions(item), 1000);
    setTimeout(() => this.validateSave(), 1000);
  }

  disableOtherSubSetting(s, list) {
    s.check = !s.check;
    list.forEach(element => {
      if (element.subSettingsName !== s.subSettingsName)
        element.check = false;
    })
    this.validateSave();
  }

  setSLAToAll(slaValue, workflowSettingsList: any[]) {
    workflowSettingsList.forEach(ele => {
      ele.flowSubSettings.forEach(eleSub => {
        eleSub.subSettingsvalue = slaValue;
      })
    });
  }

  updateLevelOrderOfDocument(list) {
    this.modalWorkFlowSetting.spinnerShow();
    for (let index = 0; index < list.length; index++) {
      list[index].orderId = index + 1;
    }
    this.service.updateLevelOrderOfDocument(list).subscribe(resp => {
      this.modalWorkFlowSetting.spinnerHide();
      if (resp.result === 'success')
        swal({ title: 'Success', text: 'Level Order Updated Successfully', type: 'success', timer: 2000, showConfirmButton: false });
      else
        swal({ title: 'Not Updated!', text: 'Level Order has not been updated', type: 'error', timer: 2000, showConfirmButton: false });
    },err=>{
      this.modalWorkFlowSetting.spinnerHide();
    })
  }

  loadAllDataForDocumentForProject(data) {
    this.workFlowChart.loadAllDataForDocumentForProject(this.projectId, data.key);
  }

  updateDocumentOrderOfProject(list: any[]) {
    this.adminComponent.spinnerFlag=true;
    let sortedList = new Array();
    let i = 0
    for (let index = 0; index < list.length; index++) {
      if (list[index].configuration) {
        list[index].displayOrder = ++i;
        let childList = new Array();
        if (list[index].child.length > 0) {
          childList.push({
            "displayOrder": list[index].displayOrder,
            "key": list[index].child[0].key
          })
        }
        sortedList.push({
          "displayOrder": list[index].displayOrder,
          "key": list[index].key,
          "child": childList
        })
      }

    }
    this.droppedItems = list.sort((a, b) => a.displayOrder - b.displayOrder);
    this.service.updateDocumentOrderOfProject(sortedList, this.projectId).subscribe(resp => {
      this.adminComponent.spinnerFlag=false;
      if (resp.result === 'success')
        swal({ title: 'Success', text: 'Document Order Updated Successfully', type: 'success', timer: 2000, showConfirmButton: false });
      else
        swal({ title: 'Not Updated!', text: 'Document Order has not been updated', type: 'error', timer: 2000, showConfirmButton: false });
    },err=>{
      this.adminComponent.spinnerFlag=false;
    })
  }

  deleteLevelOfDocumentSwal(item,flagLevelDelete,freezeFlag,dataIncompleteFlag) {
    var obj = this;
    if(freezeFlag || dataIncompleteFlag){
      swal({ title: 'Info', text: 'Cannot be deleted as workflow has started', type: 'warning', timer: 3000,allowOutsideClick: false });
      return;
    }else{
      this.configService.HTTPGetAPI("projectsetup/checkIsClonedDocument/"+this.projectId+"/"+item.key).subscribe(response =>{
        if(!response){
          swal({title: 'Are you sure?', text: 'You wont be able to revert',type: 'warning',
          showCancelButton: true,confirmButtonColor: '#3085d6',cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',cancelButtonText: 'No, cancel!',
          confirmButtonClass: 'btn btn-success m-r-10',cancelButtonClass: 'btn btn-danger',allowOutsideClick: false,
          buttonsStyling: false
        }).then(function () {
          let flag=false;
          if(flagLevelDelete){
            obj.openDeleteSwal(item,true);
          }else{
            let category = item.mappingFlag ? obj.helper.PERMISSION_CATEGORY_FORM_GROUP : item.mappingId;
            if (localStorage.getItem(category)) {
              let list = JSON.parse(atob(localStorage.getItem(category))).filter(d => d.key == item.key);
              if (list.length > 0) {
                flag = false;
              } else {
                flag = true;
              }
            } else {
              flag = true;
            }
    
            if (flag) {
              let json = { projectSetupProjectId: obj.projectId, projectSetupconstantName: item.mappingFlag ? item.mappingId : item.key, flag: item.mappingFlag }
              obj.configService.HTTPPostAPI(json, "workflowConfiguration/checkDeleteDocumentOfProject").subscribe(resp => {
                if (resp.message) {
                  obj.spinnerFlag = false;
                  obj.loadData(obj.projectId);
                  swal({ title: resp.type, text: resp.message, type: resp.type, timer: 3000, showConfirmButton: false });
                } else {
                  obj.openDeleteSwal(item, false);
                }
              });
    
            } else {
              let category = item.mappingFlag ? obj.helper.PERMISSION_CATEGORY_FORM_GROUP : item.mappingId;
              if (localStorage.getItem(category)) {
                let list = JSON.parse(atob(localStorage.getItem(category))).filter(d => d.key != item.key);
                localStorage.setItem(category, btoa(JSON.stringify(list)));
              }
              obj.loadData(obj.projectId);
            }
          }
        });
        }else{
          swal({ title: 'Warning!', text:"This document configuration cannot be deleted because option to copy data from the parent project is chosen for this document type!", type: 'warning', timer: 4000, showConfirmButton: false });
        }
      });
      
    }
  }

  openDeleteSwal(item,flagLevelDelete){
    var obj = this;
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
          obj.delete(item,flagLevelDelete,"Comments : " + value);
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

  delete(item, flagLevelDelete, userRemarks) {
    this.deleteMultiFormSettings(item);
    if (flagLevelDelete)
      this.deleteLevelOfDocument(item, userRemarks);
    else {
      this.deleteDocumentOfProject(item.mappingFlag ? item.mappingId : item.key, item.mappingFlag, userRemarks);
      let category = item.mappingFlag ? this.helper.PERMISSION_CATEGORY_FORM_GROUP : item.mappingId;
      if (localStorage.getItem(category)) {
        let list = JSON.parse(atob(localStorage.getItem(category))).filter(d => d.key != item.key);
        localStorage.setItem(category, btoa(JSON.stringify(list)))
      }
    }
  }

  onChange(event, item) {
    if (!event && !item.dataIncompleteFlag)
      this.service.deleteDocumentOfProject(this.projectId, item.key, item.mappingFlag, '').subscribe((resp) => {
        this.loadData(this.projectId);
      });
  }

  deleteLevelOfDocument(id, userRemarks) {
    this.spinnerFlag = true;
    this.service.deleteLevelOfDocument(id, "", userRemarks).subscribe((resp) => {
      this.spinnerFlag = false;
      let responseMsg: string = resp.result;
      this.loadFlowDatasOfDocument({ key: this.documentConstant, value: this.documentName, displayOrder: this.documentDisplayOrder })
      if (responseMsg === "success") {
        swal({ title: 'Success', text: 'Level is deleted successfully', type: 'success', timer: 2000, showConfirmButton: false });
      } else {
        swal({ title: 'Error!', text: 'Error in deleting level', type: 'error', timer: 2000, showConfirmButton: false });
      }
    }, (err) => {
      swal({ title: 'Error!', text: 'Error in deleting level', type: 'error', timer: 2000, showConfirmButton: false }); this.spinnerFlag = false;
    });
  }

  deleteDocumentOfProject(documentConstant, mappingFlag, userRemarks) {
    this.spinnerFlag = true;
    this.service.deleteDocumentOfProject(this.projectId, documentConstant, mappingFlag, userRemarks).subscribe((resp) => {
      this.spinnerFlag = false;
      this.loadData(this.projectId);
      this.addProjectsetupComponent.loadDataOnEdit(this.projectId);
      swal({ title: resp.type, text: resp.message, type: resp.type, timer: 3000, showConfirmButton: false });
    }, (err) => {
      swal({ title: 'Error!', text: 'Error in deleting document', type: 'error', timer: 2000, showConfirmButton: false }); this.spinnerFlag = false;
    });
  }

  copyConfiguration(list: any[], item) {
    this.spinnerFlag = true;
    let newArray = JSON.parse(JSON.stringify(list))
    let fGchild = newArray.filter(l => l.mappingFlag).map(c => c.child);
    let testcaseChildList = newArray.filter(l => !l.mappingFlag && l.dfExecutionRequired).map(c => c.child);
    let formGrouping = new Array();
    fGchild.forEach(i => {
      i.forEach(element => {
        formGrouping.push(element)
      });
    });
    let testcaseChild = new Array();
    testcaseChildList.forEach(i => {
      i.forEach(element => {
        testcaseChild.push(element)
      });
    });
    this.copyConfigurationList = newArray.filter(l => !l.mappingFlag);
    this.copyConfigurationList.push(...testcaseChild);
    this.copyConfigurationList.push(...formGrouping);
    this.copyConfigurationList = this.copyConfigurationList.filter(l => item.key !== l.key);
    this.copyConfigurationList = this.copyConfigurationList.filter(l =>!l.freezeFlag);
    this.copyConfigurationList.forEach(element => {
      element.configuration=false;
    });
    this.documentConfigurationNeedToBeApplied = item.key;
    this.copyConfigurationModal.show();
    this.applyCopy = false;
    this.spinnerFlag = false;
  }

  applyConfigurationSwal(list, flag) {
    if (flag) {
      this.copyConfigurationModal.spinnerShow();
    } else {
      this.copyLevelConfigurationModal.spinnerShow();
    }
    
    var obj = this
    swal({
      title: 'Are you sure?', text: 'You wont be able to revert', type: 'warning',
      showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, apply it!', cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10', cancelButtonClass: 'btn btn-danger', allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      if (flag)
        obj.applyConfigurationOfDocument(list, obj.documentConfigurationNeedToBeApplied, obj.projectId);
      else
        obj.applyConfigurationOfLevel(list, obj.levelConfigurationToBeApplied);
    }).catch(() => {
      if (flag) {
        this.copyConfigurationModal.spinnerHide();
      } else {
        this.copyLevelConfigurationModal.spinnerHide();
      }
    });
  }

  applyConfigurationOfDocument(list, documentConstant, projectId) {
    let keyList = JSON.parse(JSON.stringify(list)).filter(d => d.configuration).map(l => l);
    this.service.copyConfiguration(keyList, documentConstant, projectId).subscribe(resp => {
      this.copyConfigurationModal.spinnerHide();
      if (resp.result === "success") {
        swal({ title: 'Success', text: 'Document configuration copy is done successfully', type: 'success', timer: 2000, showConfirmButton: false });
        this.copyConfigurationModal.hide();
        this.loadData(projectId);
      } else {
        swal({ title: 'Error!', text: 'Error in copying configuration', type: 'error', timer: 2000, showConfirmButton: false });
      }
      this.addProjectsetupComponent.loadDataOnEdit(this.projectId);
    }, err => this.copyConfigurationModal.spinnerHide());
  }

  copyLevelConfiguration(item) {
    this.loadLevels(this.saveModal.documentFlows);
    this.levelId = new Array()
    this.levelName;
    this.levelConfigurationToBeApplied = item;
    this.copyLevelConfigurationModal.show();
  }

  applyConfigurationOfLevel(list, item) {
    this.service.copyConfigurationOfLevel(list, item).subscribe(resp => {
      this.copyLevelConfigurationModal.spinnerHide();
      if (resp.result === "success") {
        swal({ title: 'Success', text: 'Level configuration copy is done successfully', type: 'success', timer: 2000, showConfirmButton: false });
        this.loadDataForFlow(0, { 'key': this.documentConstant, 'value': this.documentName, 'freezeFlag': this.freezeFlagForLevel, 'displayOrder': this.documentDisplayOrder });
        this.copyLevelConfigurationModal.hide();
      } else {
        swal({ title: 'Error!', text: 'Error in copying configuration', type: 'error', timer: 2000, showConfirmButton: false });
      }
    }, err => this.copyLevelConfigurationModal.spinnerHide());
  }

  addToLocalStorage(key, data) {
    if (localStorage.getItem(key)) {
      let list: any[] = JSON.parse(atob(localStorage.getItem(key)))
      list.push(data)
      localStorage.setItem(key, btoa(JSON.stringify(list)));
    } else {
      localStorage.setItem(key, btoa(JSON.stringify([data])));
    }
  }

  freezeOrUnFreeze(data: any) {
    this.spinnerFlag = true;
    this.service.permissionForDocLock(data.key, this.projectId).subscribe(rsp => {
      if (rsp.result) {
        this.spinnerFlag = false;
        swal({ title: 'Sorry!', text: 'This Document is freezed for next version; cannot be unlocked', timer: 4000, showConfirmButton: false });
      } else if (rsp.workFlowResult) {
        this.spinnerFlag = false;
        swal({ title: '', text: 'Some published items in the document are pending in workflow', timer: 4000, showConfirmButton: false });
      } else {
        this.spinnerFlag = false;
        this.freezemodal.show();
        this.documentlockData = data;
        this.documentlockDataLogs = [];
        this.loadFlowDatasOfDocument(data).then((result) => {
          this.freezeData = this.saveModal;
          if (this.freezeData.lockLogs.length > 0)
            this.documentlockDataLogs.push(...this.freezeData.lockLogs);
        }).catch((err) => {
        });
      }
    })
  }

  saveDocumentLockAndUnlock() {
    this.freezeData.documentLock = !this.freezeData.documentLock;
    if (this.freezeData.documentLock && this.freezeData.draftList.length>0) {
      var dataObj = this;
      swal({
        html:`<h5 >There are a few items in Draft. Would you like to lock the document?</h5>` ,
        type:'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText:'No',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
      })
        .then((value) => {
          dataObj.callSaveLock();
        }).catch(err=>{
          this.loadData(this.projectId);
          this.freezeOrUnFreeze(this.documentlockData)
        });
    } else {
      this.callSaveLock();
    }
  }

  callSaveLock(){
    this.spinnerFlag=true;
    this.service.documentLockUnlock(this.freezeData).subscribe(resp => {
      this.spinnerFlag=false;
      this.addProjectsetupComponent.loadDataOnEdit(this.projectId);
      if (resp == false) {
        swal({
          title: 'Warning', text: this.freezeData.documentName +
            ' has been already' + ((this.freezeData.documentLock) ? ' locked' : ' Unlocked'),
          type: 'warning', timer: 2000, showConfirmButton: false
        })
      } else {
        swal({
          title: 'Success', text: this.freezeData.documentName +
            ' has been' + ((this.freezeData.documentLock) ? ' locked' : ' Unlocked'),
          type: 'success', timer: 2000, showConfirmButton: false
        })
        this.freezemodal.hide();
      }
      this.loadData(this.projectId);
      this.freezeOrUnFreeze(this.documentlockData)
    });
  }

  loadMultiFormSettings(item) {
    this.isFormGroupLevelsEqual = false;
    this.service.loadFlowFormGroupSettingsForProject(this.projectId, item.mappingId).subscribe(resp => {
      if (!this.helper.isEmpty(resp.result)) {
        this.flowFormGroupSettingsDTO = resp.result;
      } else {
        this.flowFormGroupSettingsDTO = new FlowFormGroupSettingsDTO();
        this.flowFormGroupSettingsDTO.masterFormMappingId = item.mappingId;
        this.flowFormGroupSettingsDTO.projectId = this.projectId;
      }
      this.isFormGroupLevelsEqual = resp.levelsEqualFlag;
      if (!this.isFormGroupLevelsEqual)
        this.flowFormGroupSettingsDTO.commonApprovalFlag = false;
    });
  }

  saveMultiFormSettings() {
    this.spinnerFlag = true;
    this.flowFormGroupSettingsDTO.projectId = this.projectId;
    this.service.saveFlowFormGroupSettingsForProject(this.flowFormGroupSettingsDTO).subscribe(resp => {
      swal({ title: 'Success', text: 'Form Group Settings saved Successfully', type: 'success', timer: 2000, showConfirmButton: false });
      this.closebutton.nativeElement.click();
      this.spinnerFlag = false;
    });
  }

  onChangeCommonApproval() {
    this.flowFormGroupSettingsDTO.workflowSequenceFlag = false;
  }

  deleteMultiFormSettings(item) {
    this.service.deleteFlowFormGroupSettingsForProject(this.projectId, item.mappingId).subscribe(resp => {
    });
  }

  loadStaticDocumentSettings() {
    this.service.loadStaticDocumentSettingsForProject(this.projectId).subscribe(resp => {
      if (!this.helper.isEmpty(resp.result)) {
        this.staticDocumentSettingsDTO = resp.result;
      } else {
        this.staticDocumentSettingsDTO = new FlowFormGroupSettingsDTO();
        this.staticDocumentSettingsDTO.projectId = this.projectId;
      }
    });
  }

  saveStaticDocumentSettings() {
    this.spinnerFlag = true;
    this.staticDocumentSettingsDTO.projectId = this.projectId;
    this.service.saveStaticDocumentSettingsForProject(this.staticDocumentSettingsDTO).subscribe(resp => {
      swal({ title: 'Success', text: 'Workflow Settings saved Successfully', type: 'success', timer: 2000, showConfirmButton: false });
      this.staticDocumentClosebutton.nativeElement.click();
      this.spinnerFlag = false;
    });
  }

  checkCopyApply(copy, list) {
    copy.configuration = !copy.configuration;
    this.applyCopy = (list.filter(copy => copy.configuration).length > 0);
  }

  getLevelPermission() {
    this.adminComponent.configService.loadPermissionsBasedOnModule("154").subscribe(resp => {
      this.createLevelPermission = resp.createButtonFlag;
    });
  }
  onUserDeSelect(event:any,isAll:boolean){
    if(this.isEditLevelOfDocument){
      if(this.editLevelData && this.editLevelData.allUserApproval){
        if(!isAll){
          this.selectedUsersForEdit.forEach(element1 => {
            event.forEach(element => {
              if(element.id === element1.id){
                this.configService.HTTPGetAPI("projectsetup/checkAllUserPendingDocumentWorkFlow/"+this.editLevelData.id+"/"+element.id).subscribe(response =>{
                  if (response) {
                    swal({ title: 'Warning!', text:"This user has pending items to complete in this level", type: 'warning', timer: 3000, showConfirmButton: false });
                    if (this.usersId.findIndex(i => i.id == event[0].id) === -1) {
                      this.usersId.push(event[0]);
                    }
                  }
                });
              }
            });
          });
        }else{
          let arr=new Array();
          this.selectedUsersForEdit.forEach(element => {
            this.configService.HTTPGetAPI("projectsetup/checkAllUserPendingDocumentWorkFlow/"+this.editLevelData.id+"/"+element.id).subscribe(response =>{
              if (response) {
                arr.push(element);
              }
              if(arr.length > 0){
                swal({ title: 'Warning!', text:"This user has pending items to complete in this level", type: 'warning', timer: 3000, showConfirmButton: false });
                this.usersId.push(element);
                if (this.usersId.findIndex(i => i.id == element.id) === -1) {
                  this.usersId.push(element);
                }
              }
            });
          });
        }
      }
        if(this.helper.isTestCase(this.selectedDocumentConstant)){
          if(!isAll){
            this.selectedUsersForEdit.forEach(element1 => {
              event.forEach(element => {
                if(element.id === element1.id){
                  this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.selectedDocumentConstant).subscribe(response =>{
                    if (response) {
                      swal({ title: 'Warning!', text:"Please remove this user from the Test run and try again!", type: 'warning', timer: 3000, showConfirmButton: false });
                      if (this.usersId.findIndex(i => i.id == event[0].id) === -1) {
                        this.usersId.push(event[0]);
                      }
                    }
                  });
                }
              });
            });
          }else{
            let arr=new Array();
            this.selectedUsersForEdit.forEach(element => {
              this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.selectedDocumentConstant).subscribe(response =>{
                if (response) {
                  arr.push(element);
                }
                if(arr.length > 0){
                  swal({ title: 'Warning!', text:"Please remove this user from the Test run and try again!", type: 'warning', timer: 3000, showConfirmButton: false });
                  this.usersId.push(element);
                  if (this.usersId.findIndex(i => i.id == element.id) === -1) {
                    this.usersId.push(element);
                  }
                }
              });
            });
          }
        }
      }
  }

  onRolesDeSelect(event:any,isAll:boolean){
    if(this.isEditLevelOfDocument){
      if(this.editLevelData && this.editLevelData.allUserApproval){
        if(!isAll){
          this.selectedUsersForEdit.forEach(element1 => {
            event.forEach(element => {
              if(element.id === element1.roleIdOfUser){
                this.configService.HTTPGetAPI("projectsetup/checkAllUserPendingDocumentWorkFlow/"+this.editLevelData.id+"/"+element1.id).subscribe(response =>{
                  if (response) {
                    swal({ title: 'Warning!', text:"This user has pending items to complete in this level", type: 'warning', timer: 3000, showConfirmButton: false });
                    if (this.usersId.findIndex(i => i.id == element1.id) === -1) {
                      this.usersId.push({id: element1.id, itemName: element1.itemName});
                    }
                    if (this.rolesId.findIndex(i => i.id == element1.roleIdOfUser) === -1) {
                      this.rolesId.push({id: element1.roleIdOfUser, itemName: element1.roleName});
                    }
                  }
                });
              }
            });
          });
        }else{
          let arr=new Array();
          this.selectedUsersForEdit.forEach(element => {
            this.configService.HTTPGetAPI("projectsetup/checkAllUserPendingDocumentWorkFlow/"+this.editLevelData.id+"/"+element.id).subscribe(response =>{
              if (response) {
                arr.push(element);
              }
              if(arr.length > 0){
                swal({ title: 'Warning!', text:"This user has pending items to complete in this level", type: 'warning', timer: 3000, showConfirmButton: false });
                if (this.usersId.findIndex(i => i.id == element.id) === -1) {
                  this.usersId.push({id: element.id, itemName: element.itemName});
                }
                if (this.rolesId.findIndex(i => i.id == element.roleIdOfUser) === -1) {
                  this.rolesId.push({id: element.roleIdOfUser, itemName: element.roleName});
                }
              }
            });
          });
        }
      }
        if(this.helper.IQTC_VALUE === this.selectedDocumentConstant || this.helper.IOQTC_VALUE === this.selectedDocumentConstant || this.helper.PQTC_VALUE === this.selectedDocumentConstant || this.helper.OQTC_VALUE === this.selectedDocumentConstant || this.helper.OPQTC_VALUE === this.selectedDocumentConstant){
          if(!isAll){
            this.selectedUsersForEdit.forEach(element1 => {
              event.forEach(element => {
                if(element.id === element1.roleIdOfUser){
                  this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element1.id+"/"+this.selectedDocumentConstant).subscribe(response =>{
                    if (response) {
                      swal({ title: 'Warning!', text:"Please remove this user from the Test run and try again!", type: 'warning', timer: 3000, showConfirmButton: false });
                      if (this.usersId.findIndex(i => i.id == element1.id) === -1) {
                        this.usersId.push({id: element1.id, itemName: element1.itemName});
                      }
                      if (this.rolesId.findIndex(i => i.id == element1.roleIdOfUser) === -1) {
                        this.rolesId.push({id: element1.roleIdOfUser, itemName: element1.roleName});
                      }
                    }
                  });
                }
              });
            });
          }else{
            let arr=new Array();
            this.selectedUsersForEdit.forEach(element => {
              this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.selectedDocumentConstant).subscribe(response =>{
                if (response) {
                  arr.push(element);
                }
                if(arr.length > 0){
                  swal({ title: 'Warning!', text:"Please remove this user from the Test run and try again!", type: 'warning', timer: 3000, showConfirmButton: false });
                  if (this.usersId.findIndex(i => i.id == element.id) === -1) {
                    this.usersId.push({id: element.id, itemName: element.itemName});
                  }
                  if (this.rolesId.findIndex(i => i.id == element.roleIdOfUser) === -1) {
                    this.rolesId.push({id: element.roleIdOfUser, itemName: element.roleName});
                  }
                }
              });
            });
          }
        }
      }
  }

  onDeptDeSelect(event:any,isAll:boolean){
    if(this.isEditLevelOfDocument){
      if(this.editLevelData && this.editLevelData.allUserApproval){
        if(!isAll){
          this.selectedUsersForEdit.forEach(element1 => {
            event.forEach(element => {
              if(element.id === element1.deptIdOfUser){
                this.configService.HTTPGetAPI("projectsetup/checkAllUserPendingDocumentWorkFlow/"+this.editLevelData.id+"/"+element1.id).subscribe(response =>{
                  if (response) {
                    swal({ title: 'Warning!', text:"This user has pending items to complete in this level", type: 'warning', timer: 3000, showConfirmButton: false });
                    this.usersId.push({id: element1.id, itemName: element1.itemName});
                    this.departments.forEach(e2 =>{
                      if(element1.deptIdOfUser === e2.id)
                        if (this.departmentId.findIndex(i => i.id == e2.id) === -1) {
                          this.departmentId.push(e2);
                        }
                    });
                    let deptId =  this.departments.map(m => m.id);
                    this.rolesService.loadAllUsersAndRolesOnDepartmentIds(deptId).subscribe((resp) => {
                      this.usersData = resp.result;
                      let roles = resp.result.map(option => ({ id: +option.mappingId, itemName: option.documentNumber }));
                      this.roles = roles.filter((v, i) => roles.findIndex(item => item.id == v.id) === i);
                      if (this.rolesId.findIndex(i => i.id == element1.roleIdOfUser) === -1) {
                        this.rolesId.push({id: element1.roleIdOfUser, itemName: element1.roleName});
                      }
                    });
                  }
                });
              }
            });
          });
        }else{
          let arr=new Array();
          this.selectedUsersForEdit.forEach(element => {
            this.configService.HTTPGetAPI("projectsetup/checkAllUserPendingDocumentWorkFlow/"+this.editLevelData.id+"/"+element.id).subscribe(response =>{
              if (response) {
                arr.push(element);
              }
              if(arr.length > 0){
                swal({ title: 'Warning!', text:"This user has pending items to complete in this level", type: 'warning', timer: 3000, showConfirmButton: false });
                this.usersId.push({id: element.id, itemName: element.itemName});
                  this.departments.forEach(e2 =>{
                    if(element.deptIdOfUser === e2.id)
                      if (this.departmentId.findIndex(i => i.id == e2.id) === -1) {
                        this.departmentId.push(e2);
                      }
                  });
                  let deptId =  this.departments.map(m => m.id);
                  this.rolesService.loadAllUsersAndRolesOnDepartmentIds(deptId).subscribe((resp) => {
                    this.usersData = resp.result;
                    let roles = resp.result.map(option => ({ id: +option.mappingId, itemName: option.documentNumber }));
                    this.roles = roles.filter((v, i) => roles.findIndex(item => item.id == v.id) === i);
                    if (this.rolesId.findIndex(i => i.id == element.roleIdOfUser) === -1) {
                      this.rolesId.push({id: element.roleIdOfUser, itemName: element.roleName});
                    }
                  });
              }
            });
          });
        }
      }
        if(this.helper.IQTC_VALUE === this.selectedDocumentConstant || this.helper.IOQTC_VALUE === this.selectedDocumentConstant || this.helper.PQTC_VALUE === this.selectedDocumentConstant || this.helper.OQTC_VALUE === this.selectedDocumentConstant || this.helper.OPQTC_VALUE === this.selectedDocumentConstant){
          if(!isAll){
            this.selectedUsersForEdit.forEach(element1 => {
              event.forEach(element => {
                if(element.id === element1.deptIdOfUser){
                  this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element1.id+"/"+this.selectedDocumentConstant).subscribe(response =>{
                    if (response) {
                      swal({ title: 'Warning!', text:"Please remove this user from the Test run and try again!", type: 'warning', timer: 3000, showConfirmButton: false });
                      this.usersId.push({id: element1.id, itemName: element1.itemName});
                      this.departments.forEach(e2 =>{
                        if(element1.deptIdOfUser === e2.id)
                          if (this.departmentId.findIndex(i => i.id == e2.id) === -1) {
                            this.departmentId.push(e2);
                          }
                      });
                      let deptId =  this.departments.map(m => m.id);
                      this.rolesService.loadAllUsersAndRolesOnDepartmentIds(deptId).subscribe((resp) => {
                        this.usersData = resp.result;
                        let roles = resp.result.map(option => ({ id: +option.mappingId, itemName: option.documentNumber }));
                        this.roles = roles.filter((v, i) => roles.findIndex(item => item.id == v.id) === i);
                        if (this.rolesId.findIndex(i => i.id == element1.roleIdOfUser) === -1) {
                          this.rolesId.push({id: element1.roleIdOfUser, itemName: element1.roleName});
                        }
                      });
                    }
                  });
                }
              });
            });
          }else{
            let arr=new Array();
            this.selectedUsersForEdit.forEach(element => {
              this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.selectedDocumentConstant).subscribe(response =>{
                if (response) {
                  arr.push(element);
                }
                if(arr.length > 0){
                  swal({ title: 'Warning!', text:"Please remove this user from the Test run and try again!", type: 'warning', timer: 3000, showConfirmButton: false });
                  this.usersId.push({id: element.id, itemName: element.itemName});
                    this.departments.forEach(e2 =>{
                      if(element.deptIdOfUser === e2.id)
                        if (this.departmentId.findIndex(i => i.id == e2.id) === -1) {
                          this.departmentId.push(e2);
                        }
                    });
                    let deptId =  this.departments.map(m => m.id);
                    this.rolesService.loadAllUsersAndRolesOnDepartmentIds(deptId).subscribe((resp) => {
                      this.usersData = resp.result;
                      let roles = resp.result.map(option => ({ id: +option.mappingId, itemName: option.documentNumber }));
                      this.roles = roles.filter((v, i) => roles.findIndex(item => item.id == v.id) === i);
                      if (this.rolesId.findIndex(i => i.id == element.roleIdOfUser) === -1) {
                        this.rolesId.push({id: element.roleIdOfUser, itemName: element.roleName});
                      }
                    });
                }
              });
            });
          }
        }
    }
  }
  loadRecordView(list){
    this.viewList=list;
    this.revisionDocs.show();
   }
   onCLickDocumentForms(){
    this.spinnerFlag=true;
    this.configService.HTTPGetAPI("dynamicForm/loadDocumentSpecifiedFormsForProject/"+this.projectId).subscribe(resp =>{
      this.spinnerFlag=false;
      this.documentForms=resp;
    });
   }
   saveDocumentForms(formConstant,event){
    this.spinnerFlag=true;
    this.configService.HTTPGetAPI("dynamicForm/saveDocumentFormForProject/"+formConstant+"/"+this.projectId+"/"+event.currentTarget.checked).subscribe(resp =>{
      this.spinnerFlag=false;
      this.onCLickDocumentForms();
    });
   }
   onClickEditUsers(item){
     this.saveModal.documentFlows.forEach(e =>{
        e.isEditUsers=false;
     })
    item.isEditUsers=true;
    this.newUsers=[];
    item.selectedUsers.forEach(element => {
      this.newUsers.push({ id: element.id, itemName: element.itemName,displayOrder:0 });
    });
   }
  onUsersSearch(evt: any,levelId,selectedUsers) {
    if(evt.target.value.length > 2){
      this.configService.HTTPPostAPI(evt.target.value,"common/loadProjectUsersByDeptAndSearch/"+this.projectId+"/"+this.selectedDocumentConstant+"/"+levelId).subscribe((resp) => {
       resp.result.forEach(element => {
          if(this.newUsers.filter(f =>f.id == +element.key).length == 0)
            this.newUsers.push({ id: element.key, itemName: element.value,displayOrder:0 });
        });
      }, err => {
      });
    }
  }

  onNewUsersSearch(evt: any) {
    this.addNewUsers=[];
    if(evt.target.value.length > 2){
      this.configService.HTTPPostAPI(evt.target.value,"common/loadProjectUsersByDeptAndSearch/"+this.projectId+"/"+this.selectedDocumentConstant+"/"+0).subscribe((resp) => {
        resp.result.forEach(element => {
          if(this.addNewUsers.filter(f =>f.id == +element.key).length == 0)
            this.addNewUsers.push({ id: element.key, itemName: element.value,displayOrder:0 });
        });
      }, err => {
      });
    }
  }
  saveNewUsers(item){
    this.modalWorkFlowSetting.spinnerShow();
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
          let data={flowId:item.id,levelId:item.levelId,levelOrder:item.orderId,projectId:this.projectId,projectName:this.projectName,documentType:this.selectedDocumentConstant,selectedUsers:item.selectedUsers,userRemarks:userRemarks};
          this.configService.HTTPPostAPI(data,"workflowConfiguration/saveNewWorkflow").subscribe(res =>{
            this.modalWorkFlowSetting.spinnerHide();
            this.clearSection();
            this.loadDataForFlow(0, { key: this.documentConstant, value: this.documentName, 'freezeFlag': this.freezeFlagForLevel });
            swal({ title: 'Success', text: 'Workflow Level Users Updated Successfully', type: 'success', timer: 2000, showConfirmButton: false });
          });
        } else {
          this.modalWorkFlowSetting.spinnerHide();
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });
        }
      }).catch(err=>{
        this.modalWorkFlowSetting.spinnerHide();
      });
  }
  saveNewLevelUsers(){
    this.modalWorkFlowSetting.spinnerShow();
    let data={levelId:this.newLevel,levelOrder:this.saveModal.documentFlows.length+1,projectId:this.projectId,projectName:this.projectName,documentType:this.selectedDocumentConstant,selectedUsers:this.selectredNewUsers};
    this.configService.HTTPPostAPI(data,"workflowConfiguration/saveNewWorkflow").subscribe(res =>{
      this.modalWorkFlowSetting.spinnerHide();
      this.clearSection();
      this.loadDataForFlow(0, { key: this.documentConstant, value: this.documentName, 'freezeFlag': this.freezeFlagForLevel });
      swal({ title: 'Success', text: 'Workflow Level Saved Successfully', type: 'success', timer: 2000, showConfirmButton: false });
    });
  }

  clearSection(){
    this.userInput="";
    this.newUsers=[];
    this.newLevel=0;
    this.selectredNewUsers=new Array();
    this.newUserInput="";
    this.addNewUsers=[];
  }
 
  onDeSelect(event:any,isAll:boolean,item){
      if(item.allUserApproval){
        if(!isAll){
          item.selectedAllUsers.forEach(element1 => {
            event.forEach(element => {
              if(element.id === element1.id){
                this.configService.HTTPGetAPI("projectsetup/checkAllUserPendingDocumentWorkFlow/"+item.id+"/"+element.id).subscribe(response =>{
                  if (response) {
                    swal({ title: 'Warning!', text:"This user has pending items to complete in this level", type: 'warning', timer: 3000, showConfirmButton: false });
                    if (item.selectedUsers.findIndex(i => i.id == event[0].id) === -1) {
                      item.selectedUsers.push(event[0]);
                    }
                  }
                });
              }
            });
          });
        }else{
          let arr=new Array();
          item.selectedAllUsers.forEach(element => {
            this.configService.HTTPGetAPI("projectsetup/checkAllUserPendingDocumentWorkFlow/"+item.id+"/"+element.id).subscribe(response =>{
              if (response) {
                arr.push(element);
              }
              if(arr.length > 0){
                swal({ title: 'Warning!', text:"This user has pending items to complete in this level", type: 'warning', timer: 3000, showConfirmButton: false });
                item.selectedUsers.push(element);
                if (item.selectedUsers.findIndex(i => i.id == element.id) === -1) {
                  item.selectedUsers.push(element);
                }
              }
            });
          });
        }
      }
        if(this.helper.isTestCase(this.selectedDocumentConstant)){
          if(!isAll){
            item.selectedAllUsers.forEach(element1 => {
              event.forEach(element => {
                if(element.id === element1.id){
                  this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.selectedDocumentConstant).subscribe(response =>{
                    if (response) {
                      swal({ title: 'Warning!', text:"Please remove this user from the Test run and try again!", type: 'warning', timer: 3000, showConfirmButton: false });
                      if (item.selectedUsers.findIndex(i => i.id == event[0].id) === -1) {
                        item.selectedUsers.push(event[0]);
                      }
                    }
                  });
                }
              });
            });
          }else{
            let arr=new Array();
            item.selectedAllUsers.forEach(element => {
              this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.selectedDocumentConstant).subscribe(response =>{
                if (response) {
                  arr.push(element);
                }
                if(arr.length > 0){
                  swal({ title: 'Warning!', text:"Please remove this user from the Test run and try again!", type: 'warning', timer: 3000, showConfirmButton: false });
                  item.selectedUsers.push(element);
                  if (item.selectedUsers.findIndex(i => i.id == element.id) === -1) {
                    item.selectedUsers.push(element);
                  }
                }
              });
            });
          }
        }
  }
}