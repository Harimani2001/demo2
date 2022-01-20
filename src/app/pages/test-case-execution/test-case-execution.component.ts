import { ViewTestcaseFileListComponent } from './../view-testcase-file-list/view-testcase-file-list.component';
import { DocumentStatusCommentLogComponent } from './../document-status-comment-log/document-status-comment-log.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { IQTCService } from '../iqtc/iqtc.service';
import { Page } from '../../models/model';
@Component({
  selector: 'app-test-case-execution',
  templateUrl: './test-case-execution.component.html',
  styleUrls: ['./test-case-execution.component.css']
})
export class TestCaseExecutionComponent implements OnInit, OnDestroy {
  @ViewChild('testCaseTab') tab: any;
  @ViewChild('myTable') table: any;
  @ViewChild('documentcomments') documentcomments: DocumentStatusCommentLogComponent;
  @ViewChild('viewFileOfTestCase') private viewFile: ViewTestcaseFileListComponent;
  @ViewChild('forumView') forumView: any;
  @ViewChild('createDfModal') createDfModal: any;
  categorySettings = {
    singleSelection: true,
    text: 'Select Category',
    enableSearchFilter: true,
  };
  testRunSettings = {
    singleSelection: true,
    text: 'Select Test Run',
    enableSearchFilter: true,
  };
  tabName;
  permission = new Permissions('', false);
  category: any[] = new Array();
  categoryList: any[] = new Array();
  testRun: any[] = new Array();
  testRunList: any[] = new Array();
  testCaseList: any[] = new Array();
  isMultiplePDF: boolean = false;
  oldStatus: any;
  isSelectedPublishData: boolean;
  isWorkflowDocumentOrderSequence: any;
  filterQuery
  mySubscription: any
  public individualViewFlag: boolean = false;
  backUrl: string;
  id: number = 0;
  dfID: any;
  workflowMessage = '';
  documentForumModal: boolean = false;
  commentsDocumentsList: any[] = new Array();
  spinnerFlag: boolean = false;
  dfDataForTestcase: any[] = new Array();
  selectedDataForCreateDF: any = new Object();
  isUsingExistingDF: boolean = false;
  selectedDfForCreate: any[] = new Array();
  riskWorkFlowPer = false;
  roleBackId
  page: Page = new Page();
  activeTestRunId = 0;
  selectAll: boolean;
  testRunIdFromRedirect: any;
  documentLock: boolean;

  constructor(public configService: ConfigService, private adminComponent: AdminComponent, public service: IQTCService,
    private activatedRoute: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.mySubscription = this.configService.subscription(this.adminComponent.router);
    this.loadTheWorkFlowPermissions();
    this.loadTestCaseCategory().then(() => {
      if (localStorage.getItem('te-category')) {
        let categoryPrevious = this.configService.helper.decode(localStorage.getItem('te-category'));
        if (categoryPrevious) {
          this.category = this.categoryList.filter(c => c.id == categoryPrevious);
        }
      }
      if (this.category.length == 0 && this.categoryList.length > 0) {
        this.category.push(this.categoryList[0]);
      }
      this.navigateToTestCase();
    });
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  getDocumentLockStatus() {
    this.configService.HTTPGetAPI("workflowConfiguration/getDocumentLockStatus/" + this.category[0].id).subscribe(jsonResp => {
      this.documentLock = jsonResp.result;
    })
  }

  navigateToTestCase() {
    if (this.category.length > 0) {
      localStorage.setItem('te-category', this.configService.helper.encode(this.category[0].id));
      let id = this.activatedRoute.snapshot.params["id"];
      this.activatedRoute.queryParams.subscribe(query => {
        if (!this.configService.helper.isEmpty(query.id)) {
          id = query.id;
        }
        if (!this.configService.helper.isEmpty(query.testRunId)) {
          this.testRunIdFromRedirect = query.testRunId;
        }
        if (query.status) {
          this.backUrl = query.status;
        }
        if (query.roleBackId) {
          this.roleBackId = query.roleBackId;
        }
        if (query.roleBack) {
          this.backUrl = query.roleBack;
        }
        if (query.dfID)
          this.dfID = query.dfID
        if (id) {
          this.view({ id: id });
          this.loadTestActiveTestRun();
        } else {
          this.loadTestActiveTestRun().then(() => {
            this.page.pageNumber = 0;
            this.page.size = this.configService.helper.PAGE_SIZE;
            this.configService.getUserPreference("181").subscribe(res => {
              if (res.result)
                this.loadTestCases(res.result);
              else
                this.loadTestCases("summary");
            });
          });
        }
      });
      this.getDocumentLockStatus();
      this.configService.getUserPreference("181").subscribe(res => {
        if (res.result && 'summary' !== res.result) {
          this.loadPermissions();
        }
      });
    }
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadData(this.category[0].id, this.tabName, this.activeTestRunId);
  }
  loadPermissions() {
    let constant: string = this.category.length > 0 ? this.category[0].id : '';
    this.workflowMessage = '';
    if (constant) {
      this.configService.loadPermissionsBasedOnModule(constant).subscribe(resp => {
        this.permission = resp;
        this.workflowMessage = this.configService.helper.getWorkValidationMessage(this.permission.userInWorkFlow);
      });
    } else {
      this.permission = new Permissions('', false);
    }
    this.adminComponent.setUpModuleForHelpContent(constant);
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskDocType = constant;
    this.adminComponent.taskEnbleFlag = true;
  }

  loadTestCaseCategory() {
    this.categoryList = new Array();
    return new Promise<any>(resolve => {
      let type = this.activatedRoute.snapshot.params["type"];
      this.configService.loadDocBasedOnProject().subscribe(resp => {
        resp.forEach(element => {
          if (element.key == "108" || element.key == "109" || element.key == "110" || element.key == "207" || element.key == "208") {
            if (type && type == element.key) {
              this.category.push({ 'id': element.key, 'itemName': this.configService.helper.getTestCaseName(element.key) });
            }
            this.categoryList.push({ 'id': element.key, 'itemName': this.configService.helper.getTestCaseName(element.key) });
          }
        });
        resolve('');
      }, err => resolve(''));
    })

  }
  saveCurrentTab(tabName) {
    this.configService.saveUserPreference("181", tabName).subscribe(res => { });
  }
  loadTestActiveTestRun() {
    this.testRunList = new Array();
    this.testRun = new Array();
    return new Promise<void>(resolve => {
      if (this.category.length > 0) {
        this.configService.HTTPPostAPI(this.category[0].id, "testCase/loadActiveTestRun").subscribe(resp => {
          resp.forEach(element => {
            this.testRunList.push({ 'id': element.key, 'itemName': element.value });
          });
          this.activatedRoute.queryParams.subscribe(query => {
            if (query.task) {
              let taskQueryParam = JSON.parse(this.configService.helper.decode(query.task));
              if (taskQueryParam) {
                this.adminComponent.onChange(taskQueryParam.projectId, taskQueryParam.locationId, true);
                this.service.setTestRunActiveOfUser(taskQueryParam.taskId).then(idData => {
                  if (idData != 0) {
                    this.testRun = this.testRunList.filter(t => t.id == idData);
                    this.tabName = "onGoing";
                  } else {
                    this.tabName = taskQueryParam.draft == 'false' ? "approve" : "onGoing";
                  }
                  resolve();
                }, err => resolve());
              }
            } else {
              resolve();
            }
          });
          if (!this.configService.helper.isEmpty(this.testRunIdFromRedirect)) {
            this.testRun = this.testRunList.filter(t => t.id == this.testRunIdFromRedirect);
            this.tabName = "onGoing";
          } else {
            if (this.testRunList.length == 1 && this.testRun.length == 0) {
              this.testRun = this.testRunList;
            }
          }
        }, err => resolve());
      } else {
        resolve();
      }
    })

  }

  loadTestCases(tabName?) {
    this.selectAll = false;
    this.configService.saveUserPreference("181", tabName).subscribe(res => {
      this.isSelectedPublishData = false;
      this.testCaseList = new Array();
      if (tabName) {
        this.tabName = tabName;
      }
      if (!this.tabName)
        this.tabName = 'summary';

      if (this.category.length > 0) {
        switch (this.tabName) {
          case 'onGoing':
            this.configService.isWorkflowDocumentOrderSequence(this.category[0].id).subscribe(resp => {
              this.isWorkflowDocumentOrderSequence = resp;
            });
            this.getDocumentLockStatus();
            if (this.testRun.length > 0) {
              this.activeTestRunId = this.testRun[0].id;
              this.page.pageNumber = 0;
              this.setPage({ offset: 0 });
              //this.loadData(this.category[0].id, this.tabName, this.testRun[0].id);
            } else {
              this.service.testRunActiveOfUser(this.category[0].id).then(id => {
                let testRun = this.testRunList.filter(t => t.id == id);
                if (testRun.length == 0) {
                  id = this.testRunList[0].id;
                }
                this.activeTestRunId = id;
                this.page.pageNumber = 0;
                this.setPage({ offset: 0 });
                //this.loadData(this.category[0].id, this.tabName, id);
              });
            }
            break;
          case 'completed':
            this.activeTestRunId = 0;
            this.page.pageNumber = 0;
            this.setPage({ offset: 0 });
            //this.loadData(this.category[0].id, this.tabName, 0);
            break;
          case 'feedback':
            this.configService.loadDocumentForumCodes(this.category[0].id).subscribe(resp => {
              this.commentsDocumentsList = resp;
            });
            break;
          default:
            this.isMultiplePDF = false;
            break;
        }
      }
    });
  }

  loadData(category, tabName, testRunId: number) {
    this.adminComponent.spinnerFlag = true;
    this.commentsDocumentsList = new Array();
    this.service.loadTestCase(category, tabName, ("onGoing" === tabName ? -1 : this.page.pageNumber), testRunId).subscribe(
      jsonResp => {
        this.adminComponent.spinnerFlag = false;
        this.testCaseList = jsonResp.list;
        if (this.selectAll && "onGoing" === tabName) {
          this.testCaseList.forEach(d => {
            if ((d.discrepancyForm == 0 && d['status'] !== 'Fail') || (d['status'] === 'Fail' && !d.reTestFlag))
              if ((d.status === 'Fail' && d.reTestFlag) || (d.status === null || d.status === '') || (d.status === 'In-Progress')) {
                d.publishedflag = false;
              } else {
                d.publishedflag = true;
                this.isSelectedPublishData = true;
              }
          });
        }
        this.page.totalElements = jsonResp.totalElements;
        this.page.totalPages = jsonResp.totalPages;
        if (testRunId != 0) {
          this.testRun = this.testRunList.filter(t => t.id == testRunId);
        }

        this.commentsDocumentsList = this.testCaseList.map(u => ({ 'id': u.id, 'type': "code", 'value': u.testCaseCode }));
        if ((this.testCaseList.length != 0)) {
          this.checkCustomPDFIsThere();
        }
      }, err => {
        this.adminComponent.spinnerFlag = false;
      });
  }
  checkCustomPDFIsThere() {
    this.isMultiplePDF = false;
    if (this.category.length > 0) {
      this.configService.isMultiplePDF(this.category[0].id).subscribe(resp => {
        this.isMultiplePDF = resp;
      });
    }

  }

  //CSV Export
  excelExport() {
    if (this.category.length > 0) {
      this.service.excelExport(this.configService.helper.getTestCaseId(this.category[0].id)).subscribe(resp => {
        if (resp.result) {
          this.adminComponent.previewOrDownloadByBase64(resp.sheetName + ".xls", resp.sheet, false);
        }
      })
    }
  }

  editStatus(row) {
    if (row.status != "Fail" && row.canExecute) {
      row.flag = true;
      this.oldStatus = row.status;
    }
  }

  changeStatus(row) {
    var obj = this
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonClass: 'btn btn-danger',
      allowOutsideClick: false,
      buttonsStyling: false
    }).then((result) => {
      obj.updateStatus(row.status, row.id);
    }).catch(() => {
      this.testCaseList[row.$$index].status = this.oldStatus;
      this.testCaseList[row.$$index].flag = false;
    });
  }

  updateStatus(status, id) {
    this.adminComponent.spinnerFlag = true;
    this.service.updateStatus(status, id).subscribe(jsonResp => {
      if (jsonResp.result === "success") {
        swal({
          title: 'Updated Successfully!', type: 'success',
          timer: this.configService.helper.swalTimer, showConfirmButton: false,
          text: ' Status has been updated',
        });
        this.loadTestCases(this.tabName);
        this.adminComponent.spinnerFlag = false;
      } else {
        swal({
          title: 'Update Failed!', type: 'error', timer: this.configService.helper.swalTimer, showConfirmButton: false,
          text: ' Status has not been updated. Try again!',
        });
        this.adminComponent.spinnerFlag = false;
      }
    });
  }
  onChangePublishData() {
    this.isSelectedPublishData = this.testCaseList.filter(t => t.publishedflag).length > 0;

  }

  publishConfirm() {
    var classObject = this;
    swal({
      title: 'Are you sure?',
      text: 'You wont be able to revert',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonClass: 'btn btn-danger',
      allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      classObject.publish();
    });

  }

  publish() {
    this.adminComponent.spinnerFlag = true;
    this.service.publishTestCases(this.testCaseList).subscribe(result => {
      this.isSelectedPublishData = false;
      this.loadTestCases(this.tabName);
      this.adminComponent.spinnerFlag = false;
    });
  }

  selectAllDataForSubmit(event) {
    this.selectAll = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      this.testCaseList.forEach(d => {
        if ((d.discrepancyForm == 0 && d['status'] !== 'Fail') || (d['status'] === 'Fail' && !d.reTestFlag))
          if ((d.status === 'Fail' && d.reTestFlag) || (d.status === null || d.status === '') || (d.status === 'In-Progress')) {
            d.publishedflag = false;
          } else {
            d.publishedflag = true;
            this.isSelectedPublishData = true;
          }
      });
    } else {
      this.testCaseList.forEach(d => {
        d.publishedflag = false;
      });
      this.isSelectedPublishData = false;
    }
  }

  edit(row) {
    if (this.category.length > 0) {
      let queryParams = {
        status: '/tc-execution/' + row.constantName
      }
      this.router.navigate(['/tc-edit', row.constantName, row.id], { queryParams: queryParams, skipLocationChange: true });
    }
  }

  view(row) {
    this.id = row.id;
    if (!this.backUrl) {
      this.backUrl = '/tc-execution/' + this.category[0].id;
    }
    this.individualViewFlag = true;
  }

  closeView() {
    if (this.dfID)
      this.router.navigate([this.backUrl], { queryParams: { id: this.dfID } });
    else if (this.backUrl && !this.backUrl.match('tc-execution')) {
      if (this.roleBackId)
        this.router.navigate([this.backUrl], { queryParams: { id: this.roleBackId } });
      else
        this.router.navigate([this.backUrl]);

    } else {
      this.individualViewFlag = false;
      this.loadTestCases(this.tabName);
    }
  }

  doScreenRecording(row) {
    this.adminComponent.openModalForScreenrecording(row, null, '/tc-execution/' + row.constantName, null, false);
  }

  loadDocumentCommentLog(row) {
    this.documentcomments.loadDocumentCommentLog(row);
  }

  viewFileList(row, flag) {
    this.viewFile.viewTestCaseFile(row.id, flag);
  }
  openDocumentForum() {
    this.documentForumModal = true;
    this.forumView.showModalView();
  }
  closeDocumentForum() {
    this.documentForumModal = false;
  }
  onClickCreateDFModal(data: any) {
    this.selectedDataForCreateDF = data;
    this.isUsingExistingDF = false;
    this.dfDataForTestcase = new Array();
    this.selectedDfForCreate = new Array();
    this.spinnerFlag = true;
    this.service.loadDFDataForTestcase(this.selectedDataForCreateDF.constantName).subscribe(resp => {
      resp.forEach(element => {
        this.dfDataForTestcase.push({ 'id': element.id, 'itemName': element.documentCode, 'desc': element.discrepancyDescription });
      });;
      this.spinnerFlag = false;
    })
  }
  loadDFDataForTestcase() {
    this.isUsingExistingDF = true;
  }
  saveDf() {
    this.spinnerFlag = true;
    this.service.saveDFDataForTestcase("discrepancy/saveDFDataForTestcase/" + this.selectedDfForCreate[0].id + "/" + this.selectedDataForCreateDF.id).subscribe(resp => {
      this.spinnerFlag = false;
      this.createDfModal.hide();
      swal(
        'Success!',
        'Discrepancy Form Created Successfully!',
        'success'
      ).then(responseMsg => {
        this.loadTestCases("onGoing");
      });
    })
  }

  navigateToRisk(row) {
    this.router.navigate(['/add-riskAssessment'], { queryParams: { ursForRisk: row.ursIds, specForRisk: row.specificationIds, testCaseId: row.id, testCaseCode: row.testCaseCode + " (" + row.testRunName + ")" }, skipLocationChange: true });
  }

  loadTheWorkFlowPermissions() {
    this.riskWorkFlowPer = false;
    this.configService.loadDocBasedOnProject().subscribe(res => {
      let workFlowPermis = res;
      if (workFlowPermis.length > 0) {
        if (workFlowPermis.filter(data => data.key == this.configService.helper.RISK_ASSESSMENT_VALUE).length > 0) {
          this.riskWorkFlowPer = true;
        }
      }
    });
  }

  onClickTableOfContent() {
    this.router.navigate(['/table-of-content'], { queryParams: { docId: this.category[0].id, status: document.location.pathname }, skipLocationChange: true });
  }

}
