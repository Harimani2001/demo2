import { Component, OnInit, EventEmitter, ViewChild, Output, Input, ViewEncapsulation} from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { flowNotificationDto, RolePermissions, flowMasterDto, CommonModel, WorkFlowLevelDTO, ProjectUserPermissionsDTO, UserPrincipalDTO } from '../../models/model';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { userRoleservice } from '../role-management/role-management.service';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { AdminComponent } from '../../layout/admin/admin.component';
import { DepartmentService } from '../department/department.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-add-document-workflow',
  templateUrl: './add-document-workflow.component.html',
  styleUrls: ['./add-document-workflow.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddDocumentWorkflowComponent implements OnInit {
  @Input() projectId:number=0;
  @Input() documentName:string="";
  @Input() permissionConstant:string="";
  @Output() onClose = new EventEmitter();
  @ViewChild('modalWorkFlowSetting') modalWorkFlowSetting:any;
  @ViewChild('userPermissionsSettings') userPermissionsSettings: any;
  projectName:any;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
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
  public workflowLevelList: any[] = new Array();
  public levelId: any[] = new Array();
  public add: Boolean = false;
  freezeFlagForLevel = false;
  createLevelPermission: boolean = false;
  selectedUsersForEdit:any=new Array();
  @ViewChild('emailNotificationSettings') emailNotificationSettings: any;
  spinnerFlag:boolean=false;
  switchButtonColorFlag = false;
  dataIncompleteFlag: false;
  addButtonFlag: boolean = true;
  updateFlag: boolean = false;
  isEditLevelOfDocument:boolean=false;
  editLevelData:any;
  isLoading = false;
  public workflowLevelDto: WorkFlowLevelDTO = new WorkFlowLevelDTO();
  public documentNumber: any = null;
  public documentDisplayOrder = 0;
  newUsers:any=new Array();
  addNewUsers:any=new Array();
  selectredNewUsers:any=new Array();
  newLevel:number=0;
  newUserInput:string="";
  userInput:string="";
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
  constructor(public service: WorkflowConfigurationService, public levelService: WorkFlowLevelsService, public deptService: DepartmentService,
    private helper: Helper, private rolesService: userRoleservice, private adminComponent: AdminComponent,private configService:ConfigService) { }
  ngOnInit() {
  }
  showModalView(){
    this.configService.loadCurrentUserDetails().subscribe(jsonResp =>{
      this.currentUser = jsonResp;
      if(this.projectId == 0)
      this.projectId=this.currentUser.projectId;
      this.loadData();
      this.modalWorkFlowSetting.show(); 
    });
  }
  loadData(){
    this.configService.HTTPGetAPI("workflowConfiguration/loadIndividualDocumentConfig/"+this.projectId+"/"+this.permissionConstant).subscribe(res =>{
      if(res.data){
        this.documentName=res.data.value;
        this.projectName=res.data.mappingId;
        this.loadDataForFlow(res.data);
      }
    });
  }
  loadDataForFlow(item) {
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
        this.documentDisplayOrder = data.displayOrder;
        this.documentNumber = this.saveModal.documentNumber;
        resolve();
      }, er => {
        resolve();
      });
    })
  }

  addNewLevelForDocument(alreadyFlowList: any[]) {
    this.updateFlag = false;
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
  getLevelPermission() {
    this.adminComponent.configService.loadPermissionsBasedOnModule("154").subscribe(resp => {
      this.createLevelPermission = resp.createButtonFlag;
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
          let check = this.notificationModalList.filter(f => f.userId === element.id).map(m => m.notification).toString();
          data.notification = this.notificationModalList.filter(f => f.userId === element.id).length > 0 ? ((this.notificationModalList.filter(f => f.userId === element.id).map(m => m.notification)).toString() == 'true' ? true : false) : false;
          data.email = this.notificationModalList.filter(f => f.userId === element.id).length > 0 ? ((this.notificationModalList.filter(f => f.userId === element.id).map(m => m.email)).toString() == 'true' ? true : false) : false;
          data.followUp = this.notificationModalList.filter(f => f.userId === element.id).length > 0 ? ((this.notificationModalList.filter(f => f.userId === element.id).map(m => m.followUp)).toString() == 'true' ? true : false) : false;
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
    console.log(this.levelId);
    return new Promise<void>(resolve => {
      let deptId = deptIds.map(m => m.id);
      if (deptId) {
        this.rolesService.loadUsersForWorkFlowConfig(deptId,this.projectId,this.permissionConstant,this.levelId).subscribe((resp) => {
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
  loadUserPermissions(userList, flag) {
    let userIds = userList.map(m => m.id);
    const data: ProjectUserPermissionsDTO = new ProjectUserPermissionsDTO();
    data.userIds = userIds;
    data.projectId = this.projectId;
    data.permissionConstant = this.permissionConstant;
    this.service.loadUserPermissionsForProject(data).subscribe((resp) => {
      this.userPermissionsModalList = resp;
      if (flag)
        this.userPermissionsSettings.show();
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
        if(this.helper.isTestCase(this.permissionConstant)){
          if(!isAll){
            this.selectedUsersForEdit.forEach(element1 => {
              event.forEach(element => {
                if(element.id === element1.id){
                  this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.permissionConstant).subscribe(response =>{
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
              this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.permissionConstant).subscribe(response =>{
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
        if(this.helper.IQTC_VALUE === this.permissionConstant || this.helper.IOQTC_VALUE === this.permissionConstant || this.helper.PQTC_VALUE === this.permissionConstant || this.helper.OQTC_VALUE === this.permissionConstant || this.helper.OPQTC_VALUE === this.permissionConstant){
          if(!isAll){
            this.selectedUsersForEdit.forEach(element1 => {
              event.forEach(element => {
                if(element.id === element1.roleIdOfUser){
                  this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element1.id+"/"+this.permissionConstant).subscribe(response =>{
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
              this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.permissionConstant).subscribe(response =>{
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
        if(this.helper.IQTC_VALUE === this.permissionConstant || this.helper.IOQTC_VALUE === this.permissionConstant || this.helper.PQTC_VALUE === this.permissionConstant || this.helper.OQTC_VALUE === this.permissionConstant || this.helper.OPQTC_VALUE === this.permissionConstant){
          if(!isAll){
            this.selectedUsersForEdit.forEach(element1 => {
              event.forEach(element => {
                if(element.id === element1.deptIdOfUser){
                  this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element1.id+"/"+this.permissionConstant).subscribe(response =>{
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
              this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.permissionConstant).subscribe(response =>{
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
      this.saveModal.documentConstantName = this.permissionConstant;
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
          this.loadDataForFlow( { key: this.permissionConstant, value: this.documentName, 'freezeFlag': this.freezeFlagForLevel });
          swal({ title: 'Success', text: 'Workflow Level Saved Successfully', type: 'success', timer: 2000, showConfirmButton: false });
        } else {
          swal({ title: 'Not Saved!', text: 'Workflow Level has not been saved', type: 'error', timer: 2000, showConfirmButton: false });
        }
      }, err => {
        this.modalWorkFlowSetting.spinnerHide();
        swal({ title: 'Not Saved!', text: 'Workflow Level has not been saved', type: 'error', timer: 2000, showConfirmButton: false });
      });
    }else{
      this.modalWorkFlowSetting.spinnerHide();
    }
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
                  obj.loadData();
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
              obj.loadData();
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
    this.service.deleteLevelOfDocument(id, "", userRemarks).subscribe((resp) => {
      this.spinnerFlag = false;
      let responseMsg: string = resp.result;
      this.loadFlowDatasOfDocument({ key: this.permissionConstant, value: this.documentName, displayOrder: this.documentDisplayOrder })
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
      this.loadData();
      swal({ title: resp.type, text: resp.message, type: resp.type, timer: 3000, showConfirmButton: false });
    }, (err) => {
      swal({ title: 'Error!', text: 'Error in deleting document', type: 'error', timer: 2000, showConfirmButton: false }); this.spinnerFlag = false;
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
     this.configService.HTTPPostAPI(evt.target.value,"common/loadProjectUsersByDeptAndSearch/"+this.projectId+"/"+this.permissionConstant+"/"+levelId).subscribe((resp) => {
      resp.result.forEach(element => {
         selectedUsers.forEach(user => {
           if(this.newUsers.filter(f =>f.id == +element.key).length == 0)
             this.newUsers.push({ id: element.key, itemName: element.value,displayOrder:0 });
         });
       });
     }, err => {
     });
   }
 }

 onNewUsersSearch(evt: any) {
   this.addNewUsers=[];
   if(evt.target.value.length > 2){
     this.configService.HTTPPostAPI(evt.target.value,"common/loadProjectUsersByDeptAndSearch/"+this.projectId+"/"+this.permissionConstant+"/"+0).subscribe((resp) => {
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
   let data={flowId:item.id,levelId:item.levelId,levelOrder:item.orderId,projectId:this.projectId,projectName:this.projectName,documentType:this.permissionConstant,selectedUsers:item.selectedUsers};
   this.configService.HTTPPostAPI(data,"workflowConfiguration/saveNewWorkflow").subscribe(res =>{
     this.modalWorkFlowSetting.spinnerHide();
     this.clearSection();
     this.loadDataForFlow({ key: this.permissionConstant, value: this.documentName, 'freezeFlag': this.freezeFlagForLevel });
     swal({ title: 'Success', text: 'Workflow Level Users Updated Successfully', type: 'success', timer: 2000, showConfirmButton: false });
   });
 }
 saveNewLevelUsers(){
   this.modalWorkFlowSetting.spinnerShow();
   let data={levelId:this.newLevel,levelOrder:this.saveModal.documentFlows.length+1,projectId:this.projectId,projectName:this.projectName,documentType:this.permissionConstant,selectedUsers:this.selectredNewUsers};
   this.configService.HTTPPostAPI(data,"workflowConfiguration/saveNewWorkflow").subscribe(res =>{
     this.modalWorkFlowSetting.spinnerHide();
     this.clearSection();
     this.loadDataForFlow({ key: this.permissionConstant, value: this.documentName, 'freezeFlag': this.freezeFlagForLevel });
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
       if(this.helper.isTestCase(this.permissionConstant)){
         if(!isAll){
           item.selectedAllUsers.forEach(element1 => {
             event.forEach(element => {
               if(element.id === element1.id){
                 this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.permissionConstant).subscribe(response =>{
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
             this.configService.HTTPGetAPI("testCase/checkTasksForTestRunUser/"+element.id+"/"+this.permissionConstant).subscribe(response =>{
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
 onCloseModal(){
  this.onClose.emit();
 }
}
