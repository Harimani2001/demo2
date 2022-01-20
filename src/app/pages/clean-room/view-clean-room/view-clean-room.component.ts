import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import swal from 'sweetalert2';
import { Page, ProjectTaskDTO, TaskTimerTrackingDTO, User, UserPrincipalDTO, CleanRoomInfo } from '../../../models/model';
import { Permissions } from '../../../shared/config';
import { ConfigService } from '../../../shared/config.service';
import { EsignAgreementMessege, eSignErrorTypes } from '../../../shared/constants';
import { Helper } from '../../../shared/helper';
import { DateFormatSettingsService } from '../../date-format-settings/date-format-settings.service';
import { FileUploadForDocComponent } from '../../file-upload-for-doc/file-upload-for-doc.component';
import { IndividualDocumentItemWorkflowComponent } from '../../individual-document-item-workflow/individual-document-item-workflow.component';
import { LocationService } from '../../location/location.service';
import { projectsetupService } from '../../projectsetup/projectsetup.service';
import { TaskCreationService } from '../../task-creation/task-creation.service';
import { CleanRoomService } from '../clean-room.service';
import { ChartOptions } from 'chart.js';
import { AuditTrailViewComponent } from '../../audit-trail-view/audit-trail-view.component';
import { AdminComponent } from '../../../layout/admin/admin.component';

@Component({
  selector: 'app-view-clean-room',
  templateUrl: './view-clean-room.component.html',
  styleUrls: ['./view-clean-room.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ViewCleanRoomComponent implements OnInit {
  @ViewChild('cleanRoomTab') tab: any;
  @ViewChild('myTable') table: any;
  @ViewChild('cleanroomWorkFlow') cleanroomWorkFlow: any;
  @ViewChild("individualDocumentItemWorkflow") individualDocumentItemWorkflow: IndividualDocumentItemWorkflowComponent;
  @ViewChild('viewFileupload') private viewFileupload: FileUploadForDocComponent;
  @ViewChild('documentcomments') documentcomments: any;
  @ViewChild('auditView') auditTrailView: AuditTrailViewComponent;
  @ViewChild('forumView') forumView: any;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  permissionModal: Permissions = new Permissions(this.helper.CLEAN_ROOM_VALUE, false);
  spinnerFlag: boolean = false;
  individualView: boolean = false;
  location = [];
  locationList = [];
  locationDropdownSettings = {
    singleSelection: true,
    text: "Select Location",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  project = [];
  projectList = [];
  projectDropdownSettings = {
    singleSelection: false,
    text: "Select Project",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  summaryData: any;
  objectKeys = Object.keys;
  tableData: any[] = new Array();
  showSearch: boolean = false;
  filterQuery = '';
  canPublish: boolean = false;
  page: Page = new Page();
  popupdata: any;
  getStatus: any[] = new Array();
  status: any;
  selectedDataForWorkflow: any;
  esignForm: any;
  errorList: any[] = new Array<any>();
  agreementCheck: boolean = false;
  signature: any = "";
  submitted: boolean;
  esignSaveModal: User = new User();
  comments: any;
  finalstatus: boolean = true;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  viewSignature: boolean = false;
  signaturePadOptions: Object = {
    'minWidth': 1,
    'canvasWidth': 540,
    'canvasHeight': 100,
  };
  percentage: number = 0;
  progressBarColour: string;
  taskviewFlag: boolean = false;
  graphViewFlag: boolean = false;
  pendingList: any[] = new Array();
  datePipeFormat = 'yyyy-MM-dd';
  timerTrackingDTO: TaskTimerTrackingDTO = new TaskTimerTrackingDTO();
  validationChartData: any[] = new Array();
  classificationChartData: any[] = new Array();
  validationChartLabels: any[] = new Array();
  classificationChartLabels: any[] = new Array();
  pieChartType: string = 'pie';
  pieChartColors: Array<any> = [{
    backgroundColor: ['#f54296', '#ebe834', '#3D8B37', '#eb5334', '#87CEFA', '#dd42f5']
  }];
  pieChartOptions: ChartOptions = {
    responsive: false,
    legend: {
      position: 'left',
    },
  };
  commentsDocumentsList: any[] = new Array();
  fileFlag: boolean = false;
  canEditTask: boolean = false;
  currentTaskID: any;
  taskUserList: any = [];
  assignedUsers: any[] = new Array();
  roleBack: any = null;
  routeback: any = null;
  documentForumModal: boolean = false;

  constructor(private helper: Helper, private permissionService: ConfigService, private taskCreationService: TaskCreationService,
    private locationService: LocationService, private projectService: projectsetupService, private cleanRoomService: CleanRoomService,
    private fromBuilder: FormBuilder, public errorMessageHelper: eSignErrorTypes, public esignAgreementMessage: EsignAgreementMessege,
    private dateFormatSettingsService: DateFormatSettingsService, private router: Router, private route: ActivatedRoute,
    public adminComponent: AdminComponent, private configService: ConfigService) {
    this.route.queryParams.subscribe(query => {
      if (!this.helper.isEmpty(query.id)) {
        this.routeback = query.id
        if (query.roleBack != undefined) {
          this.roleBack = query.roleBack;
        }
        this.viewRowDetails(query.id);
        this.helper.changeMessageforId(query.id);
      }
    });
  }

  ngOnInit() {
    this.permissionService.loadPermissionsBasedOnModule(this.helper.CLEAN_ROOM_VALUE).subscribe(result => {
      this.permissionModal = result;
    });

    this.permissionService.loadCurrentUserDetails().subscribe(resp => {
      this.currentUser = resp;
    });
    this.loadOrgDateFormatAndTime();

    this.page.pageNumber = 0;
    this.page.size = 10;
    this.loadcurrentProjectDetail().then(resp => {
      if (resp) {
        this.permissionService.getUserPreference(this.helper.CLEAN_ROOM_VALUE).subscribe(res => {
          if (res.result) {
            if (res.jasonData) {
              let json = JSON.parse(res.jasonData);
              let timer = setInterval(() => {
                this.location = this.locationList.filter(f => f.id == json.locationId);
                this.project = this.projectList.filter(f => json.projectIds.includes(+f.id));
                if (this.location.length > 0 && this.project.length > 0) {
                  this.onTabChange(res.result);
                  clearInterval(timer);
                }
              });
            } else {
              this.onTabChange(res.result);
            }
          } else {
            this.onTabChange('summary');
          }
        });
      }
    });

    this.esignForm = this.fromBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      signature: [this.signature],
    });
  }

  ngAfterViewInit(): void {
    this.permissionService.getUserPreference(this.helper.CLEAN_ROOM_VALUE).subscribe(res => {
      if (res.result)
        this.tab.activeId = res.result;
    });
  }

  loadOrgDateFormatAndTime() {
    this.dateFormatSettingsService.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.datePipeFormat = result.datePattern.replace("mm", "MM")
        this.datePipeFormat = this.datePipeFormat.replace("YYYY", "yyyy");
      }
    });
  }

  loadcurrentProjectDetail(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.projectService.loadCurrentLocationOfProject().subscribe(jsonResp => {
        this.location.push({ id: jsonResp.result.id, itemName: jsonResp.result.name });
        this.project.push({ id: jsonResp.project.id, itemName: jsonResp.project.projectName });
        this.loadAllActiveLocations();
        this.loadProjectsOnLocation(this.location);
        resolve(true);
      }, error => {
        resolve(false);
      });
    })
  }

  loadAllActiveLocations() {
    this.locationList = [];
    this.locationService.loadAllActiveLocations().subscribe(jsonResp => {
      this.locationList = jsonResp.result.map(option => ({ id: option.id, itemName: option.name }));
    });
  }

  loadProjectsOnLocation(location) {
    this.projectList = [];
    if (location.length > 0) {
      this.permissionService.HTTPGetAPI("projectsetup/loadProjectsOfUserAndCreatorForLocationAndProjectType/" + location.map(m => m.id)[0] + '/' + this.helper.PROJECT_TYPE_CLEAN_ROOM).subscribe(response => {
        this.projectList = response.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
      });
    }
  }

  onChangeLocation(location) {
    this.project = this.tableData = [];
    this.page = new Page();
    this.loadProjectsOnLocation(location);
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.permissionService.getUserPreference(this.helper.CLEAN_ROOM_VALUE).subscribe(res => {
      if (res.result) {
        this.tab.activeId = res.result;
        this.loadTableData(this.tab.activeId);
      }
    });
  }

  onTabChange(tabId) {
    let json = {};
    if (this.location.length > 0 && this.project.length > 0) {
      json = { 'locationId': this.location.map(m => m.id)[0], 'projectIds': this.project.map(m => m.id) };
      this.permissionService.saveUserPreference(this.helper.CLEAN_ROOM_VALUE, tabId, json).subscribe(res => { });
    }
    this.canPublish = false;
    this.taskviewFlag = false;
    this.graphViewFlag = false;
    switch (tabId) {
      case 'draft':
      case 'publish':
        this.page.pageNumber = 0;
        this.loadTableData(tabId);
        break;
      case 'audit':
        let timer = setInterval(() => {
          if (this.auditTrailView) {
            this.auditTrailView.loadData(this.helper.CLEAN_ROOM_VALUE, false, this.project).then(() => {
              clearInterval(timer);
            }).catch((err) => {
              clearInterval(timer);
            });
          }
        }, 600);
      default:
        this.loadSummaryData();
        break;
    }
  }

  loadSummaryData() {
    this.spinnerFlag = true;
    this.validationChartData = [];
    this.classificationChartData = [];
    this.validationChartLabels = [];
    this.classificationChartLabels = [];
    this.permissionService.HTTPGetAPI("cleanroom/loadSummary").subscribe(jsonResp => {
      if (jsonResp) {
        this.summaryData = jsonResp;
        this.pendingList = jsonResp.TaskList.pendingList;
        this.calculatePercentage(this.summaryData.published, this.summaryData.completed);
        this.objectKeys(jsonResp.validationStatusCount).forEach(item => {
          this.validationChartData.push(jsonResp.validationStatusCount[item]);
          this.validationChartLabels.push(item);
        })
        this.objectKeys(jsonResp.classificationCount).forEach(item => {
          this.classificationChartData.push(jsonResp.classificationCount[item]);
          this.classificationChartLabels.push(item);
        })
      }
      this.spinnerFlag = false;
    }, error => {
      this.spinnerFlag = false;
    });
  }

  calculatePercentage(published, completed) {
    if (published == 0 && completed == 0)
      this.percentage = 0;
    else
      this.percentage = Math.floor(completed / published * 100);
    this.progressBarColour = this.percentage == 100 ? "progress-bar bg-success" : "progress-bar";
  }

  loadTableData(tabId) {
    this.tableData = [];
    if (this.location.length > 0 && this.project.length > 0) {
      this.spinnerFlag = true;
      this.permissionService.HTTPGetAPI("cleanroom/loadAllByLocationAndProjectAndTabId/" + this.location.map(m => m.id)[0] + '/' + this.project.map(m => m.id) + '/' + tabId + '/' + this.page.pageNumber).subscribe(jsonResp => {
        this.tableData = jsonResp.cleanRoomDtoList;
        this.page.size = 10;
        this.page.totalElements = jsonResp.totalElements;
        this.spinnerFlag = false;
      }, error => {
        this.spinnerFlag = false;
      });
    }
  }

  onChangeProject(location, project) {
    if (location.length > 0 && project.length > 0) {
      this.location = location;
      this.project = project;
      this.onClickClose();
    } else {
      this.tableData = [];
    }
  }

  onChangePublishData() {
    this.canPublish = this.tableData.filter(f => f.published).length > 0 ? true : false;
  }

  selectAllData(event) {
    if (event.currentTarget.checked) {
      this.tableData.forEach(d => {
        d.publishFlag = 'Y';
        d.published = true;
      });
      this.canPublish = true;
    } else {
      this.tableData.forEach(d => {
        d.publishFlag = 'N';
        d.published = false;
      });
      this.canPublish = false;
    }
  }

  multiRoomPublish() {
    let ids = this.tableData.filter(f => f.published).map(m => m.id);
    this.bulkRoomPublish(ids);
  }

  singleRoomPublish(rowId) {
    let ids = [];
    ids.push(rowId);
    this.bulkRoomPublish(ids);
  }

  bulkRoomPublish(ids) {
    if (ids.length > 0) {
      this.spinnerFlag = true;
      this.cleanRoomService.bulkRoomItemPublish(ids).subscribe(jsonResp => {
        if (jsonResp.successFlag) {
          this.spinnerFlag = false;
          swal({
            title: 'Success',
            text: jsonResp.message,
            type: 'success',
            timer: 2000, showConfirmButton: false
          });
          this.onClickClose();
        }
      }, error => {
        this.spinnerFlag = false;
      })
    }
  }

  openIndividualWorkflowSetup(row) {
    this.individualDocumentItemWorkflow.openModal(row.id, row.cleanRoomCode);
  }

  openDeleteSwal(row) {
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
          let remarks = "Comments : " + value;
          this.deleteCleanRoom(row, remarks);
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

  deleteCleanRoom(row, remarks) {
    this.cleanRoomService.deleteCleanRoom({ "id": row.id, "userRemarks": remarks }).subscribe(jsonResp => {
      if (jsonResp.successFlag) {
        swal({
          title: 'Deleted!',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.onClickClose();
          }
        });
      } else {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: 'Cleanroom ' + row.roomName + '  has not been deleted.',
          type: 'error',
          timer: this.helper.swalTimer
        });
      }
    }, (err) => {
      status = "failure";
      swal({
        title: 'Not Deleted!',
        text: row.roomName + 'is not deleted...Something went wrong',
        type: 'error',
        timer: this.helper.swalTimer
      });
    });
  }

  viewRowDetails(rowId) {
    if (rowId) {
      this.spinnerFlag = true;
      this.individualView = true;
      this.cleanRoomService.loadRoomInfoOnId(rowId).subscribe(jsonResp => {
        this.popupdata = jsonResp.result;
        this.popupdata.departmentName = this.popupdata.departments.map(m => ' ' + m.itemName).toString();
        this.spinnerFlag = false;
        this.loadDocumentTimeline(rowId);
        let timer = setInterval(() => {
          if (this.viewFileupload) {
            this.viewFileupload.loadFileListForEdit(this.popupdata.id, this.popupdata.cleanRoomCode).then((result) => {
              this.fileFlag = result;
              clearInterval(timer);
            }).catch((err) => {
              clearInterval(timer);
            });
          }
        }, 600);
      }, error => {
        this.spinnerFlag = false;
      })
    }
  }

  loadDocumentTimeline(id) {
    this.spinnerFlag = true;
    this.getStatus = [];
    this.status = '';
    this.permissionService.HTTPGetAPI("individualDocumentFlow/loadApproveTimeLine/" + id + "/" + this.helper.CLEAN_ROOM_VALUE).subscribe((resp) => {
      this.spinnerFlag = false;
      this.getStatus = resp;
      this.status = this.getStatus.filter(f => f.lastEntry && f.permission)[0];
    }, (err) => {
      this.spinnerFlag = false;
    });
  }

  approveOrReject(data) {
    this.selectedDataForWorkflow = data;
    if (data.lastEntry && data.permission) {
      this.openMyModal('effect-1');
      setTimeout(() => {
        $('#esignComments').focus();
      }, 200);
    }
  }

  openMyModal(event) {
    this.esignForm.reset();
    this.errorList = [];
    this.agreementCheck = false;
    document.querySelector('#' + event).classList.add('md-show');
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

  esign() {
    this.permissionService.HTTPPostAPI(this.esignSaveModal, 'workFlow/validEsignUser').subscribe(response => {
      if (response.flag) {
        this.esignForm.reset();
        this.documentApproveOrReject(this.finalstatus ? "Y" : "N");
        this.agreementCheck = false;
        document.querySelector('#' + 'effect-1').classList.remove('md-show');
        this.spinnerFlag = false;
        swal({
          title: 'ESign Successful!',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.onClickClose();
          }
        });
      } else {
        this.spinnerFlag = false;
        this.errorList = response.errorList;
        swal({
          title: 'ESign Unsuccessful!',
          text: 'The signature is not registered.',
          type: 'error',
          timer: this.helper.swalTimer
        });
      }
    });
  }

  documentApproveOrReject(status) {
    this.selectedDataForWorkflow.status = status;
    this.selectedDataForWorkflow.comments = this.comments;
    this.selectedDataForWorkflow.documentType = this.helper.CLEAN_ROOM_VALUE;
    this.selectedDataForWorkflow.documentCode = this.popupdata.cleanRoomCode;
    this.selectedDataForWorkflow.signature = this.signature;
    this.spinnerFlag = true;
    this.permissionService.HTTPPostAPI(this.selectedDataForWorkflow, "individualDocumentFlow/documentApproveOrReject").subscribe((resp) => {
      this.spinnerFlag = false;
      this.comments = "";
      this.loadDocumentTimeline(this.selectedDataForWorkflow.documentId);
    }, (err) => {
      this.spinnerFlag = false;
    });
  }

  onclickAccept() {
    this.agreementCheck = !this.agreementCheck;
    this.esignForm.get('userName').setValue(this.currentUser.email);
  }

  signatureComplete() {
    this.signature = this.signaturePad.toDataURL();
    this.esignForm.get('signature').setValue(this.signaturePad.toDataURL());
  }

  clearSignature() {
    this.esignForm.get('signature').setValue('');
    this.signaturePad.clear();
  }

  closeMyModal(event) {
    this.agreementCheck = false;
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

  onClickClose() {
    this.permissionService.getUserPreference(this.helper.CLEAN_ROOM_VALUE).subscribe(res => {
      if (res.result) {
        this.tab.activeId = res.result;
        this.onTabChange(this.tab.activeId);
      }
    });
  }

  taskRedirect(rowId) {
    this.router.navigate(["taskCreation"], { queryParams: { id: rowId, url: window.location.pathname } })
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
      this.spinnerFlag = false;
      if (result.result == "success") {
        this.loadSummaryData();
        swal({
          title: row.taskCode + " Start at " + time,
          text: 'Task started.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      } else {
        swal({
          title: 'error',
          text: 'Oops, something went wrong',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      }
    }, error => {
      this.spinnerFlag = false;
    });
  }

  endTime(row: any) {
    swal({
      title: "Write your comments here",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      confirmButtonColor: "#93BE52",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#FC6180",
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    })
      .then((value) => {
        if (value) {
          this.endTimer(row, value);
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

  endTimer(row: any, valu: any) {
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
    this.timerTrackingDTO.comments = valu;
    this.taskCreationService.saveTimer(this.timerTrackingDTO).subscribe(result => {
      this.spinnerFlag = false;
      if (result.result == "success") {
        this.loadSummaryData();
        swal({
          title: row.taskCode + " End at " + time,
          text: 'Task Ended.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      } else {
        swal({
          title: 'error',
          text: 'Oops, something went wrong',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      }
    }, error => {
      this.spinnerFlag = false;
    });
  }

  editTask(row) {
    this.router.navigate(["taskCreation"], { queryParams: { id: row.id, url: '/editTask' } })
  }

  equipmentRedirection(rowId) {
    this.router.navigate(["equipment"], { queryParams: { id: rowId, url: window.location.pathname } })
  }

  cloneCleanRoom(row) {
    if (row.id) {
      this.spinnerFlag = true;
      this.permissionService.HTTPGetAPI("cleanroom/cloneCleanroom/" + row.id).subscribe(jsonResp => {
        if (jsonResp.result) {
          swal({
            title: 'Success',
            text: row.roomName + " cloned successfully",
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.onClickClose();
        }
        this.spinnerFlag = false;
      }, error => {
        this.spinnerFlag = false;
      });
    }
  }

  loadDocumentCommentLog(row) {
    row.constantName = this.helper.CLEAN_ROOM_VALUE;
    row.createdBy = row.createdByUserName;
    row.status = row.workflowStatus;
    row.displayUpdatedTime = row.updatedDate;
    this.documentcomments.loadDocumentCommentLog(row);
  }

  onClickProject(projectId: any) {
    this.router.navigate(['/Project-setup/view-projectsetup'], { queryParams: { id: projectId, status: document.location.pathname }, skipLocationChange: true });
  }

  getLevelUsers(row: any) {
    if (!this.helper.isEmpty(row)) {
      this.currentTaskID = row.id;
      this.taskUserList = row.userDTO.map(m => ({ value: m.organizationId, label: m.firstName }));
      this.canEditTask = row.taskPermissionFlag;
      let usernameList = row.selectedUserNames.split(',');
      this.assignedUsers = new Array();
      usernameList.forEach(item => {
        this.taskUserList.forEach(data => {
          if (item === data.label)
            this.assignedUsers.push(data.value);
        });
      });
    }
  }

  reAssignUsers() {
    this.spinnerFlag = true;
    let taskDto = new ProjectTaskDTO();
    this.taskCreationService.loadTasksBasedOnId(this.currentTaskID).subscribe(resp => {
      let taskData = resp.dto;
      taskData.selectedUsers = this.assignedUsers;
      taskData.userDTO = [];
      taskDto = taskData;
      taskDto.baseURL = this.helper.common_URL;
      taskDto.Url = '/"taskCreation?id=' + taskDto.id;
      this.taskCreationService.reAssignTaskUsers(taskDto).subscribe(jsonRep => {
        if (jsonRep.result === "success") {
          swal({
            title: '',
            text: 'Users Added Successfully',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });
          this.onClickClose();
          this.spinnerFlag = false;
        }
      })
    }, err => {
      this.spinnerFlag = false;
    });
  }

  downloadPdf(row){
    this.spinnerFlag = true;
    let fileName = row.cleanRoomCode + ".pdf";
    let dto = new CleanRoomInfo();
    dto.id = row.id;
    this.configService.HTTPPostAPIFile('cleanroom/downloadPdfFile', dto).subscribe(res => {
      this.adminComponent.previewByBlob(fileName, res, false);
      this.spinnerFlag = false;
    });
  }

  onClickSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch)
      setTimeout(() => {
        $('#search_box').focus();
      }, 200);
  }

  openDocumentForum() {
    this.documentForumModal = true;
    this.forumView.showModalView();
  }

  closeDocumentForum() {
    this.documentForumModal = false;
  }

}