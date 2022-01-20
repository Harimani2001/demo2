import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';
import { Permissions } from '../../shared/config';
import { Helper } from '../../shared/helper';
import { DepartmentService } from './department.service';
import swal from 'sweetalert2';
import { Department } from '../../models/model';
import { departmentErrorTypes } from '../../shared/constants';
import { LocationService } from '../location/location.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class DepartmentComponent implements OnInit {
  @ViewChild('deptForm') departmentForm: any;
  @ViewChild('deptName') deptName: any;
  @ViewChild('myTable') table: any;
  @ViewChild('alertMessage') alertMessage: any;
  spinnerFlag: boolean = false;
  permisionModal: Permissions = new Permissions('103', false);
  currentUser: any;
  departmentList: any[] = new Array();
  filterQuery = '';
  moduleNames: any[] = new Array();
  modal: Department = new Department();
  locationsList: any[] = new Array();
  validationMessage = '';
  disableButtonFlag: boolean = false;
  submitted: boolean = false;
  showButtonFlag: boolean = false;
  rowId: any;
  updateFlag: boolean = false;

  constructor(private adminComponent: AdminComponent, public helper: Helper, public configService: ConfigService,
    public departmentService: DepartmentService, public errorTypes: departmentErrorTypes, public locationService: LocationService) { }

  ngOnInit() {
    this.loadCurrentUserDetails();
    this.showButtonFlag = true;
    this.loadAll();
    this.loadAllActiveLocations();
    this.adminComponent.setUpModuleForHelpContent("103");
    this.adminComponent.taskDocType = "105";
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
    this.configService.loadPermissionsBasedOnModule("103").subscribe(resp => {
      this.permisionModal = resp;
    });
    var timer = setInterval(() => {
      if (this.deptName) {
        this.deptName.nativeElement.focus();
        clearInterval(timer);
      }
    })
  }

  loadCurrentUserDetails() {
    this.configService.loadCurrentUserDetails().subscribe(resp => {
      this.currentUser = resp;
      this.modal.organizationName = this.currentUser.orgName;
    });
  }

  loadAll(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.spinnerFlag = true;
      this.departmentService.loadDepartment().subscribe(jsonResp => {
        this.spinnerFlag = false;
        if (jsonResp.result) {
          this.departmentList = jsonResp.result;
          resolve(true);
        } else {
          resolve(false);
        }
      }, error => {
        this.spinnerFlag = false;
        resolve(false);
      });
    })
  }

  openSuccessDeleteSwal(dataObj) {
    this.departmentService.departmentIsUsed(dataObj.id).subscribe(jsonResp => {
      this.moduleNames = jsonResp.result;
      if (this.moduleNames.length) {
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
        }).then((value) => {
          if (value) {
            dataObj.userRemarks = "Comments : " + value;
            this.deleteDepartment(dataObj);
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
    });
  }

  deleteDepartment(dataObj): string {
    let status = '';
    let dept = new Department();
    dept.id = dataObj.id;
    dept.userRemarks = dataObj.userRemarks;
    this.departmentService.deleteDepartment(dept).subscribe(jsonResp => {
      let timerInterval;
      if (jsonResp.result) {
        status = "success";
        swal({
          title: 'Deleted!',
          text: 'Department ' + dataObj.departmentName + ' has been deleted.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.loadAll();
            clearInterval(timerInterval);
          }
        });
      } else {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: 'Department ' + dataObj.departmentName + ' is not deleted.',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        });
      }
    }, (err) => {
      status = "failure";
      swal({
        title: 'Not Deleted!',
        text: dataObj.departmentName + ' is not deleted...Something went wrong',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false,
      });
    });
    return status;
  }

  loadAllActiveLocations() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationsList = response.result;
    });
  }

  showNext() {
    if (this.modal.departmentName) {
      if (this.departmentList.filter(f => f.departmentName == this.modal.departmentName.trim() && f.location == this.modal.location).length == 0) {
        this.disableButtonFlag = false;
        this.validationMessage = '';
      } else {
        this.disableButtonFlag = true;
        this.validationMessage = this.errorTypes.validationMessage;
      }
    }
  }

  onsubmit(formIsValid) {
    if (!this.spinnerFlag) {
      let timerInterval;
      this.submitted = true;
      // console.log(formIsValid +"/"+ this.modal.location +"/"+ this.validationMessage)
      if (formIsValid && this.validationMessage == '' && this.modal.location) {
        if (this.helper.isEmpty(this.rowId)) {
          this.modal.id = 0;
        }
        this.spinnerFlag = true;
        this.departmentService.createDepartment(this.modal).subscribe(jsonResp => {
          this.spinnerFlag = false;
          this.departmentForm.reset();
          this.submitted = false;
          this.disableButtonFlag = false;
          if (jsonResp.result === "success") {
            let mes = 'Department is created Successfully';
            if (this.updateFlag) {
              mes = "Department is updated"
            }
            swal({
              title: 'success',
              text: mes,
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
              onClose: () => {
                this.loadAll().then(resp => {
                  this.modal = new Department();
                  this.modal.organizationName = this.currentUser.orgName;
                  this.updateFlag = false;
                })
                clearInterval(timerInterval);
              }
            });
          } else {
            swal({
              title: 'error',
              text: 'Something went Wrong ...Try Again',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false
            })
          }
        }, err => {
          this.spinnerFlag = false;
        });
      }
    }
  }

  editDepartment(row: any) {
    this.rowId = row.id;
    this.updateFlag = true;
    this.disableButtonFlag = false;
    this.departmentService.editDepartment(row.id).subscribe(response => {
      if (response.result) {
        this.modal = response.result;
        this.showButtonFlag = true;
        var timer = setInterval(() => {
          if (this.deptName) {
            this.deptName.nativeElement.focus();
            clearInterval(timer);
          }
        })
      }
    });
  }

  onClickCancel() {
    // this.departmentForm.reset();
    this.modal = new Department();
    this.modal.organizationName = this.currentUser.orgName;
    this.submitted = false;
    this.updateFlag = false;
    this.validationMessage = '';
  }

}