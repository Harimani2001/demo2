import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { MasterDynamicWorkFlowConfigDTO } from '../../models/model';
import { Helper } from '../../shared/helper';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { userRoleservice } from '../role-management/role-management.service';
import { UserService } from '../userManagement/user.service';
import { WorkFlowConfigurationDynamicFormService } from './work-flow-configuration-dynamic-form.service';

@Component({
  selector: 'app-work-flow-configuration-dynamic-form',
  templateUrl: './work-flow-configuration-dynamic-form.component.html',
  styleUrls: ['./work-flow-configuration-dynamic-form.component.css']
})
export class WorkFlowConfigurationDynamicFormComponent implements OnInit {
  @ViewChild('workFlowConfig') workFlowConfig: any
  filterQuery = '';
  submitted = false;
  spinnerFlag = false;
  workFlowDto = new MasterDynamicWorkFlowConfigDTO();
  templateList: any;
  levelList: any[] = new Array();
  allLevelList: any[] = new Array();
  isEdited: boolean = false;
  roleList: Array<IOption> = new Array<IOption>();
  userList: Array<IOption> = new Array<IOption>();
  masterWorkFLowConfigData: any;
  roleIds = [];
  deptIds = [];
  @Output() onClose = new EventEmitter<boolean>();
  masterFormId: any;

  constructor(private service: WorkFlowConfigurationDynamicFormService, private masterDynamicService: MasterDynamicFormsService, private userService: UserService, private helper: Helper, private roleService: userRoleservice) { }

  ngOnInit() {
    this.loadTemplate();
    this.loadRole();
    if (localStorage.getItem("masterFormId") != undefined) {
      this.masterFormId = window.atob(localStorage.getItem("masterFormId"));
      this.loadDataForDynamicForm(this.masterFormId);
    }
  }

  loadTemplate() {
    this.spinnerFlag = true;
    this.masterDynamicService.loadTemplate().subscribe(result => {
      this.templateList = result.filter(up => !up.publishedFlag);
      this.spinnerFlag = false;
    }, err => {
      this.spinnerFlag = false;
    });
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

  loadUser(roleIds: any[]): Promise<void> {
    this.spinnerFlag = true;
    return new Promise<void>(resolve => {
      this.roleService.loadListOfusers(roleIds).subscribe(resp => {
        this.userList = resp.map(option => ({ value: Number(option.key), label: option.value }));
        this.spinnerFlag = false;
      }, err => { this.spinnerFlag = false; });
    });
  }

  loadDataForDynamicForm(masterDynamicId) {
    this.spinnerFlag = true;
    this.workFlowDto = new MasterDynamicWorkFlowConfigDTO();
    this.workFlowDto.masterId = masterDynamicId;
    this.roleIds = [];
    this.service.loadNumberOfLevelsForMasterDynamicForm(masterDynamicId).subscribe(result => {
      this.allLevelList = result;
      this.loadTable(masterDynamicId);
      this.spinnerFlag = false;
    }, err => { this.spinnerFlag = false; });
    this.spinnerFlag = true;
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

  saveData(formValid) {
    this.submitted = true;
    if (!formValid) {
      return
    } else if (this.workFlowDto.workFlowLevelId != 0) {
      this.service.saveData(this.workFlowDto).subscribe(respo => {
        this.spinnerFlag = false;
        if (respo.result == "success") {
          swal({
            title: 'Saved Successfully!',
            text: 'Configuration has been saved.',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.workFlowConfig.resetForm();
              this.workFlowDto.id = 0;
              this.workFlowDto.users = new Array();
              this.workFlowDto.workFlowLevelId = 0;
              this.roleIds = new Array();
              this.submitted = false;
              this.loadTable(this.workFlowDto.masterId);
              this.isEdited = false;
            }
          }
          );
        } else {
          swal({
            title: 'Error in Saving',
            text: 'Configuration has not been saved',
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
          text: 'Configuration has not been saved',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        }
        );
      });
    }
  }

  editLevel(data) {
    this.isEdited = true;
    this.workFlowDto = data;
    this.roleIds = data.roleIds;
    this.loadUser(data.roleIds).then(re => {
    })
  }

  deleteTemplateSwal(row) {
    var obj = this
    swal({
      title: 'Are you sure?',
      text: 'You wont be able to revert',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, deactive it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonClass: 'btn btn-danger',
      allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      obj.deActivateLevel(row);
    });
  }

  deActivateLevel(row) {
    let timerInterval
    this.service.deactivate(row).subscribe(respo => {
      if (respo.result == "success") {
        swal({
          title: 'Deactivated Successfully!',
          text: 'Configuration has been deactivated.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.loadTable(this.workFlowDto.masterId)
            clearInterval(timerInterval)
          }
        }
        );
      } else {
        swal({
          title: 'Error in Deactivating',
          text: 'Configuration has not been deactivated',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        }
        );
      }
    }, error => {
      swal({
        title: 'Error in Saving',
        text: 'Configuration has not been deactivated',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      }
      );
    });
  }

  addNewLevel(masterDynamicId) {
    this.workFlowDto = new MasterDynamicWorkFlowConfigDTO();
    this.workFlowDto.masterId = masterDynamicId;
    this.roleIds = [];
  }

  redirectToView() {
    this.onClose.emit(true);
    this.isEdited = false;
  }

}
