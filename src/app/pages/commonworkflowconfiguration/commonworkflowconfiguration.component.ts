import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { AdminComponent } from './../../layout/admin/admin.component';
import { CommonModel, flowMasterDto, flowNotificationDto, WorkFlowLevelDTO } from './../../models/model';
import { Helper } from './../../shared/helper';
import { userRoleservice } from './../role-management/role-management.service';
import { WorkflowFlowchartComponent } from './../workflow-flowchart/workflow-flowchart.component';
import { CwfService } from './commonworkflowconfiguration.service';
import { DepartmentService } from '../department/department.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-wokflowconfiguration',
  templateUrl: './commonworkflowconfiguration.component.html',
  styleUrls: ['./commonworkflowconfiguration.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})

export class CommonworkflowconfigurationComponent implements OnInit {
  public data: any;
  public workflowSettingsList: any[] = new Array();
  @Input('projectId') projectId;
  @Input('projectName') projectName;
  @ViewChild('emailNotificationSettings') emailNotificationSettings: any;
  @ViewChild('copyConfigurationModal') copyConfigurationModal: any;
  @ViewChild('copyLevelConfigurationModal') copyLevelConfigurationModal: any;
  @ViewChild('modalWorkFlowSetting') modalWorkFlowSetting: ModalBasicComponent;
  @ViewChild('newModalWorkFlowSetting') newModalWorkFlowSetting: ModalBasicComponent;
  public droppedItems: any[] = new Array();
  public documentList: any[] = new Array();
  public formList: any[] = new Array();
  public temp: any;
  public changetab: false;
  @ViewChild('tabRef') tabset;
  public templateList: any[] = new Array();
  public formGroupList: any[] = new Array();
  public workflowLevelList: any[] = new Array();
  public workflowConfigurationformGroup = null;
  public workflowLevelDto: WorkFlowLevelDTO = new WorkFlowLevelDTO();
  public levelId: any[] = new Array();
  public add: Boolean = false;
  public value1: any;
  public minvalueforweek: any;
  public value2: any;
  public filterQuery: any;
  public createLevel: Boolean = false;
  @ViewChild('workFlowChart') workFlowChart: WorkflowFlowchartComponent;
  public levelName: any;
  public roles: any[] = new Array();
  public users: any[] = new Array();
  public usersData: any[] = new Array();
  public rolesId: any[] = new Array();
  public usersId: any[] = new Array();
  public departments: any[] = new Array();
  public departmentId: any[] = new Array();
  public notificationModalList: flowNotificationDto[] = new Array();
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
  modal: Permissions = new Permissions('222', false);
  documentlockDataLogs: any[] = new Array();
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
    text: "Select Roles",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
    maxHeight: 200,
    position: 'bottom'
  };
  createLevelPermission = false;
  selectedDocumentConstant:string="";
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
  addNewUsers:any=new Array();
  newLevel:number=0;
  newUserInput:string="";
  selectedNewUsers:any=new Array();
  constructor(private sservice: CwfService, public service: WorkflowConfigurationService, public permissionService: ConfigService,
    public levelService: WorkFlowLevelsService, private route: ActivatedRoute, private helper: Helper, private rolesService: userRoleservice, private adminComponent: AdminComponent, public deptService: DepartmentService) {
    this.weekminvalidation()
    $(document).ready(function () {
      $('.card').on('click', function () {
        if ($(this).hasClass('open')) {
          $('.card').removeClass('open');
          $('.card').removeClass('shadow-2');
          $(this).addClass('shadow-1');
          return false;
        } else {
          $('.card').removeClass('open');
          $('.card').removeClass('shadow-2');
          $(this).addClass('open');
          $(this).addClass('shadow-2');
        }
      });
    });
  }

  ngOnInit() {
    debugger
   if(!this.helper.isEmpty(this.route.snapshot.queryParams["tabId"])){
    this.tabset.activeId = this.route.snapshot.queryParams["tabId"];
    }
    this.loaddata();
    this.permissionService.loadPermissionsBasedOnModule('222').subscribe(resp => {
      this.modal = resp;
    });
    this.workflowConfigurationformGroup = new FormGroup({
      levelname: new FormControl(this.workflowLevelDto.workFlowLevelName, [Validators.required]),
      password: new FormControl(this.workflowLevelDto.value, [Validators.required]),
    });
    this.adminComponent.setUpModuleForHelpContent("222");
  }

  loaddata() {
    this.sservice.loadall().subscribe((resp) => {
      this.data = resp;
      this.temp = this.data;
      this.filtermodule();
    });
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
    }
    this.updateLevelOrderOfDocument(list)
  }

  createWorkflowLevel() {
    this.isLoading = true;
    this.spinnerFlag = true;
    this.workflowLevelDto.workFlowLevelName = this.levelName;
    this.levelService.saveWorkFlow(this.workflowLevelDto).subscribe((resp) => {
      this.isLoading = false;
      this.spinnerFlag = false;
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
    this.loadDepartments().then(()=>{
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
        this.loadUser(this.departmentId).then(resp => {
          this.usersId = this.notificationModalList.map(u => ({ id: u.userId, itemName: u.userName }));
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

  loadDepartments() {
    return new Promise<boolean>((resolve)=>{
      this.deptService.loadDepartment().subscribe(jsonResp => {
        this.departments = jsonResp.result.map(option => ({ id: +option.id, itemName: option.value }));
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
          notificationList.push(data);
        }
      }
      this.notificationModalList = notificationList;
    }
    this.notificationModalList.sort((a, b) => ('' + a.displayOrder).localeCompare('' + b.displayOrder));
    if (viewFlag)
      this.emailNotificationSettings.show();
  }

  loadUser(deptIds: any[]): Promise<void> {
    return new Promise<void>(resolve => {
      let deptId = deptIds.map(m => m.id);
      if (deptId) {
        this.rolesService.loadUsersForWorkFlowConfig(deptId,0,this.selectedDocumentConstant,this.levelId).subscribe((resp) => {
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
      this.service.loadFlowData(modal).subscribe((resp) => {
        if (resp.result != null)
          this.saveModal = resp.result
        this.documentName = data.value;
        this.documentConstant = data.key;
        this.documentDisplayOrder = data.displayOrder;
        this.documentNumber = this.saveModal.documentNumber;
        this.workFlowChart.loadAllDataForDocumentForProject(this.projectId, data.key);
        resolve()
      });
    })
  }

  saveLevelData() {
    if (this.validSave) {
      this.modalWorkFlowSetting.spinnerShow();
      this.saveModal.documentNumber = this.documentNumber;
      this.saveModal.levelId = Number(this.levelId);
      this.saveModal.flowNotificationDto = this.notificationModalList;
      this.saveModal.settings = this.workflowSettingsList;
      this.saveModal.documentDisplayOrder = this.documentDisplayOrder;
      this.saveModal.saveType = "CommonWorkflow";
      this.service.saveWorkFlowData(this.saveModal).subscribe((resp) => {
        this.modalWorkFlowSetting.spinnerHide();
        if (resp.result === 'success') {
          this.modalWorkFlowSetting.hide()
          this.loaddata()
          swal({ title: 'Success', text: 'Workflow Level Saved Successfully', type: 'success', timer: 2000, showConfirmButton: false });
        } else {
          swal({ title: 'Not Saved!', text: 'Workflow Level has not been saved', type: 'error', timer: 2000, showConfirmButton: false });
        }
      }, err => {
        this.modalWorkFlowSetting.spinnerHide();
        swal({ title: 'Not Saved!', text: 'Workflow Level has not been saved', type: 'error', timer: 2000, showConfirmButton: false });
      });
    }
  }

  loadDataForFlow(item) {
    this.switchButtonColorFlag = false;
    this.freezeFlagForLevel = (item.exists || item.freezeFlag);
    this.add = false
    this.loadFlowDatasOfDocument(item);
    this.getLevelPermission();
    this.modalWorkFlowSetting.show();
  }

  addNewLevelForDocument(alreadyFlowList: any[], item) {
    this.selectedDocumentConstant=item.documentConstantName;
    this.loadLevels(alreadyFlowList);
    this.loadSettingsAndUsers(0);
    this.documentName = item.documentName;
    this.rolesId = new Array();
    this.usersId = new Array();
    this.departmentId=new Array();
    this.loadDepartments();
    this.levelId = new Array();
    this.levelName = null;
    this.createLevel = false;
    let levelOrder = 1;
    if (null != alreadyFlowList && alreadyFlowList.length != 0)
      levelOrder = alreadyFlowList.length + 1;
    this.saveModal = new flowMasterDto();
    this.saveModal.documentConstantName = item.documentConstantName;
    this.saveModal.url = window.location.href
    this.saveModal.levelOrder = levelOrder;
    this.freezeFlagForLevel = item.exists;
    this.validateSave();
    this.add = true;
    this.getLevelPermission();
    this.saveModal.allUserApproval = false;
    this.modalWorkFlowSetting.show();
  }

  editLevelOfDocument(item, mainitem) {
    this.selectedDocumentConstant=mainitem.documentConstantName;
    this.documentName = mainitem.documentName;
    this.loadLevels(mainitem.documentFlows.filter(df => df.levelId !== item.levelId));
    this.loadSettingsAndUsers(item.id);
    this.saveModal.url = window.location.href
    this.freezeFlagForLevel = mainitem.exists;
    this.saveModal.flowId = item.id;
    this.saveModal.documentConstantName = mainitem.documentConstantName;
    this.saveModal.levelId = item.levelId;
    this.levelId = [];
    this.levelId.push(item.levelId);
    this.saveModal.levelOrder = item.orderId;
    this.saveModal.documentCurrentFlowId = item.documentMasterId;
    this.getLevelPermission();
    this.saveModal.allUserApproval = item.allUserApproval;
    this.modalWorkFlowSetting.show();
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
    for (let index = 0; index < list.length; index++) {
      list[index].orderId = index + 1;
    }
    this.service.updateLevelOrderOfDocument(list).subscribe(resp => {
      if (resp.result === 'success')
        swal({ title: 'Success', text: 'Level Order Updated Successfully', type: 'success', timer: 2000, showConfirmButton: false });
      else
        swal({ title: 'Not Updated!', text: 'Level Order has not been updated', type: 'error', timer: 2000, showConfirmButton: false });
    })
  }

  loadAllDataForDocumentForProject(data) {
    this.workFlowChart.loadAllDataForDocumentForProject(this.projectId, data.key);
  }

  updateDocumentOrderOfProject(list: any[]) {
    let sortedList = new Array();
    for (let index = 0; index < list.length; index++) {
      list[index].displayOrder = index + 1;
      sortedList.push({
        "displayOrder": list[index].displayOrder,
        "key": list[index].key
      })
    }
    this.service.updateDocumentOrderOfProject(sortedList, this.projectId).subscribe(resp => {
      if (resp.result === 'success')
        swal({ title: 'Success', text: 'Document Order Updated Successfully', type: 'success', timer: 2000, showConfirmButton: false });
      else
        swal({ title: 'Not Updated!', text: 'Document Order has not been updated', type: 'error', timer: 2000, showConfirmButton: false });
    })
  }

  deleteLevelOfDocumentSwal(item, flagLevelDelete, freezeFlag) {
    var obj = this;
    if (freezeFlag) {
      swal({ title: 'Info', text: 'Cannot be deleted as workflow has started', type: 'warning', timer: 3000, allowOutsideClick: false });
    } else {
      swal({
        title: 'Are you sure?', text: 'You wont be able to revert', type: 'warning',
        showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10', cancelButtonClass: 'btn btn-danger', allowOutsideClick: false,
        buttonsStyling: false
      }).then(function () {
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
              obj.delete(item, flagLevelDelete, "Comments : " + value);
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

      });
    }
  }

  delete(item, flagLevelDelete, userRemarks) {
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

  deleteLevelOfDocument(id, userRemarks) {
    this.spinnerFlag = true;
    this.service.deleteLevelOfDocument(id, "CommonWorkflow", userRemarks).subscribe((resp) => {
      this.spinnerFlag = false;
      let responseMsg: string = resp.result;
      this.loadFlowDatasOfDocument({ key: this.documentConstant, value: this.documentName, displayOrder: this.documentDisplayOrder })
      if (responseMsg === "success") {
        swal({ title: 'Success', text: 'Level is deleted successfully', type: 'success', timer: 2000, showConfirmButton: false });
        this.loaddata()
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
      swal({ title: 'Success', text: resp.message, type: resp.type, timer: 3000, showConfirmButton: false });
    }, (err) => {
      swal({ title: 'Error!', text: 'Error in deleting document', type: 'error', timer: 2000, showConfirmButton: false }); this.spinnerFlag = false;
    });
  }

  copyConfiguration(list: any[], item) {
    let newArray = JSON.parse(JSON.stringify(list))
    let fGchild = newArray.filter(l => !l.configuration && l.mappingFlag).map(c => c.child);
    let formGrouping = new Array();
    fGchild.forEach(i => {
      i.forEach(element => {
        formGrouping.push(element)
      });
    });
    this.copyConfigurationList = newArray.filter(l => !l.configuration && !l.mappingFlag);
    this.copyConfigurationList.push(...formGrouping.filter(l => !l.configuration));
    this.documentConfigurationNeedToBeApplied = item.key;
    this.copyConfigurationModal.show();
  }

  applyConfigurationSwal(list, flag) {
    this.copyConfigurationModal.spinnerShow();
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
    }, err => this.copyConfigurationModal.spinnerHide());
  }

  applyConfigurationOfDocument(list, documentConstant, projectId) {
    let keyList = JSON.parse(JSON.stringify(list)).filter(d => d.configuration).map(l => l);
    this.service.copyConfiguration(keyList, documentConstant, projectId).subscribe(resp => {
      this.copyConfigurationModal.spinnerHide()
      if (resp.result === "success") {
        swal({ title: 'Success', text: 'Document configuration copy is done successfully', type: 'success', timer: 2000, showConfirmButton: false });
        this.copyConfigurationModal.hide();
      } else {
        swal({ title: 'Error!', text: 'Error in copying configuration', type: 'error', timer: 2000, showConfirmButton: false });
      }
    }, err => this.copyConfigurationModal.spinnerHide())
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
      this.copyConfigurationModal.spinnerHide();
      if (resp.result === "success") {
        swal({ title: 'Success', text: 'Level configuration copy is done successfully', type: 'success', timer: 2000, showConfirmButton: false });
        this.loadDataForFlow({ 'key': this.documentConstant, 'value': this.documentName, 'freezeFlag': this.freezeFlagForLevel, 'displayOrder': this.documentDisplayOrder });
        this.copyLevelConfigurationModal.hide();
      } else {
        swal({ title: 'Error!', text: 'Error in copying configuration', type: 'error', timer: 2000, showConfirmButton: false });
      }
    }, err => this.copyConfigurationModal.spinnerHide())
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

  filtermodule() {
    if (this.filterQuery != undefined && this.filterQuery != "")
      this.data = this.data.filter(d => (d.documentName.toLowerCase().includes(this.filterQuery.toLowerCase())))
    else {
      this.data = this.temp;
    }
  }

  weekminvalidation() {
    let year = new Date().getFullYear();
    var elm = document.createElement('input')
    elm.type = 'week'
    elm.valueAsDate = new Date()
    var week = elm.value.split('W').pop()
    this.minvalueforweek = year + "-W" + week;
  }

  resetFilter() {
    this.filterQuery = '';
    this.filtermodule();
  }

  getLevelPermission() {
    this.adminComponent.configService.loadPermissionsBasedOnModule("154").subscribe(resp => {
      this.createLevelPermission = resp.createButtonFlag;
    });
  }

  addNewWorkflow(alreadyFlowList: any[], item) {
    this.selectedDocumentConstant=item.documentConstantName;
    this.loadLevels(alreadyFlowList);
    this.documentName = item.documentName;
    let levelOrder = 1;
    if (null != alreadyFlowList && alreadyFlowList.length != 0)
      levelOrder = alreadyFlowList.length + 1;
    this.saveModal.url = window.location.href
    this.saveModal.levelOrder = levelOrder;
    this.getLevelPermission();
    this.saveModal.allUserApproval = false;
    this.newModalWorkFlowSetting.show();
  }
  onNewUsersSearch(evt: any) {
    this.addNewUsers=[];
    if(evt.target.value.length > 2){
      this.permissionService.HTTPPostAPI(evt.target.value,"common/loadProjectUsersByDeptAndSearch/"+0+"/"+this.selectedDocumentConstant+"/"+0).subscribe((resp) => {
       resp.result.forEach(element => {
        if(this.addNewUsers.filter(f =>f.id == +element.key).length == 0)
          this.addNewUsers.push({ id: element.key, itemName: element.value,displayOrder:0 });
        });
      }, err => {
      });
    }
  }
  clearSection(){
    this.newLevel=0;
    this.newUserInput="";
    this.addNewUsers=[];
    this.selectedNewUsers=new Array();
  }
  
  saveNewLevelUsers(){
    this.newModalWorkFlowSetting.spinnerShow();
    let data={levelId:this.newLevel,levelOrder:this.saveModal.levelOrder,documentType:this.selectedDocumentConstant,selectedUsers:this.selectedNewUsers,url:this.saveModal.url};
    this.permissionService.HTTPPostAPI(data,"workflowConfiguration/saveNewWorkflow").subscribe(res =>{
      this.newModalWorkFlowSetting.spinnerHide();
      this.newModalWorkFlowSetting.hide();
      this.clearSection();
      this.loaddata();
      swal({ title: 'Success', text: 'Workflow Level Saved Successfully', type: 'success', timer: 2000, showConfirmButton: false });
    });
  }
}
