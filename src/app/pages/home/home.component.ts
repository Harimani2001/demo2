import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions } from 'chart.js';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CommonModel, DocumentSummaryDTO, ModulePermissionDto, UserPrincipalDTO, UserShortcutsDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { HomeService } from './home.service';
import swal from 'sweetalert2';
import { TaskReportService } from '../task-report/task-report.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('searchBox') searchBox: any;
  spinning = false;
  now: Date = new Date();
  public user: UserPrincipalDTO = new UserPrincipalDTO();
  public enableData: UserShortcutsDTO = new UserShortcutsDTO();
  public spinnerFlag = false;
  message: any;
  modulesList: any[] = new Array();
  taskList: any[] = new Array();
  equipmentList: any[] = new Array();
  recentActivites: any[] = new Array();
  approvalCount: any[] = new Array();
  modal: CommonModel = new CommonModel();
  data: any;
  filterData: any = [];
  public tableView: boolean = false;
  filteredDocumentSummaryList: DocumentSummaryDTO[] = new Array();
  pieChartType: string = 'pie';
  pieChartColors: Array<any> = [{
    backgroundColor: ['#eb5334', '#87CEFA', '#ebe834', '#97DC21'],
  }];
  pieChartColorsForTestCase: Array<any> = [{
    backgroundColor: ['#f54296', '#ebe834', '#97DC21', '#eb5334', '#87CEFA', '#dd42f5'],
  }];
  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
  };
  public doughnutChartType: string = 'doughnut';

  constructor(public adminComponent: AdminComponent, public projectsetupService: projectsetupService, public helper: Helper,
    public config: ConfigService, public homeService: HomeService, private router: Router, public service: TaskReportService) {
    this.adminComponent.globalProjectObservable.subscribe(resp => {
      this.adminComponent.setUpModuleForHelpContent('');
      this.spinnerFlag = true;
      this.modal.globalProjectName = resp.value;
      this.modal.globalProjectId = + resp.key;
      this.adminComponent.loadnavBar();
      this.adminComponent.loadCurrentUserDetails().then(currentUser => {
        this.user = currentUser;
        this.loadOnPageRefresh().then(() => {
          this.spinnerFlag = false;
        }).catch(() => this.spinnerFlag = false);
      })
    });
  }

  ngOnInit() {
    this.adminComponent.taskDocType = "";
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskEnbleFlag = true;
    var timer = setInterval(() => {
      if (this.searchBox) {
        this.searchBox.nativeElement.focus();
        clearInterval(timer);
      }
    }, 1000);
    this.config.getUserPreference("Home").subscribe(res => {
      if (res.result)
        this.tableView = (res.result === "table");
    });
  }

  loadOnPageRefresh(): Promise<void> {
    var curHr = this.now.getHours()
    if (curHr < 12) {
      this.message = 'Good Morning!';
    } else if (curHr < 18) {
      this.message = 'Good Afternoon!';
    } else {
      this.message = 'Good Evening!';
    }
    return new Promise<void>(resolve => {
      this.loadUserShortCutEnableData().then(() => {
        this.taskList = new Array();
        this.equipmentList = new Array();
        this.recentActivites = new Array();
        this.approvalCount = new Array();
        if (this.enableData.summary) {
          this.loadDocumentSumaryData();
        }
        if (this.enableData.tasks) {
          this.loadTaskDetailsOfTheUser();
        }
        if (this.enableData.equipments) {
          this.loadEquipmentListOfUserAndPeriod();
        }
        if (this.enableData.userApprovalCount) {
          this.loadApprovalCountOfDocument();
        }
        this.loaduserShortcutModules();
        this.loadUserActions();
        if (this.enableData.allTask) {
          this.loadBasicTaskReportData();
        }
        resolve();
      })
    })
  }

  loadUserShortCutEnableData(): Promise<void> {
    return new Promise<void>(resolve => {
      this.homeService.loadUserShortCutEnableData().subscribe(response => {
        if ('success' == response.result)
          this.enableData = response.userShortcuts;
        resolve();
      }, err => { resolve() })
    })
  }

  loadTaskDetailsOfTheUser() {
    this.taskList = [];
    this.homeService.loadTaskDetailsOfTheUser().subscribe(response => {
      if ('success' == response.result)
        this.taskList = response.tasks;
    });
  }

  loadEquipmentListOfUserAndPeriod() {
    this.equipmentList = [];
    this.homeService.loadEquipmentListOfUserAndPeriod().subscribe(response => {
      if ('success' == response.result)
        this.equipmentList = response.equipments;
    });
  }

  loaduserShortcutModules() {
    this.modulesList = [];
    this.homeService.loaduserShortcutModules().subscribe(response => {
      if (response.result) {
        this.modulesList = response.userShortcuts;
      }
    });
  }

  loadApprovalCountOfDocument() {
    this.approvalCount = new Array();
    this.homeService.loadApprovalCountOfDocument().subscribe(response => {
      if (response.result == 'success') {
        this.approvalCount = response.userApprovalsCount;
      }
    });
  }

  loadUserActions() {
    this.recentActivites = new Array();
    this.homeService.loaduserLastActions().subscribe(response => {
      if (response.result == 'success') {
        if (this.enableData.userDocuments)
          this.recentActivites = response.userDocuments;
      }
    });
  }

  urlRedirect(data: any) {
    if (!data.mappingFlag) {
      this.config.checkIndividualModulePermission(data.key).subscribe(resp => {
        if (resp) {
          this.redirect(data.url);
        } else {
          swal(
            'Warning!',
            'You do not have permission to view this page!',
            'error'
          );
        }
      });
    } else {
      this.config.checkGroupFormModulePermission(data.mappingId).subscribe(resp => {
        if (resp) {
          this.redirect(data.url);
        } else {
          swal(
            'Warning!',
            'You do not have permission to view this page!',
            'error'
          );
        }
      });
    }
  }

  reload() {
    location.reload();
  }

  taskDetails(task) {
    this.router.navigate(['/taskCreation'], { queryParams: { id: task.id, url: "/home" }, skipLocationChange: true });
  }

  activitesData(url: any) {
    if (url != null)
      this.adminComponent.redirect(url, "/home");
  }

  redirect(url, status?) {
    this.adminComponent.redirect(url, status);
  }

  eqDetails() {
    this.router.navigateByUrl("/equipmentStatusUpdate");
  }

  loadBasicTaskReportData() {
    this.filterData = [];
    this.service.loadProjectData(false).subscribe(res => {
      for (var key in res.data) {
        res.data[key].forEach(element => {
          element.dueDate = element.dueDate.split(" ")[0];
          element.updatedDate = element.updatedDate.split(" ")[0];
        });
        this.data = { 'name': key, 'dto': res.data[key].sort((a, b) => b.remaingDays.localeCompare(a.remaingDays.includes("Overdue"))) }
        this.filterData.push(this.data);
      }
      this.spinnerFlag = false;
    }, error => { this.spinnerFlag = false });
  }

  loadDocumentSumaryData() {
    this.config.HTTPPostAPI(this.user.versionId, "projectsetup/getProjectSummary").subscribe(jsonResp => {
      if (jsonResp.result != null) {
        this.filteredDocumentSummaryList = [];
        jsonResp.result.document.forEach(data => {
          if (data.documentType != '137' && data.draft + data.published != 0) {
            if (data.documentCategory == 'Form' || data.documentCategory == 'Template' || data.documentCategory == 'Form_Group') {
              let comboChartData = {
                chartType: 'ComboChart',
                dataTable: [],
                options: {
                  height: 150,
                  vAxis: { title: 'No of Documents' },
                  hAxis: { title: 'Document' },
                  seriesType: 'bars',
                  series: { 4: { type: 'line' } },
                  colors: ['#919aa3', '#62d1f3', '#FFB64D', '#93BE52',]
                },
              };
              let documentData: any[] = new Array();
              documentData.push("");
              documentData.push(data.draft);
              documentData.push(data.published);
              documentData.push(data.inProgress);
              documentData.push(data.completed);
              comboChartData.dataTable.push(documentData);
              if (comboChartData.dataTable.length > 0) {
                comboChartData.dataTable.unshift(['', 'Draft', 'Published', 'In Progress', 'Completed']);
              }
              data['comboChartData'] = comboChartData;
            }
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
          }
        });
      }
    },
      err => {
        this.spinnerFlag = false;
      }
    );
  }

  routeView(row) {
    this.spinnerFlag = true;
    this.config.saveCurrentProject({ "projectId": row.projectId, "locationId": row.locationId }).subscribe(response => {
      this.spinnerFlag = false;
      if (row.permissionCategory.includes("Template")) {
        this.adminComponent.redirect(row.url)
      } else if (row.documentId.length > 0 && row.documentConstant == this.helper.VENDOR_VALIDATION_VALUE) {
        this.router.navigate([row.url], { queryParams: { id: row.documentTypeIds[0], status: '/taskCreation' } });
      } else
        this.adminComponent.taskURLNavigation(row);
    })
  }

  changeview(value: any) {
    this.tableView = value;
    this.config.saveUserPreference("Home", this.tableView ? "table" : "card").subscribe(res => { });
  }

  pieChartView(element) {
    let chartData = new Array();
    chartData.push(element.draft);
    chartData.push(element.published);
    chartData.push(element.inProgress);
    chartData.push(element.completed);
    return chartData;
  }

  pieChartLabels(element) {
    return ['Draft' + '-' + element.draft, 'Published' + '-' + element.published, 'In Progress' + '-' + element.inProgress, 'Completed' + '-' + element.completed];
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

}
