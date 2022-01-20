import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Helper } from './../../shared/helper';
import { DashBoardService } from './dashboard.service';
import { AdminComponent } from '../../layout/admin/admin.component';
import { DatePipe } from '@angular/common';
import { DocumentSummaryDTO, TestCaseCountDTO, UserPrincipalDTO } from '../../models/model';
import { LocationService } from '../location/location.service';
import { ConfigService } from '../../shared/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskReportService } from '../task-report/task-report.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { ProjectSummaryService } from '../project-summary/project-summary.service';
import swal from 'sweetalert2';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})

export class DashboardComponent implements OnInit {
  spinnerFlag: boolean = false;
  @ViewChild('myTable') table: any;
  @ViewChild('freezemodal') freezeModalData: any;
  @ViewChild('revisionDocs') revisionDocs: any;
  locationsList: any[] = new Array();
  location: any;
  projectDropdownSettings = {
    singleSelection: true,
    text: "Select Project",
    badgeShowLimit: 1,
    enableSearchFilter: true,
    classes: "myclass custom-class",
  };
  projectList = [];
  project = [];
  tabName: any;
  boardViewData: any;
  objectKeys = Object.keys;
  summaryData: any[] = new Array();
  detailViewData: any;
  totalDocumentCount: number = 0;
  iqtcCount: TestCaseCountDTO = new TestCaseCountDTO();
  pqtcCount: TestCaseCountDTO = new TestCaseCountDTO();
  oqtcCount: TestCaseCountDTO = new TestCaseCountDTO();
  ioqtcCount: TestCaseCountDTO = new TestCaseCountDTO();
  opqtcCount: TestCaseCountDTO = new TestCaseCountDTO();
  taskViewData: any = [];
  showProjectCount: boolean = false;
  showEquipmentCount: boolean = false;
  documentlockDataLogs: any[] = new Array();
  freezeData: any;
  public currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  filteredDocumentSummaryList: DocumentSummaryDTO[] = new Array();
  donutChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
  };
  pieChartColorsForTestCase: Array<any> = [{
    backgroundColor: ['#f54296', '#ebe834', '#97DC21', '#eb5334', '#87CEFA', '#dd42f5'],
  }];
  viewList = new Array();
  pieChartOptions: ChartOptions = {
    responsive: false,
    legend: {
      position: 'right',
    },
  };
  chartProjectTypeColors: Array<any> = [{
    backgroundColor: ['#f54296', '#ebe834', '#97DC21', '#eb5334', '#87CEFA', '#dd42f5'],
  }];
  chartProjectTypeLables: any[] = new Array();
  chartProjectTypeValues: any[] = new Array();
  projectType: any;
  projectCount: any;
  projectCountOnType: any;
  permissionData: any[] = new Array();
  projectDocumentList: any[] = new Array();

  constructor(private adminComponent: AdminComponent, public helper: Helper, public taskService: TaskReportService,
    public service: DashBoardService, public datePipe: DatePipe, public locationService: LocationService,
    public configService: ConfigService, public router: Router, public projectsetupService: projectsetupService,
    public projectSummaryService: ProjectSummaryService, public workflowService: WorkflowConfigurationService,
    public route: ActivatedRoute) {
  }

  ngOnInit() {
    var tabId = this.route.snapshot.queryParams["tabId"];
    if (tabId)
      this.configService.saveUserPreference("Dashboard", tabId).subscribe(resp => { });
    this.loadCurrentUserDetails();
    this.loadcurrentProjectDetail();
    this.adminComponent.setUpModuleForHelpContent("101");
    this.adminComponent.taskDocType = "101";
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskEnbleFlag = true;
  }

  ngAfterViewInit(): void {
  }

  loadCurrentUserDetails() {
    this.adminComponent.loadCurrentUserDetails().then(jsonResp => {
      this.currentUser = jsonResp;
    })
  }

  loadcurrentProjectDetail() {
    this.projectsetupService.loadCurrentLocationOfProject().subscribe(jsonResp => {
      this.location = jsonResp.result.id;
      this.project.push({ id: jsonResp.project.id, itemName: jsonResp.project.projectName })
      this.loadProjectsOnLocation().then(resp => {
        this.loadLocation();
      });
    });
  }

  loadProjectsOnLocation(): Promise<void> {
    return new Promise<void>(resolve => {
      this.configService.loadprojectOfUserAndCreatorForLocation(this.location).subscribe(response => {
        this.projectList = response.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
        resolve();
      }, err => {
        resolve();
      })
    });
  }

  loadLocation() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationsList = response.result;
      this.configService.getUserPreference("Dashboard").subscribe(res => {
        if (res.result)
          this.changeview(res.result);
        else
          this.changeview('boardView');
      });
    });
  }

  loadBoardViewData() {
    if (this.location) {
      this.chartProjectTypeLables = [];
      this.chartProjectTypeValues = [];
      this.spinnerFlag = true;
      this.service.loadBoardViewData(this.location).subscribe(jsonResp => {
        if (jsonResp.result) {
          this.boardViewData = jsonResp;
          this.objectKeys(this.boardViewData.projectTypeCount).forEach(item => {
            this.chartProjectTypeLables.push(item);
            this.chartProjectTypeValues.push(this.boardViewData.projectTypeCount[item]);
          })
          this.spinnerFlag = false;
        }
      }, err => {
        this.spinnerFlag = false;
      })
    }
  }

  getBgColor(key) {
    let color = '';
    switch (key) {
      case 'Not Completed':
      case 'Initiated':
        color = '#ffa357';
        break;
      case 'In Process':
      case 'Validation Ongoing':
        color = '#fff069';
        break;
      case 'Technically Released':
        color = '#dcfc83';
        break;
      case 'Completed':
      case 'Validated':
        color = '#9cbdff';
        break;
      case 'Controlled by SOPs':
        color = '#e59cff';
        break;
      case 'Not applicable':
      case 'Not Required':
        color = '#c4c0bc';
        break;
      default:
        break;
    }
    return color;
  }

  chartClicked(e: any) {
    this.projectCountOnType = '';
    this.spinnerFlag = true;
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        const clickedElementIndex = activePoints[0]._index;
        this.projectType = chart.data.labels[clickedElementIndex];
        this.projectCount = chart.data.datasets[0].data[clickedElementIndex];
        this.configService.HTTPGetAPI("dashboard/loadProjectCountOnLocationAndProjectType/" + this.location + "/" + this.projectType).subscribe(jsonResp => {
          if (jsonResp.result)
            this.projectCountOnType = jsonResp.projectCount;
          this.spinnerFlag = false;
        }, error => {
          this.spinnerFlag = false;
        })
      }
    }
  }

  onChangeLocation(locationId) {
    this.location = locationId;
    this.project = [];
    this.loadProjectsOnLocation();
    this.changeview(this.tabName);
  }

  onChangeProject(projectId) {
    this.project = projectId;
    this.changeview(this.tabName);
  }

  changeview(tabName) {
    this.configService.saveUserPreference("Dashboard", tabName).subscribe(res => { });
    this.tabName = tabName;
    switch (this.tabName) {
      case 'tableView':
        this.summaryData = [];
        this.loadSummaryData();
        break;
      case 'graphView':
        this.summaryData = [];
        this.loadSummaryData();
        this.loadDocumentSumaryData();
        break;
      case 'detailView':
        this.detailViewData = '';
        this.configService.HTTPGetAPI("modules/getModulePermissionForRole").subscribe(jsonResp => {
          this.permissionData = jsonResp;
          this.loadDetailViewData();
        });
        break;
      case 'taskView':
        this.taskViewData = [];
        this.loadBasicTaskReportData();
        break;
      default:
        this.tabName = 'boardView';
        this.boardViewData = '';
        this.loadBoardViewData();
        break;
    }
  }

  loadSummaryData() {
    if (this.project.length > 0) {
      this.spinnerFlag = true;
      this.service.loadNewDashboard(this.location, this.project.map(m => m.id)).subscribe(resp => {
        this.summaryData = resp;
        this.summaryData.forEach(data => {
          data.versionList.forEach((version, index) => {
            let comboChartData = {
              chartType: 'ComboChart',
              dataTable: [],
              options: {
                height: 300,
                title: data.projectName,
                vAxis: { title: 'No of Documents' },
                hAxis: { title: 'Document' },
                seriesType: 'bars',
                series: { 5: { type: 'line' } },
                colors: ['#919aa3', '#62d1f3', '#FFB64D', '#93BE52',]
              },
            };
            version.nodataInChartFlag = true;
            version.documents.forEach((document: DocumentSummaryDTO) => {
              if (document.draft + document.published == 0) {
                if (version.nodataInChartFlag)
                  version.nodataInChartFlag = true;
              } else {
                version.nodataInChartFlag = false;
              }
              if (comboChartData.dataTable.length <= 16) {
                let documentData: any[] = new Array();
                documentData.push(document.documentName);
                documentData.push(document.draft);
                documentData.push(document.published);
                documentData.push(document.inProgress);
                documentData.push(document.completed);
                comboChartData.dataTable.push(documentData);
              }
            });
            if (comboChartData.dataTable.length > 0) {
              comboChartData.dataTable.unshift(['Document', 'Draft', 'Published', 'In Progress', 'Completed']);
            }
            version.comboChartData = comboChartData;
          });
        });
        this.spinnerFlag = false;
      }, err => { this.spinnerFlag = true; });
    }
  }

  loadDocumentSumaryData() {
    this.spinnerFlag = true;
    this.configService.HTTPPostAPI(this.currentUser.versionId, "projectsetup/getProjectSummary").subscribe(jsonResp => {
      if (jsonResp.result != null) {
        this.filteredDocumentSummaryList = [];
        jsonResp.result.document.forEach(data => {
          if (data.documentType == '108' || data.documentType == '109' || data.documentType == '110' || data.documentType == '207' || data.documentType == '208')
            data.testCaseCount.forEach(element => {
              let testrun = element;
              testrun.documentType = data.documentType;
              testrun.documentName = data.documentName;
              testrun.documentCategory = data.documentCategory
              this.filteredDocumentSummaryList.push(testrun);
            });
          else
            this.filteredDocumentSummaryList.push(data);
        });
        this.spinnerFlag = false;
      }
    },
      err => {
        this.spinnerFlag = false;
      }
    );
  }

  pieChartViewTestCase(element) {
    let chartData = new Array();
    chartData.push(element.runCount);
    chartData.push(element.testCaseInProgressCount);
    chartData.push(element.passCount);
    chartData.push(element.failCount);
    chartData.push(element.nACount);
    chartData.push(element.discrepancyCount);
    return chartData;
  }

  donaltChartLabel(element) {
    return ['No Run' + '-' + element.runCount, 'In-Progress' + '-' + element.testCaseInProgressCount, 'Pass' + '-' + element.passCount, 'Fail' + '-' + element.failCount, 'N/A' + '-' + element.nACount, 'DF' + '-' + element.discrepancyCount];
  }

  individualPermissionsResult(docType: any) {
    if (!this.permissionData) {
      return false;
    } else {
      if (this.permissionData.filter(p => p.uniqueKey === docType).length > 0 && this.projectDocumentList.filter(f => f.key === docType).length > 0)
        return true;
      else
        return false;
    }
  }

  loadDetailViewData() {
    if (this.project.length > 0) {
      this.spinnerFlag = true;
      this.configService.loadAllDocumentsForProject(this.project[0].id).subscribe(response => {
        this.projectDocumentList = response.Document;
        this.service.loadDetailViewData(this.project[0].id).subscribe(jsonResp => {
          if (jsonResp.result) {
            this.detailViewData = jsonResp.data;
            if (this.detailViewData.summaryDetails && this.detailViewData.summaryDetails.document) {
              this.totalDocumentCount = this.detailViewData.summaryDetails.document.length;
              this.detailViewData.summaryDetails.document.forEach(doc => {
                switch (doc.documentType) {
                  case this.helper.IQTC_VALUE:
                    this.iqtcCount = this.getTestCaseWiseCount(doc.testCaseCount);
                    break;
                  case this.helper.OQTC_VALUE:
                    this.oqtcCount = this.getTestCaseWiseCount(doc.testCaseCount);
                    break;
                  case this.helper.PQTC_VALUE:
                    this.pqtcCount = this.getTestCaseWiseCount(doc.testCaseCount);
                    break;
                  case this.helper.IOQTC_VALUE:
                    this.ioqtcCount = this.getTestCaseWiseCount(doc.testCaseCount);
                    break;
                  case this.helper.OPQTC_VALUE:
                    this.opqtcCount = this.getTestCaseWiseCount(doc.testCaseCount);
                    break;
                  default:
                    break;
                }
              });
            }
            this.spinnerFlag = false;
          }
        }, error => {
          this.spinnerFlag = false;
        })
      });
    }
  }

  getTestCaseWiseCount(list) {
    let count = new TestCaseCountDTO;
    list.forEach(item => {
      count.testCaseCount += item.total;
      count.passCount += item.passCount;
      count.failCount += item.failCount;
      count.inProgressCount += item.testCaseInProgressCount;
      count.dfCount += item.discrepancyCount;
      count.testRunCount += item.runCount;
    });
    return count;
  }

  loadBasicTaskReportData() {
    if (this.project.length > 0) {
      this.spinnerFlag = true;
      this.taskService.loadProjectData(true, this.location, this.project.map(m => m.id)).subscribe(res => {
        for (var key in res.data) {
          res.data[key].forEach(element => {
            element.updatedDate = element.updatedDate.split(" ")[0];
            element.dueDate = element.dueDate.split(" ")[0];
          });
          let data = { 'name': key, 'dto': res.data[key].sort((a, b) => b.remaingDays.localeCompare(a.remaingDays.includes("Overdue"))) }
          this.taskViewData.push(data);
        }
        this.spinnerFlag = false;
      }, error => { this.spinnerFlag = false; });
    }
  }

  navigateToInventory(valStatus: any) {
    let locName = this.locationsList.filter(f => this.location == f.id).map(m => m.name);
    this.router.navigate(['/inventory-report'], { queryParams: { locationId: this.location, locationName: locName[0], valStatus: valStatus, status: document.location.pathname }, skipLocationChange: true });
  }

  toggleExpandRowprojectsetup(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  urlRedirect(url: string, id?) {
    this.adminComponent.redirect(url, '/dashboard');
  }

  downloadPdf(documentConstnatName: any, docName: any, version: any) {
    this.spinnerFlag = true;
    this.service.downloadDocumentPdf(documentConstnatName, version.versionId, "dashboard").subscribe(res => {
      var blob: Blob = this.b64toBlob(res._body, 'application/pdf');
      let name: any;
      let date = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm');
      date = date.replace(":", "-");
      this.spinnerFlag = false;
      if (documentConstnatName != '128')
        name = docName + "--" + version.versionName + "--" + date + ".pdf";
      else
        name = docName + "--" + version.versionName + "--" + date + ".zip";
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

  routeView(row) {
    this.spinnerFlag = true;
    this.configService.saveCurrentProject({ "projectId": row.projectId, "locationId": row.locationId }).subscribe(response => {
      this.spinnerFlag = false;
      if (row.permissionCategory.includes("Template")) {
        this.adminComponent.redirect(row.url)
      } else
        this.adminComponent.taskURLNavigation(row);
    })
  }

  checkdocumentIslockOrNot(data, versionId) {
    this.spinnerFlag = true;
    this.projectSummaryService.docLockPermissions(data, versionId).subscribe(rsp => {
      this.spinnerFlag = false;
      if (rsp) {
        swal({ title: '', text: rsp, timer: 4000, showConfirmButton: false });
      } else {
        this.documentlockDataLogs = [];
        this.checkifdocumentIsLockedService(data, versionId).then((result) => {
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

  checkifdocumentIsLockedService(constantName, versionId): Promise<void> {
    return new Promise<void>(resolve => {
      this.projectSummaryService.docLockStatus(constantName, versionId).subscribe(jsonResp => {
        this.freezeData = jsonResp;
        resolve();
      }, err => {
        this.spinnerFlag = false;
      }
      );
    });
  }

  loadRecordView(list) {
    this.viewList = list;
    this.revisionDocs.show();
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
        this.freezeModalData.hide();
      }
      this.loadSummaryData();
    });
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

}
