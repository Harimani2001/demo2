import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CommonModel, DocumentSummaryDTO, ProjectSetup, ProjectTaskDTO, StepperClass, TaskBoardDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { AuditTrailService } from '../audit-trail/audit-trail.service';
import { DashBoardService } from '../dashboard/dashboard.service';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { traceabilitymatrixService } from '../traceabilitymatrix/traceabilitymatrix.service';
import { ProjectUrlChecklistComponent } from './../projectsetup/project-url-checklist/project-url-checklist.component';
import { WorkflowConfigurationService } from './../workflow-configuration/workflow-configuration.service';
import { ProjectSummaryService } from './project-summary.service';
import { ChartOptions } from 'chart.js';
import { ProjectChecklistComponent } from '../project-checklist/project-checklist.component';
import { TaskCreationService } from '../task-creation/task-creation.service';
import { GxpComponent } from '../projectsetup/gxp/gxp.component';
@Component({
  selector: 'app-project-summary',
  templateUrl: './project-summary.component.html',
  styleUrls: ['./project-summary.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectSummaryComponent implements OnInit {
  @ViewChild('freezemodal') freezeModalData: any;
  @ViewChild('modalLargeWorkFlowProjectSummary') stepperListView: ModalBasicComponent;
  @ViewChild('checkListURLId') checkListURLId: ProjectUrlChecklistComponent;
  @ViewChild('shareGraphEmail') shareGraphEmail: any;
  @ViewChild('mydatatable') table: any;
  @ViewChild('myTable') myTable: any;
  @ViewChild('summaryTab') tab: any;
  @ViewChild('projectCheckList') projectCheckList: ProjectChecklistComponent;
  @ViewChild('gxpFORM') gxpFormComponent: GxpComponent;
  spinnerFlag = false;
  data: any;
  filterData: any;
  nextReviewDate: any;
  category: string = "";
  docItemList: any;
  activeTabId: any;
  freezeData: any;
  documentSummaryList: DocumentSummaryDTO[];
  filteredDocumentSummaryList: DocumentSummaryDTO[];
  documentConstantNameTemp: null;
  selectedVersion: string = "";
  documentlockDataLogs: any[] = new Array();
  versions: any;
  public projectDetails: ProjectSetup = null;
  commonModal: CommonModel = new CommonModel();
  public loadStepperList: any[] = new Array();
  docName = "";
  percentage: number = 0;
  progressBarColour: string;
  DraftDocumentCount = 0;
  inProgressDocumentCount = 0;
  completedDocumentCount = 0;
  allDocumentCount = 0;
  allUnPublishedItemCount = 0;
  allPublishedItemCount = 0;
  allItemCount = 0;
  currentVersion = "";
  datePipeFormat = 'dd-MM-yyyy';
  ftpFolderSize: any;
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
  docId: string;
  urlListData: any[] = new Array();
  isSubmitted: boolean = false;
  public filterQuery = '';
  chartData: any[] = new Array();
  pieChartLabels: string[] = ['Draft', 'Published', 'Total Items'];
  pieChartType: string = 'pie';
  pieChartColors: Array<any> = [{
    backgroundColor: ['#e17474', '#e9e558', '#67c2df']
  }];
  pieChartOptions: ChartOptions = {
    responsive: false,
    legend: {
      position: 'left',
    },
  };
  detailedView: boolean = false;
  indexValue: any;
  projectChecklistStatus: string = "";
  projectChecklistPercentage: number;
  projectId: any;
  showMore: boolean = false;
  taskData: TaskBoardDTO[] = new Array<TaskBoardDTO>();
  showExpansion: boolean = false;
  @ViewChild('revisionDocs') revisionDocs: any;
  viewList = new Array();
  constructor(public workflowService: WorkflowConfigurationService, public taskCreationService: TaskCreationService,
    private adminComponent: AdminComponent, private traceservice: traceabilitymatrixService,
    public auditService: AuditTrailService, public helper: Helper, public router: Router,
    public service: ProjectSummaryService, public dashboardService: DashBoardService, public config: ConfigService,
    public datePipe: DatePipe, private servie: DateFormatSettingsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(query => {
      this.loadDocuments(query["projectId"]);
      this.loadVersion(query["projectId"]).then(() => {
        if (null != query["documentType"] && null != query["type"] && null != query["count"]) {
          this.goToDetails(query["documentType"], query["type"], query["count"]);
          const interval = setInterval(() => {
            if (this.tab) {
              this.tab.activeId = 'Details';
              this.activeTabId = "Details";
              clearInterval(interval);
            }
          }, 100)
        } else {
          this.activeTabId = "Summary";
        }
      })
    });
    this.adminComponent.setUpModuleForHelpContent("167");
    this.loadOrgDateFormatAndTime();
    this.spinnerFlag = false;
  }

  loaddata(): Promise<void> {
    return new Promise<void>(resolve => {
      this.spinnerFlag = true;
      this.service.loadProjectSummary(this.selectedVersion).subscribe(jsonResp => {
        this.spinnerFlag = false;
        this.activeTabId = "Summary";
        if (jsonResp.result != null) {
          jsonResp.result.document.forEach(plan => {
            plan.projectPlan.forEach(element => {
              if (!this.helper.isEmpty(element.startTargetDate)) {
                var today = new Date(element.startTargetDate.year, element.startTargetDate.month - 1, element.startTargetDate.day);
                element.startTargetDate = this.datePipe.transform(today, this.datePipeFormat);
                today = new Date(element.endTargetDate.year, element.endTargetDate.month - 1, element.endTargetDate.day);
                element.endTargetDate = this.datePipe.transform(today, this.datePipeFormat);
              }
            });
          });
          this.filteredDocumentSummaryList = jsonResp.result.document;
          this.documentSummaryList = jsonResp.result.document;
          this.totalCountOnDocuments(this.filteredDocumentSummaryList);
          if (jsonResp.result.nextReviewDate) {
            let startdateString = JSON.parse(jsonResp.result.nextReviewDate);
            let today = new Date(startdateString.year, startdateString.month - 1, startdateString.day);
            this.nextReviewDate = this.datePipe.transform(today, this.datePipeFormat);
          }
        }
        resolve();
      },
        err => {
          resolve();
          this.spinnerFlag = false;
        }
      );
    })
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

  loadVersion(projectId): Promise<void> {
    return new Promise<void>(resolve => {
      this.spinnerFlag = true;
      this.service.loadProjectVersions(projectId).subscribe(jsonResp => {
        this.spinnerFlag = false;
        this.versions = jsonResp.result;
        this.versions.filter(element => element.activeFlag === 'Y').forEach(element => {
          this.currentVersion = element.id;
          this.selectedVersion = element.id;
          this.loadProjectDetails(element.projectSetupId);
          this.projectId = element.projectSetupId;
          this.loadProjectCheckListStatusCount();
        });
        this.loaddata().then(() => {
          resolve();
        });
      },
        err => {
          resolve();
          this.spinnerFlag = false;
        });
      this.spinnerFlag = false;
    })
  }

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.datePipeFormat = result.datePattern.replace("mm", "MM");
        this.datePipeFormat = this.datePipeFormat.replace("YYYY", "yyyy");
      }
    });
  }

  loadProjectDetails(id) {
    this.config.HTTPPostAPI(id, 'projectsetup/editproject').subscribe(jsonResp => {
      if (jsonResp.result == 'success') {
        try {
          if (jsonResp.data.startDate) {
            let startdateString: any = JSON.parse(jsonResp.data.startDate);
            var today = new Date(startdateString.year, startdateString.month - 1, startdateString.day);
            jsonResp.data.startDate = this.datePipe.transform(today, this.datePipeFormat);
          } else {
            jsonResp.data.startDate = "";
          }
        } catch (error) {
          jsonResp.data.startDate = "";
        }

        try {
          if (jsonResp.data.endDate) {
            let startdateString = JSON.parse(jsonResp.data.endDate);
            today = new Date(startdateString.year, startdateString.month - 1, startdateString.day);
            jsonResp.data.endDate = this.datePipe.transform(today, this.datePipeFormat);
          } else {
            jsonResp.data.endDate = "";
          }
        } catch (error) {
          jsonResp.data.endDate = "";
        }

        this.projectDetails = jsonResp.data;
        this.loadProjectFTPSize(this.projectDetails.projectName);
      }
    })
  }

  totalCountOnDocuments(list: DocumentSummaryDTO[]) {
    this.allUnPublishedItemCount = 0;
    this.allPublishedItemCount = 0;
    this.allItemCount = 0;

    this.DraftDocumentCount = 0;
    this.inProgressDocumentCount = 0;
    this.completedDocumentCount = 0;
    this.allDocumentCount = list.length;
    list.forEach(data => {
      this.allUnPublishedItemCount += data.draft;
      this.allPublishedItemCount += data.published;
      this.allItemCount = this.allUnPublishedItemCount + this.allPublishedItemCount;

      if (data.published === 0 && data.completed === 0)
        ++this.DraftDocumentCount;
      else if (data.published != data.completed)
        ++this.inProgressDocumentCount;
      else
        ++this.completedDocumentCount;
    })
    this.chartData.push(this.allUnPublishedItemCount);
    this.chartData.push(this.allPublishedItemCount);
    this.chartData.push(this.allItemCount);
  }

  tracePdfdownload() {
    this.spinnerFlag = true;
    this.traceservice.generatePdf().subscribe(res => {
      var blob: Blob = this.b64toBlob(res._body, 'application/pdf');
      let name = "Traceabilitymatrix_" + new Date().toLocaleDateString() + ".pdf";
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
      this.spinnerFlag = false;
    });
  }

  loadDocuments(projectId) {
    this.docItemList = new Array<any>();
    this.config.loadDocBasedOnProject(projectId).subscribe(resp => {
      this.docItemList = resp;
      this.config.checkIndividualModulePermission(this.helper.VENDOR_VALIDATION_VALUE).subscribe(resp => {
        if (resp) {
          this.docItemList.push({ "key": this.helper.VENDOR_VALIDATION_VALUE, "value": "Vendor Documents" });
        }
      });
      this.config.checkIndividualModulePermission(this.helper.Unscripted_Value).subscribe(resp => {
        if (resp) {
          this.docItemList.push({ "key": this.helper.Unscripted_Value, "value": "Unscripted Testing" });
        }
      });
    });
  }

  onSummaryData() {
    this.filteredDocumentSummaryList = [];
    if (!this.helper.isEmpty(this.category)) {
      this.documentSummaryList.forEach(element => {
        if (this.category === element.documentType)
          this.filteredDocumentSummaryList.push(element);
      });
    } else {
      this.filteredDocumentSummaryList = this.documentSummaryList;
    }
    this.spinnerFlag = false;
  }

  loadAllTask() {
    this.taskData = new Array<TaskBoardDTO>();
    this.taskCreationService.loadOpenInProgressTasksForProjDocs().subscribe(resp => {
      if (resp.result != null) {
        this.docItemList.forEach(doc => {
          let list: ProjectTaskDTO[] = resp.result.filter(f => (f.selectedDocumentTypes).includes(doc.key));
          let dto = new TaskBoardDTO();
          dto.name = doc.value;
          dto.list = list;
          this.taskData.push(dto);
        });
        this.spinnerFlag = false;
      }
    }, er => {
      this.spinnerFlag = false;
    });
  }

  routeView(row) {
    if (row.permissionCategory.includes("Template")) {
      this.adminComponent.redirect(row.url)
    } else if (row.documentId.length > 0 && row.documentConstant == this.helper.VENDOR_VALIDATION_VALUE) {
      this.router.navigate([row.url], { queryParams: { id: row.documentTypeIds[0].documentId, status: '/taskCreation' } });
    } else
      this.adminComponent.taskURLNavigation(row);
  }

  onClickTaskCount() {
    if (this.tab) {
      this.tab.activeId = 'Tasks';
      this.activeTabId = "Tasks";
      this.spinnerFlag = true;
      this.loadAllTask();
    }
  }

  goToDetails(doc: string, type: any, count) {
    this.filterData = [];
    this.activeTabId = "Details";
    this.category = doc;
    let json = { documentType: doc, type: type, versionId: this.selectedVersion }
    this.spinnerFlag = true;
    if (count != 0) {//to reduce the hit
      this.config.HTTPPostAPI(json, 'projectsetup/goProjectSummaryDetails').subscribe(resp => {
        this.filterData = resp;
        this.spinnerFlag = false;
      });
    } else {
      this.spinnerFlag = false;
    }
  }

  loadProjectReferenceData() {
    this.config.HTTPPostAPI('', 'projectsetup/loadProjectUrlData').subscribe(resp => {
      this.checkListURLId.checkListView = resp.urlList;
      this.spinnerFlag = false;
    });
  }

  saveURLList(list: any[]) {
    if (list.length > 0) {
      this.spinnerFlag = true;
      this.config.HTTPPostAPI(list[0], 'projectsetup/saveProjectURLCheckListIndividual').subscribe(resp => {
        if (resp.result == "success") {
          this.checkListURLId.checkList = new Array();
          swal({
            title: 'Success',
            text: "Saved Successfully",
            type: 'success', timer: 2000, showConfirmButton: false
          })
        }
        this.loadProjectReferenceData();
      }, err => this.loadProjectReferenceData());
    }
  }

  onTabChange(id) {
    this.spinnerFlag = true;
    this.activeTabId = id;
    if (id == 'Summary') {
      this.onSummaryData();
    } else if (id == 'Tasks') {
      this.loadAllTask();
    } else if (id == 'Details') {
      this.filterData = [];
      if (!this.helper.isEmpty(this.category)) {
        this.goToDetails(this.category, '', 1);
      } else {
        this.spinnerFlag = false;
      }
    } else if (id == 'References') {
      this.loadProjectReferenceData();
    } else {
      this.spinnerFlag = false;
    }
    this.myTable.rowDetail.collapseAllRows();
    this.showExpansion = false;
  };

  auditPdfdownload() {
    this.spinnerFlag = true;
    this.auditService.generatePdf().subscribe(res => {
      var blob: Blob = this.b64toBlob(res._body, 'application/pdf');
      let name = "AuditTrial" + new Date().toLocaleDateString() + ".pdf";
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

  downloadPdf(documentConstnatName: any, docName: any) {
    this.spinnerFlag = true;
    this.dashboardService.downloadDocumentPdf(documentConstnatName, this.selectedVersion, "Project Summary").subscribe(res => {
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

  checkifdocumentIsLockedService(constantName): Promise<void> {
    return new Promise<void>(resolve => {
      this.service.docLockStatus(constantName, this.selectedVersion).subscribe(jsonResp => {
        this.freezeData = jsonResp;
        resolve()
      }, err => {
        this.spinnerFlag = false;
      }
      );
    });
  }

  checkdocumentIslockOrNot(data) {
    this.spinnerFlag = true;
    this.service.docLockPermissions(data, this.selectedVersion).subscribe(rsp => {
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

  saveDocumentLockAndUnlock() {
    this.freezeData.documentLock = !this.freezeData.documentLock;
    if (this.freezeData.documentLock && this.freezeData.draftList.length > 0) {
      var dataObj = this;
      swal({
        html: `<h5 >There are a few items in Draft. Would you like to lock the document?</h5>`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
      })
        .then((value) => {
          dataObj.callSaveLock();
        }).catch(err => {
          this.freezeData.documentLock = !this.freezeData.documentLock;
          this.freezeData.documentLockComments = '';
        });
    } else {
      this.callSaveLock();
    }
  }

  callSaveLock() {
    this.spinnerFlag = true;
    this.workflowService.documentLockUnlock(this.freezeData).subscribe(resp => {
      this.config.HTTPGetAPI("projectsetup/loadProjectvalidationStatusForEdit").subscribe(res => {
        this.spinnerFlag = false;
        if (res)
          this.projectDetails.validationStatus = res.validationStatus;
        this.projectDetails.systemStatus = res.systemStatus;
      });
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
        this.freezeData.documentLockComments = '';
        this.freezeModalData.hide();
      }

      this.loaddata();
      this.onTabChange(this.activeTabId);
    });
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

  loadProjectFTPSize(projectName) {
    this.service.loadProjectFTPSize(projectName).subscribe(data => {
      if (data != '' && data != null) {
        this.ftpFolderSize = data.ftpSize;
      }
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

  toggleExpandRow(row) {
    this.myTable.rowDetail.toggleExpandRow(row);
  }

  onClickChecklistStatus() {
    this.projectCheckList.showModalView(this.projectId);
  }

  loadProjectCheckListStatusCount() {
    this.config.HTTPGetAPI("projectsetup/loadProjectCheckListStatusCount/" + this.projectId).subscribe(res => {
      this.projectChecklistStatus = res.result;
      this.projectChecklistPercentage = res.percentage;
    });
  }

  onClosecheckListModal() {
    this.loadProjectCheckListStatusCount();
  }

  showAction(documentType): boolean {
    let result: boolean = true;
    switch (documentType) {
      case this.helper.VENDOR_VALIDATION_VALUE:
        result = false;
      case this.helper.Unscripted_Value:
        result = false;
    }
    return result;
  }

  onClickProject(projectId: any) {
    this.router.navigate(['/Project-setup/view-projectsetup'], { queryParams: { id: projectId, status: document.location.pathname }, skipLocationChange: true });
  }

  projectSetUpPdfDownload(projectId: any) {
    this.spinnerFlag = true;
    this.config.HTTPPostAPIFile('projectsetup/downloadProjectPdf', projectId).subscribe(resp => {
      this.adminComponent.previewByBlob("Project_SetUp.pdf", resp, false);
      this.spinnerFlag = false;
    });
  }
  loadRecordView(list) {
    this.viewList = list;
    this.revisionDocs.show();
  }
}
