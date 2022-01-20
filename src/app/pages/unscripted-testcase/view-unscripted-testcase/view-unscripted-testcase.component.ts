import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { User, DocumentSummaryDTO, TaskTimerTrackingDTO, UserPrincipalDTO, Page } from '../../../models/model';
import { ConfigService } from '../../../shared/config.service';
import { EsignAgreementMessege, eSignErrorTypes } from '../../../shared/constants';
import { Helper } from '../../../shared/helper';
import swal from 'sweetalert2';
import { ChartOptions } from 'chart.js';
import { DocumentStatusCommentLogComponent } from '../../document-status-comment-log/document-status-comment-log.component';
import { FileUploadForDocComponent } from '../../file-upload-for-doc/file-upload-for-doc.component';
import { UnscriptedService } from '../unscripted-testcase.service';
import { ModalAnimationComponent } from '../../../shared/modal-animation/modal-animation.component';
import { DateFormatSettingsService } from '../../date-format-settings/date-format-settings.service';
import { TaskCreationService } from '../../task-creation/task-creation.service';
import { projectsetupService } from '../../projectsetup/projectsetup.service';
import { Permissions } from '../../../shared/config';
import { FormBuilder, Validators } from '@angular/forms';
import { UrsService } from '../../urs/urs.service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { IndividualDocumentItemWorkflowComponent } from '../../individual-document-item-workflow/individual-document-item-workflow.component';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-view-unscripted-testcase',
  templateUrl: './view-unscripted-testcase.component.html',
  styleUrls: ['./view-unscripted-testcase.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewUnscriptedComponent implements OnInit, AfterViewInit {
  @ViewChild('iqtcTab') tab: any;
  @ViewChild('documentcomments') documentcomments: DocumentStatusCommentLogComponent;
  @ViewChild('fileupload') private file: FileUploadForDocComponent;
  @ViewChild('unscriptedVerification') formVerificationModal: ModalAnimationComponent;
  @ViewChild('myTable') table: any;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild("individualDocumentItemWorkflow") individualDocumentItemWorkflow: IndividualDocumentItemWorkflowComponent;

  commonDocumentStatusValue: any;
  spinnerFlag = false;
  data: any = [] = new Array();
  popupdata: any[] = new Array();
  viewIndividualData: boolean = false;
  agreementCheck: boolean = false;
  routeback: any = null;
  roleBack: any = null;
  routebackStatus: any;
  showAppCard: boolean = true;
  theFlag: boolean = false;
  isSelectedToExecution: boolean = false;
  selectAll: boolean = false;
  search: boolean = false;
  disableSearch: boolean = false;
  submitted: boolean;
  comments: any;
  emailOrUserName: any;
  password: any;
  errorMessage: any;
  documentDetails: DocumentSummaryDTO;
  projectPlanviewFlag: boolean = false;
  projectTaskviewFlag: boolean = false;
  pendingTaskList: any[] = new Array();
  datePipeFormat = 'yyyy-MM-dd';
  timerTrackingDTO: TaskTimerTrackingDTO = new TaskTimerTrackingDTO();
  currentTaskID: any;
  docLevelUserList: any = [];
  assignedUsers: any[] = new Array();
  users: any;
  viewFlag: boolean = false;
  chartDataList: any = new Array();
  pieChartLabels: string[] = ['In-Progress', 'Pass', 'Fail', 'N/A'];
  pieChartOptions: ChartOptions = {
    responsive: false,
    legend: {
      position: 'left',
    },
  };
  pieChartColors: Array<any> = [{
    backgroundColor: ['#ebe834', '#3D8B37', '#eb5334', '#87CEFA']
  }];
  pieChartType: string = 'pie';
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  model: Permissions = new Permissions(this.helper.Unscripted_Value, false)
  public filterQuery = '';
  public finalstatus: boolean = true;
  esignForm: any;
  public errorList: any[] = new Array<any>();
  fileFlag: boolean = true;
  ursDetailedView: boolean;
  selectedUrsDetails: any[] = new Array();
  viewSignature: boolean = false;
  public signaturePadOptions: Object = {
    'minWidth': 1,
    'canvasWidth': 540,
    'canvasHeight': 100,
  };
  signature: any = "";
  adHocId: any;
  slideIndex = 0;
  public getStatus: any = [];
  selectedDataForWorkflow: any;
  esignSaveModal: User = new User();
  modal: User = new User();
  pdfView = false;
  pdfURL: any;
  pdfName: string;
  commentsDocumentsList: any[] = new Array();
  forumFlag = false;
  outline: any[];
  pdf: any;
  error: any;
  height: any = "600px";
  heightOutline = '500px';
  public pageVariable: number = 1;
  rotation = 0;
  zoom = 1.1;
  originalSize = true;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  isOutlineShown = true;
  pdfQuery = '';
  outLineList = new Array();
  showSearch: boolean = false;
  page: Page = new Page();
  currentLevelIndex: number;
  unscriptedListForPublish: any[] = new Array();
  stepViewFlag:boolean=false;
  referenceViewFlag:boolean=false;
  imagesViewFlag:boolean=false;
  taskPermissionFlag:boolean = false;
  constructor(public permissionService: ConfigService, public helper: Helper, public esignAgreementMessage: EsignAgreementMessege,
    public service: UnscriptedService, public router: Router, private adminComponent: AdminComponent,
    private servie: DateFormatSettingsService, public ursService: UrsService, private route: ActivatedRoute,
    private taskCreationService: TaskCreationService, public projectsetupService: projectsetupService, public fb: FormBuilder, private errorMessageHelper: eSignErrorTypes) {
    this.route.queryParams.subscribe(query => {
      if (!this.helper.isEmpty(query.id)) {
        this.routeback = query.status;
        this.commonDocumentStatusValue = query.status;
        if (query.roleBack != undefined) {
          this.roleBack = query.roleBack;
        }
        this.viewRowDetails(query.id, query.status)
        this.helper.changeMessageforId(query.id)
      }
    });
  }

  ngOnInit() {
    this.viewIndividualData = false;
    this.page.pageNumber = 0;
    this.page.size = this.helper.PAGE_SIZE;
    this.setPage({ offset: 0 });
    this.selectAll = false;
    this.permissionService.loadPermissionsBasedOnModule(this.helper.Unscripted_Value).subscribe(resp => {
      this.model = resp;
    });
    this.permissionService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
    })
    this.adminComponent.setUpModuleForHelpContent(this.helper.Unscripted_Value);
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskDocType = this.helper.Unscripted_Value;
    this.adminComponent.taskEnbleFlag = true;

    this.esignForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      signature: [this.signature],
    });
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.permissionService.getUserPreference(this.helper.Unscripted_Value).subscribe(res => {
      if (res.result)
        this.loaddata(res.result);
      else
        this.loaddata();
    });
  }

  ngAfterViewInit(): void {
    this.permissionService.getUserPreference(this.helper.Unscripted_Value).subscribe(res => {
      if (res.result)
        this.tab.activeId = res.result;
    });
  }

  saveCurrentTab(tabName) {
    this.permissionService.saveUserPreference(this.helper.Unscripted_Value, tabName).subscribe(res => { });
  }

  loaddata(tabId?) {
    this.data = [];
    this.search = false;
    this.isSelectedToExecution = false;
    var currentTab;
    currentTab = tabId
    setTimeout(() => {
      this.tab.activeId = currentTab;
    }, 10);
    if (currentTab != 'pending') {
      this.selectAll = false
    }
    if (currentTab != 'summary' && currentTab != 'approve' && currentTab !== undefined) {
      if (currentTab === undefined)
        currentTab = "pending"
      if (currentTab != 'pending') {
        this.selectAll = false
      }
      this.spinnerFlag = true;
      this.search = true;
      this.service.loadIQTC(this.page.pageNumber, currentTab).subscribe(
        jsonResp => {
          this.page.totalElements = jsonResp.totalElements;
          this.page.totalPages = jsonResp.totalPages;
          if (jsonResp.list.length > 0)
            this.data = jsonResp.list;
          this.spinnerFlag = false;
          if (this.selectAll && currentTab == 'pending') {
            this.data.forEach(d => {
              d.publishedflag = true;
            });
          }
        },
        err => {
          this.spinnerFlag = false;
        }
      );
    }
     else {
      this.summary();
    }
  }

  onClickClose() {
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
    setTimeout(() => {
      this.permissionService.getUserPreference(this.helper.URS_VALUE).subscribe(res => {
        if (res.result)
          this.tab.activeId = res.result;

        if ('completed' === this.tab.activeId) {
          this.loaddata('completed');
        } else {
          this.loaddata();
        }
      });
    }, 10)
    this.viewIndividualData = false;
    this.isSelectedToExecution = false;
    this.theFlag = false;
  }

  viewRowDetails(id, status, isRedirection?) {
    this.spinnerFlag = true;
    this.routebackStatus = status;
    this.adminComponent.taskDocTypeUniqueId = id;
    this.adminComponent.taskEquipmentId = 0;
    this.commonDocumentStatusValue = status;
    this.popupdata = [];
    this.loadDocumentTimeline(id);
    this.service.loadDataByIdForView(id).subscribe(jsonResp => {
      this.ursService.getSelectedUrsAndSpecAndRiskDetails({ "ursIds": jsonResp.result.ursListData.map(m => +m), "specIds": jsonResp.result.specificationIds, "riskIds": jsonResp.result.riskIds }).subscribe(resp => {
        this.selectedUrsDetails = resp.result;
        this.setUpData(jsonResp, isRedirection).then(resp => {
          if (resp) {
            this.spinnerFlag = false;
          }
        })
      });
    }, err => {
      this.spinnerFlag = false;
    });
  }

  loadDocumentTimeline(id) {
    this.selectedDataForWorkflow = undefined;
    this.permissionService.HTTPGetAPI("individualDocumentFlow/loadApproveTimeLine/" + id + "/" + this.helper.Unscripted_Value).subscribe((resp) => {
      this.getStatus = resp;
      this.getStatus.forEach((element, index) => {
        if (element.lastEntry && element.permission) {
          this.selectedDataForWorkflow = element;
          this.currentLevelIndex = index;
        }
      });
    }, (err) => {
      this.spinnerFlag = false;
    });
  }
  /**
   * To Publish draft
   */
  publishData() {
    this.spinnerFlag = true;
    this.service.publish(this.selectAll ? this.unscriptedListForPublish : this.data).subscribe(result => {
      this.isSelectedToExecution = false;
      this.spinnerFlag = false;
      this.loaddata();
      this.permissionService.getUserPreference(this.helper.Unscripted_Value).subscribe(res => {
        if (res.result)
          this.loaddata(res.result);
        else
          this.loaddata();
      });
    }, er => {
    });
  }

  singlepublishData(data) {
    this.spinnerFlag = true;
    data.publishedflag = true;
    this.service.singlePublish(data).subscribe(res => {
      if (res.msg === this.helper.SUCCESS_RESULT_MESSAGE) {
        this.viewRowDetails(data.id, data.commonDocumentStatusValue);
        this.spinnerFlag = false;
        swal({
          title: 'Success',
          text: 'Record has been published',
          type: 'success',
          timer: 2000, showConfirmButton: false
        });
      } else {
        this.spinnerFlag = false;
      }
    });
  }

  setUpData(jsonResp, isRedirection?) {
    return new Promise<any>(resolve => {
      try {
        this.commentsDocumentsList = [];
        var timer = setInterval(() => {
          if (this.file && jsonResp.result.testCaseCode && jsonResp.result.id) {
            this.file.loadFileListForEdit(jsonResp.result.id, jsonResp.result.testCaseCode).then((result) => {
              this.fileFlag = result;
            }, err => {
              this.spinnerFlag = false;
            })
            clearInterval(timer);
          }
        }, 600);
        jsonResp.result.formData = JSON.parse(jsonResp.result.jsonExtraData);
        if (jsonResp.result.files && jsonResp.result.files.length != 0) {
          jsonResp.result.files[0].visible = true;
        }
        for (let item of jsonResp.result.checklist) {
          if (item.files.length > 0) {
            item.files[0].visible = true;
          }
        }
        this.commentsDocumentsList.push({ "id": jsonResp.result.id, "value": jsonResp.result.testCaseCode, "type": "code" });
        this.popupdata.push(jsonResp.result);
        this.viewIndividualData = true;
        resolve(true);
      } catch (error) {
        resolve(true);
      }
      resolve(true);
    })
  }

  loadDocumentCommentLog(row) {
    row.constantName = this.helper.Unscripted_Value;
    this.documentcomments.loadDocumentCommentLog(row);
  }

  tabChange(id: any) {
    this.permissionService.saveUserPreference(this.helper.Unscripted_Value, id).subscribe(res => {
      this.search = false;
      this.isSelectedToExecution = false;
      if (id === "pending" || id === "completed") {
        this.page.pageNumber = 0;
        this.setPage({ offset: 0 });
      }
      if (id === "summary") {
        this.summary();
      } else {
        this.disableSearch = false;
      }
    });
  }

  summary() {
    this.spinnerFlag = true;
    this.viewFlag = false;
    this.service.summary().subscribe(result => {
      this.spinnerFlag = false;
      if (result.result != null) {
        this.documentDetails = result.result;
        this.chartDataList = [];
        for (let index = 0; index < this.documentDetails.testCaseCount.length; index++) {
          const element = this.documentDetails.testCaseCount[index];
          if (this.getcountExists(element.runCount) || this.getcountExists(element.testCaseInProgressCount)
            || this.getcountExists(element.passCount) || this.getcountExists(element.failCount)
            || this.getcountExists(element.nacount) || this.getcountExists(element.discrepancyCount)) {
            let chartData = new Array();
            chartData.push(element.testCaseInProgressCount);
            chartData.push(element.passCount);
            chartData.push(element.failCount);
            chartData.push(element.nacount);
            this.chartDataList.push(chartData);
          }
        }
      }
    });
  }

  getcountExists(value: number): boolean {
    return value > 0;
  }

  selectAllData(event) {
    this.selectAll = event.currentTarget.checked;
    this.isSelectedToExecution = false;
    if (event.currentTarget.checked) {
      this.data.forEach(d => {
        if (this.currentUser.id === d.creatorId) {
          d.publishedflag = true;
          this.isSelectedToExecution = true;
        }
      });
    } else {
      this.data.forEach(d => {
        d.publishedflag = false;
      });
    }

  }

  onChangePublishData() {
    this.isSelectedToExecution = false;
    for (let data of this.data) {
      if (data.publishedflag) {
        this.isSelectedToExecution = true;
        break;
      }
    }
  }

  createTestCase() {
    if (this.model.createButtonFlag)
      this.router.navigate(["/Ad-hoc/add-Ad-hoc-testcase"]);
    else {
      if (!this.model.createButtonFlag) {
        swal({
          title: 'Warning!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
          text: "You don't have create permission. Please contact admin!.",
        });
      }
    }
  }

  getNoRunColor() {
    return '#f54296';
  }

  /**
* @param flag => view or download
* @param extention =>doc/docx
*/
  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.datePipeFormat = result.datePattern.replace("mm", "MM")
        this.datePipeFormat = this.datePipeFormat.replace("YYYY", "yyyy");
      }
    });
  }

  loadTaskData() {
    this.taskCreationService.loadTasksForDocument(this.helper.Unscripted_Value).subscribe(res => {
      if (res.pendingList) {
        debugger
        this.pendingTaskList = res.pendingList;
        this.taskPermissionFlag = res.taskPermissionFlag;
      }
    },
      err => {
        this.spinnerFlag = false;
      }
    );
  }

  redirect(row) {
    this.router.navigate(["taskCreation"], { queryParams: { id: row.id, url: '/' + row.url } })
  }

  startTime(row: any) {
    this.spinnerFlag = true;
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var month = today.getMonth() + 1;
    var date = today.getFullYear() + "-" + month + "-" + today.getDate() + " " + time;
    this.timerTrackingDTO.projectTaskId = row.id;
    this.timerTrackingDTO.startTimer = time;
    this.timerTrackingDTO.endTimer = "";
    this.timerTrackingDTO.activeFlag = "Y";
    this.timerTrackingDTO.startDate = date;
    this.timerTrackingDTO.endDate = "";
    this.taskCreationService.saveTimer(this.timerTrackingDTO).subscribe(result => {
      if (result.result == "success") {
        this.loadTaskData();
        this.spinnerFlag = false;
        swal({
          title: row.taskCode + " Start at " + time,
          text: 'Task started.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      } else {
        this.spinnerFlag = false;
        swal({
          title: 'error',
          text: 'Oops, something went wrong',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      }
    });
  }

  endTime(row: any) {
    this.spinnerFlag = true;
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var month = today.getMonth() + 1;
    var date = today.getFullYear() + "-" + month + "-" + today.getDate() + " " + time;
    this.timerTrackingDTO.projectTaskId = row.id;
    this.timerTrackingDTO.endTimer = time;
    this.timerTrackingDTO.startTimer = "";
    this.timerTrackingDTO.startDate = "";
    this.timerTrackingDTO.activeFlag = "N";
    this.timerTrackingDTO.endDate = date;
    this.taskCreationService.saveTimer(this.timerTrackingDTO).subscribe(result => {
      if (result.result == "success") {
        this.spinnerFlag = false;
        this.loadTaskData();
        swal({
          title: row.taskCode + " End at " + time,
          text: 'Task Ended.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      } else {
        this.spinnerFlag = false;
        swal({
          title: 'error',
          text: 'Oops, something went wrong',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      }
    });
  }

  getLevelUsers(row: any) {
    this.projectsetupService.loadUsersByProject(this.currentUser.projectId).subscribe(resp => {
      if (resp.list != null) {
        this.users = resp.list;
        this.docLevelUserList = resp.list.map(option => ({ value: option.id, label: option.userName }));
        this.loadUsers(row);
      }
    });
  }

  loadUsers(row: any) {
    if (!this.helper.isEmpty(row)) {
      this.currentTaskID = row.id;
      let usernameList = row.selectedUserNames.split(',');
      this.assignedUsers = new Array();
      usernameList.forEach(item => {
        this.docLevelUserList.forEach(data => {
          if (item === data.label)
            this.assignedUsers.push(data.value);
        });
      });
    }
  }

  editTask(row) {
    this.router.navigate(["taskCreation"], { queryParams: { id: row.id, url: '/' + 'editTask' } })
  }

  reAssignUsers() {
    this.taskCreationService.loadTasksBasedOnId(this.currentTaskID).subscribe(resp => {
      let taskData = resp.dto;
      taskData.selectedUsers = this.assignedUsers;
      taskData.userDTO = [];
      this.modal = taskData;
      this.taskCreationService.reAssignTaskUsers(this.modal).subscribe(jsonRep => {
        if (jsonRep.result === "success") {
          swal({
            title: '',
            text: 'Users Added Successfully',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });
          this.loadTaskData();
        }
      })
    });
  }

  openSuccessCancelSwal(deleteObj, i) {
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
          deleteObj.userRemarks = "Comments : " + value;
          this.delete(deleteObj, i);
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

  delete(dataObj, i) {
    this.permissionService.HTTPPostAPI(dataObj, "unscripted/deleteAdhocTestcase").subscribe((resp) => {
      if (resp.result === "success") {
        swal({
          title: 'Deleted!', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
          text: 'Record has been deleted',
          onClose: () => {
            this.data.splice(i, 1);
            if (resp.noData === 'N') {
              setTimeout(() => {
                this.loaddata('draft');
              }, 10)
              this.viewIndividualData = false;
            } else {
              this.loaddata();
              this.viewIndividualData = false;
            }
          }
        });
      } else {
        swal({
          title: 'Not Deleted!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
          text: 'Record has not been deleted',
        });
      }
    }, (err) => {
      swal({
        title: 'Not Deleted!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
        text: 'Record has not been deleted',
      });
    });
  }

  urlRedirection(id, testCaseId) {
    this.router.navigate(['/URS/view-urs'], { queryParams: { id: id, status: '/Ad-hoc/view-Ad-hoc-testcase' }, skipLocationChange: true });
  }

  clearSignature() {
    this.esignForm.get('signature').setValue('');
    this.signaturePad.clear();
  }

  signatureComplete() {
    this.signature = this.signaturePad.toDataURL();
    this.esignForm.get('signature').setValue(this.signaturePad.toDataURL());
  }

  plusSlides(forward, list: any[]) {
    if (forward == 1) {
      let prev = this.slideIndex;
      let next = this.slideIndex + 1;
      if (next < list.length) {
        list[this.slideIndex].visible = false;
        list[++this.slideIndex].visible = true;
      } else {
        list[this.slideIndex].visible = false;
        list[0].visible = true;
        this.slideIndex = 0;
      }
    } else {
      let prev = this.slideIndex - 1;
      let next = this.slideIndex;
      if (prev < 0) {
        list[this.slideIndex].visible = false;
        list[list.length - 1].visible = true;
        this.slideIndex = list.length - 1;
      } else {
        list[prev].visible = true;
        list[next].visible = false;
        this.slideIndex = prev;
      }
    }
  }
  /** Check List */
  plusChecklistSlides(n, files) {
    let index = files.findIndex(function (element) {
      return element.visible === true;
    });
    if (n == 1) {
      let next = index + 1;
      if (next < files.length) {
        files[index].visible = false;
        files[++index].visible = true;
      } else {
        files[index].visible = false;
        files[0].visible = true;
        index = 0;
      }
    } else {
      let prev = index - 1;
      let next = index;
      if (prev < 0) {
        files[index].visible = false;
        files[files.length - 1].visible = true;
        index = files.length - 1;
      } else {
        files[prev].visible = true;
        files[next].visible = false;
        index = prev;
      }
    }
  }
  openIndividualWorkflowSetup(row) {
    this.individualDocumentItemWorkflow.openModal(row.id, row.testCaseCode);
  }

  approveOrReject(data) {
    this.selectedDataForWorkflow = data;
    if (data.lastEntry && data.permission) {
      this.openMyModal('effect-1');
    }
  }
  openMyModal(event) {
    this.esignForm.reset();
    this.errorList = [];
    this.agreementCheck = false;
    document.querySelector('#' + event).classList.add('md-show');
  }
  closeMyModal(event) {
    this.agreementCheck = false;
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

  esign() {
    this.spinnerFlag = true;
    this.permissionService.HTTPPostAPI(this.esignSaveModal, 'workFlow/validEsignUser').subscribe(response => {
      if (response.flag) {
        this.esignForm.reset();
        this.documentApproveOrReject(this.finalstatus ? "Y" : "N");
        this.agreementCheck = false;
        document.querySelector('#' + 'effect-1').classList.remove('md-show');
      } else {
        this.spinnerFlag = false;
        this.errorList = response.errorList;
      }
    });
  }

  onSubmit(esignForm) {
    if (esignForm.valid) {
      this.spinnerFlag = true;
      this.submitted = false;
      this.esignSaveModal.userName = this.esignForm.get('userName').value;
      this.esignSaveModal.password = this.esignForm.get('password').value;
      this.comments = this.esignForm.get('comments').value;
      this.esign();
    } else
      this.submitted = true;
  }

  documentApproveOrReject(status) {
    this.selectedDataForWorkflow.status = status;
    this.selectedDataForWorkflow.comments = this.comments;
    this.selectedDataForWorkflow.documentType = this.helper.Unscripted_Value;
    this.selectedDataForWorkflow.documentCode = this.popupdata[0].testCaseCode;
    this.selectedDataForWorkflow.signature = this.signature;
    this.spinnerFlag = true;
    this.permissionService.HTTPPostAPI(this.selectedDataForWorkflow, "individualDocumentFlow/documentApproveOrReject").subscribe((resp) => {
      this.spinnerFlag = false;
      this.comments = "";
      swal({
        title: '',
        text: 'Esign validated',
        type: 'success',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      });
      this.loadDocumentTimeline(this.selectedDataForWorkflow.documentId);
      this.documentPreview(this.popupdata[0])
    }, (err) => {
      this.spinnerFlag = false;
    });
  }
  documentPreview(data) {
    this.pdfURL = '';
    if (this.pdfView) {
      if (this.pdfName && !this.pdfName.includes(data.testCaseCode)) {
        this.pdfURL = '';
      }
      this.spinnerFlag = true;
      this.service.loadPreviewDocument(data.id).subscribe(resp => {
        this.spinnerFlag = false;
        if (resp != null) {
          const blob: Blob = new Blob([resp], { type: "application/pdf" });
          this.pdfURL = URL.createObjectURL(blob)
          this.pdfName = data.testCaseCode + ".pdf";
        }
      }, err => {
        this.spinnerFlag = false;
      });
    }
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.loadOutline();
  }

  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
      if (this.outline)
        this.outLineList = this.outline.map(o => ({ id: o.title, value: o.title.replace(" ", ""), type: 'chapter' }));
      else {
        this.outLineList = new Array();
      }
    });
  }

  onError(error: any) {
    this.error = error; // set error
    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );
      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  setPassword(password: string) {
    let newSrc;
    if (this.pdfURL instanceof ArrayBuffer) {
      newSrc = { data: this.pdfURL };
    } else if (typeof this.pdfURL === 'string') {
      newSrc = { url: this.pdfURL };
    } else {
      newSrc = { ...this.pdfURL };
    }
    newSrc.password = password;
    this.pdfURL = newSrc;
  }

  onclickAccept() {
    this.agreementCheck = !this.agreementCheck;
    this.esignForm.get('userName').setValue(this.currentUser.email);
  }
  loadStepperData() {
    this.getStatus.forEach((element, index) => {
      if (index < this.currentLevelIndex) {
        element.workFlowCompleted = true;
      } else {
        element.workFlowCompleted = false;
      }
    });
    this.getStatus = this.getStatus.filter(d => d.status != "Rejected" && d.status != "Deactivated");
  }
  loadSelectAllDataForPublish(event) {
    this.unscriptedListForPublish = new Array();
    if (event.currentTarget.checked) {
      this.spinnerFlag = true;
      this.service.loadIQTC(-1, 'pending').subscribe(jsonResp => {
        this.spinnerFlag = false;
        this.unscriptedListForPublish = jsonResp.list;
        this.unscriptedListForPublish.forEach(d => {
          d.publishedflag = true;
        });
      });
    }
  }

  cloneTestCase(row) {
    if (row.id) {
      this.permissionService.HTTPGetAPI("unscripted/cloneUnscriptedTestCase/" + row.id).subscribe(resp => {
        if (resp.successFlag) {
          swal({
            title: 'Success',
            text: row.testCaseCode + " cloned successfully",
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.loaddata('pending');
        }
      });
    }
  }
  loadData(data, type) {
    this.spinnerFlag = true;
    this.permissionService.HTTPGetAPI("unscripted/loadUnscriptedChildData/"+data.id+"/"+type).subscribe(resp => {
      this.spinnerFlag = false;
      if(resp.result){
        switch (type) {
          case "images":
            data.files=resp.result;
            if (data.files.length != 0)
              data.files[0].visible = true;
            break;
          case "testSteps":
            data.checklist=resp.result;
            for (let item of data.checklist) {
              if (item.files.length > 0) {
                item.files[0].visible = true;
              }
            }
            break;
          case "urlChecklist":
            data.urlChecklist=resp.result;
            break;
          case "videos":
            data.videoList=resp.result;
            break;
          case "screenshots":
            data.imageList=resp.result;
            break;
        }
      }
    });
  } 
  onClickTableOfContent() {
    this.router.navigate(['/table-of-content'], { queryParams: { docId: this.helper.Unscripted_Value, status: document.location.pathname }, skipLocationChange: true });
  }
}