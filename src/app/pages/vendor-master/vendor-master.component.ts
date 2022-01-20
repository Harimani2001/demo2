import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { AdminComponent } from '../../layout/admin/admin.component';
import { IOption } from 'ng-select';
import { vendorMasterErrorMes } from '../../shared/constants';
import { VendorMasterService } from './vendor-master.service';
import { Helper } from '../../shared/helper';
import { VendorMaster } from '../../models/model';
import swal from 'sweetalert2';
@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class VendorMasterComponent implements OnInit {

  @ViewChild('myTable') table: any;
  @ViewChild('vendorCode') vendorCode: any;
  public rowsOnPage = 10;
  public filterQuery = '';
  spinnerFlag = false;
  iscreate: boolean = false;
  isUpdate: boolean = false;
  isSave: boolean = false;
  submitted: boolean = false;
  public onVendorMasterForm: FormGroup;
  data: any;
  modal: VendorMaster = new VendorMaster();
  permissionModal: Permissions = new Permissions('199', false);
  projectList: Array<IOption> = new Array<IOption>();

  constructor(public helper: Helper, public errorMessages: vendorMasterErrorMes, public service: VendorMasterService, public permissionService: ConfigService, private comp: AdminComponent, public fb: FormBuilder) { }

  ngOnInit() {
    this.comp.setUpModuleForHelpContent("199");
    this.comp.taskDocType = "199";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.comp.taskEnbleFlag = false;
    this.onVendorMasterForm = this.fb.group({
      code: ['', Validators.compose([
        Validators.required
      ])],
      name: ['', Validators.compose([
        Validators.required
      ])],
      address: ['', Validators.compose([])],
      email: ['', Validators.compose([
        Validators.required, Validators.email, Validators.pattern(this.helper.email_pattern)
      ])],
      website: ['', Validators.compose([])],
      contactNo: ['', Validators.compose([
        Validators.pattern(this.helper.mobileNumberPattern)
      ])],
      projectId: ['', Validators.compose([])],
      active: ['', Validators.compose([])],
    });
    this.permissionService.loadPermissionsBasedOnModule("199").subscribe(resp => {
      this.permissionModal = resp;
    });
    this.loadAllEquipments();
    this.loadAll();
  }

  onClickSave() {
    this.submitted = true;
    if (this.onVendorMasterForm.valid) {
      this.submitted = false;
      let timerInterval;
      this.spinnerFlag = true;
      this.modal.code = this.onVendorMasterForm.get("code").value;
      this.modal.name = this.onVendorMasterForm.get("name").value;
      this.modal.address = this.onVendorMasterForm.get("address").value;
      this.modal.phoneNumber = this.onVendorMasterForm.get("contactNo").value;
      this.modal.website = this.onVendorMasterForm.get("website").value;
      this.modal.projectId = this.onVendorMasterForm.get("projectId").value;
      this.modal.email = this.onVendorMasterForm.get("email").value;
      if (this.onVendorMasterForm.get("active").value)
        this.modal.activeFlag = "Y";
      else
        this.modal.activeFlag = "N";
      this.service.createVendorMaster(this.modal).subscribe(jsonResp => {
        this.spinnerFlag = false;
        let responseMsg: string = jsonResp.result;
        if (responseMsg === "success") {
          this.loadAll();
          this.modal = new VendorMaster();
          let mes = 'Vendor Master is created';
          if (this.isUpdate) {
            mes = "Vendor Master is updated"
          }
          swal({
            title: '',
            text: mes,
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.iscreate = false;
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
          this.spinnerFlag = false;
        }
      );
    }
  }

  editVendor(data: VendorMaster) {
    this.iscreate = true;
    this.isSave = false;
    this.isUpdate = true;
    this.modal = data;
    this.onVendorMasterForm.get("active").setValue(data.activeFlag === 'Y' ? true : false);
    this.onVendorMasterForm.get("code").setValue(data.code);
    this.onVendorMasterForm.get("name").setValue(data.name);
    this.onVendorMasterForm.get("address").setValue(data.address);
    this.onVendorMasterForm.get("contactNo").setValue(data.phoneNumber);
    this.onVendorMasterForm.get("projectId").setValue(data.projectId);
    this.onVendorMasterForm.get("website").setValue(data.website);
    this.onVendorMasterForm.get("email").setValue(data.email);
    var timer = setInterval(() => {
      if (this.vendorCode) {
        this.vendorCode.nativeElement.focus();
        clearInterval(timer);
      }
    })
  }

  onClickCancel() {
    this.iscreate = false;
    this.submitted = false;
  }

  loadAll() {
    this.spinnerFlag = true;
    this.service.loadVendorMaster().subscribe(resp => {
      this.spinnerFlag = false;
      this.data = resp.data;
    }, err => {
      this.spinnerFlag = false;
    });
  }

  onClickCreate() {
    this.isSave = true;
    this.iscreate = true;
    this.isUpdate = false;
    this.onVendorMasterForm.reset();
    this.onVendorMasterForm.get("active").setValue(true);
    var timer = setInterval(() => {
      if (this.vendorCode) {
        this.vendorCode.nativeElement.focus();
        clearInterval(timer);
      }
    })
  }

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  loadAllEquipments() {
    this.spinnerFlag = true;
    this.service.loadAllProjects().subscribe(response => {
      this.spinnerFlag = false
      if (response.projectList != null) {
        this.projectList = response.projectList.map(option => ({ value: option.id, label: option.projectName }))
      }
    }, error => { this.spinnerFlag = false });
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
          this.deleteVendor(dataObj);
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

  deleteVendor(dataObj): string {
    this.spinnerFlag = true;
    let timerInterval;
    let status = '';
    let vendor = new VendorMaster();
    vendor.id = dataObj.id;
    vendor.remarks = dataObj.userRemarks;
    this.service.deleteVendorMaster(vendor)
      .subscribe((response) => {
        this.spinnerFlag = false;
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
          this.spinnerFlag = false;
          status = "failure";
          swal({
            title: 'Not Deleted!',
            text: 'Vendor Master ' + dataObj.name + '  has not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer
          }
          );
        }
      }, (err) => {
        this.spinnerFlag = false;
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

}
