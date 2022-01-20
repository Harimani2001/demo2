import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { JsonResponse, User, Roles } from '../../../models/model';
import { UserService } from '../user.service';
import { Helper } from '../../../shared/helper';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { Permissions } from '../../../shared/config';
import { ConfigService } from '../../../shared/config.service';
import { FileUploader } from 'ng2-file-upload';
import { ModalBasicComponent } from '../../../shared/modal-basic/modal-basic.component';
import { DepartmentService } from '../../department/department.service';
import { userRoleservice } from '../../role-management/role-management.service';
import { LocationService } from '../../location/location.service';
import { projectsetupService } from '../../projectsetup/projectsetup.service';
const URL_For_Upload = 'https://evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewUserComponent implements OnInit {
  @ViewChild('myTable') table: any;
  @ViewChild('bulkUserModal') public bulkUserModal: ModalBasicComponent;
  @ViewChild('bulkAddUserByAD') bulkAddUserByAD: ModalBasicComponent;
  @ViewChild('alertMessage') alertMessage: any;
  @ViewChild('projectRoleTrasferModal') projectRoleTrasferModal: any;
  @ViewChild('organizationRoleTrasferModal') organizationRoleTrasferModal: any;
  @ViewChild('roleTransferAlertMessage') roleTransferAlertMessage: any;
  public uploader: FileUploader = new FileUploader({
    url: URL_For_Upload,
    isHTML5: true
  });
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  response: JsonResponse;
  data: any;
  loading: boolean = false;
  editableEmployee = new User();
  editableIndex: number;
  submitted: boolean = false;
  spinnerFlag: boolean = false;
  public licenseMessage: any;
  @Input() visible: boolean;
  permissionData: any;
  permisionModal: Permissions = new Permissions('112', false);
  disableDeleteOfUser: any;
  public validationMessage: string = "";
  correctFile = false;
  fileList: any;
  excelData: any[] = new Array();
  formExtendedColumns: any;
  isUploaded: boolean = false;
  locationsList = [];
  departmentList = [];
  roles: Roles[] = new Array();
  managerList = [];
  enableImportButton: boolean = false;
  permissionValue: string = '';
  activeSessionCount: number;
  moduleNames: any[] = new Array();
  showSearch: boolean = false;
  viewIndividualData: boolean = false;
  department: any[] = new Array();
  deptList: any[] = new Array();
  userData: any;
  userList: any[] = new Array();
  dropdownSettings = {
    singleSelection: true,
    text: "Select Department",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  isSMTPConfigured: boolean = false;
  //AD Variables
  adUserIds: any;
  aDUsersList: any[] = new Array();
  isADConfigured = false;
  // role transfer variables
  showUserMapping: boolean = false;
  userMappedModules: any;
  deptDropdownSettings = {
    singleSelection: false,
    text: "Select Department",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  userDropdownSettings = {
    singleSelection: true,
    text: "Select User",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  projSelectAll: boolean = false;
  projItemSelected: boolean = false;
  deptForProjectList = [];
  deptForProject = [];
  userForProjectList = [];
  userForProject = [];
  remarksForProject: any;
  projectRoleSubmitted: boolean = false;
  orgSelectAll: boolean = false;
  orgItemSelected: boolean = false;
  deptForOrganization = [];
  userForOrganizationList = [];
  userForOrganization = [];
  remarksForOrganization: any;
  orgRoleSubmitted: boolean = false;
  failureRoleModuleList: any;
  failureRoleUserName: any;

  constructor(public permissionService: ConfigService, private comp: AdminComponent, public http: Http, private router: Router,
    public locationService: LocationService, private userService: UserService, public helper: Helper,
    public departmentService: DepartmentService, public roleServie: userRoleservice, public projectService: projectsetupService) {
  }

  ngOnInit() {
    this.loadDepartments();
    this.loadAllActiveLocations();
    this.checkSMTPConfiguration();
    this.isADConfiguredCheck();
    this.comp.setUpModuleForHelpContent("112");
    this.comp.taskDocType = "112";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEnbleFlag = true;
    this.comp.checkTheTaskData();
    this.comp.taskEquipmentId = 0;
    this.loadAll();
    this.permissionService.loadPermissionsBasedOnModule("112").subscribe(resp => {
      this.permissionValue = 'ok';
      this.permisionModal = resp
    });
  }

  checkSMTPConfiguration() {
    this.permissionService.HTTPGetAPI('emailConfig/checkEmailConfigForOrganization').subscribe(resp => {
      this.isSMTPConfigured = resp;
    })
  }

  isADConfiguredCheck() {
    this.permissionService.HTTPPostAPI('0', "ldap/isLDAPSetting").subscribe(resp => {
      this.isADConfigured = resp.exists;
    })
  }

  loadAll() {
    this.projectService.loadCurrentLocationOfProject().subscribe(resp => {
      this.userService.loadAllUserBasedOnOrganization().subscribe(jsonResp => {
        this.data = jsonResp.result;
        this.activeSessionCount = this.data.filter(x => x.activeSession).length;
        this.licenseMessage = jsonResp.message;
        this.disableDeleteOfUser = jsonResp.disableDeleteOfUser;
        if (resp.department) {
          this.department = [{ id: resp.department.id, itemName: resp.department.departmentName }];
        }
        let id = this.department.map(m => m.id);
        if (id.length > 0) {
          this.userList = this.data.filter(f => f.departmentId === id[0]);
        } else {
          this.userList = this.data;
        }
      });
    });
  }

  viewRowDetails(id) {
    this.spinnerFlag = true;
    this.showUserMapping = false;
    this.userService.getDataForEdit(id).subscribe(jsonResp => {
      this.userData = jsonResp.result;
      this.viewIndividualData = true;
      this.spinnerFlag = false;
    }, err => { this.spinnerFlag = false; });
  }

  onPage(event) {
  }

  deleteUser(dataObj, i): string {
    this.spinnerFlag = true;
    let status = '';
    this.userService.deleteEmployee(dataObj).subscribe((resp) => {
      let responseMsg: string = resp.result;
      let timerInterval
      if (responseMsg === "success") {
        this.spinnerFlag = false;
        status = "success";
        swal({
          title: 'Delete Successfully!',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            if (this.router.url.search("masterControl") != -1)
              this.router.navigate(["/masterControl"]);
            else
              this.router.navigate(["/userManagement/view-user"]);
            clearInterval(timerInterval)
          }
        }
        );
        this.loadAll();
      } else {
        this.spinnerFlag = false;
        status = "failure";
        swal(
          'Not Deleted!',
          'Record has not been deleted.',
          'error'
        );
      }
    }, (err) => {
      status = "failure";
      this.spinnerFlag = false;
      swal({
        title: 'Not Deleted!',
        text: dataObj.fullName + 'has  not been deleted.',
        type: 'error',
        timer: this.helper.swalTimer
      });
    });
    return status;
  }

  openSuccessCancelSwal(dataObj, i) {
    this.loadUserAssociatedModules(dataObj.id).then(resp => {
      if (resp) {
        this.alertMessage.show();
      } else {
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
              dataObj.userRemarks = "Comments : " + value;
              this.deleteUser(dataObj, i);
            } else {
              swal({
                title: '',
                text: 'Comments is requried',
                type: 'info',
                timer: this.helper.swalTimer,
                showConfirmButton: false,
              });
            }
          })
      }
    })
  }

  loadUserAssociatedModules(userId) {
    return new Promise<boolean>(resolve => {
      this.userService.userIsUsed(userId).subscribe(jsonResp => {
        this.moduleNames = jsonResp.result;
        if (this.moduleNames.length > 0)
          resolve(true);
        else
          resolve(false);
      }, err => {
        resolve(false);
      })
    })
  }

  openMyModal(event, i) {
    this.editableEmployee = this.data[i];
    this.editableIndex = i;
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

  onEditEmployeeSubmit(isFormValid) {
    this.loading = true;
    this.submitted = true;
    if (!isFormValid) {
      this.loading = false;
      this.submitted = false;
      return;
    }
    this.userService.updateEmployee(this.editableEmployee).subscribe(jsonResp => {
      let responseMsg: string = jsonResp.result;
      if (responseMsg === "success") {
        this.loading = false;
        this.data[this.editableIndex] = this.editableEmployee;
        swal({
          title: 'Updated Successfully!',
          text: this.editableEmployee.userName + 'Employee Details has been updated successfully.',
          type: 'success',
          timer: this.helper.swalTimer
        });
        let element: HTMLElement = document.getElementById('showSuccessModalId') as HTMLElement;
        element.click();

      } else {
        this.loading = false;
        this.submitted = false;

        swal(
          'Error in updating',
          this.editableEmployee.userName + 'Employee Details has not  been updated.',
          'error'
        );
      }
    });
  }

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) { }

  onBulkImport() {
    if (this.isSMTPConfigured) {
      this.bulkUserModal.show();
      this.validationMessage = "";
      this.uploader.queue = new Array();
    } else {
      swal('Warning', 'Smtp Configuration is not available, Please provide it before creating user for welcome mail', 'warning');
    }
  }

  sampleUserDownload() {
    this.bulkUserModal.spinnerShow();
    this.userService.downloadSampleUserFile().subscribe(res => {
      this.bulkUserModal.spinnerHide();
      var blob: Blob = this.helper.b64toBlob(res.body, 'application/xls');
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, 'sampleUserFile.xls');
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'sampleUserFile.xls';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }, err => this.bulkUserModal.spinnerHide());
  }

  extractFile(event: any) {
    this.loadAllActiveLocations();
    this.loadRoles();
    this.loadUsersForOrgnization();
    this.validationMessage = "";
    if (event.target.files[0].name.match('.xls')) {
      this.correctFile = true;
      this.fileList = event.target.files;
      if (this.uploader.queue.length > 1) {
        this.uploader.queue = new Array(this.uploader.queue[1]);
      }
      this.onClickOfUploadButton();
      event.target.value = '';
    } else {
      this.validationMessage = "Please upload .xls file";
    }
  }

  loadAllActiveLocations() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationsList = response.result
    });
  }

  loadDepartments() {
    this.departmentList = new Array();
    this.departmentService.loadDepartment().subscribe(response => {
      this.departmentList = response.result;
      this.deptList = response.result.map(option => ({ id: option.id, itemName: option.value }));
    })
  }

  loadDepartmentOnLocation(row) {
    if (row.locationId) {
      row.departmentList = new Array();
      row.departmentId = 0;
      this.departmentService.loadDepartmentOnLocation(row.locationId).subscribe(response => {
        row.departmentList = response.result;
      })
    }
  }

  loadRoles() {
    this.roles = new Array();
    this.roleServie.loadroles().subscribe(result => {
      for (let key in result) {
        this.roles.push(new Roles(key, result[key]));
      }
    });
  }

  loadUsersForOrgnization() {
    this.permissionService.HTTPGetAPI('user/loadAllActiveUsersForOrganization').subscribe(jsonResp => {
      this.managerList = jsonResp.result;
    })
  }

  onClickOfUploadButton() {
    this.bulkUserModal.spinnerShow();
    this.validationMessage = "";
    if (this.fileList.length > 0) {
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.userService.extractExcelFile(formData).subscribe(resp => {
        this.bulkUserModal.spinnerHide();
        this.spinnerFlag = false;
        let dataList = resp.list;
        dataList.forEach(item => {
          item.hodFlag = item.hodFlag == 'Y' ? true : false;
        });
        let validationMsg = resp.validationMsg;
        if (!this.helper.isEmpty(dataList) && this.helper.isEmpty(validationMsg)) {
          this.validationMessage = file.name + " file read successfully done";
          this.excelData = dataList;
          this.excelData.forEach(u => {
            this.checkFirstName(this.excelData, u);
            this.checkLastName(this.excelData, u);
            this.checkUserName(this.excelData, u);
            this.checkEmail(this.excelData, u);
            this.checkDept(this.excelData, u);
            this.checkLoc(this.excelData, u);
            this.checkRole(this.excelData, u);
          })
          this.isUploaded = true;
        }
        if (!this.helper.isEmpty(validationMsg) && validationMsg == 'You have exceeded the maximum number of Users creation') {
          swal({
            title: 'Are you sure?',
            text: validationMsg + ', Do you want to continue with first ' + resp.list.length + (resp.list.length == 1 ? 'User' : ' Users'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok, proceed',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success m-r-10',
            cancelButtonClass: 'btn btn-danger',
            allowOutsideClick: false,
            buttonsStyling: false
          }).then(responseMsg => {
            this.validationMessage = file.name + " file read successfully done";
            this.excelData = dataList;
            this.isUploaded = true;
            this.disableImportButton(this.excelData);
          });
        }
      }, err => {
        this.validationMessage = 'Error in Excel File';
        this.bulkUserModal.spinnerHide();
      }
      );
    }
  }

  importData() {
    if (!this.helper.isEmpty(this.excelData)) {
      this.bulkUserModal.spinnerShow();
      this.excelData.forEach(item => {
        item.hodFlag = item.hodFlag ? 'Y' : 'N';
      });
      let list = JSON.parse(JSON.stringify(this.excelData));
      this.userService.saveBulkUsers(list).subscribe(resp => {
        this.bulkUserModal.spinnerHide();
        this.bulkUserModal.hide();
        if (resp.result) {
          swal({
            title: '', text: 'Saved Successfully', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
            onClose: () => {
              this.excelData = new Array();
              this.ngOnInit();
            }
          });
        } else { swal({ title: 'Error', text: 'Something went Wrong ...Try Again', type: 'error', timer: 2000 }) }
      }, err => { this.bulkUserModal.spinnerHide(); });
    }
  }

  checkEmail(list: any[], rowData) {
    if (!this.helper.isEmpty(list) && rowData.email != '') {
      let data = list.filter(data => rowData.email == data.email);
      if (!this.helper.isEmpty(data) && data.length > 1)
        rowData.emailValMsg = 'Email is already in use';
      else
        rowData.emailValMsg = '';
      let userDTO = new User();
      userDTO.email = rowData.email;
      this.userService.onChangeGetEmailDetails(userDTO).subscribe(
        jsonResp => {
          let responseMsg: boolean = jsonResp;
          if (responseMsg == true && this.helper.isEmpty(rowData.emailValMsg)) {
            rowData.emailValMsg = 'Email is already in use';
          } else {
            let emailPattern: string = "[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
            if (!userDTO.email.match(emailPattern))
              rowData.emailValMsg = 'Invalid Email';
          }
        }
      );
      this.disableImportButton(list);
    } else {
      rowData.emailValMsg = 'Email can\'t be empty';
      this.disableImportButton(list);
    }
  }

  checkFirstName(list: any[], rowData) {
    if (!this.helper.isEmpty(list) && rowData.firstName != '')
      rowData.firstNameValMsg = '';
    else
      rowData.firstNameValMsg = 'FirstName can\'t be empty';
    this.disableImportButton(list);
  }

  checkLastName(list: any[], rowData) {
    if (!this.helper.isEmpty(list) && rowData.lastName != '')
      rowData.lastNameValMsg = '';
    else
      rowData.lastNameValMsg = 'LastName can\'t be empty';
    this.disableImportButton(list);
  }

  checkLoc(list: any[], rowData) {
    if (!this.helper.isEmpty(rowData)) {
      if (rowData.locationId && rowData.locationId != 0)
        rowData.locValMsg = '';
      else
        rowData.locValMsg = 'Location can\'t be empty';
      this.disableImportButton(list);
    }
  }

  checkDept(list: any[], rowData) {
    if (!this.helper.isEmpty(rowData)) {
      if (rowData.departmentId && rowData.departmentId != 0)
        rowData.deptValMsg = '';
      else
        rowData.deptValMsg = 'Department can\'t be empty';
      this.disableImportButton(list);
    }
  }

  checkRole(list: any[], rowData) {
    if (!this.helper.isEmpty(rowData)) {
      if (rowData.role && rowData.role != 0)
        rowData.roleValMsg = '';
      else
        rowData.roleValMsg = 'Role can\'t be empty';
      this.disableImportButton(list);
    }
  }

  checkUserName(list: any[], rowData) {
    if (!this.helper.isEmpty(list) && rowData.userName != '') {
      let data = list.filter(data => rowData.userName == data.userName);
      if (!this.helper.isEmpty(data) && data.length > 1)
        rowData.userNameValMsg = 'UserName is already in use';
      else
        rowData.userNameValMsg = '';
      let userDTO = new User();
      userDTO.userName = rowData.userName;
      userDTO.organizationId = rowData.organizationId;
      this.userService.onChangeGetUserDetails(userDTO).subscribe(jsonResp => {
        let responseMsg: boolean = jsonResp;
        if (responseMsg == true && this.helper.isEmpty(rowData.userNameValMsg))
          rowData.userNameValMsg = 'UserName is already in use';
        this.disableImportButton(list);
      }
      );
    }
    else {
      rowData.userNameValMsg = 'UserName can\'t be empty'
      this.disableImportButton(list);
    }
  }

  disableImportButton(list) {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element.firstNameValMsg == '' && element.lastNameValMsg == '' && element.userNameValMsg == '' &&
        element.emailValMsg == '' && element.locValMsg == '' && element.deptValMsg == '' && element.roleValMsg == '') {
        this.enableImportButton = false;
      } else {
        this.enableImportButton = true;
        break;
      }
    }
  }

  closeBulkUserModel() {
    this.isUploaded = false;
    this.excelData = new Array();
    this.ngOnInit();
  }

  openBulkAddUserByADModal() {
    this.bulkAddUserByAD.show();
    this.adUserIds = new Array();
    this.aDUsersList = new Array();
    this.loadRoles();
    this.validationMessage = "";
  }

  loadUsersFromAD(userIds: any[]) {
    this.validationMessage = "";
    this.aDUsersList = new Array();
    var list = userIds.map(d => d.value);
    this.bulkAddUserByAD.spinnerShow();
    this.permissionService.HTTPPostAPI(list, "user/loadUsersFromAD").subscribe(resp => {
      if (resp.message) {
        this.validationMessage = resp.message;
      }
      this.aDUsersList = resp.successUsers;
      this.aDUsersList.forEach(u => {
        if (u.departmentIdName) {
          let dept = this.departmentList.filter(d => d.value == u.departmentIdName);
          if (dept.length > 0) {
            u.departmentId = dept[0].id;
          }
        }
        this.checkFirstName(this.aDUsersList, u);
        this.checkLastName(this.aDUsersList, u);
        this.checkUserName(this.aDUsersList, u);
        this.checkEmail(this.aDUsersList, u);
        this.checkDept(this.aDUsersList, u);
        this.checkLoc(this.aDUsersList, u);
        this.checkRole(this.aDUsersList, u);
      })
      this.bulkAddUserByAD.spinnerHide();
    }, err => this.bulkAddUserByAD.spinnerHide());
  }

  closeBulkAddUserByADModal() {
    this.bulkAddUserByAD.hide();
    this.adUserIds = new Array();
    this.aDUsersList = new Array();
    this.validationMessage = "";
  }

  saveBulkAddUserByADModal() {
    if (this.aDUsersList) {
      this.bulkAddUserByAD.spinnerShow();
      let list = JSON.parse(JSON.stringify(this.aDUsersList));
      this.permissionService.HTTPPostAPI(list, "user/saveUsersFromAD").subscribe(resp => {
        this.bulkAddUserByAD.spinnerHide();
        this.bulkAddUserByAD.hide();
        if (resp.result == 'success') {
          swal({
            title: '', text: 'Saved Successfully', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
            onClose: () => {
              this.aDUsersList = new Array();
              this.ngOnInit();
            }
          });
        } else { swal({ title: 'Error', text: 'Something went Wrong ...Try Again', type: 'error', timer: 2000 }) }
      }, err => { this.bulkAddUserByAD.spinnerHide(); });
    }
  }

  filterUsersList(deptId) {
    let id = deptId.map(m => m.id);
    if (id.length > 0) {
      this.userList = this.data.filter(f => f.departmentId === id[0]);
    } else {
      this.userList = [];
    }
  }

  reinvitation(id) {
    this.spinnerFlag = true;
    this.permissionService.HTTPGetAPI("user/sendReinvitation/" + id).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp.result == 'success') {
        swal({
          title: '', text: 'Successfully Sent Invitation', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
          onClose: () => {
            this.aDUsersList = new Array();
            this.ngOnInit();
          }
        });
      } else { swal({ title: 'Error', text: 'Something went Wrong ...Try Again', type: 'error', timer: 2000 }) }
    }, err => { this.spinnerFlag = false; });
  }

  loadUserMappedModules(userId) {
    this.spinnerFlag = true;
    this.permissionService.HTTPGetAPI('user/loadUserMappedModules/' + userId).subscribe(jsonResp => {
      this.userMappedModules = jsonResp;
      this.spinnerFlag = false;
    }, err => {
      this.spinnerFlag = false;
    })
  }

  loadDepartmentList(arr, key) {
    this.deptForProjectList = [];
    if (arr.length > 0) {
      const list = arr.map(e => e[key]).map((e, i, final) => final.indexOf(e) === i && i).filter((e) => arr[e]).map(e => arr[e]);
      if (list && list.length > 0) {
        if (list.length == 1) {
          this.departmentService.loadDepartmentOnProjectId(list[0].projectId).subscribe(jsonResp => {
            this.deptForProjectList = jsonResp.result.map(option => ({ id: option.key, itemName: option.value }));
          });
        } else {
          this.permissionService.HTTPGetAPI('department/loadDepartmentOfUser/' + this.userData.id).subscribe(jsonResp => {
            if (jsonResp.result) {
              this.deptForProjectList.push({ id: jsonResp.result.key, itemName: jsonResp.result.value });
            }
          });
        }
      }
    }
  }

  onClickProjSelectAll(event) {
    this.projSelectAll = event.currentTarget.checked;
    if (this.userMappedModules) {
      if (event.currentTarget.checked) {
        this.userMappedModules.projectSpecific.forEach(element => {
          element.checked = true;
        });
      } else {
        this.userMappedModules.projectSpecific.forEach(element => {
          element.checked = false;
        });
      }
      this.projItemSelected = this.userMappedModules.projectSpecific.filter(f => f.checked).length > 0 ? true : false;
      this.loadDepartmentList(this.userMappedModules.projectSpecific.filter(f => f.checked), 'projectId');
    }
  }

  onClickProjSelect() {
    this.loadDepartmentList(this.userMappedModules.projectSpecific.filter(f => f.checked), 'projectId');
    this.projItemSelected = this.userMappedModules.projectSpecific.filter(f => f.checked).length > 0 ? true : false;
  }

  onClickOrgSelectAll(event) {
    this.orgSelectAll = event.currentTarget.checked;
    if (this.userMappedModules) {
      if (event.currentTarget.checked) {
        this.userMappedModules.organizationSpecific.forEach(element => {
          element.checked = true;
        });
      } else {
        this.userMappedModules.organizationSpecific.forEach(element => {
          element.checked = false;
        });
      }
      this.orgItemSelected = this.userMappedModules.organizationSpecific.filter(f => f.checked).length > 0 ? true : false;
    }
  }

  onClickOrgSelect() {
    this.orgItemSelected = this.userMappedModules.organizationSpecific.filter(f => f.checked).length > 0 ? true : false;
  }

  onChangeProjectDept(dept) {
    this.userForProjectList = [];
    if (!this.helper.isEmpty(dept)) {
      this.getDeptUsers(dept.map(m => +m.id)).then(resp => {
        this.userForProjectList = resp;
        if (!this.helper.isEmpty(this.userForProject) && !this.userForProjectList.map(m => m.id).includes(this.userForProject[0].id)) {
          this.userForProject = [];
        }
      }, err => {
        this.userForProject = [];
      })
    } else {
      this.userForProject = [];
    }
  }

  onChangeOrgDept(dept) {
    this.userForOrganizationList = [];
    if (!this.helper.isEmpty(dept)) {
      this.getDeptUsers(dept.map(m => +m.id)).then(resp => {
        this.userForOrganizationList = resp;
        if (!this.helper.isEmpty(this.userForOrganization) && !this.userForOrganizationList.map(m => m.id).includes(this.userForOrganization[0].id)) {
          this.userForOrganization = [];
        }
      }, err => {
        this.userForOrganization = [];
      })
    } else {
      this.userForOrganization = [];
    }
  }

  getDeptUsers(deptIds) {
    return new Promise<any[]>(resolve => {
      let usersList = [];
      if (!this.helper.isEmpty(deptIds)) {
        this.userService.loadAllUserBasedOnDepartment(deptIds).subscribe(jsonResp => {
          usersList = jsonResp.result.filter(f => +f.key != this.userData.id).map(option => ({ id: +option.key, itemName: option.value }));
          resolve(usersList);
        }, err => {
          resolve(usersList);
        })
      }
    })
  }

  roleTransferForProjectModule(projRoleTransferForm) {
    this.projectRoleSubmitted = true;
    if (projRoleTransferForm.valid) {
      this.spinnerFlag = true;
      let list = this.userMappedModules.projectSpecific.filter(f => f.checked);
      this.permissionService.HTTPPostAPI(list, "user/roleTransferForProjectModule" + '/' + this.userData.id + '/' + this.userForProject[0].id + '/' + this.remarksForProject).subscribe(jsonResp => {
        if (jsonResp.result == 'success') {
          let userName = this.userForProject[0].itemName;
          swal({
            title: '',
            text: this.userData.firstName + ' ' + this.userData.lastName + ' role transferred to ' + userName,
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              if (!this.helper.isEmpty(jsonResp.failedRoleTransferList)) {
                this.failureRoleModuleList = jsonResp.failedRoleTransferList;
                this.failureRoleUserName = userName;
                this.roleTransferAlertMessage.show();
              }
            }
          });
          this.projItemSelected = false;
          this.projSelectAll = false;
          this.projectRoleSubmitted = false;
          projRoleTransferForm.reset();
          this.projectRoleTrasferModal.hide();
          this.loadUserMappedModules(this.userData.id);
        }
        this.spinnerFlag = false;
      }, err => {
        this.spinnerFlag = false;
      })
    }
  }

  roleTransferForOrgModule(orgRoleTransferForm) {
    this.orgRoleSubmitted = true;
    if (orgRoleTransferForm.valid) {
      this.spinnerFlag = true;
      let list = this.userMappedModules.organizationSpecific.filter(f => f.checked);
      this.permissionService.HTTPPostAPI(list, "user/roleTransferForOrganizationModule" + '/' + this.userData.id + '/' + this.userForOrganization[0].id + '/' + this.remarksForOrganization).subscribe(jsonResp => {
        if (jsonResp.result == 'success') {
          let userName = this.userForOrganization[0].itemName;
          swal({
            title: '',
            text: this.userData.firstName + ' ' + this.userData.lastName + ' role transferred to ' + userName,
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              if (!this.helper.isEmpty(jsonResp.failedRoleTransferList)) {
                this.failureRoleModuleList = jsonResp.failedRoleTransferList;
                this.failureRoleUserName = userName;
                this.roleTransferAlertMessage.show();
              }
            }
          });
          this.orgItemSelected = false;
          this.orgSelectAll = false;
          this.orgRoleSubmitted = false;
          orgRoleTransferForm.reset();
          this.organizationRoleTrasferModal.hide();
          this.loadUserMappedModules(this.userData.id);
        }
        this.spinnerFlag = false;
      }, err => {
        this.spinnerFlag = false;
      })
    }
  }

  closeProjectRoleModal() {
    this.projectRoleTrasferModal.hide();
    this.projSelectAll = false;
    this.projectRoleSubmitted = false;
  }

  closeOrgRoleModal() {
    this.organizationRoleTrasferModal.hide();
    this.orgSelectAll = false;
    this.orgRoleSubmitted = false;
  }

}
