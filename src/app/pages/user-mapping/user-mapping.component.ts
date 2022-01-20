import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { EquipmentUserMapping, templateBuilder } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { EquipmentService } from '../equipment/equipment.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { TemplateBuiderService } from '../templatebuilder/templatebuilder.service';
import { UserService } from '../userManagement/user.service';
import { UservsEquipmentService } from './user-mapping.service';

@Component({
  selector: 'app-user-mapping',
  templateUrl: './user-mapping.component.html',
  styleUrls: ['./user-mapping.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserMappingComponent implements OnInit {
  spinnerFlag = false;
  public onUserVSEquipment: FormGroup;
  userList: Array<IOption> = new Array<IOption>();
  equipmentList: any;
  permissionsfromlocalstorage: any;
  permissionModal: Permissions = new Permissions("175", false);
  permissionData: any = new Array<Permissions>();
  modal: EquipmentUserMapping = new EquipmentUserMapping();
  data: any[] = new  Array();
  id: number = 0;
  isViewPage: boolean = true;
  public templateModalArray: templateBuilder[] = new Array();
  templateViewData: any = "";
  logUserFilterQuery: any = '';
  constructor(public permissionService: ConfigService, private service: UservsEquipmentService, private userService: UserService, private comp: AdminComponent, public Eservice: EquipmentService, public helper: Helper, public fb: FormBuilder, public masterDynamicFormService: MasterDynamicFormsService, private tempService: TemplateBuiderService) {
    this.loadTemplateList();
  }

  ngOnInit() {
    this.permissionService.loadPermissionsBasedOnModule("175").subscribe(resp => {
      this.permissionModal = resp
    });
    this.comp.setUpModuleForHelpContent("175");
    this.onUserVSEquipment = this.fb.group({
      selectedUser: ['', Validators.compose([
        Validators.required
      ])],
      equipmentId: ['', Validators.compose([
        Validators.required
      ])],
      templateId: ['', Validators.compose([
        Validators.required
      ])],
    });
    this.onUserVSEquipment.get("equipmentId").enable();
    this.loadAllEquipments();
    this.loadUser();
    this.loadAll();
    this.id = 0;
  }

  loadAllEquipments() {
    this.spinnerFlag = true;
    this.Eservice.loadAllActiveEquipment().subscribe(response => {
      this.spinnerFlag = false;
      if (response.result != null) {
        this.equipmentList = response.result;
      }
    }, error => { this.spinnerFlag = false });
  }

  loadUser() {
    this.spinnerFlag = true;
    this.userService.loadAllUserBasedOnOrganization().subscribe(
      jsonResp => {
        if (jsonResp.result != null) {
          this.userList = jsonResp.result.map(option => ({ value: option.id, label: option.firstName + " " + option.lastName }));
        }
        this.spinnerFlag = false;
      }, err => { this.spinnerFlag = false; });
  }

  onClickSave() {
    this.spinnerFlag = true;
    this.modal.equipmentId = this.onUserVSEquipment.get("equipmentId").value;
    this.modal.userIds = this.onUserVSEquipment.get("selectedUser").value;
    this.modal.id = this.id;
    this.modal.templateId = this.onUserVSEquipment.get("templateId").value;
    this.service.saveEquipmentForUser(this.modal).subscribe(jsonResp => {
      this.spinnerFlag = false;
      let responseMsg: string = jsonResp.result;
      if (responseMsg === "success") {
        this.loadAll();
        this.onUserVSEquipment.reset();
        this.onUserVSEquipment.get("selectedUser").setValue("");
        this.onUserVSEquipment.get("equipmentId").setValue("");
        swal({
          title: '',
          text: 'User Mapped to Equipment Successfully',
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
        this.id = 0;
      }
    },
      err => {
        this.spinnerFlag = false
      }
    );
  }

  onClickCancel() {
    this.isViewPage = true;
    this.loadAll();
  }

  loadAll() {
    this.spinnerFlag = true;
    this.data = new  Array();
    this.service.loadAllEquipmentForUser().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null && response.result.length != 0) {
        this.data = response.result;
      }
    }, error => { this.spinnerFlag = false });
  }

  editData(data: EquipmentUserMapping) {
    this.modal = data;
    this.onUserVSEquipment.get("equipmentId").setValue(this.modal.equipmentId);
    this.onUserVSEquipment.get("selectedUser").setValue(this.modal.userIds);
    this.onUserVSEquipment.get("templateId").setValue(this.modal.templateId);
    this.onUserVSEquipment.get("equipmentId").disable();
    this.id = 1;
    this.isViewPage = false;
  }

  onChangeEquipment() {
    this.spinnerFlag = true;
    this.id = 0;
    this.modal.equipmentId = this.onUserVSEquipment.get("equipmentId").value;
    this.service.loadEquipment(this.modal).subscribe(result => {
      this.spinnerFlag = false;
      this.data.forEach(element => {
        if (this.modal.equipmentId == element.equipmentId)
          this.onUserVSEquipment.get("templateId").setValue(element.templateId);
      });
      if (result.result != null && result.result.length != 0) {
        this.id = 1;
        this.onUserVSEquipment.get("selectedUser").setValue(result.result);
      } else
        this.onUserVSEquipment.get("selectedUser").setValue("");
    });
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
    let form = new EquipmentUserMapping();
    form.equipmentId = dataObj.equipmentId;
    form.userRemarks = dataObj.userRemarks;
    this.service.deleteData(form).subscribe((response) => {
        let responseMsg: string = response.result;
        if (responseMsg === "success") {
          swal({
            title: 'Deleted!',
            text: dataObj.equipmentName + '  has been Deleted.',
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
            text: dataObj.equipmentName + '  has not been Deleted.',
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
          text: dataObj.equipmentName + 'is not Deleted...Something went wrong',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      });
    return status;
  }

  onAdd() {
    this.isViewPage = false;
    this.onUserVSEquipment.get("equipmentId").setValue("");
    this.onUserVSEquipment.get("selectedUser").setValue("");
    this.onUserVSEquipment.get("templateId").setValue("");
    this.onUserVSEquipment.get("equipmentId").enable();
    this.templateViewData = "";
  }

  loadTemplateList() {
    this.tempService.getEmailTemplateBasedOnOrgId().subscribe(result => {
      this.templateModalArray = result.data;
    });
  }

  loadTemplate(id) {
    this.templateViewData = "";
    this.templateModalArray.forEach(element => {
      if (element.id == id) {
        this.templateViewData = element.templateContent;
      }
    })
  }

}
