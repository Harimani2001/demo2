import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Shift,ComplianceAssessment } from '../../models/model';
import swal from 'sweetalert2';
import { Helper } from '../../shared/helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComplianceAssessmentService } from './compliance-assessment.service';
import { Permissions } from '../../shared/config';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';
import { complianceAssessmentErrorTypes } from '../../shared/constants';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { Page } from '../../models/model';


@Component({
  selector: 'app-compliance-assessment',
  templateUrl: './compliance-assessment.component.html',
  styleUrls: ['./compliance-assessment.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class ComplianceAssessmentComponent implements OnInit {

  @ViewChild('myTable') table: any;
  @ViewChild('categoryName') categoryName: any;
  public complianceAssessmentForm: FormGroup;
  data: any;
  modal: ComplianceAssessment = new ComplianceAssessment();
  page: Page = new Page();
  public rowsOnPage = 15;
  public filterQuery = '';
  spinnerFlag = false;
  isUpdate: boolean = false;
  locationList: any;
  equipmentList: any;
  permissionsfromlocalstorage: any;
  permissionModal: Permissions = new Permissions("143", false);
  isValidName: boolean = false;
  equipmentCategoryList=[];
  currentUser:any

  constructor(public permissionService: ConfigService, private comp: AdminComponent, public fb: FormBuilder, public service: ComplianceAssessmentService,
    public helper: Helper, public lookUpService: LookUpService,public complianceAssessmentErrorTypes: complianceAssessmentErrorTypes) { }

  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.size = 15;
    this.permissionService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
    })

    this.getEquipmentCategory();
    this.comp.setUpModuleForHelpContent("231");
    this.comp.taskDocType = "231";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.setPage({ offset: 0 });
    this.complianceAssessmentForm = this.fb.group({
      category: ['', Validators.compose([
        Validators.required
      ])],
      description: ['', Validators.compose([
        Validators.required
      ])],
      reference: ['', Validators.compose([
        Validators.required
      ])],
      active: ['', Validators.compose([
        Validators.required
      ])],
    });
    this.complianceAssessmentForm.get("active").setValue(true);
    this.permissionService.loadPermissionsBasedOnModule("231").subscribe(resp => {
      this.permissionModal = resp
    });
    var timer = setInterval(() => {
      if (this.categoryName) {
        this.categoryName.nativeElement.focus();
        clearInterval(timer);
      }
    })
  }

  onChangeName() {
    this.isValidName = false;
    this.data.forEach(element => {
      if (element.name === this.complianceAssessmentForm.get("name").value && this.modal.id != element.id) {
        this.isValidName = true;
      }
    });
  }

  onClickCancel() {
    this.isUpdate = false;
    this.modal = new ComplianceAssessment();
    this.complianceAssessmentForm.reset();
    this.complianceAssessmentForm.get("active").setValue(true);
  }

  loadAll() {
    this.spinnerFlag = true;
    this.service.loadComplianceAssessment(this.page.pageNumber).subscribe(response => {
      if (response.result != null) {
        this.page.totalElements = response.totalElements;
        this.page.totalPages = response.totalPages;
        this.data = response.list;
      }
      this.spinnerFlag = false
    }, error => { this.spinnerFlag = false });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.permissionService.getUserPreference(this.helper.COMPLIANCE_ASSESSMENT_VALUE).subscribe(res => {
      if (res.result)
        this.loadAll();
      else
        this.loadAll();
    });
  }

  editData(data: ComplianceAssessment) {
    this.isUpdate = true;
    this.modal = data;
    this.complianceAssessmentForm.get("active").setValue(data.status === 'Active' ? true : false);
    this.complianceAssessmentForm.get("category").setValue(data.category);
    this.complianceAssessmentForm.get("description").setValue(data.description);
    this.complianceAssessmentForm.get("reference").setValue(data.reference);
    var timer = setInterval(() => {
      if (this.categoryName) {
        this.categoryName.nativeElement.focus();
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
          this.deleteCompliance(dataObj);
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

  deleteCompliance(dataObj): string {
    let status = '';
    let data = new ComplianceAssessment();
    data.id = dataObj.id;
    data.userRemarks = dataObj.userRemarks;
    this.service.deleteComplianceAssessment(data)
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
            text: 'Compliance Assessment has not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer
          });
        }
      }, (err) => {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: 'Compliance Assessment has not been deleted.',
          type: 'error',
          timer: this.helper.swalTimer
        });
      });
    return status;
  }


  onClickSave() {
    let timerInterval;
    if (this.complianceAssessmentForm.valid) {
      if (!this.isValidName) {
        this.spinnerFlag = true;
        this.modal.category = this.complianceAssessmentForm.get("category").value;
        this.modal.description = this.complianceAssessmentForm.get("description").value;
        this.modal.reference = this.complianceAssessmentForm.get("reference").value
        if (this.complianceAssessmentForm.get("active").value)
          this.modal.status = "Y";
        else
          this.modal.status = "N";
        if(this.modal.reference==null)
          this.modal.reference='';
        this.service.createComplianceAssessment(this.modal).subscribe(jsonResp => {
          this.spinnerFlag = false;
          let responseMsg: string = jsonResp.result;
          if (responseMsg === "success") {
            this.complianceAssessmentForm.reset();
            this.complianceAssessmentForm.get("active").setValue(true);
            this.loadAll();
            let mes = 'New Compliance Assessment is created';
            if (this.isUpdate) {
              mes = "Compliance Assessment is updated";
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
      Object.keys(this.complianceAssessmentForm.controls).forEach(field => {
        const control = this.complianceAssessmentForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  getEquipmentCategory() {
    this.lookUpService.getlookUpItemsBasedOnCategory("complianceCategory").subscribe(response => {
      if (response.result == "success") {
        this.equipmentCategoryList = response.response;
      }
    });
  }

}
