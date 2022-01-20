import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Shift } from './../../models/model';
import swal from 'sweetalert2';
import { Helper } from './../../shared/helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShiftService } from './shift.service';
import { Permissions } from './../../shared/config';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';
import { shiftErrorTypes } from '../../shared/constants';
@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class ShiftComponent implements OnInit {

  @ViewChild('myTable') table: any;
  @ViewChild('shiftName') shiftName: any;
  public onShiftForm: FormGroup;
  data: any;
  modal: Shift = new Shift();
  public rowsOnPage = 10;
  public filterQuery = '';
  spinnerFlag = false;
  isUpdate: boolean = false;
  locationList: any;
  equipmentList: any;
  permissionsfromlocalstorage: any;
  permissionModal: Permissions = new Permissions("143", false);
  isValidName: boolean = false;

  constructor(public permissionService: ConfigService, private comp: AdminComponent, public fb: FormBuilder, public service: ShiftService,
    public helper: Helper, public shiftErrorTypes: shiftErrorTypes) { }

  ngOnInit() {
    this.comp.setUpModuleForHelpContent("143");
    this.comp.taskDocType = "143";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.loadAll();
    this.onShiftForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required
      ])],
      startTime: ['', Validators.compose([
        Validators.required
      ])],
      endTime: ['', Validators.compose([
        Validators.required
      ])],
      active: ['', Validators.compose([
        Validators.required
      ])],
    });
    this.onShiftForm.get("active").setValue(true);
    this.permissionService.loadPermissionsBasedOnModule("143").subscribe(resp => {
      this.permissionModal = resp
    });
    var timer = setInterval(() => {
      if (this.shiftName) {
        this.shiftName.nativeElement.focus();
        clearInterval(timer);
      }
    })
  }

  onChangeName() {
    this.isValidName = false;
    this.data.forEach(element => {
      if (element.name === this.onShiftForm.get("name").value && this.modal.id != element.id) {
        this.isValidName = true;
      }
    });
  }

  onClickCancel() {
    this.isUpdate = false;
    this.modal = new Shift();
    this.onShiftForm.reset();
    this.onShiftForm.get("active").setValue(true);
  }

  loadAll() {
    this.spinnerFlag = true;
    this.service.loadShift().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.data = response.result
      }
    }, error => { this.spinnerFlag = false });
  }

  editShift(data: Shift) {
    this.isUpdate = true;
    this.modal = data;
    this.onShiftForm.get("active").setValue(data.active === 'Y' ? true : false);
    this.onShiftForm.get("name").setValue(data.name);
    this.onShiftForm.get("startTime").setValue(data.startTime);
    this.onShiftForm.get("endTime").setValue(data.endTime);
    var timer = setInterval(() => {
      if (this.shiftName) {
        this.shiftName.nativeElement.focus();
        clearInterval(timer);
      }
    })
  }

  openSuccessCancelSwal(dataObj, id) {
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
          this.deleteLocation(dataObj);
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

  deleteLocation(dataObj): string {
    let status = '';
    let shift = new Shift();
    shift.id = dataObj.id;
    shift.userRemarks = dataObj.userRemarks;
    this.service.deleteShift(shift)
      .subscribe((response) => {
        let timerInterval;
        let responseMsg: string = response.result;
        if (responseMsg === "success") {
          swal({
            title: 'Deleted!',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.loadAll();
              clearInterval(timerInterval)
            }
          });
        } else {
          status = "failure";
          swal({
            title: 'Not Deleted!',
            text: 'Shift ' + dataObj.name + '  has not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer
          });
        }
      }, (err) => {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: dataObj.name + 'is not deleted...Something went wrong',
          type: 'error',
          timer: this.helper.swalTimer
        });
      });
    return status;
  }

  onClickSave() {
    let timerInterval;
    if (this.onShiftForm.valid) {
      if (!this.isValidName) {
        this.spinnerFlag = true;
        this.modal.name = this.onShiftForm.get("name").value;
        this.modal.startTime = this.onShiftForm.get("startTime").value;
        this.modal.endTime = this.onShiftForm.get("endTime").value;
        if (this.onShiftForm.get("active").value)
          this.modal.active = "Y";
        else
          this.modal.active = "N";
        this.service.createShift(this.modal).subscribe(jsonResp => {
          this.spinnerFlag = false;
          let responseMsg: string = jsonResp.result;
          if (responseMsg === "success") {
            this.onShiftForm.reset();
            this.onShiftForm.get("active").setValue(true);
            this.loadAll();
            let mes = 'New Shift is created';
            if (this.isUpdate) {
              mes = " Shift is updated";
              this.isUpdate = false;
              this.onClickCancel();
            }
            swal({
              title: '',
              text: mes,
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
              onClose: () => {
                clearInterval(timerInterval)
              }
            });
          } else {
            swal({
              title: '',
              text: 'Something went Wrong ...Try Again',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false
            });
          }
        },
          err => {
            this.spinnerFlag = false
          }
        );
      }
    } else {
      Object.keys(this.onShiftForm.controls).forEach(field => {
        const control = this.onShiftForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

}
