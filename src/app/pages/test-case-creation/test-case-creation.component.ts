import { TestRunComponent } from './../test-run/test-run.component';
import { ViewTestcaseFileListComponent } from './../view-testcase-file-list/view-testcase-file-list.component';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { Permissions } from '../../shared/config';
import { AdminComponent } from './../../layout/admin/admin.component';
import { ConfigService } from './../../shared/config.service';
import { DocumentStatusCommentLogComponent } from './../document-status-comment-log/document-status-comment-log.component';
import { IQTCService } from './../iqtc/iqtc.service';
import { Page } from '../../models/model';
@Component({
  selector: 'app-test-case-creation',
  templateUrl: './test-case-creation.component.html',
  styleUrls: ['./test-case-creation.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class TestCaseCreationComponent implements OnInit {
  @ViewChild('testCaseCreateTab') tab: any;
  @ViewChild('myTable') table: any;
  @ViewChild('documentcomments') documentcomments: DocumentStatusCommentLogComponent;
  @ViewChild('viewFileOfTestCase') private viewFile: ViewTestcaseFileListComponent;
  @ViewChild('testRun') private testRun: TestRunComponent;
  @ViewChild('forumView') forumView: any;
  categorySettings = {
    singleSelection: true,
    text: 'Select Category',
    enableSearchFilter: true,
  };
  tabName = 'summary';
  permission = new Permissions('', false);
  category: any[] = new Array();
  categoryList: any[] = new Array();
  testCaseList: any[] = new Array();
  isMultiplePDF: boolean = false;
  oldStatus: any;
  isSelectedToMaster: boolean;
  isWorkflowDocumentOrderSequence: string;
  filterQuery
  mySubscription: any
  public individualViewFlag: boolean = false;
  selectAll: boolean;
  backUrl: string;
  id: number = 0;
  viewpdf: boolean = false;
  draftIds: any[] = new Array();
  viewPdfPreview: boolean = false;
  workflowMessage = '';
  roleBackId;
  documentForumModal: boolean = false;
  commentsDocumentsList: any[] = new Array();
  page: Page = new Page();
  testcaseListForPublish: any[] = new Array();
  documentLock: boolean;

  constructor(public configService: ConfigService, private adminComponent: AdminComponent, public service: IQTCService,
    private activatedRoute: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.mySubscription = this.configService.subscription(this.adminComponent.router);
    this.loadTestCaseCategory().then(() => {
      if (localStorage.getItem('tc-category')) {
        let categoryPrevious = this.configService.helper.decode(localStorage.getItem('tc-category'));
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
    this.configService.getUserPreference(this.configService.helper.TEST_CASE_CREATION_VALUE).subscribe(res => {
      if (res.result)
        this.tabName = res.result;
    });
  }

  getDocumentLockStatus() {
    this.configService.HTTPGetAPI("workflowConfiguration/getDocumentLockStatus/" + this.category[0].id).subscribe(jsonResp => {
      this.documentLock = jsonResp.result;
    })
  }

  saveCurrentTab(tabName) {
    this.configService.saveUserPreference(this.configService.helper.TEST_CASE_CREATION_VALUE, tabName).subscribe(res => { });
  }

  navigateToTestCase() {
    if (this.category.length > 0) {
      localStorage.setItem('tc-category', this.configService.helper.encode(this.category[0].id));
      let id = this.activatedRoute.snapshot.params["id"];
      this.activatedRoute.queryParams.subscribe(query => {
        if (!this.configService.helper.isEmpty(query.id)) {
          id = query.id;
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
        if (query.task) {
          let taskQueryParam = JSON.parse(this.configService.helper.decode(query.task));
          if (taskQueryParam) {
            if (!this.configService.helper.isTestCase(taskQueryParam.type))
              this.saveCurrentTab("testPlan");
          }
        }
        if (id) {
          this.view({ id: id });
        } else {
          this.page.pageNumber = 0;
          this.page.size = this.configService.helper.PAGE_SIZE;;
          this.configService.getUserPreference(this.configService.helper.TEST_CASE_CREATION_VALUE).subscribe(res => {
            if (res.result)
              this.loadTestCases(res.result);
            else
              this.loadTestCases("summary");
          });

        }
      });
      this.getDocumentLockStatus();
      this.configService.getUserPreference(this.configService.helper.TEST_CASE_CREATION_VALUE).subscribe(res => {
        if (res.result && 'summary' !== res.result) {
          this.loadPermissions();
        }
      });
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadData(this.category[0].id, this.tabName);
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

  addTestRun() {
    this.testRun.viewTestRunFlag = true;
    this.testRun.testRunSpinnerFlag = true;
    setTimeout(() => {
      this.testRun.addTestRun();
    }, 600)
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

  loadTestCases(tabName?) {
    this.configService.saveUserPreference(this.configService.helper.TEST_CASE_CREATION_VALUE, tabName).subscribe(res => {
      this.selectAll = false;
      this.viewPdfPreview = false;
      this.isSelectedToMaster = false;
      this.testCaseList = new Array();
      this.commentsDocumentsList = new Array();
      this.draftIds = []
      if (tabName) {
        this.tabName = tabName;
      }
      if (this.tabName != 'pending') {
        this.selectAll = false
      }
      if (this.category.length > 0) {
        switch (this.tabName) {
          case 'pending':
            this.configService.isWorkflowDocumentOrderSequence(this.category[0].id).subscribe(resp => {
              this.isWorkflowDocumentOrderSequence = resp;
            });
            this.page.pageNumber = 0;
            this.setPage({ offset: 0 });
            this.viewPdfPreview = true;
            this.getDocumentLockStatus();
            break;
          case 'master':
            this.page.pageNumber = 0;
            this.setPage({ offset: 0 });
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

  loadData(category, tabName) {
    this.adminComponent.spinnerFlag = true;
    this.commentsDocumentsList = new Array();
    this.service.loadTestCase(category, tabName, this.page.pageNumber, 0).subscribe(
      jsonResp => {
        this.page.totalElements = jsonResp.totalElements;
        this.page.totalPages = jsonResp.totalPages;
        this.adminComponent.spinnerFlag = false;
        this.testCaseList = jsonResp.list;
        if (this.selectAll && "pending" === tabName) {
          this.testCaseList.forEach(d => {
            if (d.canPublish) {
              d.masterFlag = true;
              this.isSelectedToMaster = true;
            }
          });
        }
        if (tabName == 'pending')
          this.draftIds = this.testCaseList.map(m => m.id);

        this.commentsDocumentsList = this.testCaseList.map(u => ({ 'id': u.id, 'type': "code", 'value': u.testCaseCode }));
        if ((this.testCaseList.length != 0)) {
          this.checkCustomPDFIsThere();
        }
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

  publishToMaster() {
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
      classObject.publishMaster();
    });
  }

  publishMaster() {
    this.adminComponent.spinnerFlag = true;
    this.configService.HTTPPostAPI(this.selectAll ? this.testcaseListForPublish : this.testCaseList, "testCase/publishToMaster").subscribe(result => {
      this.isSelectedToMaster = false;
      this.loadTestCases(this.tabName);
      this.adminComponent.spinnerFlag = false;
    });
  }

  createTestCase() {
    if (this.permission.createButtonFlag && this.permission.userInWorkFlow) {
      this.adminComponent.spinnerFlag = true;
      this.configService.checkIndividualModulePermission(this.configService.helper.TEST_CASE_CREATION_VALUE).subscribe(resp => {
        this.adminComponent.spinnerFlag = false;
        if (this.permission.createButtonFlag && this.permission.userInWorkFlow && resp && this.category.length > 0) {
          let queryParams = {
            status: '/tc-creation/' + this.category[0].id
          }
          this.router.navigate(['/tc-add', this.category[0].id], { queryParams: queryParams, skipLocationChange: true });
        } else {
          this.createSwalMessage();
        }
      }, err => {
        this.adminComponent.spinnerFlag = false;
        this.createSwalMessage();
      });
    } else {
      this.createSwalMessage();
    }
  }

  createSwalMessage() {
    swal({
      title: 'Warning!', type: 'error', timer: this.configService.helper.swalTimer, showConfirmButton: false,
      text: !this.permission.createButtonFlag ? "You don't have create permission. Please contact admin!." :
        "Testcase creation module permission is disabled. Please contact admin!.",
    });
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

  selectAllDataForMaster(event) {
    this.selectAll = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      this.testCaseList.forEach(d => {
        if (d.canPublish) {
          d.masterFlag = true;
          this.isSelectedToMaster = true;
        }
      });
    } else {
      this.testCaseList.forEach(d => {
        d.masterFlag = false;
      });
      this.isSelectedToMaster = false;
    }
  }

  loadSelectAllDataForMaster(event) {
    this.testcaseListForPublish = new Array();
    if (event.currentTarget.checked) {
      this.adminComponent.spinnerFlag = true;
      this.service.loadTestCase(this.category[0].id, this.tabName, -1, 0).subscribe(jsonResp => {
        this.adminComponent.spinnerFlag = false;
        this.testcaseListForPublish = jsonResp.list;
        this.testcaseListForPublish.forEach(d => {
          if (d.canPublish) {
            d.masterFlag = true;
            this.isSelectedToMaster = true;
          }
        });
      });
    }
  }

  onChangeToMasterData(row) {
    row.masterFlag = !row.masterFlag;
    this.isSelectedToMaster = this.testCaseList.filter(d => d.masterFlag).length > 0 ? true : false;
  }

  edit(row) {
    if (this.category.length > 0) {
      let queryParams = {
        status: '/tc-creation/' + row.constantName
      }
      this.router.navigate(['/tc-edit', row.constantName, row.id], { queryParams: queryParams, skipLocationChange: true });
    }
  }

  view(row) {
    this.id = row.id;
    if (!this.backUrl) {
      this.backUrl = '/tc-creation/' + this.category[0].id;
    }
    this.individualViewFlag = true;
  }

  openSuccessCancelSwal(deleteObj) {
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
          deleteObj.userRemarks = value;
          this.delete(deleteObj);
        } else {
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: this.configService.helper.swalTimer,
            showConfirmButton: false,
          });
        }
      });
  }

  delete(dataObj) {
    this.service.deleteTestCase(dataObj)
      .subscribe((resp) => {
        if (resp.result === "success") {
          swal({
            title: 'Deleted!', type: 'success', timer: this.configService.helper.swalTimer, showConfirmButton: false,
            text: ' Record has been deleted',
            onClose: () => {
              this.loadTestCases(this.tabName);
            }
          });
        } else {
          swal({
            title: 'Not Deleted!', type: 'error', timer: this.configService.helper.swalTimer,
            text: ' Record has not been deleted'
          });
        }
      }, (err) => {
        swal({
          title: 'Not Deleted!', type: 'error', timer: this.configService.helper.swalTimer,
          text: ' Record has not been deleted'
        });
      });
  }

  closeView() {
    if (this.backUrl && !this.backUrl.match('tc-creation')) {
      this.router.navigate([this.backUrl], { queryParams: { id: this.roleBackId } });
    } else {
      this.individualViewFlag = false;
      this.loadTestCases(this.tabName);
    }
  }

  loadDocumentCommentLog(row) {
    this.documentcomments.loadDocumentCommentLog(row);
  }

  viewFileList(row, flag) {
    this.viewFile.viewTestCaseFile(row.id, flag);
  }

  onClickTableOfContent() {
    this.router.navigate(['/table-of-content'], { queryParams: { docId: this.category[0].id, status: document.location.pathname }, skipLocationChange: true });
  }

  openDocumentForum() {
    this.documentForumModal = true;
    this.forumView.showModalView();
  }

  closeDocumentForum() {
    this.documentForumModal = false;
  }

  updateList(list: any) {
    this.commentsDocumentsList = list;
  }

  cloneTestCase(row) {
    if (row.id) {
      this.configService.HTTPGetAPI("testCase/cloneTestCase/" + row.id).subscribe(resp => {
        if (resp.successFlag) {
          swal({
            title: 'Success',
            text: row.testCaseCode + " cloned successfully",
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadTestCases(this.tabName);
        }
      });
    }
  }

}
