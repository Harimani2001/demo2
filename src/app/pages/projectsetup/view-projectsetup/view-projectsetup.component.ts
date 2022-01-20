
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDpOptions } from 'mydatepicker/dist';
import swal from 'sweetalert2';
import { DatePipe } from '../../../../../node_modules/@angular/common';
import { ProjectSetup, Page } from '../../../models/model';
import { Permissions } from '../../../shared/config';
import { ConfigService } from '../../../shared/config.service';
import { Helper } from '../../../shared/helper';
import { DashBoardService } from '../../dashboard/dashboard.service';
import { DateFormatSettingsService } from '../../date-format-settings/date-format-settings.service';
import { FileUploadForDocComponent } from '../../file-upload-for-doc/file-upload-for-doc.component';
import { LocationService } from '../../location/location.service';
import { WorkflowFlowchartComponent } from '../../workflow-flowchart/workflow-flowchart.component';
import { ProjectUrlChecklistComponent } from '../project-url-checklist/project-url-checklist.component';
import { projectsetupService } from '../projectsetup.service';
import { AdminComponent } from './../../../layout/admin/admin.component';
import { StepperClass, WorkflowDocumentStatusDTO } from './../../../models/model';
import { ProjectChecklistComponent } from '../../project-checklist/project-checklist.component';
import { LookUpService } from '../../LookUpCategory/lookup.service';
@Component({
  selector: 'app-view-projectsetup',
  templateUrl: './view-projectsetup.component.html',
  styleUrls: ['./view-projectsetup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewProjectsetupComponent implements OnInit {
  @ViewChild('documentcomments') documentcomments: any;
  @ViewChild('workFlowChart') workFlowChart: WorkflowFlowchartComponent;
  @ViewChild('viewFileupload') private viewFileupload: FileUploadForDocComponent;
  @ViewChild("manualVersionCreation") manualVersionCreation: any;
  @ViewChild('myTable') table: any;
  tabName = 'summary';
  @ViewChild('fileSize') fileSize: any;
  @ViewChild('date') date: any;
  @ViewChild('checkListURLId') checkListURLId: ProjectUrlChecklistComponent;
  @ViewChild('projectCheckList') projectCheckList: ProjectChecklistComponent;
  windowHeight = window;
  temDate: any;
  releaseDate: any;
  datePipeFormat = 'dd-mm-yyyy';
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: this.datePipeFormat,
    disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
  };
  data: any = null;
  publishedData: any = new Array();;
  modal: ProjectSetup;
  popupdata = [];
  public tempRowId: any;
  viewIndividualData: boolean = false;
  permissionsfromlocalstorage: any;
  permissionModal: Permissions = new Permissions(this.helper.PROJECT_SETUP_VALUE, false);
  workFLowConfigData: any;
  name = "world";
  isSelectedPublishData: boolean = false;
  isViewImportedData: boolean = false;
  public docItemList: any;
  projectCountFlag = false;
  projectCountMsg = ""
  selectedDocument: string = "";
  createProjectWizardId: any;
  commonDocumentStatusValue: any;
  documentList: any;
  routeback: any = null;
  roleBack: any;
  isPublishLoading: boolean = false;
  fileFlag: boolean = true;
  checkListFlag: boolean = true;
  spinnerFlag: boolean = false;
  unpublishedData: any = new Array();
  ftpFolderSize: any;
  dBSize: any;
  rowId: any;
  public filterQuery = '';
  location = [];
  locationsList = [];
  locationDropdownSettings = {
    singleSelection: true,
    text: "Select Location",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  showSearch: boolean = false;
  projectChecklistStatus: string = "";
  projectChecklistPercentage: number;
  summaryData: any;
  percentage: number = 0;
  progressBarColour: string;
  isInventoryModulePermission: boolean = false;
  validationStatus = [
    { id: "Initiated", itemName: "Initiated" },
    { id: "Validation Ongoing", itemName: "Validation Ongoing" },
    { id: "Technically Released", itemName: "Technically Released" },
  ];
  validationStatusList = [];
  statusDropdownSettings = {
    singleSelection: false,
    text: "Select Validation Status",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  page: Page = new Page();
  constructor(public datePipe: DatePipe, private servie: DateFormatSettingsService, public permissionService: ConfigService, private route: ActivatedRoute, public helper: Helper,
    public service: projectsetupService, public router: Router, private adminComponent: AdminComponent, public dashBoardService: DashBoardService, public locationService: LocationService,
    public lookUpService: LookUpService) {

    this.route.queryParams.subscribe(rep => {
      if (rep.id !== undefined) {
        this.routeback = rep.id
        if (rep.roleBack != undefined) {
          this.roleBack = rep.roleBack;
        }
        this.viewRowDetails(rep.id, rep.status);
        this.helper.changeMessageforId(rep.id);
      }
      this.loadOrgDateFormatAndTime();
    });
    this.helper.listen().subscribe((m: any) => {
      this.viewRowDetails(m, "/documentapprovalstatus")
    })
  }

  ngOnInit() {
    this.permissionService.loadPermissionsBasedOnModule(this.helper.PROJECT_SETUP_VALUE).subscribe(resp => {
      this.permissionModal = resp
    });

    this.getValidationStatus();
    this.loadInventoryPermissions();
    this.adminComponent.setUpModuleForHelpContent("100");
    this.canCreateProject();
    this.loadAllLocation().then(response => {
      this.service.loadCurrentLocationOfProject().subscribe(resp => {
        if (resp.result) {
          this.location = [{ id: resp.result.id, itemName: resp.result.name }];
          this.page.pageNumber = 0;
          this.page.size = this.helper.PAGE_SIZE;;
          this.setPage({ offset: 0 });
        } else {
          this.location = [{ id: this.locationsList[0].id, itemName: this.locationsList[0].itemName }];
          this.page.pageNumber = 0;
          this.page.size = this.helper.PAGE_SIZE;;
          this.setPage({ offset: 0 });
        }
      });
    });
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.permissionService.getUserPreference(this.helper.PROJECT_SETUP_VALUE).subscribe(res => {
      if (res.result)
        this.loadAll(res.result);
      else
        this.loadAll('summary');
    });
  }
  onTabChange(tabName: any) {
    this.tabName = tabName;
    this.permissionService.saveUserPreference(this.helper.PROJECT_SETUP_VALUE, tabName).subscribe(res => {
      if (tabName === 'draft') {
        this.page.pageNumber = 0;
        this.setPage({ offset: 0 });
      } else if (tabName === 'published') {
        this.page.pageNumber = 0;
        this.setPage({ offset: 0 });
      } else if (tabName === 'summary') {
        this.loadSummary(this.location[0].id);
      }
    });
  }
  loadAll(tabId) {
    var currentTab = 'draft';
    if (tabId) {
      currentTab = tabId;
    }
    if (currentTab == 'draft' || currentTab == 'published') {
      this.loadProjectsbasedOnTab(currentTab);
    } else if (currentTab == 'summary') {
      this.loadSummary(this.location[0].id);
    }
  }
  loadSummary(locationId) {
    this.spinnerFlag = true;
    this.permissionService.HTTPGetAPI("projectsetup/loadProjectSummaryForFirstTab/" + locationId).subscribe(res => {
      let status = this.validationStatus.map(m => m.itemName);
      this.summaryData = res.filter(f => status.includes(f.validationStatus));
      this.spinnerFlag = false;
    })
  }

  ngAfterViewInit(): void {
    this.permissionService.getUserPreference(this.helper.PROJECT_SETUP_VALUE).subscribe(res => {
      if (res.result)
        this.tabName = res.result;
    });
  }

  loadProjectsbasedOnTab(tabId?) {
    if (!tabId) {
      this.permissionService.getUserPreference(this.helper.PROJECT_SETUP_VALUE).subscribe(res => {
        if (res.result)
          tabId = res.result;
        else
          tabId = 'draft';
      });
    }
    this.tabName = tabId;
    this.spinnerFlag = true;
    this.adminComponent.loadProjects();
    this.service.loadAllproject(this.location[0].id, this.page.pageNumber, tabId, this.validationStatus.map(m => m.itemName)).subscribe(jsonResp => {
      this.spinnerFlag = false;
      this.page.totalElements = jsonResp.totalElements;
      this.page.totalPages = jsonResp.totalPages;
      if (jsonResp.unpublishedList && jsonResp.unpublishedList.length > 0) {
        this.unpublishedData = jsonResp.unpublishedList;
      }
      if (jsonResp.publishedList && jsonResp.publishedList.length > 0) {
        this.publishedData = jsonResp.publishedList;
      }
      this.publishedData.forEach(element => {
        if (element.vsrNextReviewDate) {
          let date = JSON.parse(element.vsrNextReviewDate);
          element.vsrNextReviewDate = { date: date };
          var today = new Date(element.vsrNextReviewDate.date.year, element.vsrNextReviewDate.date.month - 1, element.vsrNextReviewDate.date.day);
          element.vsrNextReviewDateView = this.datePipe.transform(today, this.datePipeFormat);
        }
        if (element.releaseDate) {
          let date = JSON.parse(element.releaseDate);
          element.releaseDate = { date: date };
        }
      });
    });
  }

  filterProjectList(location, valStatus) {
    this.location = location;
    this.validationStatus = valStatus;
    this.page.pageNumber = 0;
    this.setPage({ offset: 0 });
  }

  loadInventoryPermissions() {
    this.permissionService.checkIndividualModulePermission(this.helper.Inventory_Report_Value).subscribe(resp => {
      this.isInventoryModulePermission = resp;
    });
  }

  loadAllLocation() {
    return new Promise<boolean>(resolve => {
      this.locationService.loadAllActiveLocations().subscribe(response => {
        this.locationsList = response.result.map(option => ({ id: option.id, itemName: option.name }));
        resolve(true);
      }, err => {
        this.locationsList = new Array();
        resolve(true);
      });
    });
  }

  getValidationStatus() {
    this.lookUpService.getlookUpItemsBasedOnCategory("projectSetupValidationStatus").subscribe(response => {
      if (response.result == "success") {
        this.validationStatusList = response.response.map(option => ({ id: option.key, itemName: option.value }));
      }
    });
  }

  canCreateProject() {
    this.projectCountMsg = ''
    this.service.canCreateProject().subscribe(res => {
      this.projectCountFlag = res;
      this.projectCountMsg = `*Note: <span class="asterisk required">Project Creation Limit is crossed. Please contact Admin if needed...!</span> `
    });
  }

  toggleExpandRowprojectsetup(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.datePipeFormat = result.datePattern.replace("YYYY", "yyyy");
        this.myDatePickerOptions.dateFormat = this.datePipeFormat;
        this.datePipeFormat = result.datePattern.replace("mm", "MM");
        if (this.date)
          this.date.setOptions();
      }
    });
  }

  viewRowDetails(rowId: any, rep?: any) {
    this.fileFlag = true;
    this.checkListFlag = true;
    this.rowId = rowId;
    this.commonDocumentStatusValue = rep;
    this.tempRowId = rowId;
    this.popupdata = [];
    this.service.loadProjectSummaryStepper3(rowId).subscribe(resp => {
      if (resp.data != null)
        resp.data.equipment = resp.data.equipmentName;

      if (resp.data.startDate && resp.data.startDate.includes("{")) {
        let startdateString: any = JSON.parse(resp.data.startDate);
        var today = new Date(startdateString.year, startdateString.month - 1, startdateString.day);
        resp.data.startDate = this.datePipe.transform(today, this.datePipeFormat);
      }

      if (resp.data.endDate && resp.data.endDate.includes("{")) {
        let startdateString: any = JSON.parse(resp.data.endDate);
        var today = new Date(startdateString.year, startdateString.month - 1, startdateString.day);
        resp.data.endDate = this.datePipe.transform(today, this.datePipeFormat);
      }

      if (resp.data.vsrNextReviewDate) {
        let startdateString: any = JSON.parse(resp.data.vsrNextReviewDate);
        var today = new Date(startdateString.year, startdateString.month - 1, startdateString.day);
        resp.data.vsrNextReviewDate = this.datePipe.transform(today, this.datePipeFormat);
      }
      if (resp.data.releaseDate) {
        let startdateString: any = JSON.parse(resp.data.releaseDate);
        var today = new Date(startdateString.year, startdateString.month - 1, startdateString.day);
        resp.data.releaseDate = this.datePipe.transform(today, this.datePipeFormat);
      }

      this.popupdata.push(resp.data);
      this.loadProjectCheckListStatusCount(rowId);
      this.viewIndividualData = true;
      this.workflowfunction(resp);
      this.stepperfunction(resp);
      setTimeout(() => {
        this.viewFileupload.loadFileListForEdit(resp.data.systemDescription.id, resp.projectName).then((result) => {
          this.fileFlag = result;
          this.checkListURLId.loadProjectReferenceData(this.data.id).then((result) => {
            this.checkListFlag = result;
          })
        }).catch((err) => {
          this.spinnerFlag = false;
        });;
        this.spinnerFlag = false;
      }, 1000)
    })
  }

  stepperfunction(jsonResp: any) {
    const stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = "100";
    stepperModule.code = jsonResp.data.projectName;
    stepperModule.documentIdentity = jsonResp.data.id;
    stepperModule.publishedFlag = jsonResp.data.publishedFlag;
    stepperModule.creatorId = jsonResp.data.createdById;
    stepperModule.lastupdatedTime = jsonResp.data.updatedTime;
    stepperModule.displayCreatedTime = jsonResp.data.displayCreatedTime;
    stepperModule.displayUpdatedTime = jsonResp.data.displayUpdatedTime;
    stepperModule.documentTitle = jsonResp.data.projectName;
    stepperModule.createdBy = jsonResp.data.createdBy;
    stepperModule.updatedBy = jsonResp.data.updatedBy;
    this.helper.stepperchange(stepperModule);
  }

  workflowfunction(jsonResp: any) {
    if (jsonResp.data.publishedflag) {
      const workflowmodal: WorkflowDocumentStatusDTO = new WorkflowDocumentStatusDTO();
      workflowmodal.documentType = this.helper.PROJECT_SETUP_VALUE;
      workflowmodal.documentId = jsonResp.data.id;
      workflowmodal.currentLevel = jsonResp.data.currentCommonLevel;
      workflowmodal.documentCode = jsonResp.data.projectCode;
      workflowmodal.noProjectRequiredFlag = true;
      workflowmodal.workflowAccess = jsonResp.data.workflowAccess;
      workflowmodal.docName = 'Project Setup';
      workflowmodal.publishFlag = jsonResp.data.publishedFlag;
      this.helper.setIndividulaWorkflowData(workflowmodal);
    }
  }

  navigateToProjectSetUp(projId: any) {
    this.router.navigate(["Project-setup/add-projectsetup"], this.helper.isEmpty(projId) ? {} : { queryParams: { id: this.helper.encode(projId) } });
  }

  publishData() {
    this.isPublishLoading = true;
    if (this.rowId)
      this.unpublishedData.filter(f => this.rowId === f.id).forEach(data => data.publishedFlag = true);
    this.service.publishProjects(this.unpublishedData).subscribe(result => {
      this.loadProjectsbasedOnTab('draft');
      this.adminComponent.loadProjects();
      this.isPublishLoading = false;
      this.isSelectedPublishData = false;
      this.viewIndividualData = false;
    });
  }

  onChangePublishData() {
    let publishedLength = this.unpublishedData.filter(d => d.publishedFlag).length;
    if (publishedLength != 0)
      this.isSelectedPublishData = true
    else
      this.isSelectedPublishData = false;
  }

  viewImportedData(data: any) {
    this.docItemList = new Array<any>();
    this.createProjectWizardId = data.createProjectWizardId
    this.permissionService.loadDocBasedOnProject().subscribe(resp => {
      resp.result.forEach(element => {
        let tempDocItemList = { 'id': element.key, 'name': element.value }
        this.docItemList.push(tempDocItemList);
      });
      this.isViewImportedData = true;
    });
  }



  loadDocumentCommentLog(row) {
    row.constantName = this.helper.PROJECT_SETUP_VALUE;
    this.documentcomments.loadDocumentCommentLog(row);
  }

  loadProjectDetailsForNewVersion(currentVersionId) {
    this.manualVersionCreation.loadProjectDetailsForNewVersion(currentVersionId);
  }

  loadProjectFTPSize() {
    this.spinnerFlag = true;
    this.service.applicationFileSize("data").subscribe(data => {
      if (data != '' && data != null) {
        this.ftpFolderSize = data.ftpSize;
        this.dBSize = data.orgDbSize;
        this.fileSize.show();
        this.spinnerFlag = false;
      }
    });
  }

  oldDate(event) {
    this.temDate = event;
  }

  onChangeFromDate(date: any, row) {
    let newDate = date ? JSON.stringify(date.date) : "";
    let that = this;
    swal({
      title: "Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      allowOutsideClick: false,
    })
      .then((value) => {
        if (value) {
          that.updateNextReviewDate(row.id, newDate, value);
        } else {
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: this.permissionService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              that.onChangeFromDate(newDate, row);
            }
          });
        }
      }).catch(() => {
        row.vsrNextReviewDate = this.temDate;
      });
  }

  updateNextReviewDate(projectId, newDate, comment) {
    this.temDate = null;
    this.permissionService.changeReviewDate(projectId, newDate, comment).subscribe(resp => {
      if (resp.result) {
        swal({
          title: 'saved',
          text: 'Next Review Date is saved!!',
          type: 'success',
          showConfirmButton: false,
          timer: 3000, allowOutsideClick: true
        });
      }
    })
  }

  onClickChecklistStatus() {
    this.projectCheckList.showModalView(this.popupdata[0].id);
  }

  loadProjectCheckListStatusCount(projectId) {
    this.permissionService.HTTPGetAPI("projectsetup/loadProjectCheckListStatusCount/" + projectId).subscribe(res => {
      this.projectChecklistStatus = res.result;
      this.projectChecklistPercentage = res.percentage;
    });
  }

  onClosecheckListModal() {
    this.loadProjectCheckListStatusCount(this.popupdata[0].id);
  }

  calculatePercentage(totalSum, value) {
    if (totalSum == 0 && value == 0)
      this.percentage = 0;
    else
      this.percentage = Math.floor(value / totalSum * 100);
    this.progressBarColour = this.percentage == 100 ? "progress-bar bg-success" : "progress-bar";
    return this.percentage;
  }
  onChangeReleaseDate(event) {
    this.releaseDate = event;
  }

  saveReleaseDate(date: any, row) {
    let newDate = date ? JSON.stringify(date.date) : "";
    let that = this;
    swal({
      title: "Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      allowOutsideClick: false,
    })
      .then((value) => {
        if (value) {
          that.updateReleaseDate(row.id, newDate, value);
        } else {
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: this.permissionService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              that.saveReleaseDate(newDate, row);
            }
          });
        }
      }).catch(() => {
        row.releaseDate = this.releaseDate;
      });
  }

  updateReleaseDate(projectId, newDate, comment) {
    this.releaseDate = null;
    this.permissionService.HTTPPostAPI(newDate, "projectsetup/updateReleaseDate/" + projectId + "/" + comment).subscribe(resp => {
      if (resp.result) {
        swal({
          title: 'saved',
          text: 'Release Date is saved!!',
          type: 'success',
          showConfirmButton: false,
          timer: 3000, allowOutsideClick: true
        });
      }
    })
  }

  onClickRequiremennt(row) {
    this.permissionService.saveCurrentProject({ "projectId": row.id, "locationId": row.selectedLocations[0].id }).subscribe(response => {
      this.adminComponent.loadCurrentUserDetails().then(rr => {
        this.router.navigate(["requirementSummary"]);
      })
    });
  }

}
