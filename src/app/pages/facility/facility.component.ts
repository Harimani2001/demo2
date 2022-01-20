import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { EquipmentService } from '../equipment/equipment.service';
import { Facility } from './../../models/model';
import swal from 'sweetalert2';
import { Helper } from './../../shared/helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../location/location.service';
import { FacilityService } from './facility.service';
import { IOption } from 'ng-select';
import { Permissions } from './../../shared/config';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';
import { facilityErrorTypes } from '../../shared/constants';
@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class FacilityComponent implements OnInit {

  @ViewChild('myTable') table: any;
  @ViewChild('facilityName') facilityName: any;
  public onFacilityForm: FormGroup;
  data: any;
  modal: Facility = new Facility();
  public rowsOnPage = 10;
  public filterQuery = '';
  spinnerFlag = false;
  isUpdate: boolean = false;
  isSave: boolean = false;
  locationList: any;
  equipmentList: Array<IOption> = new Array<IOption>();
  permissionsfromlocalstorage: any;
  permissionModal: Permissions = new Permissions('142', false);
  isValidName: boolean = false;
  equipmentFlag: boolean = false;
  locationFlag: boolean = false;
  nameFlag: boolean = false;

  constructor(public permissionService: ConfigService, private comp: AdminComponent, public fb: FormBuilder, public service: FacilityService,
    public equipmentService: EquipmentService, public helper: Helper, public locationService: LocationService, public facilityErrorTypes: facilityErrorTypes) { }

  ngOnInit() {
    this.comp.setUpModuleForHelpContent("142");
    this.comp.taskDocType = "142";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.loadAll();
    this.loadAllActiveLocations();
    this.loadAllEquipments();
    this.onFacilityForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required
      ])],
      locationId: ['', Validators.compose([
        Validators.required
      ])],
      equipmentId: ['', Validators.compose([
        Validators.required
      ])],
      active: ['', Validators.compose([
        Validators.required
      ])],
    });
    this.onFacilityForm.get("active").setValue(true);
    this.permissionService.loadPermissionsBasedOnModule("142").subscribe(resp => {
      this.permissionModal = resp
    });
    var timer = setInterval(() => {
      if (this.facilityName) {
        this.facilityName.nativeElement.focus();
        clearInterval(timer);
      }
    })
  }

  loadAllActiveLocations() {
    this.spinnerFlag = true;
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.locationList = response.result
      }
    }, error => { this.spinnerFlag = false });
  }

  loadAllEquipments() {
    this.spinnerFlag = true;
    this.equipmentService.loadEquipmentsByuser().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.equipmentList = response.result.map(option => ({ value: option.id, label: option.name }))
      }
    }, error => { this.spinnerFlag = false });
  }

  onChangeName() {
    this.isValidName = false;
    this.nameFlag = false;
    this.data.forEach(element => {
      if (element.name === this.onFacilityForm.get("name").value && this.modal.id != element.id)
        this.isValidName = true;
    });
  }

  onClickCancel() {
    this.isUpdate = false;
    this.modal = new Facility();
    this.onFacilityForm.reset();
    this.onFacilityForm.get("active").setValue(true);
  }

  loadAll() {
    this.spinnerFlag = true;
    this.service.loadFacility().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.data = response.result
      }
    }, error => { this.spinnerFlag = false });
  }

  editFacility(data: Facility) {
    this.isSave = false;
    this.isUpdate = true;
    this.modal = data;
    this.onFacilityForm.get("active").setValue(data.active === 'Y' ? true : false);
    this.onFacilityForm.get("name").setValue(data.name);
    this.onFacilityForm.get("locationId").setValue(data.locationId);
    this.onFacilityForm.get("equipmentId").setValue(data.equipmentId);
    var timer = setInterval(() => {
      if (this.facilityName) {
        this.facilityName.nativeElement.focus();
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
    let timerInterval;
    let status = '';
    let facility = new Facility();
    facility.id = dataObj.id;
    facility.userRemarks = dataObj.userRemarks;
    this.service.deleteFacility(facility)
      .subscribe((response) => {
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
            text: 'Facility ' + dataObj.name + '  has not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer
          }
          );
        }
      }, (err) => {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: dataObj.name + 'is not deleted...Something went wrong',
          type: 'error',
          timer: this.helper.swalTimer
        }
        );
      });
    return status;
  }

  onClickSave() {
    let timerInterval
    if (this.onFacilityForm.valid) {
      if (!this.isValidName) {
        this.equipmentFlag = false;
        this.locationFlag = false;
        this.nameFlag = false;
        this.spinnerFlag = true;
        this.modal.name = this.onFacilityForm.get("name").value;
        this.modal.locationId = this.onFacilityForm.get("locationId").value;
        this.modal.equipmentId = this.onFacilityForm.get("equipmentId").value;
        if (this.onFacilityForm.get("active").value)
          this.modal.active = "Y";
        else
          this.modal.active = "N";
        this.service.createFacility(this.modal).subscribe(jsonResp => {
          this.spinnerFlag = false;
          let responseMsg: string = jsonResp.result;
          if (responseMsg === "success") {
            this.onFacilityForm.reset();
            this.onFacilityForm.get("active").setValue(true);
            this.loadAll();
            let mes = 'New Facility is created';
            if (this.isUpdate) {
              mes = "Facility is updated";
              this.isUpdate = false;
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
              timer: this.helper.swalTimer
            }
            )
          }
        },
          err => {
            this.spinnerFlag = false
          }
        );
      }
    } else {
      Object.keys(this.onFacilityForm.controls).forEach(field => {
        const control = this.onFacilityForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

}
