import { Component, OnInit, ViewEncapsulation, ViewChild, Input, SimpleChanges } from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { DocumentSpecificFlowLevelDTO, User, WorkFlowLevelDTO, CommonModel } from '../../models/model';
import { EsignAgreementMessege, eSignErrorTypes } from '../../shared/constants';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../userManagement/user.service';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { userRoleservice } from '../role-management/role-management.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { Router } from '@angular/router';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { AdminComponent } from '../../layout/admin/admin.component';
import swal from 'sweetalert2';
import { LocationService } from '../location/location.service';
import { DepartmentService } from '../department/department.service';

@Component({
  selector: 'app-document-forms',
  templateUrl: './document-forms.component.html',
  styleUrls: ['./document-forms.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DocumentFormsComponent implements OnInit {
  selectedForm:any="0";
  documentSpecifiedData: any[] = new Array();
  public workflowLevelList: any[] = new Array();
  documentSpecificForms: any[] = new Array();
  public workflowLevelDto: WorkFlowLevelDTO = new WorkFlowLevelDTO();
  public levelId: number = 0;
  public add: Boolean = false;
  public createLevel: Boolean = false;
  public workflowSettingsList: any[] = new Array();
  public levelName: any;
  public roles: any[] = new Array();
  public roleUsers: any[] = new Array();
  public rolesId: any[] = new Array();
  public usersId: any[] = new Array();
  public validSave: Boolean;
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
  spinnerFlag: boolean = false;
  @Input() permissionConstant: string = "";
  @ViewChild('formSpecificWorkFlow') formSpecificWorkFlow: any;
  isUserInWorkFlow: boolean = false;
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
  public locationsList: any[] = new Array();
  public locationId: any[] = new Array();
  public departments: any[] = new Array();
  public departmentId: any[] = new Array();
  documentSpecificFormsData: any[] = new Array();
  constructor(public esignErrors: eSignErrorTypes, public fb: FormBuilder, public esignAgreementMessage: EsignAgreementMessege,
    public config: ConfigService, public userService: UserService, public levelService: WorkFlowLevelsService,
    private helper: Helper, private rolesService: userRoleservice, public locationService: LocationService,
    private dynamicFormService: DynamicFormService, public router: Router, public workflowService: WorkflowConfigurationService,
    public admin: AdminComponent, public deptService: DepartmentService) { }

  ngOnInit() {
    this.esignForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      comments: ['', [Validators.required]],
    });

    this.defaultLoad();
    this.loadDocumentSpecificFormsWithData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.permissionConstant) {
      if (changes.permissionConstant.previousValue != this.permissionConstant) {
        this.loadDocumentSpecificFormsWithData();
      }
    }
  }

  defaultLoad() {
    let docList = [this.permissionConstant];
    if (this.permissionConstant != this.helper.CLEAN_ROOM_VALUE)
      this.config.isUserInWorkFlow(docList).subscribe(resp => {
        this.isUserInWorkFlow = resp;
      });
    else
      this.isUserInWorkFlow = true;
  }

  loadDocumentSpecificFormsWithData() {
    this.spinnerFlag = true;
    this.config.HTTPGetAPI("dynamicForm/loadDocumentSpecifiedFormsWithData/"+this.permissionConstant).subscribe(res => {
      this.documentSpecificFormsData = res;
      this.spinnerFlag = false;
    },
      err => {
        this.spinnerFlag = false;
      }
    );
  }

  navigate(masterId) {
    const queryParams = {
      exists: false,
      id: masterId,
      isMapping: false,
      redirectUrl: this.router.url,
      documentSpecifiedConstant: this.permissionConstant
    };
    localStorage.setItem("DocumentSpecificForm", masterId);
    this.router.navigate(['/dynamicForm/' +masterId], { queryParams: queryParams, skipLocationChange: true });
  }

  viewRowDetails(row) {
    this.admin.redirect("dynamicFormView/" + row.id + "?true?false", this.router.url);
  }

  addNewLevelForDocument(alreadyFlowList: any[]) {
    this.loadLevels(alreadyFlowList);
    this.loadSettingsAndUsers(0);
    this.rolesId = new Array();
    this.usersId = new Array();
    this.departmentId = new Array();
    this.locationId = new Array();
    this.loadroles();
    this.levelId = 0;
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
        this.config.HTTPGetAPI("documentSpecific/loadWorkFlowLevelById/" + flowId).subscribe((resp1) => {
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

  validateSave() {
    setTimeout(() => {
      const data = this.workflowSettingsList.filter(element => element.mainPageCheck && true === element.check);
      if (data.length > 0 && this.rolesId.length > 0 && this.usersId.length > 0 && this.levelId != 0) {
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
      this.config.HTTPPostAPI({ 'documentType' : this.permissionConstant, 'roles' : ids, 'departments' : deptId  }, "documentSpecific/loadUsersBasedOnRolesAndDocument/" + this.selectedForm + "/" + this.levelId).subscribe((resp) => {
        this.roleUsers = resp.map(option => ({ id: +option.key, itemName: option.value }));
        let usersList = [];
        this.usersId.forEach(el1 => {
          this.roleUsers.forEach(el2 => {
            if (el1 === el2.id)
              usersList.push(el2);
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

  saveLevelData() {
    this.spinnerFlag = true;
    if (this.validSave) {
      this.documentSpecificFlowLevelDTO.documentConstantName = this.permissionConstant;
      this.documentSpecificFlowLevelDTO.levelId = Number(this.levelId);
      const data = this.workflowSettingsList.filter(element =>
        element.mainPageCheck && true === element.check
      );
      this.documentSpecificFlowLevelDTO.optionId = data[0].flowSettingsId;
      this.documentSpecificFlowLevelDTO.masterFormId = this.selectedForm;
      this.documentSpecificFlowLevelDTO.userIds = this.usersId.map(d => d.id);
      this.config.HTTPPostAPI(this.documentSpecificFlowLevelDTO, "documentSpecific/saveWorkFlowLevels").subscribe((resp) => {
        this.spinnerFlag = false;
        if (resp) {
          this.loadDataForFlow(this.selectedForm);
          swal({ title: 'Success', text: 'Workflow Level Saved Successfully', type: 'success', timer: 2000, showConfirmButton: false });
        } else {
          swal({ title: 'Not Saved!', text: 'Workflow Level has not been saved', type: 'error', timer: 2000, showConfirmButton: false });
        }
      }, err => {
        this.spinnerFlag = false;
        swal({ title: 'Not Saved!', text: 'Workflow Level has not been saved', type: 'error', timer: 2000, showConfirmButton: false });
      });
    }
  }

  loadDataForFlow(masterId) {
    this.selectedForm=masterId;
    this.add = false;
    this.addButtonFlag = true;
    this.config.HTTPGetAPI("documentSpecific/isDocumentFreeze/" + this.permissionConstant + "/" + this.selectedForm).subscribe((resp) => {
      this.freezeFlagForLevel = resp;
    }, err => {
      this.spinnerFlag = false;
    });
    this.config.HTTPGetAPI("documentSpecific/loadWorkFlowLevels/" + this.permissionConstant + "/" + this.selectedForm).subscribe((resp) => {
      this.spinnerFlag = false;
      this.documentFlows = resp;
    }, err => {
      this.spinnerFlag = false;
    });
  }

  loadAllActiveLocations() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationsList = response.result.map(option => ({ id: +option.id, itemName: option.name }));
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
          this.levelId = data.id
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

  loadDepartments(event): Promise<void> {
    return new Promise<void>(resolve => {
      let locationId = event.map(m => m.id);
      this.deptService.loadDepartmentsbyMultipleLocations(locationId).subscribe(jsonResp => {
        this.departments = jsonResp.result.map(option => ({ id: +option.id, itemName: option.departmentName }));
      });
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
    this.levelId = +item.levelId
  }

  updateLevelOrderOfDocument(list) {
    for (let index = 0; index < list.length; index++) {
      list[index].orderId = index + 1;
    }
    this.config.HTTPPostAPI(list, "documentSpecific/updateLevelOrderOfDocument").subscribe(resp => {
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
    this.config.HTTPGetAPI("documentSpecific/deleteWorkFlowLevelById/" + id).subscribe((resp) => {
      this.spinnerFlag = false;
      this.loadDataForFlow(this.selectedForm);
      if (resp) {
        swal({ title: 'Success', text: 'Level is deleted successfully', type: 'success', timer: 2000, showConfirmButton: false });
      } else {
        swal({ title: 'Error!', text: 'Error in deleting level', type: 'error', timer: 2000, showConfirmButton: false });
      }
    }, (err) => {
      swal({ title: 'Error!', text: 'Error in deleting level', type: 'error', timer: 2000, showConfirmButton: false }); this.spinnerFlag = false;
    });
  }

  loadDocumentTimeline(id,masterId) {
    this.selectedForm=masterId;
    this.spinnerFlag = true;
    this.config.HTTPGetAPI("documentSpecific/loadApproveTimeLine/" + id + "/" + this.permissionConstant + "/" + this.selectedForm).subscribe((resp) => {
      this.spinnerFlag = false;
      this.getStatus = resp;
    }, (err) => {
      this.spinnerFlag = false;
    });
  }

  getDescription(data: any) {
    this.flag = false;
    this.content = data;
    this.levelDescription.show();
  }

  approveOrReject(data) {
    this.selectedDataForWorkflow = data;
    if (data.lastEntry && data.permission) {
      if (data.optionId === 1) {
        this.approveModal.show();
      } else {
        this.openMyModal('effect-1');
      }
    }
  }

  documentApproveOrReject(status) {
    this.selectedDataForWorkflow.status = status;
    this.selectedDataForWorkflow.comments = this.comments;
    this.spinnerFlag = true;
    this.config.HTTPPostAPI(this.selectedDataForWorkflow, "documentSpecific/documentApproveOrReject").subscribe((resp) => {
      this.spinnerFlag = false;
      this.comments = "";
      this.loadDocumentTimeline(this.selectedDataForWorkflow.documentId,this.selectedForm);
      this.approveModal.hide();
      if (status === 'N') {
        this.formSpecificWorkFlow.hide();
        this.loadDocumentSpecificFormsWithData();
      }
    }, (err) => {
      this.spinnerFlag = false;
    });
  }

  openMyModal(event) {
    this.agreementCheck = false;
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeMyModal(event) {
    this.agreementCheck = false;
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

  esign() {
    this.spinnerFlag = true;
    this.config.HTTPPostAPI(this.esignSaveModal, 'workFlow/validEsignUser').subscribe(response => {
      if (response.flag) {
        this.esignForm.reset();
        this.documentApproveOrReject(this.finalstatus ? "Y" : "N");
        this.agreementCheck = false;
        document.querySelector('#' + 'effect-1').classList.remove('md-show');
      } else {
        this.spinnerFlag = false;
        this.errorList = response.errorList;
      }
    });
  }

  onSubmit(esignForm) {
    if (esignForm.valid) {
      this.spinnerFlag = true;
      this.submitted = false;
      this.esignSaveModal.userName = this.esignForm.get('userName').value;
      this.esignSaveModal.password = this.esignForm.get('password').value;
      this.comments = this.esignForm.get('comments').value;
      this.esign();
    } else
      this.submitted = true;
  }

  onclickAccept() {
    this.agreementCheck = !this.agreementCheck;
    this.config.loadCurrentUserDetails().subscribe(jsonResp => {
      this.esignForm.get('userName').setValue(jsonResp.email);
    })
  }

}
