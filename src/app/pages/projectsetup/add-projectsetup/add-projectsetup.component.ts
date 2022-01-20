import { ModalBasicComponent } from './../../../shared/modal-basic/modal-basic.component';
import { GxpComponent } from './../gxp/gxp.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker/dist';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { JsonResponse, ProjectSetup, ProjectSetupSystemDescriptionDTO, CheckListEquipmentDTO, ProjectStatusDTO, VendorMaster, StepperClass } from '../../../models/model';
import { ConfigService } from '../../../shared/config.service';
import { projectPlanSetupErrorTypes } from '../../../shared/constants';
import { Helper } from '../../../shared/helper';
import { DateFormatSettingsService } from '../../date-format-settings/date-format-settings.service';
import { DepartmentService } from '../../department/department.service';
import { EquipmentService } from '../../equipment/equipment.service';
import { FileUploadForDocComponent } from '../../file-upload-for-doc/file-upload-for-doc.component';
import { FormExtendedComponent } from '../../form-extended/form-extended.component';
import { LocationService } from '../../location/location.service';
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { MasterControlService } from '../../master-control/master-control.service';
import { UserService } from '../../userManagement/user.service';
import { ProjectUrlChecklistComponent } from '../project-url-checklist/project-url-checklist.component';
import { projectsetupService } from '../projectsetup.service';
import { ProjectChecklistComponent } from '../../project-checklist/project-checklist.component';
import { VendorMasterService } from '../../vendor-master/vendor-master.service';
import { veificationHistoryComponent } from '../../veification-history/veification-history.component';
import { TemplatelibraryService } from '../../templatelibrary/templatelibrary.service';
import { resolve } from 'url';
import { AddDocumentWorkflowComponent } from '../../add-document-workflow/add-document-workflow.component';
import { DocumentWorkflowHistoryComponent } from '../../document-workflow-history/document-workflow-history.component';
@Component({
  selector: 'app-add-projectsetup',
  templateUrl: './add-projectsetup.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./add-projectsetup.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
})
export class AddProjectsetupComponent implements OnInit, AfterViewInit {
  @ViewChild('fileupload') private file: FileUploadForDocComponent;
  @ViewChild('viewFileupload') private viewFileupload: FileUploadForDocComponent;
  @ViewChild('startDateModal') startDateModal: any;
  @ViewChild('endDateModal') endDateModal: any;
  @ViewChild('formExtendedId') private formExtendedComponent: FormExtendedComponent;
  @ViewChild('departmentSelect') private departmentSelect: any;
  @ViewChild('startDateElement') startDateElement: any;
  @ViewChild('endDateElement') endDateElement: any;
  @ViewChild('formWizard') formWizard: any;
  @ViewChild('checkListURLId') checkListURLId: ProjectUrlChecklistComponent;
  @ViewChild('gxpFORM') gxpFormComponent: GxpComponent;
  @ViewChild('sendGxPMailModal') sendGxPMailModal: ModalBasicComponent;
  @ViewChild('projectCheckList') projectCheckList: ProjectChecklistComponent;
  @ViewChild('projectStatusModal') projectStatusModal: any;
  @ViewChild('addSupplierModal') addSupplierModal: any;
  @ViewChild('verificationHistoryModal') verificationHistoryModal: veificationHistoryComponent;
  @ViewChild('addDocumentWorkFlow') addDocumentWorkFlow:AddDocumentWorkflowComponent;
  projectName;
  validationStatusList = new Array();
  systemStatusList = new Array();
  hostingTypeList = new Array();
  vendorMasterList = new Array();
  refreshWizard = true;
  data: any;
  spinnerFlag: boolean = false;
  modal: ProjectSetup = new ProjectSetup();
  projectStatusDTO: ProjectStatusDTO = new ProjectStatusDTO();
  editorSwap = false;
  departmentlist: any;
  editorSwappurposescope = false;
  toggleEditordescriptionvar = false;
  toggleValidationStrategy = false;
  toggleAcceptenceCriteria = false;
  simpleOptionCCF: Array<IOption> = new Array<IOption>();
  settings = {
    singleSelection: false,
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    classes: "myclass custom-class",
  };
  locationList: any[] = new Array();
  simpleOptionDepartment: any[] = new Array();
  response: JsonResponse;
  submitted: boolean = false;
  valadationMessage: string;
  errorMessage: string;
  receivedId: string;
  isUpdate: boolean = false;
  isSave: boolean = false;
  checkBoxArray: String[] = new Array();
  form: any;
  userList: Array<IOption> = new Array<IOption>();
  departmentList: any[] = new Array();
  validationMessage: string = '';
  public docItemList: any;
  editing = {};
  step1ShowNext: boolean = false;
  step2ShowNext: boolean = false;
  step3ShowNext: boolean = false;
  stepGXPNext: boolean = false;
  isCompleted: boolean = false;
  startDate: any;
  endDate: any;
  vsrNextReviewDate: any;
  minDate: any = { year: 0, month: 0, day: 0 };
  equipmentList: any;
  public inputField: any = [];
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };
  public onSystemDescription: FormGroup;
  systemDescriptionDTO: ProjectSetupSystemDescriptionDTO = new ProjectSetupSystemDescriptionDTO();
  fileFlag: boolean = true;
  checkListFlag: boolean = true;
  typeList: any[] = new Array();
  applicableList: any[] = new Array();
  systemList: any[] = new Array();
  datePipeFormat = 'dd-MM-yyyy';
  projectWizardId: any;
  title: string = 'Create Project';
  simpleOptionBusinessOwner: any[] = new Array();
  gxpForm: boolean = false;
  gampCategoriesList: any[] = new Array();
  isCheckListEntered: boolean = false;
  projectChecklistStatus: string = "";
  dropdownSettings = {
    singleSelection: false,
    text: "Select Users",
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
  };
  dropdownLocationSettings = {
    singleSelection: false,
    text: "Select",
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
  };
  selectedUsersForEmail: any[] = new Array();
  remarksForEmail: any = "";
  projectChecklistPercentage: number;
  projectTypeList: any[] = new Array();
  checklistFlag: boolean = false;
  sopFilesFlag: boolean = false;
  referenceFlag: boolean = false;
  isGxpImportprojects: boolean = false;
  public supplierForm: FormGroup;
  supplierModal: VendorMaster = new VendorMaster();
  submitSupplierForm: boolean = false;
  gxpUserList: any = new Array();
  isGxpPublished:boolean=false;
  isGxpWorkflowCompleted:boolean=false;
  isGxpWorkflowAdded:boolean=false;
  @ViewChild('documentWorkFlowHistory') documentWorkFlowHistory:DocumentWorkflowHistoryComponent;
  constructor(private datePipe: DatePipe, public service: projectsetupService, public router: Router, public helper: Helper,
    private route: ActivatedRoute, public deptService: DepartmentService, public lookUpService: LookUpService,
    private comp: AdminComponent, private configService: ConfigService, public equipmentService: EquipmentService,
    private userService: UserService, public projectPlanSetupErrorTypes: projectPlanSetupErrorTypes,
    public masterControlService: MasterControlService, private servie: DateFormatSettingsService, public fb: FormBuilder,
    public locationService: LocationService, public vendorMasterService: VendorMasterService,
    private templatelibraryService: TemplatelibraryService) { }

  ngOnInit() {
    this.loadvalidationAndSystemStatusList();
    this.loadOrgDateFormatAndTime();
    this.loadAllActiveLocations();
    this.loadGAMPCategories();
    this.spinnerFlag = true;
    this.loadCCF();
    this.loadDataOnEdit(this.helper.isEmpty(this.route.snapshot.queryParams["id"]) ? undefined : this.helper.decode(this.route.snapshot.queryParams["id"]), this.helper.isEmpty(this.route.snapshot.queryParams["tab"]) ? "" : this.helper.decode(this.route.snapshot.queryParams["tab"]));
    this.comp.setUpModuleForHelpContent("100");
    this.onSystemDescription = this.fb.group({
      equipmentId: [],
      type: [],
      softwareName: [],
      softwareVersion: [],
      use: [],
      gxpCriticality: [],
      erApplicability: [],
      esApplicability: [],
      supplierName: [],
      hostingType: [],
      typeOfSystem: [],
      validationStrategy: [],
      acceptanceCriteria: [],
      gxpForm: [false],
      gampId: [0]
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("ProjectSetupType").subscribe(resp => {
      this.projectTypeList = resp.response;
    });
    // supplier form
    this.supplierForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(this.helper.email_pattern)])]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      $('#projectName').focus();
    }, 1000);
  }

  loadGAMPCategories() {
    this.configService.HTTPPostAPI({ projectId: 0 }, 'projectsetup/loadGAMPCategories').subscribe(resp => {
      this.gampCategoriesList = resp
    }, err => {
      this.gampCategoriesList = new Array();
    });
  }

  loadDataOnEdit(id, tab?) {
    if (id) {
      this.service.editproject(id).subscribe(jsonResp => {
        if (jsonResp.result == 'success' && jsonResp.data) {
          this.modal = jsonResp.data;
          this.projectName = this.modal.projectName;
          this.onChangeLocation(this.modal.selectedLocations);
          if (jsonResp.data.systemDescription) {
            this.gxpForm = jsonResp.data.systemDescription.gxpForm;
          }
          if (this.modal.jsonExtraData && this.modal.jsonExtraData != '[]') {
            this.inputField = JSON.parse(this.modal.jsonExtraData);
          } else {
            this.laodJsonStrucutre(this.modal.id);
          }
          this.modal.changeControlForms = this.modal.changeControlForms.map(d => +d);
          let startdateString: any
          if (this.modal.startDate) {
            startdateString = JSON.parse(this.modal.startDate);
            if (startdateString != null) {
              this.startDate = { date: { year: startdateString.year, month: startdateString.month, day: startdateString.day } };
              this.step1ShowNext = true;
            }
          }
          if (this.modal.endDate) {
            startdateString = JSON.parse(this.modal.endDate);
            if (startdateString != null) {
              this.endDate = { date: { year: startdateString.year, month: startdateString.month, day: startdateString.day } };
            }
          }
          this.onChangeFromDate()
          if (this.modal.vsrNextReviewDate) {
            startdateString = JSON.parse(this.modal.vsrNextReviewDate);
            if (startdateString != null) {
              this.vsrNextReviewDate = { date: { year: startdateString.year, month: startdateString.month, day: startdateString.day } };
            }
          }

          this.enableEditor(this.modal)
          this.getDeptUsers(this.modal.selectedDepartments);
          this.route.queryParams.forEach(q => {
            if (q.tab && this.helper.decode(q.tab) == 'gxp') {
              let count = setInterval(() => {
                if (this.formWizard) {
                  this.formWizard.next();
                  this.formWizard.next();
                  if (q.external && this.helper.decode(q.external) == 'true') {
                    this.formWizard._steps[0].isDisabled = true;
                    this.formWizard._steps[1].isDisabled = true;
                    this.formWizard._steps[3].isDisabled = true;
                    this.formWizard._steps[4].isDisabled = true;
                  }
                  clearInterval(count);
                }
              }, 600);
            }
          })
          if (tab) {
            this.loadGxPStatus(id).then(re =>{
              let count = setInterval(() => {
                if (this.formWizard) {
                  debugger
                  switch (tab) {
                    case 'gxp':
                      this.onStepGXPFORMNext();
                      break;
                    case 'workflow':
                      this.onStep2Next();
                      if (!this.gxpForm) {
                        this.formWizard.next();
                        this.formWizard.next();
                      }else {
                        this.formWizard.next();
                        this.formWizard.next();
                        if(this.isGxpWorkflowCompleted)
                          this.formWizard.next();
                      }
                      break;
                  }
                  clearInterval(count);
                }
              });
            });
          }
          this.configService.HTTPGetAPI("pdfSetting/loadPdfSettingsForGXPClone/" + id).subscribe(resp => {
            this.isGxpImportprojects = resp.result.length > 0;
          });
        }
        else
          this.modal = new ProjectSetup();
        this.spinnerFlag = false;
      });
    } else {
      this.laodJsonStrucutre(this.modal.id);
      this.spinnerFlag = false;
      this.modal.projectType = "Computer System Validation";
    }
  }

  loadvalidationAndSystemStatusList() {
    this.configService.HTTPPostAPI({ "categoryName": "projectSetupValidationStatus", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.validationStatusList = result.response;
      if (this.modal.id === 0 && this.validationStatusList.length > 0)
        this.modal.validationStatus = this.validationStatusList[0].value;
    });
    this.configService.HTTPPostAPI({ "categoryName": "projectSetupSystemStatus", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.systemStatusList = result.response;
      if (this.modal.id === 0 && this.systemStatusList.length > 0)
        this.modal.systemStatus = this.systemStatusList[0].value;
    });
    this.configService.HTTPPostAPI({ "categoryName": "projectSetupHostingType", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.hostingTypeList = result.response;
    });
    this.loadVendorList();
  }

  loadVendorList() {
    this.vendorMasterService.loadVendorMaster().subscribe(res => {
      this.vendorMasterList = res.data;
    });
  }

  onClickProjectStatusModal() {
    this.projectStatusDTO = new ProjectStatusDTO();
    this.projectStatusDTO.projectId = this.modal.id;
    this.projectStatusDTO.validationStatus = this.modal.validationStatus;
    this.projectStatusDTO.systemStatus = this.modal.systemStatus;
    this.projectStatusDTO.comments = "";
    this.projectStatusModal.show();
  }

  saveStatus() {
    this.spinnerFlag = true;
    this.configService.HTTPPostAPI(this.projectStatusDTO, "projectsetup/saveProjectsetupStatus").subscribe(resp => {
      this.modal.validationStatus = this.projectStatusDTO.validationStatus;
      this.modal.systemStatus = this.projectStatusDTO.systemStatus;
      this.spinnerFlag = false;
      this.projectStatusModal.hide();
    });
  }
  onCloseProjectStatusModal() {
    this.modal.validationStatus = this.projectStatusDTO.validationStatus;
    this.modal.systemStatus = this.projectStatusDTO.systemStatus;
    this.projectStatusModal.hide();
  }
  loadAllActiveLocations() {
    this.locationService.loadAllActiveLocations().subscribe(jsonResp => {
      this.locationList = jsonResp.result.map(m => ({ id: m.id, itemName: m.name }));
    });
  }

  onChangeLocation(data: any[]) {
    this.departmentList = new Array();
    this.spinnerFlag = false;
    if (data) {
      let i = 1
      data.forEach(e => {
        e.displayOrder = i++;
      })
      let ids = data.map(m => m.id);
      this.deptService.loadDepartmentsbyMultipleLocations(ids).subscribe(jsonResp => {
        this.departmentList = jsonResp.result;
        this.simpleOptionDepartment = jsonResp.result.map(m => ({ id: m.id, itemName: m.departmentName }));
        this.getDeptUsers(this.modal.selectedDepartments);
      })
    }
  }

  loadAllEquipments() {
    this.spinnerFlag = true;
    this.equipmentList = new Array();
    let locations = this.modal.selectedLocations.map(f => f.id);
    this.equipmentService.loadActiveEquipmentsForLocations(locations).subscribe(response => {
      this.spinnerFlag = false;
      if (response.result != null) {
        this.equipmentList = response.result;
      }
    }, error => { this.spinnerFlag = false });
  }

  onChangeEquipment(event) {
    this.systemDescriptionDTO.equipmentNo = "";
    this.systemDescriptionDTO.equipmentMake = "";
    if (event) {
      for (let data of this.equipmentList) {
        if (data.id === +event) {
          this.systemDescriptionDTO.equipmentNo = data.code;
          this.systemDescriptionDTO.equipmentMake = data.manufacturer;
          break;
        }
      }
    }
  }

  loadCCF() {
    this.configService.loadChangeControlFormDropDown().subscribe(resp => {
      this.simpleOptionCCF = resp.map(option => ({ value: +option.key, label: option.value }));
    })
  }

  enableOfCustomCCF() {
    this.modal.customCCFEnable = !this.modal.customCCFEnable;
    this.modal.changeControlForms = []
    this.modal.customCCFValue = '';
  }

  showNext = (() => {
    return () => {
      setTimeout(() => {
        this.validationMessage = "";
        if (!this.helper.isEmpty(this.modal.projectName) && this.projectName != this.modal.projectName) {
          this.service.isExistsProjectName(this.modal.projectName).subscribe(
            jsonResp => {
              let responseMsg: boolean = jsonResp;
              if (responseMsg == true) {
                this.validationMessage = this.projectPlanSetupErrorTypes.validationMessage;
              } else {
                this.validationMessage = "";
              }
            }
          );
        } else {

        }
      }, 600);
    }
  })();

  openSuccessCancelSwal(type, dataObj) {
    this.submitted = true;
    if (dataObj.valid && this.checkListURLId.validateList(this.systemDescriptionDTO.urlChecklist)) {
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
            if (type == "tab1")
              this.onsubmit(dataObj.valid, userRemarks);
            else if (type == "tab2")
              this.saveSystemDescription(userRemarks);
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

  onsubmit(formIsValid, userRemarks?) {
    if (!formIsValid || this.validationMessage != '' || !this.formExtendedComponent.validateChildForm() || this.modal.selectedLocations.length == 0 || this.modal.selectedDepartments.length == 0) {
      this.submitted = true;
      return;
    } else {
      this.spinnerFlag = true;
      this.modal.startDate = null;
      this.modal.endDate = null;
      if (this.startDate)
        this.modal.startDate = JSON.stringify(this.startDate.date);

      if (this.endDate)
        this.modal.endDate = JSON.stringify(this.endDate.date);

      this.modal.userRemarks = userRemarks;
      if (this.vsrNextReviewDate)
        this.modal.vsrNextReviewDate = JSON.stringify(this.vsrNextReviewDate.date);
      this.modal.jsonExtraData = JSON.stringify(this.inputField);
      for (let index = 0; index < this.modal.selectedLocations.length; index++) {
        this.modal.selectedLocations[index].displayOrder = index + 1;
      }
      this.modal.departmentName = "";
      this.simpleOptionDepartment.forEach(d1 => {
        this.modal.selectedDepartments.forEach(d2 => {
          if (d2.id == d1.id) {
            this.modal.departmentName += d1.itemName + ",";
          }
        });
      });
      if (!this.modal.customCCFEnable)// for audit in backend for list of CCF if the customCCF is not there
        this.modal.customCCFValue = this.simpleOptionCCF.filter(d => this.modal.changeControlForms.includes('' + d.value)).map(d => d.label).toString()
      this.service.createproject(this.modal, this.modal.createProjectUsingWizard).subscribe(jsonResp => {
        let responseMsg: string = jsonResp.result;
        if (responseMsg === "success") {
          this.step1ShowNext = true;
          this.spinnerFlag = false;
          if (this.modal.id == 0) {
            swal({
              title: 'Success',
              text: 'Project "' + this.modal.projectName + '" created successfully',
              type: 'success',
              timer: 2000, showConfirmButton: false
            });
          } else {
            swal({
              title: 'Success',
              text: 'Project "' + this.modal.projectName + '" updated successfully',
              type: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
          this.modal = jsonResp.data;
          if (this.modal.customCCFValue) {

          }
          this.comp.loadProjects();
          this.comp.loadCurrentUserDetails();
          this.onStep2Next();
          this.configService.HTTPGetAPI("pdfSetting/loadPdfSettingsForGXPClone/" + this.modal.id).subscribe(resp => {
            this.isGxpImportprojects = resp.result.length > 0;
          });
        } else {
          this.spinnerFlag = false;
          this.submitted = false;
          this.valadationMessage = responseMsg;
          swal({
            title: 'Error',
            text: 'Error in ' + (this.modal.id == 0 ? "saving" : "updating") + ' project ' + this.modal.projectName,
            type: 'error',
            timer: 2000, showConfirmButton: false
          })
        }
      }, err => { this.spinnerFlag = false });
    }
  }

  onStep1Next() {
    this.checkListURLId.reset();
    this.toggleValidationStrategy = false;
    this.toggleAcceptenceCriteria = false;
    window.scroll(0, 0);
    this.spinnerFlag = true;
    this.step2ShowNext = false;
    this.loadAllEquipments();
    this.lookUpService.getlookUpItemsBasedOnCategory("ProjectType").subscribe(res => {
      this.typeList = res.response;
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("ProjectApplicability").subscribe(res => {
      this.applicableList = res.response;
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("ProjectSystem").subscribe(res => {
      this.systemList = res.response;
    });
    this.loadSystemDescription(this.modal.id);
  }

  loadSystemDescription(projectId) {
    this.systemDescriptionDTO = new ProjectSetupSystemDescriptionDTO();
    this.service.loadSystemDescription(projectId).subscribe(response => {
      this.spinnerFlag = false;
      if (!this.helper.isEmpty(response.result)) {
        this.step2ShowNext = true;
        this.systemDescriptionDTO = response.result;
        this.file.loadFileListForEdit(this.systemDescriptionDTO.id, this.modal.projectName).then(() => this.spinnerFlag = false);
        this.onSystemDescription.get("equipmentId").setValue(this.systemDescriptionDTO.equipment);
        this.onSystemDescription.get("type").setValue(this.systemDescriptionDTO.type);
        this.onSystemDescription.get("softwareName").setValue(this.systemDescriptionDTO.softwareName);
        this.onSystemDescription.get("softwareVersion").setValue(this.systemDescriptionDTO.softwareVersion);
        this.onSystemDescription.get("use").setValue(this.systemDescriptionDTO.use);
        this.onSystemDescription.get("gxpCriticality").setValue(this.systemDescriptionDTO.gxpCriticality);
        this.onSystemDescription.get("erApplicability").setValue(this.systemDescriptionDTO.erApplicability);
        this.onSystemDescription.get("esApplicability").setValue(this.systemDescriptionDTO.esApplicability);
        this.onSystemDescription.get("typeOfSystem").setValue(this.systemDescriptionDTO.typeOfSystem);
        this.onSystemDescription.get("supplierName").setValue(this.systemDescriptionDTO.supplierName);
        this.onSystemDescription.get("hostingType").setValue(this.systemDescriptionDTO.hostingType);
        this.onSystemDescription.get("validationStrategy").setValue(this.systemDescriptionDTO.validationStrategy);
        this.onSystemDescription.get("acceptanceCriteria").setValue(this.systemDescriptionDTO.acceptanceCriteria);
        this.onSystemDescription.get("gxpForm").setValue(this.systemDescriptionDTO.gxpForm);
        this.gxpForm = this.systemDescriptionDTO.gxpForm;
        if (!this.gxpForm) {
          this.onSystemDescription.get("gampId").setValue(this.systemDescriptionDTO.gampId);
        }
        if (this.systemDescriptionDTO.validationStrategy != '' && this.systemDescriptionDTO.validationStrategy.search(/<*>/i) !== -1)
          this.toggleValidationStrategy = true;
        if (this.systemDescriptionDTO.acceptanceCriteria != '' && this.systemDescriptionDTO.acceptanceCriteria.search(/<*>/i) !== -1)
          this.toggleAcceptenceCriteria = true;
      } else {
        this.onSystemDescription.reset();
        this.onSystemDescription.get("equipmentId").setValue("");
        this.onSystemDescription.get("type").setValue("");
        this.onSystemDescription.get("softwareName").setValue("");
        this.onSystemDescription.get("softwareVersion").setValue("");
        this.onSystemDescription.get("use").setValue("");
        this.onSystemDescription.get("gxpCriticality").setValue("");
        this.onSystemDescription.get("erApplicability").setValue("");
        this.onSystemDescription.get("esApplicability").setValue("");
        this.onSystemDescription.get("typeOfSystem").setValue("");
        this.onSystemDescription.get("supplierName").setValue("");
        this.onSystemDescription.get("hostingType").setValue("");
        this.onSystemDescription.get("validationStrategy").setValue("");
        this.onSystemDescription.get("acceptanceCriteria").setValue("");
        this.onSystemDescription.get("gxpForm").setValue(false);
        this.systemDescriptionDTO.canDisableGxPForm = response.canDisableGxPForm;
      }
    });
  }

  onStep2Next() {
    this.comp.removeDraftOfProjectSetUp();
    if (this.modal.createdById == this.comp.currentUser.id)
      this.modal.editable = true;
    this.step3ShowNext = false;
    this.spinnerFlag = true;
    setTimeout(() => { this.step3ShowNext = true, this.spinnerFlag = false; }, 10);
  }

  public onStep3Next() {
    this.fileFlag = true;
    this.checkListFlag = true;
    this.comp.removeDraftOfProjectSetUp();
    this.step3ShowNext = false;
    setTimeout(() => { this.step3ShowNext = true, this.spinnerFlag = false; }, 10);
    this.spinnerFlag = true;
    this.service.loadProjectSummaryStepper3(this.modal.id).subscribe(resp => {
      this.loadProjectCheckListStatusCount();
      console.log(resp);
      if (resp.data.vsrNextReviewDate && resp.data.vsrNextReviewDate != "null") {
        let startdateString = JSON.parse(resp.data.vsrNextReviewDate);
        var today = new Date(startdateString.year, startdateString.month - 1, startdateString.day);
        resp.data.vsrNextReviewDate = this.datePipe.transform(today, this.datePipeFormat);
      } else {
        resp.data.vsrNextReviewDate = '';
      }
      try {
        if (resp.data.startDate) {
          let startdateString: any = JSON.parse(resp.data.startDate);
          var today = new Date(startdateString.year, startdateString.month - 1, startdateString.day);
          resp.data.startDate = this.datePipe.transform(today, this.datePipeFormat);
        } else {
          resp.data.startDate = "";
        }
      } catch (error) {
        resp.data.startDate = "";
      }

      try {
        if (resp.data.endDate) {
          let startdateString = JSON.parse(resp.data.endDate);
          today = new Date(startdateString.year, startdateString.month - 1, startdateString.day);
          resp.data.endDate = this.datePipe.transform(today, this.datePipeFormat);
        } else {
          resp.data.endDate = "";
        }
      } catch (error) {
        resp.data.endDate = "";
      }

      this.data = resp.data;
      var timer = setInterval(() => {
        if (this.viewFileupload) {
          this.viewFileupload.loadFileListForEdit(this.data.systemDescription.id, this.data.projectName).then((result) => {
            this.fileFlag = result;
            this.checkListURLId.loadProjectReferenceData(this.data.id).then((result) => {
              this.checkListFlag = result;
            })
          }).catch((err) => {
            this.spinnerFlag = false;
          });
          this.spinnerFlag = false;
          clearInterval(timer);
        }
      }, 600)
    });
  }

  public onStepGXPFORMNext() {
    this.stepGXPNext = false;
    setTimeout(() => { this.stepGXPNext = true }, 10);
  }

  enableEditor(modal) {
    if (modal.introduction != null && modal.introduction.search(/<*>/i) !== -1)
      this.editorSwap = true;
    if (modal.purposeAndScope != null && modal.purposeAndScope.search(/<*>/i) !== -1)
      this.editorSwappurposescope = true;
    if (modal.description != null && modal.description.search(/<*>/i) !== -1)
      this.toggleEditordescriptionvar = true;
  }

  loadProjectForWizard(id) {
    this.service.editproject(id).subscribe(jsonResp => {
      if (jsonResp.result == 'success') {
        this.projectWizardId = id;
        this.modal = jsonResp.data;
        this.modal.createProjectWizardId = jsonResp.data.id;
        this.modal.id = 0;
        this.modal.projectName = '';
        this.modal.projectCode = '';
        this.modal.startDate = '';
        this.modal.endDate = '';
        this.modal.createProjectUsingWizard = true;
        this.modal.customCCFEnable = true;
        this.enableEditor(this.modal)
        this.onChangeLocation(this.modal.selectedLocations);
        this.getDeptUsers(this.modal.selectedDepartments);
        this.modal.changeControlForms = this.modal.changeControlForms.map(d => '' + d);
      }
      else
        this.modal = new ProjectSetup();
      this.spinnerFlag = false;
    });
  }

  setProjectWizardSelectedDocs(data: any) {
    this.modal.selectedDocumnts = data;
  }

  openDatepicker(id) {
    id.toggle();
  }

  onStepChangedLoadData(event) {
    this.title = event.title;
    switch (event.title) {
      case 'Create Project':
        this.router.navigate(["Project-setup/add-projectsetup"], { queryParams: { id: btoa(""+this.modal.id)} });
        // this.spinnerFlag = true;
        // this.loadDataOnEdit(this.modal.id);
        break;
      case 'Summary':
        this.onStep3Next();
        break;
      case 'Document Workflow Setup':
        this.onStep2Next();
        break;
      case 'System Description':
        this.onStep1Next();
        break;
      case 'GxP Assessment':
        this.loadGxPStatus(this.modal.id);
        this.onStepGXPFORMNext();
        break;
    }
  }

  laodJsonStrucutre(id: number) {
    this.masterControlService.loadFormExtendOfTheProjectParticularDocument(id, this.helper.PROJECT_SETUP_VALUE).subscribe(res => {
      if (res != null)
        this.inputField = JSON.parse(res.jsonStructure);
    });
  }

  checkLocationDepartmentUserAreInWorkflow(event, list) {
    this.spinnerFlag = true;
    let deptIds = this.departmentList.filter(f => f.location === event.id).map(m => m.id);
    let json = { projectId: this.modal.id != 0 ? this.modal.id : this.projectWizardId, deptIds: deptIds }
    this.configService.HTTPPostAPI(json, "workflowConfiguration/checkDepartmentUserAreInWorkflow").subscribe(resp => {
      if (resp.result) {
        let listData = [];
        listData = list;
        listData.push(event);
        listData = listData.sort((a, b) => a.displayOrder - b.displayOrder);
        this.modal.selectedLocations = listData;
        this.onChangeLocation(this.modal.selectedLocations);
        swal({
          title: '',
          text: 'Location Departments Users are in Workflow',
          type: 'warning',
          timer: 2000, showConfirmButton: false,
          onClose: () => {
            this.spinnerFlag = false;
          }
        })
      } else {
        this.modal.selectedDepartments = this.modal.selectedDepartments.filter(f => !deptIds.includes(f.id));
        this.onChangeLocation(this.modal.selectedLocations);
        this.spinnerFlag = false;
      }
    }, err => this.spinnerFlag = false);
  }

  checkLocationDepartmentUserAreInWorkflowDeSelectAll(event: any[], list) {
    let eve = event.map(e => e.id);
    let deptIds = [];
    let locationIds = [];
    this.departmentList.filter(f => eve.includes(f.location)).forEach(m => {
      if (!locationIds.includes(m.location))
        locationIds.push(m.location);
      deptIds.push(m.id);
    });
    let json = { projectId: this.modal.id != 0 ? this.modal.id : this.projectWizardId, deptIds: deptIds }
    this.configService.HTTPPostAPI(json, "workflowConfiguration/checkDepartmentUserAreInWorkflow").subscribe(resp => {
      if (resp.result) {
        this.modal.selectedLocations = event.filter(f => locationIds.includes(f.id));
        this.onChangeLocation(this.modal.selectedLocations);
        swal({
          title: '',
          text: 'Location Departments Users are in Workflow',
          type: 'warning',
          timer: 2000, showConfirmButton: false,
          onClose: () => {
            this.spinnerFlag = false;
          }
        })
      } else {
        this.modal.selectedDepartments = this.modal.selectedDepartments.filter(f => !deptIds.includes(f.id));
        this.onChangeLocation(this.modal.selectedLocations);
        this.spinnerFlag = false;
      }
    }, err => this.spinnerFlag = false);
  }

  checkDepartmentUserAreInWorkflow(event: any, list: any) {
    if (this.modal.id != 0 || this.projectWizardId) {
      this.spinnerFlag = true;
      let deptIds = [];
      deptIds.push(event.id);
      let json = { projectId: this.modal.id != 0 ? this.modal.id : this.projectWizardId, deptIds: deptIds }
      this.configService.HTTPPostAPI(json, "workflowConfiguration/checkDepartmentUserAreInWorkflow").subscribe(resp => {
        if (resp.result) {
          list.push(event);
          this.modal.selectedDepartments = list;
          swal({
            title: '',
            text: 'Cannot be deleted as the Users from this department are mapped in workflow',
            type: 'warning',
            timer: 2000, showConfirmButton: false,
            onClose: () => {
              this.spinnerFlag = false;
            }
          })
        } else {
          this.spinnerFlag = false;
        }
      });
    }
  }

  pushToDMS(projectId) {
    this.spinnerFlag = true;
    this.service.pushToDms(projectId).subscribe(response => {
      this.spinnerFlag = false;
      if (response) {
        swal({
          title: 'Success',
          text: 'PDF uploaded successfully',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        swal({
          title: 'Error',
          text: 'Something went wrong please try again!',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    }, error => {
      this.spinnerFlag = false
    });
  }

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.myDatePickerOptions.dateFormat = result.datePattern.replace("YYYY", "yyyy");
        this.datePipeFormat = result.datePattern.replace("mm", "MM")
        this.startDateElement.setOptions();
        this.endDateElement.setOptions();
      }
    });
  }

  saveSystemDescription(userRemarks) {
    this.isCheckListEntered = false;
    this.systemDescriptionDTO.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    this.checkListURLId.submittedCheckList = true;
    if (this.onSystemDescription.valid && this.checkListURLId.validateList(this.systemDescriptionDTO.urlChecklist) && !this.isCheckListEntered) {
      this.spinnerFlag = true;
      this.systemDescriptionDTO.userRemarks = userRemarks;
      this.systemDescriptionDTO.projectSetup = this.modal.id;
      this.systemDescriptionDTO.equipment = this.onSystemDescription.get("equipmentId").value;
      this.systemDescriptionDTO.type = this.onSystemDescription.get("type").value;
      this.systemDescriptionDTO.softwareName = this.onSystemDescription.get("softwareName").value;
      this.systemDescriptionDTO.softwareVersion = this.onSystemDescription.get("softwareVersion").value;
      this.systemDescriptionDTO.use = this.onSystemDescription.get("use").value;
      this.systemDescriptionDTO.gxpCriticality = this.onSystemDescription.get("gxpCriticality").value;
      this.systemDescriptionDTO.erApplicability = this.onSystemDescription.get("erApplicability").value;
      this.systemDescriptionDTO.esApplicability = this.onSystemDescription.get("esApplicability").value;
      this.systemDescriptionDTO.typeOfSystem = this.onSystemDescription.get("typeOfSystem").value;
      this.systemDescriptionDTO.supplierName = this.onSystemDescription.get("supplierName").value;
      this.systemDescriptionDTO.hostingType = this.onSystemDescription.get("hostingType").value;
      this.systemDescriptionDTO.validationStrategy = this.onSystemDescription.get("validationStrategy").value;
      this.systemDescriptionDTO.acceptanceCriteria = this.onSystemDescription.get("acceptanceCriteria").value;
      this.systemDescriptionDTO.gxpForm = this.onSystemDescription.get("gxpForm").value;
      this.gxpForm = this.systemDescriptionDTO.gxpForm;
      this.systemDescriptionDTO.gampId = 0;
      this.systemDescriptionDTO.gampCategory = 'NA';
      if (!this.gxpForm) {
        this.systemDescriptionDTO.gampId = this.onSystemDescription.get("gampId").value;
        let gamp = this.gampCategoriesList.filter(f => f.id == this.systemDescriptionDTO.gampId);
        if (gamp.length > 0) {
          this.systemDescriptionDTO.gampCategory = gamp[0]['gampDesc'];
        }
      }
      this.service.saveSystemDescription(this.systemDescriptionDTO).subscribe(response => {
        this.spinnerFlag = false;
        this.file.uploadFileList(response.result, this.helper.PROJECT_SETUP_VALUE, this.modal.projectName).then(re => {
          if (this.systemDescriptionDTO.id === 0) {
            swal({
              title: 'Success',
              text: 'System Description Saved successfully',
              type: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          } else {
            swal({
              title: 'Success',
              text: 'System Description Updated successfully',
              type: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
        },
          err => {
            swal({
              title: 'Error', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
              text: ' System Description has not  been saved.',
            }
            );
          });
        this.step2ShowNext = true;
        this.systemDescriptionDTO = response.result;
      });
    } else {
      Object.keys(this.onSystemDescription.controls).forEach(field => {
        const control = this.onSystemDescription.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  openBtnClicked(select: any) {
    if (this.startDateElement && !this.startDateElement.showSelector)
      this.startDateElement.openBtnClicked();
    if (this.endDateElement && !this.endDateElement.showSelector)
      this.endDateElement.openBtnClicked();
  }

  onChangeFromDate() {
    if (this.endDate)
      this.startDateElement.opts.disableSince = this.endDate.date;
    if (this.startDate)
      this.endDateElement.opts.disableUntil = this.startDate.date;
  }

  getDeptUsers(data) {
    let deptId = data.map(m => m.id);
    if (!this.helper.isEmpty(deptId)) {
      this.userService.loadAllUserBasedOnDepartment(deptId).subscribe(jsonResp => {
        this.userList = jsonResp.result.map(option => ({ value: +option.key, label: option.value }));
        this.modal.systemOwnerId = this.userList.filter(f => ('' + this.modal.systemOwnerId).includes('' + f.value)).length > 0 ? this.modal.systemOwnerId : 0;
        this.simpleOptionBusinessOwner = jsonResp.result.map(m => ({ id: +m.key, itemName: m.value }));
        let selectedBusinessOwner: any[] = new Array();
        this.simpleOptionBusinessOwner.forEach(d1 => {
          this.modal.selectedBusinessOwner.forEach(d2 => {
            if (d1.id == d2.id) {
              selectedBusinessOwner.push(d1);
            }
          });
        });
        this.modal.selectedBusinessOwner = selectedBusinessOwner;
      })
    }
  }

  publishData() {
    this.spinnerFlag = true;
    this.modal.publishedFlag = true;
    let data = [];
    data.push(this.modal);
    this.service.publishProjects(data).subscribe(result => {
      this.spinnerFlag = false;
    });
  }

  navigatePrevious() {
    this.formWizard.previous();

  }

  navigateNext() {
    this.formWizard.next();
  }

  openEmailPopUp() {
    this.selectedUsersForEmail = new Array();
    this.remarksForEmail = '';
    this.sendGxPMailModal.show();
    let users: any = this.userList.map(option => ({ id: Number(option.value), itemName: option.label }));
    this.gxpUserList = new Array();
    this.gxpUserList = users;
  }

  cancelEmail() {
    this.sendGxPMailModal.hide();
    this.selectedUsersForEmail = new Array();
    this.remarksForEmail = '';
  }

  sendEmail() {
    if (this.selectedUsersForEmail && this.selectedUsersForEmail.length > 0) {
      this.sendGxPMailModal.spinnerShow();
      let json = {
        'projectId': this.modal.id,
        'userIds': this.selectedUsersForEmail.map(u => u.id),
        'remarks': this.remarksForEmail,
        'projectName': this.modal.projectName
      }
      this.configService.HTTPPostAPI(json, 'projectsetup/notifygxpform').subscribe(resp => {
        this.sendGxPMailModal.spinnerHide();
        if (resp.result == "success") {
          this.spinnerFlag = false;
          this.sendGxPMailModal.hide();
          swal({
            title: 'Success',
            text: 'Email Notifed Successfully',
            type: 'success',
            timer: 2000, showConfirmButton: false
          });
        } else {
          swal({
            title: 'Error',
            text: 'Email Notifed un-successfully',
            type: 'error',
            timer: 2000, showConfirmButton: false
          });
        }
      }, error => {
        this.sendGxPMailModal.spinnerHide();
        swal({
          title: 'Error',
          text: 'Email Notifed un-successfully',
          type: 'error',
          timer: 2000, showConfirmButton: false
        });
      })

    } else {
      return;
    }

  }
  /**
     * Checklist
     */
  addChecklistItem() {
    this.isCheckListEntered = false;
    this.systemDescriptionDTO.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    if (!this.isCheckListEntered) {
      let data = new CheckListEquipmentDTO();
      data.id = 0;
      data.checklistName = "";
      data.displayOrder = this.systemDescriptionDTO.checklist.length + 1;
      this.systemDescriptionDTO.checklist.push(data);
      setTimeout(() => {
        $('#check_list_name_id_' + (this.systemDescriptionDTO.checklist.length - 1)).focus();
      }, 600);
    }
  }

  onChangecheckList() {
    this.isCheckListEntered = false;
    this.systemDescriptionDTO.checklist.forEach(checkList => {
      if (this.configService.helper.isEmpty(checkList.checklistName))
        this.isCheckListEntered = true;
    });
  }

  deleteCheckList(data) {
    this.systemDescriptionDTO.checklist = this.systemDescriptionDTO.checklist.filter(event => event !== data);
  }

  onClickChecklistStatus() {
    this.projectCheckList.showModalView(this.modal.id);
  }

  loadProjectCheckListStatusCount() {
    this.configService.HTTPGetAPI("projectsetup/loadProjectCheckListStatusCount/" + this.modal.id).subscribe(res => {
      this.projectChecklistStatus = res.result;
      this.projectChecklistPercentage = res.percentage
    });
  }

  loadProjectCheckList() {
    this.spinnerFlag = true;
    this.configService.HTTPGetAPI("projectsetup/loadProjectCheckList/" + this.modal.id).subscribe(res => {
      this.projectCheckList = res;
      this.systemDescriptionDTO.checklist = res;
      this.spinnerFlag = false;
    });
  }

  saveSupplier() {
    this.submitSupplierForm = true;
    if (this.supplierForm.valid) {
      this.submitSupplierForm = false;
      this.spinnerFlag = true;
      this.supplierModal.code = this.supplierForm.get("code").value;
      this.supplierModal.name = this.supplierForm.get("name").value;
      this.supplierModal.email = this.supplierForm.get("email").value;
      this.supplierModal.activeFlag = "Y";
      this.vendorMasterService.createVendorMaster(this.supplierModal).subscribe(jsonResp => {
        this.spinnerFlag = false;
        if (jsonResp.result === "success") {
          this.loadVendorList();
          this.addSupplierModal.hide();
          swal({
            title: 'Success',
            text: 'Supplier is created',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          });
        } else {
          swal({
            title: 'Error',
            text: 'Something went Wrong ...Try Again',
            type: 'error',
            timer: this.helper.swalTimer
          })
        }
      }, err => {
        this.spinnerFlag = false;
      });
    }
  }

  onClickVerifyHistory() {
    this.verificationHistoryModal.showVerificationHistoryModal();
  }

  loadProjectForTemplateLibrary(filePath: any): Promise<void> {
    return new Promise<void>(resolve => {
      this.templatelibraryService.readTemplateLibraryFile(filePath).subscribe(jsonResp => {
        if (jsonResp.result === 'success' && jsonResp.projectInfo) {
          const projectInfo = jsonResp.projectInfo.projectDto;
          this.modal = projectInfo;
          this.showNext();
          this.modal.id = 0;
          this.modal.createProjectUsingWizard = false;
          this.modal.templateLibraryFilePath=filePath;
          this.modal.customCCFEnable = true;
          if (this.modal.startDate) {
            let dateArray = this.modal.startDate.split('-');
            if (dateArray.length == 3) {
              this.startDate = { date: { year: +dateArray[0], month: +dateArray[1], day: +dateArray[2] } };
              this.modal.startDate = JSON.stringify(this.startDate.date);
            }
          }
          if (this.modal.endDate) {
            let dateArray = this.modal.endDate.split('-');
            if (dateArray.length == 3) {
              this.endDate = { date: { year: +dateArray[0], month: +dateArray[1], day: +dateArray[2] } };
              this.modal.endDate = JSON.stringify(this.endDate.date);
            }
          }
          this.enableEditor(this.modal);
          this.onChangeLocation(this.modal.selectedLocations);
          this.getDeptUsers(this.modal.selectedDepartments);
          this.modal.changeControlForms = this.modal.changeControlForms.map(d => '' + d);
          this.modal.activeFlag = true;

          resolve();
        }
      }, error => {
        resolve();
      })
    })
  }
  loadGxPStatus(id){
    return new Promise<any>((resolve) => {
      this.configService.HTTPGetAPI("projectDocumentsFlow/isDocumentPublished/114/"+id).subscribe(resp =>{
        if(resp.publish)
          this.isGxpPublished=resp.publish;
        if(resp.workflow)
          this.isGxpWorkflowCompleted=resp.workflow;
          if(resp.isWorkflowAdded)
          this.isGxpWorkflowAdded=resp.isWorkflowAdded;
          resolve(true);
      });
    });
  }
  publishGxp(){
    this.spinnerFlag = true;
    this.configService.HTTPGetAPI("projectDocumentsFlow/publishDocument/114/"+this.modal.id).subscribe(resp =>{
      this.spinnerFlag = false;
      this.loadGxPStatus(this.modal.id);
      swal({
        title: 'Success',
        text: 'GxP has been published',
        type: 'success',
        timer: 2000, showConfirmButton: false
      });
    },err => {
      this.spinnerFlag = false
  });
  }
  onClickWorkflowHistory(){
    this.documentWorkFlowHistory.showModalView();
  }
  onCloseAddWorkflowModal(){
    this.loadGxPStatus(this.modal.id);
  }
  onClickWorkflow(){
    this.addDocumentWorkFlow.showModalView();
  }
}
