import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LocationService } from './location.service';
import { Location } from './../../models/model';
import swal from 'sweetalert2';
import { Helper } from './../../shared/helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Permissions } from './../../shared/config';
import { AdminComponent } from '../../layout/admin/admin.component';
import { IOption } from 'ng-select';
import { ConfigService } from '../../shared/config.service';
import { locationValidationMsg } from '../../shared/constants';
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class LocationComponent implements OnInit {
  @ViewChild('myTable') table: any;
  public onLocationForm: FormGroup;
  public simpleOptionStep: Array<IOption> = new Array<IOption>();
  data: any;
  modal: Location = new Location();
  public rowsOnPage = 10;
  public filterQuery = '';
  spinnerFlag = false;
  isUpdate: boolean = false;
  permissionsfromlocalstorage: any;
  permissionModal: Permissions = new Permissions("140", false);
  isValidName: boolean = false;
  submitted: boolean = false;

  constructor(public permissionService: ConfigService, private comp: AdminComponent, public fb: FormBuilder, public service: LocationService, public helper: Helper, private locationValMsg: locationValidationMsg) { }

  ngOnInit() {
    this.comp.setUpModuleForHelpContent("140");
    this.comp.taskDocType = "140";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.loadAll();
    this.onLocationForm = this.fb.group({
      code: ['', Validators.compose([
        Validators.required
      ])],
      name: ['', Validators.compose([
        Validators.required
      ])],
      active: ['', Validators.compose([
      ])],
      steps: [[],]
    });
    this.onLocationForm.reset();
    this.onLocationForm.get("active").setValue(true);
    this.permissionService.loadPermissionsBasedOnModule("140").subscribe(resp => {
      this.permissionModal = resp
    });
    setTimeout(() => {
      $('#locationName').focus();
    }, 600);
  }

  onChangeName() {
    this.isValidName = false;
    this.data.forEach(element => {
      if (element.name.toUpperCase() === this.onLocationForm.get("name").value.toUpperCase() && this.modal.id != element.id)
        this.isValidName = true;
    });
  }

  onClickCancel() {
    this.submitted = false;
    this.isUpdate = false;
    this.modal = new Location();
    this.onLocationForm.reset();
    this.onLocationForm.get("active").setValue(true);
  }

  loadAll() {
    this.spinnerFlag = true;
    this.service.loadStepList("LocationStep").subscribe(jsonResp => {
      this.simpleOptionStep = this.helper.cloneOptions(jsonResp.result);
    });
    this.service.loadLocation().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.data = response.result
      }
    }, error => { this.spinnerFlag = false });
  }

  editLocation(data: Location) {
    this.isUpdate = true;
    this.modal = data;
    this.onLocationForm.get("active").setValue(data.active === 'Y' ? true : false);
    this.onLocationForm.get("code").setValue(data.code);
    this.onLocationForm.get("name").setValue(data.name);
    this.onLocationForm.get("steps").setValue(data.stepList);
    setTimeout(() => {
      let temp = $("#locationName").val();
      $("#locationName").val('');
      $("#locationName").val(temp);
      $("#locationName").focus();
    }, 600);
  }

  cannotDeactivate(id, event) {
    if (!event.srcElement.checked) {
      this.service.isLocationIsMappedToProject(id).subscribe(
        jsonResp => {
          let responseMsg: boolean = jsonResp;
          if (responseMsg == true) {
            this.onLocationForm.get("active").setValue(true);
            event.srcElement.checked = true;
            swal({
              title: 'Info',
              text: 'Cannot be de-active as this location is already in use!!',
              type: 'warning',
              showConfirmButton: false,
              timer: 3000, allowOutsideClick: false
            });
          } else {

            this.onLocationForm.get("active").setValue(false);
            event.srcElement.checked = false;
          }
        })
    }
  }

  openSuccessCancelSwal(dataObj, id) {
    this.service.isLocationIsMappedToProject(dataObj.id).subscribe(
      jsonResp => {
        let responseMsg: boolean = jsonResp;
        if (responseMsg == true) {
          swal({
            title: 'Info',
            text: 'Cannot be deleted as this location is already in use!!',
            type: 'warning',
            showConfirmButton: false,
            timer: 3000, allowOutsideClick: false
          });
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
      });
  }

  deleteLocation(dataObj): string {
    let timerInterval;
    let status = '';
    let location = new Location();
    location.id = dataObj.id;
    location.userRemarks = dataObj.userRemarks;
    this.service.deleteLocation(location)
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
            text: 'Location ' + dataObj.code + '  has not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          }
          );
        }
      }, (err) => {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: dataObj.code + 'is not deleted...Something went wrong',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        });
      });
    return status;
  }

  onClickSave() {
    let timerInterval;
    if (!this.isValidName && this.onLocationForm.valid) {
      this.spinnerFlag = true;
      this.submitted = false;
      this.modal.code = this.onLocationForm.get("code").value;
      this.modal.name = this.onLocationForm.get("name").value;
      if (this.onLocationForm.get("steps").value) {
        this.modal.stepList = this.onLocationForm.get("steps").value;
      } else {
        this.modal.stepList = [];
      }
      if (this.onLocationForm.get("active").value)
        this.modal.active = "Y";
      else
        this.modal.active = "N";
      this.service.createLocation(this.modal).subscribe(jsonResp => {
        this.spinnerFlag = false;
        let responseMsg: string = jsonResp.result;
        if (responseMsg === "success") {
          this.onLocationForm.reset();
          this.onLocationForm.get("active").setValue(true);
          this.modal= new Location();
          this.loadAll();
          let mes = 'New Location is created';
          if (this.isUpdate) {
            mes = "Location is updated"
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
            timer: this.helper.swalTimer,
            showConfirmButton: false
          })
        }
      },
        err => {
          this.spinnerFlag = false
        }
      );
    } else {
      this.submitted = true;
      Object.keys(this.onLocationForm.controls).forEach(field => {
        const control = this.onLocationForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  checkOnly(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

}
