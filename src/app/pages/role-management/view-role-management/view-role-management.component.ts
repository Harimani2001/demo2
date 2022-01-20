import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { LookUpItem, RolePermissions, RolePermissionSave, Roles } from '../../../models/model';
import { PermissionCategory } from '../../../models/permissioncategory';
import { ConfigService } from '../../../shared/config.service';
import { Helper } from '../../../shared/helper';
import { userRoleservice } from '../role-management.service';
import { CommonModel } from './../../../models/model';

@Component({
  selector: 'app-view-role-management',
  templateUrl: './view-role-management.component.html',
  styleUrls: ['./view-role-management.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewRoleManagementComponent implements OnInit {
  spinnerFlag: boolean = false;
  public modulePermissionFlag: boolean = true;
  public rowsOnPage = 10;
  public ModulePermissionMasterDto: any;
  errorMessageIndex: any;
  addFlag: boolean = false;
  tableFlag: boolean = true;
  editing = {};
  editingRowName = [];
  modal: RolePermissionSave = new RolePermissionSave();
  permissions: RolePermissions[] = new Array();
  permissionsdata: RolePermissions[] = new Array();
  lookupdata: RolePermissionSave[] = new Array();
  rows = [];
  rowallid: number;
  hasdata = false;
  selectAll: boolean = false;
  data: LookUpItem[] = new Array();
  roles: Roles[] = new Array();
  documentroleid: number = 0;
  selected = [];
  filterQuery: any = "";
  filterQuery1: any = "";
  filterQuery3: any = "";
  editPermission = false;
  loading: boolean = false;
  toggleEditoractualresult = false;
  submitted: boolean = false;
  valadationMessage: string;
  roleName: string;
  activeFlag: boolean = true;
  roleId: number = 0;
  tableOffset: number = 0;
  tableOffsetRole: number = 0;
  tableOffsetModule: number = 0;
  updateFlag: boolean = false;
  errorMessage: string = "";
  errorMessageForAdd = '';
  updatedRoles: any = new Array();
  mapData: Map<string, string[]>;
  @ViewChild('mydatatable') table: any;
  @ViewChild('cloneRoleModal') cloneRoleModal: any;
  clonedRoleId: any;
  clonedRoleName: any;
  clonedRoleSubmitted: boolean = false;
  constructor(private adminComponent: AdminComponent, private userRoleServices: userRoleservice, private configService: ConfigService,
    public helper: Helper, private permissionCategory: PermissionCategory) {
  }

  ngOnInit() {
    this.loadAll();
    this.adminComponent.setUpModuleForHelpContent(this.helper.ROLE_MANAGEMENT);
  }

  loadAll() {
    this.spinnerFlag = true;
    this.modulePermissionFlag = true;
    this.roles = [];
    this.userRoleServices.loadrolesList().subscribe(result => {
      this.updatedRoles = this.roles = result;
      this.tableFlag = true;
      this.spinnerFlag = false;
    });
  }

  onSubmitRoles(formIsValid) {
    if (formIsValid) {
      this.updateFlag = false;
      this.save(this.roleName, this.activeFlag, this.roleId);
    }
    else {
      this.submitted = true;
      return;
    }
  }

  editrole(roleName: any, roleId: any) {
    this.roleName = roleName;
    this.roleId = roleId;
  }

  rowsAfterFilter() {
    this.tableOffset = 0;
  }

  rowsAfterFilterRole() {
    this.tableOffsetRole = 0;
  }

  rowsAfterFilterModule() {
    this.tableOffsetModule = 0;
  }

  onChange(event: any): void {
    this.tableOffset = event.offset;
  }

  onChangeRole(event: any): void {
    this.tableOffsetRole = event.offset;
  }

  onChangeModule(event: any): void {
    this.tableOffsetModule = event.offset;
  }

  save(roleName, activeFlag, roleId, userRemarks?) {
    let timerInterval;
    this.spinnerFlag = true;
    this.userRoleServices.createRoles(roleName, activeFlag, roleId, userRemarks).subscribe(result => {
      this.spinnerFlag = false;
      if (result.result === "success") {
        this.tableOffsetRole = 0;
        let swalMsg = "";
        if (!this.updateFlag)
          swalMsg = 'Role Saved Successfully';
        else
          swalMsg = 'Role Updated Successfully';
        swal({
          title: 'Success',
          text: swalMsg,
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.loadAll();
            this.editingRowName = [];
            this.addFlag = false;
            clearInterval(timerInterval)
          }
        });
      }
      else {
        this.loading = false;
        this.submitted = false;
        this.valadationMessage = result.result;
      }
    },
      err => {
        this.spinnerFlag = false;
        this.loading = false;
      }
    );
  }

  updateValue(event, cell, cellValue, row) {
    this.editing[row.$$index + '-' + cell] = false;
    this.rows[row.$$index][cell] = event.target.value;
  }

  editdata() {
    this.editPermission = true;
  }

  onCancel() {
    this.spinnerFlag = true;
    this.loadAll();
    this.tableOffset = 0;
    this.selectAll = false;
    this.editPermission = false;
    this.spinnerFlag = false;
    this.selected = [];
    this.filterQuery1 = "";
  }

  onsubmit(data) {
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
          let timerInterval
          this.spinnerFlag = true;
          this.modal = new RolePermissionSave();
          this.permissionsdata = new Array<RolePermissions>();
          for (let i = 0; i < this.permissions.length; i++) {
            let premData = new RolePermissions();
            premData.id = this.permissions[i].id;
            premData.permissionTitle = this.permissions[i].permissionTitle;
            premData.permissionId = this.permissions[i].permissionId;
            premData.workFlowButtonFlag = this.permissions[i].workFlowButtonFlag;
            premData.createButtonFlag = this.permissions[i].createButtonFlag;
            premData.updateButtonFlag = this.permissions[i].updateButtonFlag;
            premData.deleteButtonFlag = this.permissions[i].deleteButtonFlag;
            premData.exportButtonFlag = this.permissions[i].exportButtonFlag;
            premData.importButtonFlag = this.permissions[i].importButtonFlag;
            premData.viewButtonFlag = this.permissions[i].viewButtonFlag;
            premData.publishButtonFlag = this.permissions[i].publishButtonFlag;
            this.permissionsdata.push(premData);
          }
          this.modal.permissions = this.permissionsdata;
          this.modal.roleId = this.documentroleid;
          this.editPermission = false;
          this.modal.category = "";
          this.modal.userRemarks = "Comments : " + value;
          this.userRoleServices.saveRolePermissions(this.modal).subscribe(result => {
            this.spinnerFlag = false;
            if (result.result === "success") {
              this.tableOffset = 0;
              this.selectAll = false;
              swal({
                title: 'Success!',
                text: 'Permissions saved successfully...',
                type: 'success',
                timer: 2000,
                showConfirmButton: false,
                onClose: () => {
                  this.loadAll();
                  clearInterval(timerInterval)
                }
              });
            } else {
              this.selectAll = false;
              swal({
                title: 'Error!',
                text: 'Oops something went Worng..',
                type: 'error',
                timer: 200
              });
            }
          }, error => { this.spinnerFlag = false });
          this.selected = [];
          this.documentroleid = 0;
          this.modal.roleId = 0;
          this.selectAll = false;
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

  getRoleIdForModulePermission(value) {
    this.modulePermissionFlag = false;
    let data: CommonModel = new CommonModel();
    data.roleId = value;
    this.ModulePermissionMasterDto = [];
    this.userRoleServices.loadModules(data).subscribe(result => {
      this.ModulePermissionMasterDto = result;
    });
  }

  saveAndGoTo() {
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
          this.spinnerFlag = true;
          let timerInterval;
          this.ModulePermissionMasterDto.userRemarks = "Comments : " + value;
          this.userRoleServices.SaveModules(this.ModulePermissionMasterDto).subscribe(result => {
            this.spinnerFlag = false;
            if (result) {
              this.tableOffsetModule = 0;
              swal({
                title: 'Success!',
                text: 'Modules saved successfully...',
                type: 'success',
                timer: this.helper.swalTimer,
                showConfirmButton: false,
                onClose: () => {
                  window.location.reload();
                  this.loadAll();
                  clearInterval(timerInterval)
                }
              });
            } else {
              swal({
                title: 'Error!',
                text: 'Oops something went Worng..',
                type: 'error',
                timer: this.helper.swalTimer,
                showConfirmButton: false
              }
              );
            }
          });
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

  roleChanged(value) {
    this.spinnerFlag = true
    this.tableFlag = false;
    this.documentroleid = value;
    this.hasdata = false;
    if (value != 0) {
      this.getdocdata();
    }
  }

  getdocdata() {
    this.userRoleServices.permission('', this.documentroleid).subscribe(result => {
      let data = result.result;
      this.filterQuery1 = "";
      this.mapData = this.permissionCategory.permissionSet();
      this.permissions = data.filter(p => p.groupCategoryId != 0);
      this.permissions.sort((a, b) => a.groupCategoryId - b.groupCategoryId);
      this.selected = this.permissions.filter(row => row['flag']);
      this.selectAll = this.permissions.filter(row => row['flag']).length == this.permissions.length ? true : false;
      this.hasdata = true;
      this.spinnerFlag = false
    });
  }

  selectAllData(select) {
    this.selectAll = select;
    if (this.selectAll) {
      this.permissions.forEach(element => {
        element['flag'] = true;
        this.enableOrDisbalePermission(element, true);
      })
    } else {
      this.permissions.forEach(element => {
        element['flag'] = false;
        this.enableOrDisbalePermission(element, false);
      })
    }
    this.selected = this.permissions.filter(row => row['flag']);
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }

  selectrow(row) {
    this.rowallid = row.permissionId;
    this.selected = this.permissions.filter(row => row['flag']);
    this.enableOrDisbalePermission(row, row.flag);
  }

  close() {
    this.documentroleid = 0;
    this.modal.roleId = 0;
    this.hasdata = true;
  }

  isRoleNameExists(roleName) {
    this.errorMessageForAdd = "";
    this.spinnerFlag = true;
    this.isRoleExist(0, roleName).then(jsonResp => {
      this.errorMessageForAdd = jsonResp;
      this.spinnerFlag = false;
    }, err => {
      this.spinnerFlag = false
    });
  }

  isRoleExist(id, roleName): Promise<string> {
    return new Promise<string>((resolve) => {
      let json = { 'id': id, 'value': roleName };
      this.userRoleServices.isRoleNameExists(json).subscribe(jsonResp => {
        if (jsonResp) {
          resolve("Role name already exists..Please add new role name");
        } else {
          resolve("")
        }
      }, e => resolve(""));
    })
  }

  updateRow(row, index) {
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
          this.spinnerFlag = true;
          this.addFlag = false;
          this.errorMessageIndex = index;
          if (this.editingRowName[row.$$index]) {
            this.isRoleExist(row.id, row.roleName).then(resp => {
              this.errorMessage = resp;
              this.spinnerFlag = false;
              if (!this.errorMessage) {
                this.updateFlag = true;
                this.save(row.roleName, row.activeFlag, row.id, userRemarks);
              }
            }).catch(() => this.spinnerFlag = false);
          } else {
            this.spinnerFlag = false
          }
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

  updateRoleName(event, cell, row) {
    for (let index = 0; index < this.editingRowName.length; index++) {
      if (index != row.$$index) {
        this.editingRowName[index] = false;
      }
    }
    this.rows = this.updatedRoles;
    if (event.relatedTarget != null) {
      if (event.relatedTarget.id != "updateButton_" + row.$$index) {
        this.rows[row.$$index].roleName = row.roleName;
        this.editingRowName[row.$$index] = false;
      } else {
        this.rows[row.$$index].roleName = event.target.value;
        this.editingRowName[row.$$index] = true;
      }
    } else {
      this.rows[row.$$index].roleName = row.roleName;
      if (cell == "") {
        this.editingRowName[row.$$index] = false;
      }
    }
  }

  deactivateRole(row) {
    this.userRoleServices.isRoleIsMapped(row.id).subscribe(
      jsonResp => {
        let responseMsg: boolean = jsonResp;
        if (responseMsg == true) {
          swal({
            title: 'Info',
            text: 'This Role is mapped!!',
            type: 'warning',
            showConfirmButton: false,
            timer: 3000, allowOutsideClick: false
          });
          this.loadAll();
        } else {
          swal({
            title: "Write your comments here:",
            input: 'textarea',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: row.activeFlag ? 'Deactive' : 'Active',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
          })
            .then((value) => {
              if (value) {
                let userRemarks = "Comments : " + value;
                this.save(row.roleName, !row.activeFlag, row.id, userRemarks);
              } else {
                swal({
                  title: '',
                  text: 'Comments is requried',
                  type: 'info',
                  timer: this.helper.swalTimer,
                  showConfirmButton: false,
                });
              }
            }, err => {
              this.loadAll();
            });
        }
      });
  }

  addRoleResetData() {
    this.roleName = "";
    this.roleId = 0
    this.errorMessageForAdd = "";
    this.errorMessage = '';
    this.addFlag = true;
    this.filterQuery = '';
    this.submitted = false;
  }

  enableOrDisbalePermission(element, flag) {
    element.createButtonFlag = flag;
    element.viewButtonFlag = flag;
    element.updateButtonFlag = flag;
    element.workFlowButtonFlag = flag;
    element.exportButtonFlag = flag;
    element.deleteButtonFlag = flag;
    element.importButtonFlag = flag;
    element.publishButtonFlag = flag;
  }

  onClickClone(roleId) {
    this.clonedRoleId = '';
    this.clonedRoleName = '';
    this.errorMessageForAdd = '';
    this.clonedRoleSubmitted = false;
    if (roleId) {
      this.clonedRoleId = roleId;
      this.cloneRoleModal.show();
    }
  }

  cloneRole(isValid) {
    if (isValid) {
      let timerInterval;
      this.spinnerFlag = true;
      this.configService.HTTPGetAPI('admin/cloneRole/' + this.clonedRoleId + '/' + this.clonedRoleName).subscribe(jsonResp => {
        if (jsonResp.result) {
          swal({
            title: 'Success',
            text: "Role cloned successfully",
            type: 'success',
            timer: 2000,
            showConfirmButton: false,
            onClose: () => {
              this.loadAll();
              clearInterval(timerInterval)
            }
          });
        }
        this.spinnerFlag = false;
        this.cloneRoleModal.hide();
      }, error => {
        this.spinnerFlag = false;
      });
    } else {
      this.clonedRoleSubmitted = true;
    }
  }

}
