import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CommonModel, DocumentSummaryDTO, UserPrincipalDTO, UserShortcutsDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { ChartOptions } from 'chart.js';
import swal from 'sweetalert2';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css'],
})

export class MainmenuComponent implements OnInit {
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  public user: UserPrincipalDTO = new UserPrincipalDTO();
  public enableData: UserShortcutsDTO = new UserShortcutsDTO();
  gxpFormExists: boolean = false;
  permissionData: any[] = new Array();
  showValProjectSetUp: boolean = false;
  showEquipment: boolean = false;
  showForms: boolean = false;
  showQms: boolean = false;
  showMaster: boolean = false;
  showReport: boolean = false;
  showSetting: boolean = false;
  showTask: boolean = false;
  cardName: string;
  projectDocumentList: any[] = new Array();
  formsForMainMenu: any[] = new Array();
  templatesForMainMenu: any[] = new Array();
  orgFormsForMainMenu: any[] = new Array();
  public tableView: boolean = false;
  filteredDocumentSummaryList: DocumentSummaryDTO[] = new Array();
  pieChartType: string = 'pie';
  modulesList: any[] = new Array();
  taskList: any[] = new Array();
  equipmentList: any[] = new Array();
  recentActivites: any[] = new Array();
  approvalCount: any[] = new Array();
  modal: CommonModel = new CommonModel();
  pieChartColors: Array<any> = [{
    backgroundColor: ['#eb5334', '#87CEFA', '#ebe834', '#97DC21'],
  }];
  pieChartColorsForTestCase: Array<any> = [{
    backgroundColor: ['#f54296', '#ebe834', '#97DC21', '#eb5334', '#87CEFA', '#dd42f5'],
  }];
   public doughnutChartType: string = 'doughnut';

   pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
  };

  now: Date = new Date();
  public spinnerFlag = false;
  message: any;
  data: any;
  filterData: any = [];


  constructor(private adminComponent: AdminComponent, private configService: ConfigService, public helper: Helper, public router: Router,
    public projectService: projectsetupService) {
    this.adminComponent.setUpModuleForHelpContent("");
    this.adminComponent.taskEnbleFlag = true;
    this.adminComponent.loadCurrentUserDetails().then(response =>{
      this.user=response.versionId;
    })   
  }

  ngOnInit() {
   
    this.loadModulePermissionForRole();
    this.loadProjectDocumentList();
    this.loadProjectFormsForMainMenu();
    this.loadProjectTemplatesForMainMenu();
    this.loadOrgFormsForMainMenu();
    
    this.loadBasicTaskReportData();
    this.loadUserShortCutEnableData()
    this.loadTaskDetailsOfTheUser()
    this.loadEquipmentListOfUserAndPeriod()
    this.loaduserShortcutModules()
    this.loadUserActions()
    this.loadApprovalCountOfDocument()
    this.loadDocumentSumaryData();
  }

  ngAfterViewInit(): void {
    this.configService.getUserPreference(this.helper.MAIN_MENU).subscribe(res => {
      if (res.result) {
        this.showSubCard(res.result);
      }
    });
  }

  changeview(value: any) {
    this.tableView = value;
    this.configService.saveUserPreference("Home", this.tableView ? "table" : "card").subscribe(res => { });
  }

  loadBasicTaskReportData() {
    this.filterData = [];
    let location,projectIds;
    if(!location){
      location="0";
    }
    let data = {"flag": false, "location":location, "projectIds":projectIds}
    this.configService.HTTPPostAPI(data, "taskReport/loadIndividualtaskData").subscribe(res => {
      for (var key in res.data) {
        res.data[key].tasks.forEach(element => {
          element.dueDate = element.dueDate.split(" ")[0];
          element.updatedDate = element.updatedDate.split(" ")[0];
        });
        this.data = { 'name': key, 'openCount': res.data[key].openCount, 'completedCount' : res.data[key].completedCount, 'totalCount' : res.data[key].totalCount, 'openWidth' : res.data[key].openWidth, 'completedWidth' : res.data[key].completedWidth, 'dto': res.data[key].tasks.sort((a, b) => b.remaingDays.localeCompare(a.remaingDays.includes("Overdue"))) }
        this.filterData.push(this.data);
      }
    })
  }




  loadDocumentSumaryData() {
    this.configService.HTTPPostAPI(this.user, "projectsetup/getProjectSummary").subscribe(jsonResp => {
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
      }
    );
  }

  routeView(row) {
    if (row.permissionCategory.includes("Template")) {
      this.adminComponent.redirect(row.url)
    } else if (row.documentId.length > 0 && row.documentConstant == this.helper.VENDOR_VALIDATION_VALUE) {
      this.router.navigate([row.url], { queryParams: { id: row.documentTypeIds[0].documentId, status: '/taskCreation' } });
    } else
      this.adminComponent.taskURLNavigation(row);
  }

  loadModulePermissionForRole() {
    this.configService.HTTPGetAPI("modules/getModulePermissionForRole").subscribe(jsonResp => {
      this.permissionData = jsonResp;
      this.loadCurrentUserDetails();
    });
  }

  loadCurrentUserDetails() {
    const permissionData = this.permissionData.filter(p => p.uniqueKey === "100");
    if (permissionData && permissionData.length > 0) {
      this.adminComponent.loadCurrentUserDetails().then(jsonResp => {
        this.currentUser = jsonResp;
        if (this.currentUser.projectId) {
          this.projectService.isExistsGxpForProject(this.currentUser.projectId).subscribe(resp => {
            this.gxpFormExists = resp;
          })
        }
      })
    }
  }

  loadProjectDocumentList() {
    this.configService.HTTPPostAPI(false, "admin/loadDocumentForPdfSetting").subscribe(jsonResp => {
      this.projectDocumentList = jsonResp;
    })
  }

  loadProjectFormsForMainMenu() {
    this.configService.HTTPPostAPI("", "modules/loadNavBarForms").subscribe(jsonResp => {
      this.formsForMainMenu = jsonResp;
    });
  }

  loadProjectTemplatesForMainMenu() {
    this.configService.HTTPPostAPI("", "modules/loadNavBarTemplates").subscribe(jsonResp => {
      this.templatesForMainMenu = jsonResp;
    });
  }

  loadOrgFormsForMainMenu() {
    this.configService.HTTPPostAPI("", 'admin/loadFormForMainMenu').subscribe(jsonResp => {
      this.orgFormsForMainMenu = jsonResp;
      this.orgFormsForMainMenu = this.orgFormsForMainMenu.sort((f1, f2) => f1.order - f2.order);
    })
  }

  showSubCard(cardName: any) {
    this.cardName = cardName
    this.showValProjectSetUp = false;
    this.showEquipment = false;
    this.showForms = false;
    this.showQms = false;
    this.showMaster = false;
    this.showReport = false;
    this.showSetting = false;
    this.showTask = false;
    this.configService.saveUserPreference(this.helper.MAIN_MENU, cardName).subscribe(res => { });
    switch (cardName) {
      case 'projectSetUp':
        this.showValProjectSetUp = true;
        break;
      case 'equipment':
        this.showEquipment = true;
        break;
      case 'forms':
        this.showForms = true;
        break;
      case 'qms':
        this.showQms = true;
        break;
      case 'masterData':
        this.showMaster = true;
        break;
      case 'reports':
        this.showReport = true;
        break;
      case 'settings':
        this.showSetting = true;
        break;
      case 'myTask':
          this.showTask = true;
          break;
      default:
        break;
    }
  }

  individualPermissionsResult(docType: any) {
    if (!this.permissionData) {
      return false;
    } else {
      const permissionData = this.permissionData.filter(p => p.uniqueKey === docType);
      if (permissionData && permissionData.length > 0)
        return true;
      else
        return false;
    }
  }

  checkProjectDocument(docType: any) {
    const item = this.projectDocumentList.filter(f => f.key === docType);
    if (item.length > 0)
      return true
    else
      return false;
  }

  navigateToModule(constantName: any) {
    const permission = this.permissionData.filter(f => constantName === f.uniqueKey);
    if (permission && permission.length > 0) {
      this.router.navigate([permission[0].url]);
      localStorage.setItem('cardName', this.helper.encode(this.cardName));
    }
  }

  navigateToProjectTab(tabName: any) {
    this.router.navigate(["Project-setup/add-projectsetup"], { queryParams: { id: this.helper.encode(this.currentUser.projectId), tab:this.helper.encode(tabName)} });
  }

  navigateToTestExecutionReport() {
    this.router.navigate(["dashboard"], { queryParams: { tabId: 'graphView', url: window.location.pathname } });
  }

  redirect(url, status?) {
    var queryParams = {};
    if (status) {
      queryParams["status"] = status;
    }
    if (url.includes("dynamicForm")) {
      let finalURLList = url.split("?");
      queryParams["exists"] = finalURLList[1];
      queryParams["id"] = finalURLList[0].split("/")[1];
      queryParams["isMapping"] = finalURLList[2];
      if (finalURLList[3]) {
        queryParams["documentCode"] = finalURLList[3];
      }
      this.router.navigate([finalURLList[0]], { queryParams: queryParams, skipLocationChange: true });
    } else if (url.includes("newDynamicTemplate")) {
      let finalURLList = url.split("?");
      let valueList = finalURLList[1].split("&");
      queryParams["exists"] = valueList[1];
      queryParams["id"] = valueList[0];
      this.router.navigate([finalURLList[0]], { queryParams: queryParams, skipLocationChange: true });
    } else {
      this.router.navigateByUrl(url);
    }
  }

  loadApprovalCountOfDocument() {
    this.approvalCount = new Array();
    this.configService.HTTPPostAPI("","home/loadApprovalCountOfDocument").subscribe(response => {
      if (response.result == 'success') {
        this.approvalCount = response.userApprovalsCount;
      }
    });
  }


  loadUserShortCutEnableData(): Promise<void> {
    return new Promise<void>(resolve => {
      this.configService.HTTPPostAPI("","home/loadUserShortCutEnableData").subscribe(response => {
        if ('success' == response.result)
          this.enableData = response.userShortcuts;
        resolve();
      }, err => { resolve() })
    })
  }

  loadTaskDetailsOfTheUser() {
    this.taskList = [];
    this.configService.HTTPPostAPI("","home/loadTaskDetailsOfTheUser").subscribe(response => {
      if ('success' == response.result)
        this.taskList = response.tasks;
    });
  }


  loadEquipmentListOfUserAndPeriod() {
    this.equipmentList = [];
    this.configService.HTTPPostAPI("","home/loadEquipmentListOfUserAndPeriod").subscribe(response => {
      if ('success' == response.result)
        this.equipmentList = response.equipments;
    });
  }
  

  loaduserShortcutModules() {
    this.modulesList = [];
    this.configService.HTTPPostAPI("", "home/loadHomePageData").subscribe(response => {
      if (response.result) {
        this.modulesList = response.userShortcuts;
    }
    })
  }

  loadUserActions() {
    this.recentActivites = new Array();
    this.configService.HTTPPostAPI("","home/lastActions").subscribe(response => {
      if (response.result == 'success') {
        if (this.enableData.userDocuments)
          this.recentActivites = response.userDocuments;
      }
    });
  }

  urlRedirect(data: any) {
    if (!data.mappingFlag) {
      this.configService.checkIndividualModulePermission(data.key).subscribe(resp => {
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
      this.configService.checkGroupFormModulePermission(data.mappingId).subscribe(resp => {
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
    this.router.navigate(['/taskCreation'], { queryParams: { id: task.id, url: "/MainMenu" }, skipLocationChange: true });
  }

  activitesData(url: any) {
    if (url != null)
      this.adminComponent.redirect(url, "/MainMenu");
  }

 
  eqDetails() {
    this.router.navigateByUrl("/equipmentStatusUpdate");
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
