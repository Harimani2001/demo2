import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { FormEquipmentMapping, FormReports, UserPrincipalDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { EquipmentService } from '../equipment/equipment.service';
import { LocationService } from '../location/location.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { FormvsEquipmentService } from './form-equipment.service';
@Component({
  selector: 'app-form-equipment',
  templateUrl: './form-equipment.component.html',
  styleUrls: ['./form-equipment.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class FormEquipmentComponent implements OnInit {
  spinnerFlag = false;
  isViewPage: boolean = true;
  equipmentList: any;
  public onFormVSEquipment: FormGroup;
  formList: any[] = new Array();
  formReports: FormReports = new FormReports();
  equipment: Array<IOption> = new Array<IOption>();
  public simpleOptionStep: Array<IOption> = new Array<IOption>();
  modal: FormEquipmentMapping = new FormEquipmentMapping();
  data: any;
  permissionsfromlocalstorage: any;
  permissionModal: Permissions = new Permissions('168', false);
  public validationMessage: string = "";
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  public logFilterQuery = '';
  submitted: boolean = false;
  constructor(private configService: ConfigService, private comp: AdminComponent, public locationService: LocationService, public service: FormvsEquipmentService,
    public Eservice: EquipmentService, public helper: Helper, public fb: FormBuilder,
    public masterDynamicFormService: MasterDynamicFormsService, private routers: Router) { }

  ngOnInit() {
    this.configService.loadCurrentUserDetails().subscribe(result => {
      this.currentUser = result
    });
    this.comp.setUpModuleForHelpContent("168");
    this.comp.taskDocType = "168";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.onFormVSEquipment = this.fb.group({
      selectedEquipment: ['', Validators.compose([
        Validators.required
      ])],
      formId: ['', Validators.compose([
        Validators.required
      ])],
      steps: ['', Validators.compose([
        Validators.required
      ])],
    });
    this.masterDynamicFormService.loadFormOrMappedFormBasedOnProject(true).subscribe(result => {
      this.onFormVSEquipment.get("formId").setValue("");
      if (result != null)
        this.formList = result;
    });
    this.loadEquipment();
    this.loadAll();
    this.configService.loadPermissionsBasedOnModule("168").subscribe(resp => {
      this.permissionModal = resp
    });
  }

  loadAll() {
    this.spinnerFlag = true;
    this.locationService.loadStepList("LocationStep").subscribe(jsonResp => {
      this.simpleOptionStep = this.helper.cloneOptions(jsonResp.result);
    });
    this.service.loadAllEquipmentStatus().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.data = response.result;
      }
    }, error => { this.spinnerFlag = false });
  }

  loadEquipment() {
    this.onFormVSEquipment.get("selectedEquipment").setValue("");
    this.spinnerFlag = true;
    this.Eservice.loadEquipmentsByuser().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.equipment = response.result.map(option => ({ value: option.id, label: option.name }));
      }
    }, error => { this.spinnerFlag = false });
  }

  onChangeEquipment() {
    if (!this.helper.isEmpty(this.onFormVSEquipment.get("formId").value)) {
      this.service.loadEquipment(this.onFormVSEquipment.get("formId").value).subscribe(result => {
        if (result != null) {
        }
      });
    }
  }

  onEdit(data: FormEquipmentMapping) {
    this.modal = data;
    this.onFormVSEquipment.get("formId").setValue(this.modal.formId);
    this.onFormVSEquipment.get("selectedEquipment").setValue(this.modal.equipmentIds);
    this.onFormVSEquipment.get("steps").setValue(this.modal.stages);
    this.isViewPage = false;
  }

  onClickCancel() {
    this.isViewPage = true;
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
    let form = new FormEquipmentMapping();
    form.formId = dataObj.formId;
    form.stages = dataObj.stages;
    form.id = dataObj.id;
    form.userRemarks = dataObj.userRemarks;
    this.service.deleteEquipment(form)
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
            text: 'Equipment Log ' + dataObj.equipmentNames + '  has not been deleted.',
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
          text: 'Equipment Log ' + dataObj.equipmentNames + ' is not deleted...Something went wrong.',
          type: 'error',
          timer: 2000
        });
      });
    return status;
  }

  onClickSave(isValid) {
    this.submitted = true;
    if (isValid) {
      this.modal.organizationOfLoginUser = this.currentUser.orgId;
      this.modal.loginUserId = this.currentUser.id;
      this.modal.updatedBy = this.currentUser.id;
      if (this.modal.id == 0) {
        this.modal.createdBy = this.currentUser.id;
      }
      this.spinnerFlag = true;
      this.modal.formId = this.onFormVSEquipment.get("formId").value;
      this.modal.equipmentIds = this.onFormVSEquipment.get("selectedEquipment").value;
      this.modal.loginUserId = this.currentUser.id;
      this.modal.stages = this.onFormVSEquipment.get("steps").value;
      const form = this.formList.filter(f => f.key == this.modal.formId);
      if (form.length != 0) {
        form.forEach(element => {
          this.modal.mappingFlag = element.mappingFlag;
          this.modal.mappingId = +element.mappingId;
        });
      }
      this.service.saveEquipmentForForm(this.modal).subscribe(jsonResp => {
        this.spinnerFlag = false;
        this.submitted = false;
        let responseMsg: string = jsonResp.result;
        if (responseMsg === "success") {
          this.loadAll();
          this.onFormVSEquipment.reset();
          this.onFormVSEquipment.get("selectedEquipment").setValue("");
          this.onFormVSEquipment.get("formId").setValue("");
          this.onFormVSEquipment.get("steps").setValue("");
          swal({
            title: '',
            text: 'Data Saved Successfully',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          }
          )
          this.isViewPage = true;
        } else {
          swal({
            title: '',
            text: 'Something went Wrong ...Try Again',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          }
          )
          this.loadAll();
        }
      },
        err => {
          this.spinnerFlag = false
        }
      );
    }
  }

  onAdd() {
    this.isViewPage = false;
    this.onFormVSEquipment.reset();
    this.modal = new FormEquipmentMapping();
  }

}
