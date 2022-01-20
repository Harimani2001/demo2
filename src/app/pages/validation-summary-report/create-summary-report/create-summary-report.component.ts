import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDpOptions } from 'mydatepicker/dist';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { DocumentSummaryDTO, StepperClass, VsrDTO, ProjectSetup, ProjectStatusDTO } from '../../../models/model';
import { Permissions } from '../../../shared/config';
import { Helper } from '../../../shared/helper';
import { ModalBasicComponent } from '../../../shared/modal-basic/modal-basic.component';
import { DashBoardService } from '../../dashboard/dashboard.service';
import { DateFormatSettingsService } from '../../date-format-settings/date-format-settings.service';
import { FormExtendedComponent } from '../../form-extended/form-extended.component';
import { MasterControlService } from '../../master-control/master-control.service';
import { ProjectSummaryService } from '../../project-summary/project-summary.service';
import { UrlchecklistComponent } from '../../urlchecklist/urlchecklist.component';
import { WorkflowConfigurationService } from '../../workflow-configuration/workflow-configuration.service';
import { VsrService } from '../validation-summary.service';
import { CommonModel } from './../../../models/model';
import { ConfigService } from './../../../shared/config.service';
import { ProjectChecklistComponent } from '../../project-checklist/project-checklist.component';

@Component({
  selector: 'app-create-summary-report',
  templateUrl: './create-summary-report.component.html',
  styleUrls: ['./create-summary-report.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateSummaryReportComponent implements OnInit {
  @ViewChild('formExtendedId') private formExtendedComponent: FormExtendedComponent;
  @ViewChild('alertMessage') alertMessage: any;
  @ViewChild('datePicker') datePicker: any;
  @ViewChild('date') date: any;
  @ViewChild('relaseDateElement') relaseDateElement: any;
  @ViewChild('formWizard') formWizard: any;
  @ViewChild('wizardStep') wizardStep: any;
  @ViewChild('urlchecklist') urlchecklist: any;
  @ViewChild('checkListURL') checkListURL: UrlchecklistComponent;
  @ViewChild('myTable') myTable: any;
  @ViewChild('modalLargeWorkFlowProjectSummary') stepperListView: ModalBasicComponent;
  @ViewChild('shareGraphEmail') shareGraphEmail: any;
  @ViewChild('freezemodal') freezeModalData: any;
  @ViewChild('projectCheckList') projectCheckList: ProjectChecklistComponent;
  public inputField: any = [];
  public commonModel: CommonModel = new CommonModel();
  modal: VsrDTO = new VsrDTO();
  spinnerFlag: boolean = false;
  publishedFlag: boolean = false;
  saveButtonFlag: boolean = true;
  updateButtonFlag: boolean = false;
  editButtonFlag: boolean = false;
  receivedId: string = "";
  showCreation: boolean = true;
  showView: boolean = false;
  isAllDocLocked: boolean = false;
  public docItemList: any[] = new Array();
  selectedDocumentForPeriodic=false;
  public pendingDocs: any = new Array();
  public pendingworkflow: boolean;
  isLoading: boolean = false;
  viewData = [];
  public con: any = new Array();
  permissionModal: Permissions = new Permissions(this.helper.VSR_VALUE, false);
  validationExpiryDate:any;
  releaseDate:any;
  public myDatePickerOptions: IMyDpOptions = {
    disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
    dateFormat: 'dd.mm.yyyy',
  };
  title: string = 'Step 1';
  simpleOptionCCF: Array<IOption> = new Array<IOption>();
  referenceFlag: boolean = false;
  filteredDocumentSummaryList: DocumentSummaryDTO[];
  percentage: number = 0;
  progressBarColour: string;
  docName = "";
  public loadStepperList: any[] = new Array();
  docId: string;
  userList = new Array();
  graphRemarks: any;
  selectedUsersForEmail: any[] = new Array();
  dropdownSettings = {
    singleSelection: false,
    text: "Select Users",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    classes: "myclass custom-class",
  };
  isSubmitted: boolean = false;
  datePipeFormat = 'dd-MM-yyyy';
  documentlockDataLogs: any[] = new Array();
  documentConstantNameTemp: null;
  freezeData: any;
  projectChecklistStatus:string="";
  isProjectChecklistStatus:boolean=false;
  projectChecklistPercentage:number;
  validationStatusList = new Array();
  systemStatusList = new Array();
  validationStatus:any;
  systemStatus:any;
  projectModal:ProjectSetup=new ProjectSetup();
  @ViewChild('projectStatusModal') projectStatusModal:any;
  projectStatusDTO :ProjectStatusDTO=new ProjectStatusDTO();
  @ViewChild('revisionDocs') revisionDocs: any;
  viewList=new Array();
  constructor(public config: ConfigService, private http: Http, public projectSummaryService: ProjectSummaryService,
    private adminComponent: AdminComponent, public vsrService: VsrService, public helper: Helper, public route: ActivatedRoute,
    private router: Router, public datePipe: DatePipe, public dashboardService: DashBoardService, public workflowService: WorkflowConfigurationService,
    private masterControlService: MasterControlService, private configService: ConfigService, private servie: DateFormatSettingsService) {

  }

  ngOnInit() {
    this.loadCCF();
    this.loadvalidationAndSystemStatusList();
    this.loadOrgDateFormatAndTime();
    this.spinnerFlag = true;
    this.selectedDocumentForPeriodic=false;
    this.docItemList = new Array<any>();
    this.configService.HTTPPostAPI('0', 'workflowConfiguration/loadAllDocumentsForProject').subscribe(resp => {
      this.adminComponent.taskEquipmentId = 0;
      this.adminComponent.taskDocTypeUniqueId = "";
      this.adminComponent.taskDocType = this.helper.VSR_VALUE;
      this.configService.HTTPPostAPI(this.commonModel, "workFlow/loadDocumentsForUser").subscribe(response => {
        if ([] = response.pendingList)
          this.pendingworkflow = true;
      });
      this.docItemList = resp.filter(f => Number(f.key) != 137).map(m => ({ 'key': m.key, 'check': false, 'name': m.value, 'docLock': false }));
      this.loaddata();
      this.vsrService.getReportByProjectId().subscribe(response => {
        if (response.result === "success") {
          if (response.modal.jsonExtraData && response.modal.jsonExtraData != '[]'){
            this.inputField = JSON.parse(response.modal.jsonExtraData);
            response.modal.formData = JSON.parse(response.modal.jsonExtraData);
          } else {
            this.loadFormExtend();
          }
          this.modal = response.modal;
          this.modal.changeControlForms = this.modal.changeControlForms.map(d => '' + d);
          if (this.modal.validationExpiryDate) {
            this.validationExpiryDate = { date: JSON.parse(this.modal.validationExpiryDate) };
          }
          if (this.modal.releaseDate) {
            this.releaseDate = { date: JSON.parse(this.modal.releaseDate) };
          }
          
          this.stepperfunction(this.modal);
          this.viewData.push(response.modal);
          this.publishedFlag = this.modal.publishedFlag;
          this.showView = true;
          this.showCreation = false;
          this.editButtonFlag = true;
          this.loadProjectCheckListStatusCount();
          this.updateButtonFlag = true;
          this.saveButtonFlag = false;
          this.isAllDocLocked = true;
          this.modal.validationSummaryChildDto.forEach(e => {
            this.docItemList.forEach(f => {
              if (f.key == e.key && e.check == 'true') {
                f.check = true;
              }
            });
          });
        } else {
          this.loadFormExtend();
          this.modal.customCCFValue = response.modal.customCCFValue;
          this.modal.customCCFEnable = response.modal.customCCFEnable;
          this.modal.periodicReviewFlag = response.modal.periodicReviewFlag;
          this.modal.newVersionRequiredFlag = response.modal.newVersionRequiredFlag;
          this.modal.changeControlForms = response.modal.changeControlForms.map(d => '' + d);
        }
        this.selectedDocumentForPeriodic=this.docItemList.filter(f=>f.check).length>0;
        this.spinnerFlag = false;
        this.configService.HTTPGetAPI("projectsetup/loadProjectvalidationStatusForEdit").subscribe(res =>{
          if(res)
            this.projectModal=res;
        });
      });
    },
      err => {
        this.spinnerFlag = false;
      }
    );
    this.spinnerFlag = true;
    this.viewData = [];
    this.adminComponent.setUpModuleForHelpContent(this.helper.VSR_VALUE);
    this.configService.loadPermissionsBasedOnModule(this.helper.VSR_VALUE).subscribe(resp => {
      this.permissionModal = resp
    });
  }

  loadvalidationAndSystemStatusList() {
    this.configService.HTTPPostAPI({ "categoryName": "projectSetupValidationStatus", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.validationStatusList = result.response;
    });
    this.configService.HTTPPostAPI({ "categoryName": "projectSetupSystemStatus", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.systemStatusList = result.response;
    });
  }

  stepperfunction(jsonResp: any) {
    const stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = this.helper.VSR_VALUE;
    stepperModule.code = "VSR-001";
    stepperModule.lastupdatedTime = jsonResp.updatedTime;
    stepperModule.documentIdentity = jsonResp.id;
    stepperModule.publishedFlag = jsonResp.publishedflag;
    stepperModule.creatorId = jsonResp.creatorId;
    stepperModule.displayCreatedTime = jsonResp.displayCreatedTime;
    stepperModule.displayUpdatedTime = jsonResp.displayUpdatedTime;
    stepperModule.documentTitle = "Validation Summary Report";
    stepperModule.createdBy = jsonResp.createdBy;
    stepperModule.updatedBy = jsonResp.updatedBy;
    this.helper.stepperchange(stepperModule);
  }

  loaddata() {
    this.projectSummaryService.loadVSRSummary().subscribe(jsonResp => {
      if (jsonResp.result != null)
        this.filteredDocumentSummaryList = jsonResp.result.document.filter(f=>this.helper.VSR_VALUE!=f.documentType && "114"!=f.documentType && this.helper.Traceability!=f.documentType && this.helper.Compliance_Report_Value!=f.documentType);
    });
  }

  loadFormExtend() {
    this.masterControlService.loadJsonOfDocumentIfActive(this.helper.VSR_VALUE).subscribe(res => {
      if (res != null)
        this.inputField = JSON.parse(res.jsonStructure);
    });
  }

  addData(row) {
    switch (this.docItemList[row].key) {
      case this.helper.SP_VALUE:
        if (!this.docItemList[row].check)
          this.docItemList.forEach(d => {
            if (d.key === this.helper.URS_VALUE)
              d.check = true
          });
        break;
      case this.helper.IQTC_VALUE:
        if (!this.docItemList[row].check)
          this.docItemList.forEach(d => {
            if (d.key === this.helper.URS_VALUE)
              d.check = true
            if (d.key === this.helper.SP_VALUE)
              d.check = true
            if (d.key === this.helper.RISK_ASSESSMENT_VALUE)
              d.check = true
          });
        break;
      case this.helper.OQTC_VALUE:
        if (!this.docItemList[row].check)
          this.docItemList.forEach(d => {
            if (d.key === this.helper.URS_VALUE)
              d.check = true
            if (d.key === this.helper.SP_VALUE)
              d.check = true
            if (d.key === this.helper.RISK_ASSESSMENT_VALUE)
              d.check = true
          });
        break;
      case this.helper.PQTC_VALUE:
        if (!this.docItemList[row].check)
          this.docItemList.forEach(d => {
            if (d.key === this.helper.URS_VALUE)
              d.check = true
            if (d.key === this.helper.SP_VALUE)
              d.check = true
            if (d.key === this.helper.RISK_ASSESSMENT_VALUE)
              d.check = true
          });
        break;
      case this.helper.IOQTC_VALUE:
        if (!this.docItemList[row].check)
          this.docItemList.forEach(d => {
            if (d.key === this.helper.URS_VALUE)
              d.check = true
            if (d.key === this.helper.SP_VALUE)
              d.check = true
            if (d.key === this.helper.RISK_ASSESSMENT_VALUE)
              d.check = true
          });
        break;
      case this.helper.OPQTC_VALUE:
        if (!this.docItemList[row].check)
          this.docItemList.forEach(d => {
            if (d.key === this.helper.URS_VALUE)
              d.check = true
            if (d.key === this.helper.SP_VALUE)
              d.check = true
            if (d.key === this.helper.RISK_ASSESSMENT_VALUE)
              d.check = true
          });
        break;
      case this.helper.RISK_ASSESSMENT_VALUE:
        if (!this.docItemList[row].check)
          this.docItemList.forEach(d => {
            if (d.key === this.helper.URS_VALUE)
              d.check = true
            if (d.key === this.helper.SP_VALUE)
              d.check = true
          });
        break;
    }
    if (this.docItemList[row].key === this.helper.URS_VALUE) {
      if (this.docItemList[row].check) {
        this.docItemList.forEach(d => {
          switch (d.key) {
            case this.helper.SP_VALUE:
              d.check = false;
              break;
            case this.helper.IQTC_VALUE:
              d.check = false;
              break;
            case this.helper.OQTC_VALUE:
              d.check = false;
              break;
            case this.helper.PQTC_VALUE:
              d.check = false;
              break;
            case this.helper.IOQTC_VALUE:
              d.check = false;
              break;
            case this.helper.OPQTC_VALUE:
              d.check = false;
              break;
            case this.helper.RISK_ASSESSMENT_VALUE:
              d.check = false;
              break;
          }
        });
      }
    }
    if (this.docItemList[row].key === this.helper.SP_VALUE) {
      if (this.docItemList[row].check) {
        this.docItemList.forEach(d => {
          switch (d.key) {
            case this.helper.IQTC_VALUE:
              d.check = false;
              break;
            case this.helper.OQTC_VALUE:
              d.check = false;
              break;
            case this.helper.PQTC_VALUE:
              d.check = false;
              break;
            case this.helper.IOQTC_VALUE:
              d.check = false;
              break;
            case this.helper.OPQTC_VALUE:
              d.check = false;
              break;
            case this.helper.RISK_ASSESSMENT_VALUE:
              d.check = false;
              break;
          }
        });
      }
    }
    if (this.docItemList[row].key === this.helper.RISK_ASSESSMENT_VALUE) {
      if (this.docItemList[row].check) {
        this.docItemList.forEach(d => {
          switch (d.key) {
            case this.helper.IQTC_VALUE:
              d.check = false;
              break;
            case this.helper.OQTC_VALUE:
              d.check = false;
              break;
            case this.helper.PQTC_VALUE:
              d.check = false;
              break;
            case this.helper.IOQTC_VALUE:
              d.check = false;
              break;
            case this.helper.OPQTC_VALUE:
              d.check = false;
              break;
          }
        });
      }
    }
  }

  openSuccessUpdateSwal(step1Valid, step2Valid) {
    if (step1Valid && step2Valid) {
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
            this.onsubmit(step1Valid, step2Valid, userRemarks);
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

  onsubmit(step1Valid, step2Valid, userRemarks?) {
    this.spinnerFlag = true;
    this.isLoading = true;
    //let selectedDocList = this.docItemList.filter(d => d.check);
    if (!step1Valid || (this.formExtendedComponent && !this.formExtendedComponent.validateChildForm())) {
      this.spinnerFlag = false;
      swal({
        title: 'Warning!',
        text: 'Please check all the required',
        type: 'warning',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      }
      )
    } else if (!step2Valid) {
      this.spinnerFlag = false;
      swal({
        title: 'Warning!',
        text: 'Please check all the required field',
        type: 'warning',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      }
      )
    } 
    // else if (selectedDocList.length == 0) {
    //   this.spinnerFlag = false;
    //   swal({
    //     title: 'Warning!',
    //     text: 'Please select atleast one document',
    //     type: 'warning',
    //     timer: this.helper.swalTimer,
    //     showConfirmButton: false
    //   }
    //   )
    // } 
    else {
      this.modal.jsonExtraData = JSON.stringify(this.inputField);
      this.modal.validationSummaryChildDto = this.docItemList;
      this.modal.deleteFlag = false;
      this.modal.freezeFlag = false;
      if (this.validationExpiryDate) {
        this.modal.validationExpiryDate = JSON.stringify(this.validationExpiryDate.date);
      } else {
        this.modal.validationExpiryDate = '';
      }
      if (this.releaseDate) {
        this.modal.releaseDate = JSON.stringify(this.releaseDate.date);
      } else {
        this.modal.releaseDate = '';
      }
      if (!this.modal.customCCFEnable)// for audit in backend for list of CCF if the customCCF is not there
        this.modal.customCCFValue = this.simpleOptionCCF.filter(d => this.modal.changeControlForms.includes(d.value)).map(d => d.label).toString()
      this.modal.publishedFlag = this.modal.publishedFlag;
      this.modal.userRemarks = userRemarks;
      this.vsrService.saveReport(this.modal).subscribe(resp => {
        this.isLoading = false;
        this.spinnerFlag = false;
        if (resp.result === "success") {
          this.pendingDocs = [];
          swal({
            title: 'Success',
            text: 'Summary Report saved successfully',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          }
          )
          this.saveButtonFlag = false;
          this.updateButtonFlag = false;
          this.editButtonFlag = true;
          this.showView = true;
          this.showCreation = false;
          this.modal = resp.modal;
          this.publishedFlag = resp.modal.publishedFlag;
          this.viewData = [];
          resp.modal.formData = JSON.parse(resp.modal.jsonExtraData)
          this.viewData.push(resp.modal);
          this.ngOnInit();
        } else {
          swal(
            'Error!',
            'Oops something went Worng..',
            'error'
          )
        }
      }, err => this.spinnerFlag = false);
    }
  }

  openDatepicker(id) {
    id.toggle()
  }

  publishData() {
    // let selectedDocList = this.docItemList.filter(d => d.check);
    // if (selectedDocList.length == 0) {
    //   this.spinnerFlag = false;
    //   swal({
    //     title: 'Warning!',
    //     text: 'Please select atleast one document',
    //     type: 'warning',
    //     timer: this.helper.swalTimer,
    //     showConfirmButton: false
    //   });
    // } else {
      this.spinnerFlag = true;
      var dateObj = new Date();
      dateObj.setHours(0, 0, 0, 0);
      var validDate = new Date();
      validDate.setHours(1, 1, 1, 1);
      if (this.validationExpiryDate) {
        let jsonDate = this.validationExpiryDate.date;
        validDate = new Date(jsonDate.year, jsonDate.month - 1, jsonDate.day, 0, 0, 0, 0);
      }
      if (this.releaseDate) {
        let jsonDate = this.releaseDate.date;
        validDate = new Date(jsonDate.year, jsonDate.month - 1, jsonDate.day, 0, 0, 0, 0);
      }
      if (validDate.getTime() >= dateObj.getTime()) {
        this.vsrService.getdocLockStatus(this.modal.id).subscribe(res => {
          this.spinnerFlag = false;
          this.modal.validationSummaryChildDto = res.dto;
          this.isAllDocLocked = res.isAllDocLocked;
          this.pendingDocs = res.list;
          
          if (!this.isAllDocLocked) {
            this.alertMessage.show();
          } else {
            var selfLockList=this.modal.validationSummaryChildDto.filter(f=>f.selfLock);

            if(selfLockList.length>0){
              var dataObj = this;
              let docNames =selfLockList.filter(f=>!f.isDocumentDataExists).map(m=>m.name).join(",");
              swal({
                html:`<h5 >`+docNames+` added to the Validation plan but no items are added. Would you still like to publish the vsr?</h5>` ,
                type:'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText:'No',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
              })
                .then((value) => {
                  dataObj.publish();
                }).catch(err=>{
                 
                });
            }else{
              this.publish();
            }
          }
        });
      } else {
        this.spinnerFlag = false;
        swal({ title: 'Ooops!', text: 'Please check the Validation expiry Date. It should not be an past date.', timer: 3000, showConfirmButton: false });
      }
    // }
  }

  publish(){
    this.spinnerFlag = true;
    this.modal.publishedFlag = true;
    if (this.validationExpiryDate) {
      this.modal.validationExpiryDate = JSON.stringify(this.validationExpiryDate.date);
    } else {
      this.modal.validationExpiryDate = '';
    }
    if (this.releaseDate) {
      this.modal.releaseDate = JSON.stringify(this.releaseDate.date);
    } else {
      this.modal.releaseDate = '';
    }
    this.vsrService.saveReport(this.modal).subscribe(response => {
      if (response.result === "success") {
        status = "success";
        swal({
          title: 'Published Successfully!',
          text: 'Record has been published.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }
        );
        this.spinnerFlag = false;
        this.ngOnInit();
      } else {
        swal({
          title: 'Published Failed!',
          text: 'Record has not been published. Try again!',
          type: 'error',
          timer: this.helper.swalTimer
        }
        );
        this.spinnerFlag = false;
      }
    });
  }

  onStep4Next() {
    this.viewData = [];
    this.viewData.push(this.modal);
  }

  editReport() {
    this.title = 'Step 1';
    this.spinnerFlag = true;
    this.vsrService.getReportById(this.modal.id).subscribe(response => {
      if (response.data.jsonExtraData != null && response.data.jsonExtraData != '[]')
        this.inputField = JSON.parse(response.data.jsonExtraData);
      this.modal = response.data;
      if (this.modal.validationExpiryDate) {
        this.validationExpiryDate = { date: JSON.parse(this.modal.validationExpiryDate) };
      }
      if (this.modal.releaseDate) {
        this.releaseDate = { date: JSON.parse(this.modal.releaseDate) };
      }
      this.editButtonFlag = false;
      this.updateButtonFlag = true;
      this.saveButtonFlag = false;
      this.showView = false;
      this.showCreation = true;
      this.spinnerFlag = false;
    });
  }

  pdfdownload() {
    this.spinnerFlag = true;
    this.vsrService.generatePdf().subscribe(res => {
      var blob: Blob = this.b64toBlob(res._body, 'application/pdf');
      let name = "Validation_Summary_Report_" + new Date().toLocaleDateString(); +".pdf";
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, name);
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      this.spinnerFlag = false
    });
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  reload() {
    this.ngOnInit();
  }

  openBtnClicked() {
    if (!this.date.showSelector)
      this.date.openBtnClicked();
  }

  openReleaseBtnClicked() {
    if (this.relaseDateElement && !this.relaseDateElement.showSelector)
      this.relaseDateElement.openBtnClicked();
  }

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.myDatePickerOptions.dateFormat = result.datePattern.replace("YYYY", "yyyy");
        this.datePipeFormat = result.datePattern.replace("mm", "MM");
        this.datePipeFormat = this.datePipeFormat.replace("YYYY", "yyyy");
      }
    });
  }

  onStepChange(event) {
    this.title = event.title;
  }

  navigatePrevious() {
    this.formWizard.previous();
  }

  navigateNext() {
    this.formWizard.next();
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

  enablePeriodocReview() {
    this.modal.periodicReviewFlag = !this.modal.periodicReviewFlag;
    if(!this.modal.periodicReviewFlag){
      this.validationExpiryDate="";
    }
  }

  validateReference(list) {
    if (this.checkListURL.validateList(list)){
      this.urlchecklist.hide();
      this.referenceFlag = false;
    }
  }

  closereference(list) {
    this.modal.urlChecklist = this.checkListURL.removeChecklist(list);
    this.referenceFlag = false;
    this.urlchecklist.hide();
  }

  onClickTableOfContent() {
    this.router.navigate(['/table-of-content'], { queryParams: { docId: this.helper.VSR_VALUE, status: document.location.pathname }, skipLocationChange: true });
  }

  toggleExpandRow(row) {
    this.myTable.rowDetail.toggleExpandRow(row);
  }

  goToDetails(doc: string, type: any, count) {
    this.router.navigate(['/projectSummary'], { queryParams: { projectId: this.adminComponent.currentUser.projectId, documentType: doc, type: type, count: count }, skipLocationChange: true });
  }

  calculatePercentage(totalSum, value) {
    if (totalSum == 0 && value == 0)
      this.percentage = 0;
    else
      this.percentage = Math.floor(value / totalSum * 100);
    this.progressBarColour = this.percentage == 100 ? "progress-bar bg-success" : "progress-bar";
  }

  getPercentage(totalSum, value) {
    let percentageValue;
    if (totalSum == 0 && value == 0)
      percentageValue = 0;
    else
      percentageValue = Math.floor(value / totalSum * 100);
    if (percentageValue == 100)
      return true;
    else
      return false;
  }

  loadStepperData(doc: DocumentSummaryDTO) {
    this.stepperListView.spinnerShow();
    this.docName = doc.documentName;
    let list = new Array();
    if (doc.formGroupConstants.length != 0) {
      doc.formGroupConstants.forEach(value => {
        list.push({ key: value });
      });
    } else {
      list[0] = { key: doc.documentType };
    }
    this.loadStepperList = new Array();
    list.forEach(element => {
      let stepperModule = new StepperClass();
      stepperModule.constantName = element.key;
      this.config.loaddocumentStepper(stepperModule).subscribe(response => {
        this.loadStepperList.push({ docName: element.value, stepperList: response, displayOrder: element.displayOrder })
        if (this.loadStepperList.length == list.length) {
          this.loadStepperList.sort((a, b) => a.displayOrder - b.displayOrder);
          this.stepperListView.spinnerHide();
        }
      }, err => this.stepperListView.spinnerHide());
    });
  }

  loadWorkflowUsers(type) {
    this.docId = type;
    this.config.getAllUsersForProjectAndDocumentType(undefined, this.docId).subscribe(resp => {
      this.userList = resp.map(option => ({ id: option.id, itemName: option.userName }));
    });
  }

  onClose() {
    this.graphRemarks = "";
    this.selectedUsersForEmail = [];
    this.shareGraphEmail.hide();
    this.isSubmitted = false;
  }

  sendGraphEmail() {
    if (this.selectedUsersForEmail.length > 0) {
      this.spinnerFlag = true;
      this.selectedUsersForEmail = this.selectedUsersForEmail.map(m => m.id);
      let docData = this.filteredDocumentSummaryList.filter(f => this.docId === f.documentType);
      let dataJson: any;
      dataJson = docData.length > 0 ? docData[0] : {};
      dataJson.projectPlan.forEach(element => {
        element.description = element.startTargetDate;
        element.responsibility = element.endTargetDate;
        element.actualStartTargetDate = this.datePipe.transform(element.actualStartTargetDate, this.datePipeFormat);
        element.actualEndTargetDate = this.datePipe.transform(element.actualEndTargetDate, this.datePipeFormat);
      });
      let json = { remarks: this.graphRemarks, users: this.selectedUsersForEmail, data: dataJson };
      this.config.HTTPPostAPI(json, "projectsetup/sendIndividualDocSummaryEmail").subscribe(resp => {
        this.onClose();
        this.shareGraphEmail.hide();
        this.isSubmitted = false;
        if (resp.result == "success") {
          this.spinnerFlag = false;
          swal({
            title: 'Success',
            text: 'Summary Email is Sent!',
            type: 'success',
            timer: this.helper.swalTimer, showConfirmButton: false
          });
        } else {
          this.spinnerFlag = false;
          swal({
            title: 'Error',
            text: 'Error in Sending Summary Email!',
            type: 'error',
            timer: this.helper.swalTimer, showConfirmButton: false,
          });
        }
      }, err => {
        this.spinnerFlag = false;
      });
    } else {
      this.isSubmitted = true;
    }
  }

  urlRedirect(url: string, id?) {
    if (url.toLocaleLowerCase().includes('dynamic')) {
      if (id !== undefined)
        this.adminComponent.redirect(url, '/projectSummary');
      else
        this.adminComponent.redirect(url);
    } else {
      if (id !== undefined)
        this.adminComponent.redirect(url + '?id=' + id + '&status=/projectSummary&exists=true');
      else
        this.adminComponent.redirect(url);
    }
  }

  downloadPdf(documentConstnatName: any, docName: any) {
    this.spinnerFlag = true;
    this.dashboardService.downloadDocumentPdf(documentConstnatName, this.adminComponent.currentUser.versionId, "Project Summary").subscribe(res => {
      var blob: Blob = this.b64toBlob(res._body, 'application/pdf');
      let name;
      this.spinnerFlag = false;
      if (documentConstnatName != '128')
        name = docName + ".pdf";
      else
        name = docName + ".zip";
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, name);
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.spinnerFlag = false;
      }
      this.spinnerFlag = false;
    });
  }

  checkdocumentIslockOrNot(data) {
    this.spinnerFlag = true;
    this.projectSummaryService.docLockPermissions(data, this.adminComponent.currentUser.versionId).subscribe(rsp => {
      this.spinnerFlag = false;
      if (rsp) {
        swal({ title: '', text: rsp, timer: 4000, showConfirmButton: false });
      } else {
        this.documentlockDataLogs = [];
        this.documentConstantNameTemp = data;
        this.checkifdocumentIsLockedService(data).then((result) => {
          this.freezeData.documentConstantName = data;
          if (this.freezeData.lockLogs.length > 0)
            this.documentlockDataLogs.push(...this.freezeData.lockLogs);
          this.freezeModalData.show();
          this.spinnerFlag = false;
        }).catch((err) => {
        });
      }
    });
  }

  checkifdocumentIsLockedService(constantName): Promise<void> {
    return new Promise<void>(resolve => {
      this.projectSummaryService.docLockStatus(constantName, this.adminComponent.currentUser.versionId).subscribe(jsonResp => {
        this.freezeData = jsonResp;
        resolve()
      }, err => {
        this.spinnerFlag = false;
      }
      );
    });
  }

  saveDocumentLockAndUnlock() {
    this.freezeData.documentLock = !this.freezeData.documentLock;
    if (this.freezeData.documentLock && this.freezeData.draftList.length>0) {
      var dataObj = this;
      swal({
        html:`<h5 >There are a few items in Draft. Would you like to lock the document?</h5>` ,
        type:'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText:'No',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
      })
        .then((value) => {
          dataObj.callSaveLock();
        }).catch(err=>{
          this.freezeData.documentLock = !this.freezeData.documentLock;
          this.freezeData.documentLockComments='';
        });
    } else {
      this.callSaveLock();
    }
  }
  callSaveLock(){
    this.spinnerFlag=true;
    this.workflowService.documentLockUnlock(this.freezeData).subscribe(resp => {
      this.spinnerFlag=false;
      if (resp == false) {
        swal({
          title: 'Warning', text: this.freezeData.documentName +
            ' has been already' + ((this.freezeData.documentLock) ? ' locked' : ' Unlocked'),
          type: 'warning', timer: 2000, showConfirmButton: false
        })
      } else {
        swal({
          title: 'Success', text: this.freezeData.documentName +
            ' has been' + ((this.freezeData.documentLock) ? ' locked' : ' Unlocked'),
          type: 'success', timer: 2000, showConfirmButton: false
        })
        this.freezeData.documentLockComments='';
        this.freezeModalData.hide();
      }
      this.loaddata();
      this.isAllDocLocked = true;
    });
  }

  onClickChecklistStatus(){
    this.projectCheckList.showModalView(this.adminComponent.currentUser.projectId);
  }
  
  loadProjectCheckListStatusCount(){
    this.config.HTTPGetAPI("projectsetup/loadProjectCheckListStatusCount/"+this.adminComponent.currentUser.projectId).subscribe(res =>{
      this.projectChecklistStatus=res.result;
      this.projectChecklistPercentage=res.percentage;
    });
    this.config.HTTPGetAPI("projectsetup/checkProjectChecklistStatus/"+this.adminComponent.currentUser.projectId).subscribe(res =>{
      this.isProjectChecklistStatus=res.result;
    });
  }
  onClosecheckListModal(){
    this.loadProjectCheckListStatusCount();
  }

  onClickProjectStatusModal(){
    this.projectStatusDTO=new ProjectStatusDTO();
    this.projectStatusDTO.projectId=this.projectModal.id;
    this.projectStatusDTO.validationStatus=this.projectModal.validationStatus;
    this.projectStatusDTO.systemStatus=this.projectModal.systemStatus;
    this.projectStatusDTO.comments="";
    this.projectStatusModal.show();
  }
  saveStatus(){
    this.spinnerFlag=true;
    this.configService.HTTPPostAPI(this.projectStatusDTO,"projectsetup/saveProjectsetupStatus").subscribe(resp =>{
      this.projectModal.validationStatus=this.projectStatusDTO.validationStatus;
      this.projectModal.systemStatus= this.projectStatusDTO.systemStatus;
      this.spinnerFlag=false;
      this.projectStatusModal.hide();
    });
  }
  onCloseProjectStatusModal(){
    this.projectModal.validationStatus=this.projectStatusDTO.validationStatus;
    this.projectModal.systemStatus= this.projectStatusDTO.systemStatus;
    this.projectStatusModal.hide();
  }

  loadRecordView(list){
    this.viewList=list;
    this.revisionDocs.show();
   }
}
