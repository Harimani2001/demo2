import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { OrganizationDetails, Roles, User } from '../../../models/model';
import { ConfigService } from '../../../shared/config.service';
import { addUserErrorTypes } from '../../../shared/constants';
import { Helper } from '../../../shared/helper';
import { DepartmentService } from '../../department/department.service';
import { LocationService } from '../../location/location.service';
import { userRoleservice } from '../../role-management/role-management.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})

export class AddUserComponent implements OnInit {
  @ViewChild('empUserName') userNameId: any;
  @ViewChild('alertMessage') alertMessage: any;
  employeeModel: User = new User();
  spinnerFlag = false;
  submitted: boolean = false;
  successMessage: string = "";
  errorMessage: string = "";
  roles: Roles[] = new Array();
  departmentList = [];
  locationsList = [];
  managerList = [];
  managerDropdownSettings = {
    singleSelection: true,
    text: "Select Manager",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  receivedId: string;
  valadationMessage: string = "";
  organizationList: OrganizationDetails[] = new Array();
  licenceMsg: string = "";
  isRoleMessage: boolean = false;
  isDisabled: boolean = false;
  emailValadationMessage: string = "";
  isValidationMessage: boolean = false;
  moduleNames: any[] = new Array();
  isEmailExists:boolean=false;
  constructor(public configService: ConfigService, private comp: AdminComponent, public helper: Helper, private employeeService: UserService,
    private route: ActivatedRoute, private routers: Router, public departmentService: DepartmentService, public locationService: LocationService,
    public roleServie: userRoleservice, public addUserErrorTypes: addUserErrorTypes) {
  }

  ngOnInit() {
    this.spinnerFlag = true;
    this.comp.setUpModuleForHelpContent("112");
    this.comp.taskDocType = "112";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEnbleFlag = true;
    this.comp.taskEquipmentId = 0;
    this.comp.checkTheTaskData();
    this.loadRoles();
    this.loadAllActiveLocations();
    this.loadUsersForOrgnization();
    this.employeeModel.hodFlag = false;
    this.employeeModel.activeFlag = true;
    this.receivedId = this.route.snapshot.params["id"];
    if (this.receivedId !== undefined) {
      if (this.receivedId.search("view") != -1) {
        this.isDisabled = true;
        this.receivedId = this.receivedId.replace("-view", "").trim();
      }
      let id = this.receivedId;
      this.employeeService.getDataForEdit(id).subscribe(jsonResp => {
        this.employeeModel = jsonResp.result;
        this.checkEmail();
        if (!this.helper.isEmpty(this.employeeModel.managerId)) {
          this.employeeModel.manager = [{ 'id': this.employeeModel.managerId, 'itemName': this.employeeModel.managerName }];
        }
        this.loadDepartmentOnLocation(this.employeeModel.locationId);
        this.employeeModel.hodFlag = this.employeeModel.hodFlag == 'Y' ? true : false;
        this.employeeModel.activeFlag = this.employeeModel.activeFlag == 'Y' ? true : false;
        this.licenceMsg = jsonResp.result.message;
      }, err => {
      }
      );
    }
    this.spinnerFlag = false;
  }

  saveAndGoto(formIsValid: any) {
    this.submitted = true;
    this.spinnerFlag = true;
    if (!formIsValid || this.valadationMessage != "" || this.emailValadationMessage != "" || this.employeeModel.role == 0 || this.employeeModel.locationId == 0 || this.employeeModel.departmentId == 0) {
      this.spinnerFlag = false;
      return;
    } else {
      if (!this.helper.isEmpty(this.employeeModel.manager)) {
        let id = this.employeeModel.manager[0].id;
        this.employeeModel.managerId = this.managerList.filter(f => f.id == id).map(m => m.id)[0];
        this.employeeModel.managerName = this.managerList.filter(f => f.id == id).map(m => m.itemName)[0];
      }
      this.employeeModel.hodFlag = this.employeeModel.hodFlag ? 'Y' : 'N';
      this.employeeModel.activeFlag = this.employeeModel.activeFlag ? 'Y' : 'N';
      this.employeeModel.isDefault = "false";
      this.employeeModel.id = 0
      this.employeeService.saveAndGoto(this.employeeModel).subscribe(result => {
        let responseMsg: string = result.result;
        if (responseMsg === "success") {
          this.spinnerFlag = false;
          swal({
            title: 'Saved Successfully!',
            text: this.employeeModel.userName + ' Employee details has been saved',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => { this.routers.navigate(["/userManagement/view-user"]); }
          });
        } else {
          this.spinnerFlag = false;
          if (result.message !== "") {
            this.licenceMsg = result.message;
            swal('Error in Saving', this.licenceMsg, 'warning');
          } else {
            swal('Error in Saving', this.employeeModel.userName + ' Employee details has not  been saved', 'error');
          }

        }
      }, err => { this.spinnerFlag = false; });
    }
  }

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  userNameKeyPrevent(event: any) {
    let regex = new RegExp("^[a-zA-Z0-9]+$");
    let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }

  onEditEmployeeSubmit(isFormValid) {
    if (!isFormValid || this.valadationMessage != "" || this.emailValadationMessage != "" || this.employeeModel.role == 0 || this.employeeModel.locationId == 0 || this.employeeModel.departmentId == 0) {
      this.submitted = true;
      this.spinnerFlag = false;
      return;
    }
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
          this.employeeModel.userRemarks = "Comments : " + value;
          this.submitted = true;
          this.spinnerFlag = true;
          if (!this.helper.isEmpty(this.employeeModel.manager)) {
            let id = this.employeeModel.manager[0].id;
            this.employeeModel.managerId = this.managerList.filter(f => f.id == id).map(m => m.id)[0];
            this.employeeModel.managerName = this.managerList.filter(f => f.id == id).map(m => m.itemName)[0];
          }
          this.employeeModel.hodFlag = this.employeeModel.hodFlag ? 'Y' : 'N';
          this.employeeModel.activeFlag = this.employeeModel.activeFlag ? 'Y' : 'N';
          this.employeeService.updateEmployee(this.employeeModel).subscribe(result => {
            let responseMsg: string = result.result;
            let timerInterval
            if (responseMsg === "success") {
              this.spinnerFlag = false;
              this.submitted = true;
              swal({
                title: 'Updated Successfully!',
                text: this.employeeModel.userName + ' Employee details has been updated successfully',
                type: 'success',
                timer: this.helper.swalTimer,
                showConfirmButton: false,
                onClose: () => {
                  if (!this.isDisabled)
                    this.routers.navigate(["/userManagement/view-user"]);
                  else if (this.isDisabled)
                    this.routers.navigate(["/dashboard"]);
                  clearInterval(timerInterval)
                }
              }
              );
            } else {
              this.spinnerFlag = false;
              this.submitted = true;
              swal(
                'Error in updating',
                this.employeeModel.userName + ' Employee details has not  been updated',
                'error'
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

  checkUserNameIsExits = (() => {
    this.isValidationMessage = false;
    return () => {
      setTimeout(() => {
        if (!this.helper.isEmpty(this.employeeModel.userName)) {
          this.employeeService.onChangeGetUserDetails(this.employeeModel.userName).subscribe(
            jsonResp => {
              let responseMsg: boolean = jsonResp;
              if (responseMsg == true) {
                this.isValidationMessage = true;
                this.valadationMessage = "User name is already exist";
              } else {
                this.valadationMessage = "";
                this.isValidationMessage = false;
              }
            }
          );
        } else {
          this.valadationMessage = "";
          this.isValidationMessage = false;
        }
      }, 600);
    }
  })();

  checkEmail = (() => {
    this.isValidationMessage = false;
    this.isEmailExists=false;
    return () => {
      setTimeout(() => {
        if (!this.helper.isEmpty(this.employeeModel.email)) {
          this.spinnerFlag=true;
          this.employeeService.onChangeGetEmailDetails(this.employeeModel.email).subscribe(
            jsonResp => {
              this.spinnerFlag=false;
              this.isEmailExists=jsonResp.result;
              if(this.isEmailExists){
                this.employeeModel.userName=jsonResp.userName;
              }else{
                this.employeeModel.userName="";
              }
              // let responseMsg: boolean = jsonResp.result;
              // if (responseMsg == true) {
              //   this.isValidationMessage = true;
              //   this.emailValadationMessage = "Email is already axist";
              // } else {
              //   this.emailValadationMessage = "";
              //   this.isValidationMessage = false;
              // }
            }
          );
        } else {
          this.emailValadationMessage = "";
          this.isValidationMessage = false;
        }
      }, 600);
    }
  })();

  loadRoles() {
    this.roleServie.loadroles().subscribe(result => {
      for (let key in result) {
        this.roles.push(new Roles(key, result[key]));
      }
    });
  }

  loadAllActiveLocations() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationsList = response.result;
    });
  }

  loadUsersForOrgnization() {
    this.configService.HTTPGetAPI('user/loadAllActiveUsersForOrganization').subscribe(jsonResp => {
      this.managerList = jsonResp.result.map(m => ({ 'id': +m.key, 'itemName': m.value }));
      if (!this.helper.isEmpty(this.receivedId)) {
        this.managerList = this.managerList.filter(f => f.id != this.receivedId);
      }
    })
  }

  loadDepartmentOnLocation(data) {
    if (data) {
      this.departmentService.loadDepartmentOnLocation(data).subscribe(response => {
        this.departmentList = response.result;
      })
    }
  }

  onDeActive(userId) {
    this.employeeService.userIsUsed(userId).subscribe(jsonResp => {
      this.moduleNames = jsonResp.result;
      if (this.moduleNames.length > 0) {
        this.alertMessage.show();
        this.employeeModel.activeFlag = true;
      }
    });
  }

}