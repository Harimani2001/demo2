import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigService } from '../../shared/config.service';
import { externalApprovalErrorTypes } from '../../shared/constants';
import { Helper } from '../../shared/helper';
import { IndividualDocumentItemWorkflowService } from './individual-document-item-workflow.service';
import { DocumentSpecificFlowLevelDTO, User, CommonModel, WorkFlowLevelDTO } from '../../models/model';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { UserService } from '../userManagement/user.service';
import { userRoleservice } from '../role-management/role-management.service';
import swal from 'sweetalert2';
import { DepartmentService } from '../department/department.service';
import { LocationService } from '../location/location.service';

@Component({
  selector: 'app-individual-document-item-workflow',
  templateUrl: './individual-document-item-workflow.component.html',
  styleUrls: ['./individual-document-item-workflow.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class IndividualDocumentItemWorkflowComponent implements OnInit {
  @Output() onCloseModel = new EventEmitter<any>();
  @Input() permissionConstant: string = "";
  documentId: any;
  documentCode: any;
  public workflowLevelList: any[] = new Array();
  public workflowLevelDto: WorkFlowLevelDTO = new WorkFlowLevelDTO();
  public levelId: any[] = new Array();
  public add: Boolean = false;
  public createLevel: Boolean = false;
  public workflowSettingsList: any[] = new Array();
  public levelName: any;
  public roles: any[] = new Array();
  public users: any[] = new Array();
  public rolesId: any[] = new Array();
  public usersId: any[] = new Array();
  public locationsList: any[] = new Array();
  public validSave: Boolean;
  public departments: any[] = new Array();
  public departmentId: any[] = new Array();
  public locationId: any[] = new Array();
  public documentSpecificFlowLevelDTO: DocumentSpecificFlowLevelDTO = new DocumentSpecificFlowLevelDTO();
  public documentDisplayOrder = 0;
  addButtonFlag: boolean = true;
  documentFlows: any[] = new Array();
  switchButtonColorFlag = false;
  public getStatus: any = [];
  content: any;
  flag: boolean = true;
  @ViewChild('levelDescription') levelDescription: any;
  comments: string = "";
  esignForm: any;
  @ViewChild('approveModal') approveModal: any;
  selectedDataForWorkflow: any;
  esignSaveModal: User = new User();
  submitted: boolean = false;
  public finalstatus: boolean = true;
  public errorList: any[] = new Array<any>();
  agreementCheck: boolean = false;
  freezeFlagForLevel = false;
  @ViewChild('individualDocumentWorkflowModal') public individualDocumentWorkflowModal: any;
  spinnerFlag: boolean = false;
  dropdownSettings = {
    singleSelection: false,
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
    maxHeight: 200,
    position: 'top'
  };
  locationDropdownSettings = {
    singleSelection: false,
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
    maxHeight: 200,
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
  newUsers:any=new Array();
  addNewUsers:any=new Array();
  selectredNewUsers:any=new Array();
  newLevel:any=0;
  newUserInput:string="";
  userInput:string="";
  constructor(private service: IndividualDocumentItemWorkflowService, public deptService: DepartmentService,
    public config: ConfigService, public helper: Helper, public fb: FormBuilder, public locationService: LocationService,
    public externalApprovalErrorTypes: externalApprovalErrorTypes, public workflowService: WorkflowConfigurationService,
    public userService: UserService, public levelService: WorkFlowLevelsService, private rolesService: userRoleservice) {
  }

  ngOnInit() {
  }

  openModal(documentId: any, documentCode: any) {
    this.documentId = documentId;
    this.documentCode = documentCode;
    this.individualDocumentWorkflowModal.show();
    this.loadDataForFlow();
    this.loadAllActiveLocations();
  }

  loadAllActiveLocations() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationsList = response.result.map(option => ({ id: +option.id, itemName: option.name }));
    });
  }

  addNewLevelForDocument(alreadyFlowList: any[]) {
    this.loadLevels(alreadyFlowList);
    this.loadSettingsAndUsers(0);
    this.rolesId = new Array();
    this.usersId = new Array();
    this.departmentId = new Array();
    this.locationId = new Array();
    this.loadroles();
    this.levelId = new Array();
    this.levelName = null;
    this.createLevel = false;
    this.addButtonFlag = false;
    let levelOrder = 1;
    if (alreadyFlowList.length != 0)
      levelOrder = alreadyFlowList.length + 1;
    this.documentSpecificFlowLevelDTO = new DocumentSpecificFlowLevelDTO();
    this.documentSpecificFlowLevelDTO.levelOrder = levelOrder;
    this.add = true;
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
    this.loadroles();
    const commonmodal: CommonModel = new CommonModel();
    commonmodal.currentCommonLevel = flowId;
    this.spinnerFlag = true;
    this.workflowService.loadworkFlowSettingsAndUsers(commonmodal).subscribe((resp) => {
      this.add = true;
      this.workflowSettingsList = resp.data;
      this.spinnerFlag = false;
      if (flowId != 0) {
        this.spinnerFlag = true;
        this.service.getApi("individualDocumentFlow/loadWorkFlowLevelById/" + flowId).subscribe((resp1) => {
          this.spinnerFlag = false;
          if (resp1) {
            this.documentSpecificFlowLevelDTO = resp1;
            this.workflowSettingsList.forEach(element => {
              if (this.documentSpecificFlowLevelDTO.optionId === element.flowSettingsId) {
                element.check = true;
              } else {
                element.check = false;
              }
            });
            resp1.roleIds.forEach(e1 => {
              this.roles.forEach(e2 => {
                if (e1 === e2.id)
                  this.rolesId.push(e2);
              });
            });
            resp1.locationIds.forEach(e1 => {
              this.locationsList.forEach(e2 => {
                if (e1 === e2.id)
                  this.locationId.push(e2);
              });
            });
            this.usersId = resp1.userIds;
            let locationId = this.locationId.map(m => m.id);
            this.deptService.loadDepartmentsbyMultipleLocations(locationId).subscribe(jsonResp => {
              this.departments = jsonResp.result.map(option => ({ id: +option.id, itemName: option.departmentName }));
              resp1.deptIds.forEach(e1 => {
                this.departments.forEach(e2 => {
                  if (e1 === e2.id)
                    this.departmentId.push(e2);
                });
              });
              this.loadUser(this.rolesId, this.departmentId).then(resp2 => {
                this.validateSave();
              })
            });
          }
        }, err => {
          this.spinnerFlag = false;
        });
      }
    }, err => {
      this.spinnerFlag = false;
    });
  }

  loadroles() {
    this.rolesService.loadListOfrolesIfUserExists().subscribe((resp) => {
      this.roles = resp.map(option => ({ id: +option.key, itemName: option.value }));
    });
  }

  loadDepartments(event): Promise<void> {
    return new Promise<void>(resolve => {
      let locationId = event.map(m => m.id);
      this.deptService.loadDepartmentsbyMultipleLocations(locationId).subscribe(jsonResp => {
        this.departments = jsonResp.result.map(option => ({ id: +option.id, itemName: option.departmentName }));
      });
    });
  }

  validateSave() {
    setTimeout(() => {
      if (this.rolesId.length > 0 && this.usersId.length > 0 && this.levelId) {
        this.validSave = true;
      } else {
        this.validSave = false;
      }
    }, 600)
  }

  loadUser(roleIds: any[], deptIds: any[]): Promise<void> {
    return new Promise<void>(resolve => {
      let ids = roleIds.map(m => m.id);
      let deptId = deptIds.map(m => m.id);
      this.rolesService.loadUsersForIndividualWorkFlowConfig(ids, deptId, this.permissionConstant, this.documentId, this.levelId).subscribe((resp) => {
        this.users = resp.map(option => ({ id: +option.key, itemName: option.value }));
        let usersList = [];
        this.usersId.forEach(el1 => {
          this.users.forEach(el2 => {
            if (el1 === el2.id)
              usersList.push({ id: el2.id, itemName: el2.itemName });
          })
        })
        this.usersId = usersList;
        resolve();
      }, err => {
        resolve();
      });
    });
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

  saveLevelData() : Promise<void>{
    this.spinnerFlag = true;
    return new Promise<void>(resolve => {
      if (this.validSave) {
        this.documentSpecificFlowLevelDTO.documentConstantName = this.permissionConstant;
        this.documentSpecificFlowLevelDTO.levelId = Number(this.levelId);
        const data = this.workflowSettingsList.filter(element =>
          element.mainPageCheck && true === element.check
        );
        this.documentSpecificFlowLevelDTO.optionId = 2;
        this.documentSpecificFlowLevelDTO.documentId = this.documentId;
        this.documentSpecificFlowLevelDTO.documentcode = this.documentCode;
        this.documentSpecificFlowLevelDTO.userIds = this.usersId.map(d => d.id);
        this.service.postApi(this.documentSpecificFlowLevelDTO, "individualDocumentFlow/saveWorkFlowLevels").subscribe((resp) => {
          this.spinnerFlag = false;
          if (resp) {
            this.loadDataForFlow();
            swal({ title: 'Success', text: 'Workflow Level Saved Successfully', type: 'success', timer: 2000, showConfirmButton: false });
          } else {
            swal({ title: 'Not Saved!', text: 'Workflow Level has not been saved', type: 'error', timer: 2000, showConfirmButton: false });
          }
        }, err => {
          this.spinnerFlag = false;
          swal({ title: 'Not Saved!', text: 'Workflow Level has not been saved', type: 'error', timer: 2000, showConfirmButton: false });
        });
        resolve();
      }else {
        resolve();
      }
    });
  }

  loadDataForFlow() {
    this.add = false;
    this.addButtonFlag = true;
    this.service.getApi("individualDocumentFlow/isDocumentFreeze/" + this.permissionConstant + "/" + this.documentId).subscribe((resp) => {
      this.freezeFlagForLevel = resp;
    }, err => {
      this.spinnerFlag = false;
    });
    this.service.getApi("individualDocumentFlow/loadWorkFlowLevels/" + this.permissionConstant + "/" + this.documentId).subscribe((resp) => {
      this.spinnerFlag = false;
      this.documentFlows = resp;
      this.loadLevels(this.documentFlows);
    }, err => {
      this.spinnerFlag = false;
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
  }

  createWorkflowLevel() {
    this.spinnerFlag = true;
    this.workflowLevelDto.workFlowLevelName = this.levelName;
    this.levelService.saveWorkFlow(this.workflowLevelDto).subscribe((resp) => {
      this.spinnerFlag = false;
      let responseMsg: string = resp.result;
      let data: any = resp.dto;
      if (responseMsg === "success") {
        if (data.id != 0) {
          this.loadLevels(this.documentFlows);
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
        this.spinnerFlag = false;
        swal({ title: 'Not Saved!', text: 'Level has  not been saved', type: 'error', timer: 2000, showConfirmButton: false });
      });
  }

  editLevelOfDocument(item) {
    this.addButtonFlag = false;
    this.rolesId = new Array();
    this.usersId = new Array();
    this.locationId = new Array();
    this.departmentId = new Array();
    this.loadLevels(this.documentFlows.filter(df => df.levelId !== item.levelId));
    this.loadSettingsAndUsers(item.id);
    this.levelId = [];
    this.levelId.push(item.levelId);
  }

  updateLevelOrderOfDocument(list) {
    for (let index = 0; index < list.length; index++) {
      list[index].orderId = index + 1;
    }
    this.service.postApi(list, "individualDocumentFlow/updateLevelOrderOfDocument").subscribe(resp => {
      if (resp)
        swal({ title: 'Success', text: 'Level Order Updated Successfully', type: 'success', timer: 2000, showConfirmButton: false });
      else
        swal({ title: 'Not Updated!', text: 'Level Order has not been updated', type: 'error', timer: 2000, showConfirmButton: false });
    })
  }

  deleteLevelOfDocumentSwal(item) {
    var obj = this;
    swal({
      title: 'Are you sure?', text: 'You wont be able to revert', type: 'warning',
      showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10', cancelButtonClass: 'btn btn-danger', allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      obj.deleteLevelOfDocument(item);
    });
  }

  deleteLevelOfDocument(id) {
    this.spinnerFlag = true;
    this.service.getApi("individualDocumentFlow/deleteWorkFlowLevelById/" + id).subscribe((resp) => {
      this.spinnerFlag = false;
      this.loadDataForFlow();
      if (resp) {
        swal({ title: 'Success', text: 'Level is deleted successfully', type: 'success', timer: 2000, showConfirmButton: false });
      } else {
        swal({ title: 'Error!', text: 'Error in deleting level', type: 'error', timer: 2000, showConfirmButton: false });
      }
    }, (err) => {
      swal({ title: 'Error!', text: 'Error in deleting level', type: 'error', timer: 2000, showConfirmButton: false }); this.spinnerFlag = false;
    });
  }

  onClosePopUpModel(){
    this.onCloseModel.emit(this.documentId);
  }
  onClickEditUsers(item){
    this.spinnerFlag=true;
    this.service.getApi("individualDocumentFlow/loadWorkFlowLevelById/" + item.id).subscribe((resp1) => {
      if (resp1) {
        this.documentSpecificFlowLevelDTO = resp1;
      }
      this.spinnerFlag=false;
      this.documentFlows.forEach(e =>{
        e.isEditUsers=false;
     })
    item.isEditUsers=true;
    this.newUsers=[];
    item.selectedUsers.forEach(element => {
      this.newUsers.push({ id: element.id, itemName: element.itemName,displayOrder:0 });
    });
    });
  }
 onUsersSearch(evt: any,levelId) {
   if(evt.target.value.length > 2){
     this.config.HTTPPostAPI(evt.target.value,"common/loadUsersForIndividualWorkFlowBySearch/"+this.permissionConstant+"/"+this.documentId+"/"+levelId).subscribe((resp) => {
      resp.forEach(element => {
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
     this.config.HTTPPostAPI(evt.target.value,"common/loadUsersForIndividualWorkFlowBySearch/"+this.permissionConstant+"/"+this.documentId+"/"+0).subscribe((resp) => {
      resp.forEach(element => {
        if(this.addNewUsers.filter(f =>f.id == +element.key).length == 0)
         this.addNewUsers.push({ id: element.key, itemName: element.value,displayOrder:0 });
       });
     }, err => {
     });
   }
 }
 clearSection(){
  this.userInput="";
  this.newUsers=[];
  this.newLevel=0;
  this.selectredNewUsers=new Array();
  this.newUserInput="";
  this.addNewUsers=[];
}

 saveNewUsers(item){
  this.validSave=true;
  this.usersId=item.selectedUsers;
  this.levelId=this.documentSpecificFlowLevelDTO.levelId;
  this.saveLevelData().then(res =>{
    this.clearSection();
    this.loadDataForFlow();   
  })
 
 }
 saveNewLevelUsers(){
  this.documentSpecificFlowLevelDTO=new DocumentSpecificFlowLevelDTO();
  this.validSave=true;
  this.levelId=this.newLevel;
  this.usersId=this.selectredNewUsers;
  this.documentSpecificFlowLevelDTO.levelOrder=this.documentFlows.length+1
  this.saveLevelData().then(res =>{
    this.clearSection();
    this.loadDataForFlow();   
  });
 }
}