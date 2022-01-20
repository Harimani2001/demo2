import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { Urs, Category, CheckListEquipmentDTO } from '../../../models/model';
import { Permissions } from '../../../shared/config';
import { ConfigService } from '../../../shared/config.service';
import { Helper } from '../../../shared/helper';
import { CategoryService } from '../../category/category.service';
import { FileUploadForDocComponent } from '../../file-upload-for-doc/file-upload-for-doc.component';
import { FormExtendedComponent } from '../../form-extended/form-extended.component';
import { MasterControlService } from '../../master-control/master-control.service';
import { priorityService } from '../../priority/priority.service';
import { UrsService } from '../urs.service';
import { ComplianceAssesmentModalComponent } from '../../compliance-assesment-modal/compliance-assesment-modal.component';

@Component({
  selector: 'app-add-urs',
  templateUrl: './add-urs.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./add-urs.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})

export class AddUrsComponent implements OnInit, OnDestroy {
  @ViewChild('formExtendedId') private formExtendedComponent: FormExtendedComponent;
  @ViewChild('fileupload') private file: FileUploadForDocComponent;
  @ViewChild('complianceAssesmentModal') complianceAssesmentModal:ComplianceAssesmentModalComponent;
  public inputField: any = [];
  ursSpinnerFlag = false;
  modal: Urs = new Urs();
  editorSwap: boolean = false;
  submitted: boolean = false;
  valadationMessage: string;
  categoryList: any;
  priorityList: any = new Array();
  receivedId: string;
  public editor;
  model: Permissions = new Permissions(this.helper.URS_VALUE, false);
  returnColor: any = '';
  addCatModal: Category = new Category();
  submittedCategory: boolean = false;
  isCheckListEntered: boolean = false;
  redirctUrlFormUrsView: any;
  potentialList: any;
  implemenationList: any;
  testingMethodList: any;
  complianceRequirements:any[]=new Array();
  dropdownSettings = {
    singleSelection: false,
    text: "Select Compliance Requirements",
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    classes: "myclass custom-class",
  };
  constructor(private comp: AdminComponent, public permissionService: ConfigService,
    public helper: Helper, public routers: Router, public ursService: UrsService,
    public categoryService: CategoryService, public priorityService: priorityService,
    public router: ActivatedRoute, private masterControlService: MasterControlService) {
    this.permissionService.loadPermissionsBasedOnModule(this.helper.URS_VALUE).subscribe(resp => {
      this.model = resp;
    });
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.ursSpinnerFlag = true;
    this.loadCategory();
    this.loadComplianceRequirements();
    this.permissionService.HTTPPostAPI({ "categoryName": "URSPotentialRisk", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.potentialList = result.response;
    });

    this.permissionService.HTTPPostAPI({ "categoryName": "URSImplementationMethod", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.implemenationList = result.response;
    });

    this.permissionService.HTTPPostAPI({ "categoryName": "URSTestingMethod", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.testingMethodList = result.response;
    });
    this.priorityService.loadAllPriority().subscribe(response => {
      this.priorityList = response.result;
    });
    this.router.queryParams.subscribe(query => {
      if (query.redirectUrl) {
        this.redirctUrlFormUrsView = query.redirectUrl;
      }
    });
    this.receivedId = this.router.snapshot.params["id"];
    if (this.receivedId !== undefined) {
      this.ursService.getDataForEdit(this.receivedId).subscribe(result => {
        if (result.result.jsonExtraData != null && result.result.jsonExtraData != '[]')
          this.inputField = JSON.parse(result.result.jsonExtraData);
        this.modal = result.result;
        this.selectOption(this.modal.priority)
        if (!this.helper.isEmpty(this.modal.description) && (this.modal.description.includes('<p>')))
          this.editorSwap = true;
        this.file.loadFileListForEdit(this.receivedId, this.modal.ursCode).then(() => this.ursSpinnerFlag = false);
      });
    } else {
      this.masterControlService.loadJsonOfDocumentIfActive(this.helper.URS_VALUE).subscribe(res => {
        if (res != null) {
          this.inputField = JSON.parse(res.jsonStructure);
          this.formExtendedComponent.setDefaultValue(this.inputField);
        }
      });
      this.modal.potentialRisk = "None";
      this.loadTestCaseTypes();
      this.ursSpinnerFlag = false;
      this.modal.testingRequired=true;
      this.permissionService.HTTPPostAPI({ "categoryName": "URSTestingMethod", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
        this.testingMethodList = result.response;
        this.onTestingRequired();
      });
    }
    this.comp.setUpModuleForHelpContent(this.helper.URS_VALUE);
  }

  loadCategory() {
    this.categoryService.loadCategory().subscribe(response => {
      this.categoryList = response.result;
    });
  }

  loadComplianceRequirements() {
    this.permissionService.HTTPGetAPI("complianceAssessment/loadAllCompliancesForUrs").subscribe(response => {
      this.complianceRequirements = response.result.map(option => ({ id: option.id, itemName: option.category }));;
    });
  }

  openSuccessUpdateSwal(formIsValid) {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    if (!formIsValid || !this.formExtendedComponent.validateChildForm() || this.modal.category == 0 || this.modal.priority == 0 || this.isCheckListEntered) {
      this.submitted = true;
      this.ursSpinnerFlag = false;
      return;
    } else {
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
            let userRemarks = "Comments : " + value;
            this.saveAndGoto(formIsValid, userRemarks);
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
  }


  /**
   * @param formIsValid => boolean to check form is valid or not
   */
  saveAndGoto(formIsValid, userRemarks?) {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    this.ursSpinnerFlag = true;
    if (!formIsValid || !this.formExtendedComponent.validateChildForm() || this.modal.category == 0 || this.modal.priority == 0 || this.isCheckListEntered) {
      this.submitted = true;
      this.ursSpinnerFlag = false;
      return;
    }
    else {
      if (this.receivedId) {
        this.modal.id = + this.receivedId;
      } else {
        this.modal.id = 0;
      }
      this.modal.userRemarks = userRemarks;
      this.modal.jsonExtraData = JSON.stringify(this.inputField);
      this.ursService.saveAndGoto(this.modal).subscribe(result => {
        this.submitted = false;
        this.ursSpinnerFlag = false;
        this.file.uploadFileList(result.dto, this.helper.URS_VALUE, result.dto.ursCode).then(re => {
          if (result.result === "success") {
            if (!this.receivedId) {
              swal({
                title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
                text: 'User Requirement Specification Saved Successfully',
                onClose: () => {
                  this.ursSpinnerFlag = false;
                  if (this.redirctUrlFormUrsView)
                    this.routers.navigate([this.redirctUrlFormUrsView]);
                  else
                    this.routers.navigate(["/URS/view-urs"]);
                }
              });
            } else {
              swal({
                title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
                text: 'User Requirement Specification Updated Successfully',
                onClose: () => {
                  this.ursSpinnerFlag = false;
                  if (this.redirctUrlFormUrsView)
                    this.routers.navigate([this.redirctUrlFormUrsView]);
                  else
                    this.routers.navigate(["/URS/view-urs"]);
                }
              });
            }
          } else {
            if (result.result === "failure") {
              swal({
                title: 'Error', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
                text: ' User Requirement specification has not  been saved.',
              }
              );
            } else {
              swal({
                title: 'Warning', type: 'warning', timer: this.helper.swalTimer, showConfirmButton: false,
                text: result.result,
              }
              );
            }
          }
        },
          err => {
            this.submitted = false;
            this.ursSpinnerFlag = false;
            swal({
              title: 'Error', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
              text: ' User Requirement specification has not  been saved.',
            }
            );
          });
      }, err => {
        this.submitted = false;
        this.ursSpinnerFlag = false;
      });
    }
  }

  onClickClose() {
    if (this.redirctUrlFormUrsView)
      this.routers.navigate([this.redirctUrlFormUrsView]);
    else
      this.routers.navigate(["/URS/view-urs"]);
  }

  /**
   * 
   * @param quill => Quill editor input
   */
  onEditorCreated(quill) {
    this.editor = quill;
  }

  /**
   * Loading test case types
   */
  loadTestCaseTypes() {
    this.ursService.loadTestCaseTypes().subscribe(result => {
      this.modal.testCaseTypes = result.result;
    });
  }

  /**
   * @param flag => view or download
   * @param extention =>doc/docx
   */
  documentPreview(flag, extention) {
    this.ursSpinnerFlag = true;
    this.modal.downloadDocType = extention;
    this.ursService.loadPreviewDocument(this.modal).subscribe(resp => {
      this.ursSpinnerFlag = false;
      if (resp != null) {
        this.comp.previewByBlob(this.modal.ursCode + '.' + extention, resp, flag, 'User Requirement Specification Preview');
      }
    }, err => this.ursSpinnerFlag = false);
  }

  selectOption(data) {
    let filteredData: any;
    filteredData = this.priorityList.filter(res => Number(data) == res.id);
    if (!this.helper.isEmpty(filteredData))
      filteredData.forEach(element => {
        this.returnColor = element.priorityColor;
      });
    return this.returnColor;
  }

  onsubmit(addCategoryForm) {
    this.submittedCategory = true;
    if (addCategoryForm.valid) {
      this.categoryService.createCategory(this.addCatModal).subscribe(jsonResp => {
        let responseMsg = jsonResp.result;
        if (responseMsg === "success") {
          let mes = 'New category ' + this.addCatModal.categoryName + ' is created';
          this.loadCategory();
          addCategoryForm.reset();
          this.submittedCategory = false;
          swal({
            title: '',
            text: mes,
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });
        } else if (responseMsg === "failure") {
          this.submitted = false;
          swal({
            title: '',
            text: 'Something went Wrong ...Try Again',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          })
        } else {
          swal({
            title: 'Duplicate Record',
            text: responseMsg,
            type: 'info',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          })
        }
      },
        err => {
          swal({
            title: 'error',
            text: 'Something went Wrong ...Try Again',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          })
        }
      );
    }
  }
  /**
     * Checklist
     */
  addChecklistItem() {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    if (!this.isCheckListEntered) {
      let data = new CheckListEquipmentDTO();
      data.id = 0;
      data.checklistName = "";
      data.displayOrder = this.modal.checklist.length + 1;
      this.modal.checklist.push(data);
    }
    setTimeout(() => {
      $('#check_list_name_id_' + (this.modal.checklist.length - 1)).focus();
    }, 600);
  }

  onChangecheckList() {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName))
        this.isCheckListEntered = true;
    });
  }

  deleteCheckList(data) {
    this.modal.checklist = this.modal.checklist.filter(event => event !== data);
  }

  onTestingRequired() {
    if (this.modal.testingRequired) {
      this.modal.implementationMethod = "Out of box";
      this.onChangePotentialAndImplemenation();
    } else {
      this.modal.implementationMethod = "";
      this.modal.testingMethod = "";
    }
  }

  onChangePotentialAndImplemenation() {
    if (this.modal.implementationMethod === 'Custom' && this.modal.potentialRisk === 'High') {
      this.modal.testingMethod = this.testingMethodList[0].key;
    } else if (this.modal.implementationMethod === 'Configured' && this.modal.potentialRisk === 'High') {
      this.modal.testingMethod = this.testingMethodList[0].key;
    } else {
      this.modal.testingMethod = this.testingMethodList[1].key;
    }
  }

  onClickCompliance(){
    this.complianceAssesmentModal.viewModal();
  }
  onSubmitComplianceAssesment(event){
    this.modal.complianceRequirements=event.map(option => ({ id: option.id, itemName: option.category }));
  }
}
