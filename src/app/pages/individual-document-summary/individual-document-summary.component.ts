import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions } from 'chart.js';
import swal from 'sweetalert2';
import { DocumentSummaryDTO, User,MatrixDTO, ProjectTaskDTO, StepperClass, TaskTimerTrackingDTO, TestCaseSummaryDTO, UserPrincipalDTO, flowMasterDto, WorkFlowLevelDTO, FlowFormGroupSettingsDTO, flowNotificationDto, RolePermissions, CommonModel, DocumentSpecificFlowLevelDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { IQTCService } from '../iqtc/iqtc.service';
import { ProjectSummaryService } from '../project-summary/project-summary.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { TaskCreationService } from '../task-creation/task-creation.service';
import { UserService } from '../userManagement/user.service';
import { WorkflowConfigurationService } from '../workflow-configuration/workflow-configuration.service';
import { DocumentForumComponent } from '../document-forum/document-forum.component';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { AdminComponent } from '../../layout/admin/admin.component';
import { WorkFlowLevelsService } from '../workflow-levels/workflow-levels.service';
import { userRoleservice } from '../role-management/role-management.service';
import { IndividualDocumentSummaryService } from './individual-document-summary.service';
import { FormBuilder, Validators } from '@angular/forms';
import { EsignAgreementMessege, eSignErrorTypes } from '../../shared/constants';
@Component({
  selector: 'app-individual-document-summary',
  templateUrl: './individual-document-summary.component.html',
  styleUrls: ['./individual-document-summary.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IndividualDocumentSummaryComponent implements OnInit,OnChanges {
  docName = '';
  @Input() permissionConstant: string = "";
  @ViewChild('freezemodal') freezeModalData: any;
  @ViewChild('createMatrix') createMatrix: any;
  @ViewChild('shareGraphEmail') shareGraphEmail: any;
  @ViewChild('formSpecificWorkFlow') formSpecificWorkFlow: any;
  @ViewChild('revisionDocs') revisionDocs: any;
  documentDetails: DocumentSummaryDTO;
  percentage: number = 0;
  progressBarColour: string;
  spinnerFlag: boolean = false;
  public loadStepperList: any[] = new Array();
  pendingTaskList: any[] = new Array();
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  freezeData: any;
  documentlockDataLogs: any[] = new Array();
  @Output() onCloseSummary = new EventEmitter();
  viewFlag: boolean = false;
  projectPlanviewFlag: boolean = false;
  projectTaskviewFlag: boolean = false;
  testApproachviewFlag: boolean = false;
  documentSpecificViewFlag: boolean = false;
  TableViewFlag: boolean = false;
  pieChartLabels: string[] = ['No Run', 'In-Progress', 'Pass', 'Fail', 'N/A', 'DF'];
  pieChartType: string = 'pie';
  pieChartColors: Array<any> = [{
    backgroundColor: ['#f54296', '#ebe834', '#3D8B37', '#eb5334', '#87CEFA', '#dd42f5']
  }];
  chartDataList: any[] = new Array();
  pieChartOptions: ChartOptions = {
    responsive: false,
    legend: {
      position: 'left',
    },
  };
  datePipeFormat = 'yyyy-MM-dd';
  toggleTestApproach = false;
  toggleConclusion = false;
  conclusion: string = "";
  testApproach: string = ""
  isTestApproach: boolean = false;
  isTestApproachEdit: boolean = false;
  isUserInWorkFlow: boolean = false;
  timerTrackingDTO: TaskTimerTrackingDTO = new TaskTimerTrackingDTO();
  modal: ProjectTaskDTO = new ProjectTaskDTO();
  permissionModal: Permissions = new Permissions(this.permissionConstant, false)
  docLevelUserList: any = [];
  assignedUsers: any[] = new Array();
  currentTaskID: any;
  graphRemarks: any;
  userList = new Array();
  selectedUsersForEmail: any[] = new Array();
  dropdownSettings = {
    singleSelection: false,
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    classes: "myclass custom-class",
  };
  createMarix: string = "5";
  count: number;
  isSubmitted: boolean = false;
  matrixList: MatrixDTO[] = new Array();
  errorFlag: boolean = false;
  taskPermissionFlag:boolean = false;
  commentsDocumentsList: any[] = new Array();
  
  freezeFlagForLevel=false;
  viewList=new Array();
  constructor(public esignErrors: eSignErrorTypes,public fb: FormBuilder,public esignAgreementMessage: EsignAgreementMessege,public service:IndividualDocumentSummaryService,public admin: AdminComponent,public config: ConfigService, private projectsetupService: projectsetupService, public userService: UserService,public levelService: WorkFlowLevelsService,
    private helper: Helper, private rolesService: userRoleservice,
     private taskCreationService: TaskCreationService, private servie: DateFormatSettingsService, private dynamicFormService: DynamicFormService,
    public router: Router, public projectSummaryService: ProjectSummaryService, public workflowService: WorkflowConfigurationService, private iqService: IQTCService, public datePipe: DatePipe,public documentForumComponent:DocumentForumComponent) { }
 

  ngOnInit() {
    this.loadOrgDateFormatAndTime();
    this.config.loadCurrentUserDetails().subscribe(response => {
      this.currentUser = response;
      this.defaultLoad();
    });
    this.config.loadDocumentForumCodes(this.permissionConstant).subscribe(resp => {
      this.commentsDocumentsList = resp;
    });
    this.loadDocumentForumData(this.permissionConstant);
  }

  defaultLoad(){
    this.loaddata();
    let docList = [this.permissionConstant];
    this.config.isUserInWorkFlow(docList).subscribe(resp => {
      this.isUserInWorkFlow = resp;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.permissionConstant) {
      if (changes.permissionConstant.previousValue != this.permissionConstant) {
        this.defaultLoad();
        this.TableViewFlag=false;
        if (this.testApproachviewFlag && (this.permissionConstant == '108' || this.permissionConstant == '109' || this.permissionConstant == '110' || this.permissionConstant == '207' || this.permissionConstant == '208')) {
          this.loadTestCaseSummary(this.permissionConstant);
        }
      }
    }
  }
  
  loaddata() {
    this.spinnerFlag = true;
    this.chartDataList = new Array();
    this.projectsetupService.loadDocumentSummary(this.permissionConstant).subscribe(jsonResp => {
      this.spinnerFlag = false;
      if (jsonResp.result != null) {
        jsonResp.result.projectPlan.forEach(element => {
          if (!this.helper.isEmpty(element.startTargetDate)) {
            var today = new Date(element.startTargetDate.year, element.startTargetDate.month - 1, element.startTargetDate.day);
            element.startTargetDate = this.datePipe.transform(today, this.datePipeFormat);
            today = new Date(element.endTargetDate.year, element.endTargetDate.month - 1, element.endTargetDate.day);
            element.endTargetDate = this.datePipe.transform(today, this.datePipeFormat);
          }
        });
        this.documentDetails = jsonResp.result;
        this.calculatePercentage(this.documentDetails.published, this.documentDetails.completed);
        this.count = this.documentDetails.draft + this.documentDetails.published;
        this.checkdocumentIslockOrNotForIcon();
        if (this.documentDetails.documentType == '108' || this.documentDetails.documentType == '109' || this.documentDetails.documentType == '110' || this.documentDetails.documentType == '207' || this.documentDetails.documentType == '208') {
          this.config.loadPermissionsBasedOnModule(this.documentDetails.documentType).subscribe(resp => {
            this.permissionModal = resp;
          })
          this.chartDataList = new Array();
          for (let index = 0; index < this.documentDetails.testCaseCount.length; index++) {
            const element = this.documentDetails.testCaseCount[index];
            if (this.getcountExists(element.runCount) || this.getcountExists(element.testCaseInProgressCount)
              || this.getcountExists(element.passCount) || this.getcountExists(element.failCount)
              || this.getcountExists(element.nACount) || this.getcountExists(element.discrepancyCount)) {
              let chartData = new Array();
              chartData.push(element.runCount);
              chartData.push(element.testCaseInProgressCount);
              chartData.push(element.passCount);
              chartData.push(element.failCount);
              chartData.push(element.nACount);
              chartData.push(element.discrepancyCount);
              this.chartDataList.push(chartData);
            }
          }

        }
        this.onCloseSummary.emit(this.documentDetails);

      }
    },
      err => {
        this.spinnerFlag = false;
      }
    );
  }
  getcountExists(value: number): boolean {
    return value > 0;
  }
  loadStepperData(doc: DocumentSummaryDTO) {
    this.docName = doc.documentName;
    let list = new Array();
    if (doc.formGroupConstants.length != 0) {
      list = doc.formGroupConstants;
    } else {
      list[0] = { key: doc.documentType, value: "", displayOrder: 0 }
    }
    this.loadStepperList = new Array();
    list.forEach(element => {
      let stepperModule = new StepperClass();
      stepperModule.constantName = element.key;
      this.config.loaddocumentStepper(stepperModule).subscribe(response => {
        this.loadStepperList.push({ docName: element.value, stepperList: response, displayOrder: element.displayOrder })
        if (this.loadStepperList.length == list.length) {
          this.loadStepperList.sort((a, b) => a.displayOrder - b.displayOrder);
        }
      },
        err => {
          this.spinnerFlag = false;
        }
      );
    });
  }
  loadTaskData() {
    this.taskCreationService.loadTasksForDocument(this.permissionConstant).subscribe(res => {
      if (res.pendingList) {
        this.pendingTaskList = res.pendingList;
        this.taskPermissionFlag = res.taskPermissionFlag;
      }
    },
      err => {
        this.spinnerFlag = false;
      }
    );
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

  calculatePercentage(totalSum, value) {
    if (totalSum == 0 && value == 0)
      this.percentage = 0;
    else
      this.percentage = Math.floor(value / totalSum * 100);
    this.progressBarColour = this.percentage == 100 ? "progress-bar bg-success" : "progress-bar";
  }
  redirect(row) {
    if (+this.permissionConstant < 1000) {
      this.router.navigate(["taskCreation"], { queryParams: { id: row.id, url: window.location.pathname } })
    } else {
      if (row.url) {
        this.router.navigate(["taskCreation"], { queryParams: { id: row.id, url: row.url } })
      }
    }
  }

  editTask(row) {
    this.router.navigate(["taskCreation"], { queryParams: { id: row.id, url: '/' + 'editTask' } })
  }

  freezeOrUnFreeze() {
    this.spinnerFlag = true;
    this.projectSummaryService.docLockPermissions(this.permissionConstant, this.currentUser.versionId).subscribe(rsp => {
     this.spinnerFlag = false;
      if (rsp) {
        swal({  text: rsp, timer: 4000, showConfirmButton: false });
      }
       else {
        this.documentlockDataLogs = [];
        this.checkifdocumentIsLockedService().then((result) => {
          this.freezeData.documentConstantName = this.permissionConstant;
          if (this.freezeData.lockLogs.length > 0)
            this.documentlockDataLogs.push(...this.freezeData.lockLogs);
          this.freezeModalData.show();
          this.spinnerFlag = false;
        }).catch((err) => {
        });
      }
    });
  }
  checkifdocumentIsLockedService(): Promise<void> {
    return new Promise<void>(resolve => {
      this.projectSummaryService.docLockStatus(this.permissionConstant, this.currentUser.versionId).subscribe(jsonResp => {
        this.freezeData = jsonResp;
        resolve()
      }, err => {
        this.spinnerFlag = false;
      }
      );
    });
  }

   loadRecordView(list){
    this.viewList=list;
    this.revisionDocs.show();
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
          dataObj.freezeOrUnFreeze();
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
          this.freezeModalData.hide();
      }
      this.loaddata();
    });
  }
  checkdocumentIslockOrNotForIcon() {
    if (!this.documentDetails.freezeFlag) {
      this.spinnerFlag = true;
      this.projectSummaryService.docLockPermissions(this.documentDetails.documentType, this.currentUser.versionId).subscribe(rsp => {
        if (rsp) {
          this.spinnerFlag = false;
          this.documentDetails.freezeFlagIcon = true;
        } else {
          this.documentlockDataLogs = [];
          this.checkifdocumentIsLockedService().then((result) => {
            this.spinnerFlag = false;
          }).catch((err) => {
          });
        }
      });
    }
  }
  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.datePipeFormat = result.datePattern.replace("mm", "MM")
        this.datePipeFormat = this.datePipeFormat.replace("YYYY", "yyyy");
      }
    });
  }

  close() {
    this.onCloseSummary.emit();
  }

  saveTestCaseSummary() {
    let dto = new TestCaseSummaryDTO();
    dto.docType = this.documentDetails.documentType;
    dto.testApproach = this.testApproach;
    dto.conclusion = this.conclusion;
    this.spinnerFlag = true;
    this.iqService.saveTestCaseSummary(dto).subscribe(resp => {
      this.spinnerFlag = false;
      this.loadTestCaseSummary();
      swal({
        title: 'Success',
        text: 'TestCase Summary Saved successfully',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }, err => {
      this.spinnerFlag = false;
      swal({
        title: 'Error', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
        text: type + ' has not  been saved.',
      }
      );
    });
  }
  loadTestCaseSummary(permissionConstant?) {
    this.isTestApproachEdit = false;
    this.isTestApproach = false;
    this.spinnerFlag = true;
    this.testApproach = '';
    this.conclusion = '';
    this.iqService.loadTestCaseSummary(permissionConstant?permissionConstant:this.documentDetails.documentType).subscribe(resp => {
      this.spinnerFlag = false;
      if (!this.helper.isEmpty(resp.result)) {
        if (!this.helper.isEmpty(resp.result.testApproach) || !this.helper.isEmpty(resp.result.conclusion)) {
          this.testApproach = resp.result.testApproach;
          this.conclusion = resp.result.conclusion;
          this.isTestApproach = true;
        } else {
          if (this.permissionModal.createButtonFlag && this.permissionModal.userInWorkFlow)
            this.isTestApproachEdit = true;
        }
      } else {
        if (this.permissionModal.createButtonFlag && this.permissionModal.userInWorkFlow) {
          this.isTestApproachEdit = true;
        }
      }
    });
  }
  editTestApproach() {
    this.isTestApproachEdit = true;
    this.isTestApproach = false;
  }

  getLevelUsers(row: any) {
    if (!this.helper.isEmpty(row)) {
      this.currentTaskID = row.id;
      this.docLevelUserList = row.userDTO.map(m => ({ value: m.organizationId, label: m.firstName }));
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

  reAssignUsers() {
    this.spinnerFlag = true;
    this.modal = new ProjectTaskDTO();
    this.taskCreationService.loadTasksBasedOnId(this.currentTaskID).subscribe(resp => {
      let taskData = resp.dto;
      taskData.selectedUsers = this.assignedUsers;
      taskData.userDTO = [];
      this.modal = taskData;
      this.modal.baseURL = this.helper.common_URL;
      this.modal.Url = '/"taskCreation?id=' + this.modal.id;
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
          this.spinnerFlag = false;
        }
      })
    }, err => {
      this.spinnerFlag = false;
    });
  }

  loadWorkflowUsers(type) {
    this.config.getAllUsersForProjectAndDocumentType(undefined, type).subscribe(resp => {
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
      let selectedUserIds = this.selectedUsersForEmail.map(m => m.id);
      let json = { remarks: this.graphRemarks, users: selectedUserIds, graphData: this.documentDetails };
      this.config.HTTPPostAPI(json, "projectsetup/sendGraphEmail").subscribe(resp => {
        if (resp.result == "success") {
          this.spinnerFlag = false;
          swal({
            title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
            text: 'Published Document Status Email is Sent!',
            onClose: () => {
              this.onClose();
              this.shareGraphEmail.hide();
              this.isSubmitted = false;
            }
          });
        } else {
          this.spinnerFlag = false;
          swal({
            title: 'Error',
            text: 'Error in Sending Published Document Status Email!',
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


  matrix(size: string) {
    this.matrixList = [];
    this.errorFlag = false;
    if (size == "5") {
this.config.HTTPPostAPI({'name':'RPNPriority','value':'5'},'risk-assessment/loadPriorityForMatrix').subscribe(result=>{
  if(result.result == "success"){
  for (let index = 0; index < result.data.length; index++) {
    let data = new MatrixDTO();
    data.id = 0;
    data.matrixSize = size;
    data.projectId = this.currentUser.projectId;
    data.type = result.data[index].type;
    data.min = result.data[index].min;
    data.max = result.data[index].max;
    data.flag = result.data[index].flag;
   
    this.matrixList.push(data);
  }
}
});
    } else {
      let data1 = new MatrixDTO();
      data1.id = 0;
      data1.matrixSize = size;
      data1.projectId = this.currentUser.projectId;
      data1.type = "Low";
      data1.min = 1;
      data1.max = 125;
      data1.flag = false;
      this.matrixList.push(data1);
    }
  }

  onChangeNumber(number: any, index: number, matrixlist: any) {
    if (number && number < 125) {
      this.errorFlag = false;
      if (index == 0) {
        matrixlist[index + 1].min = number + 1;
        matrixlist[index + 1].flag = false;
        matrixlist[index + 1].max = "";
        matrixlist[index + 2].min = "";
      }
      else if (number > Number(matrixlist[index - 1].max)) {
        matrixlist[index + 1].min = number + 1;
        matrixlist[index + 1].flag = false;
      } else
        this.errorFlag = true;
    } else {
      this.errorFlag = true;
      matrixlist[index + 1].min = "";
    }

  }

  loadDefaultMatrix() {
    this.matrixList = [];
    this.errorFlag = false;
    this.config.HTTPPostAPI("", "risk-assessment/loadDefaultMatrixForRisk").subscribe(resp => {
      this.createMatrix.show();
      if (resp.result == "success") {
        this.matrixList = resp.data;
        this.createMarix = resp.data[0].matrixSize;
      }else
      this.createMarix = '5';
    });
  }

  createDefaultMatrix() {
    if (!this.errorFlag)
      this.config.HTTPPostAPI(this.matrixList, "risk-assessment/createMatrixForRisk").subscribe(resp => {
        this.createMatrix.hide();
        this.spinnerFlag = false;
        if (resp.result == "success") {

          swal({
            title: 'Success',
            text: 'Default Matrix saved',
            type: 'success',
            timer: this.helper.swalTimer, showConfirmButton: false,
          });
        } else {

          swal({
            title: 'Error',
            text: 'Error in Saving default Matrix!',
            type: 'error',
            timer: this.helper.swalTimer, showConfirmButton: false,
          });
        }
      });
  }
loadDocumentForumData(permissionConstant){
  if(permissionConstant.length >3)
    this.documentForumComponent.loadCommentsForForms(permissionConstant)
}
}



