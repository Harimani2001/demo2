import { IMyDpOptions, MyDatePicker } from 'mydatepicker/dist';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateISOParserFormatter } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import swal from 'sweetalert2';
import { IOption } from '../../../../node_modules/ng-select';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { EquipmentService } from '../equipment/equipment.service';
import { FileUploadForDocComponent } from '../file-upload-for-doc/file-upload-for-doc.component';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { FileDTO, ProjectTaskDocuments, ProjectTaskDocumentsIdDTO, ProjectTaskDTO, TaskBoardDTO, TaskTimerTrackingDTO, UserPrincipalDTO, CheckListEquipmentDTO } from './../../models/model';
import { TaskCreationService } from './task-creation.service';

@Component({
  selector: 'app-task-creation',
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})

export class TaskCreationComponent implements OnInit {
  @Input() public createFlag: any;
  @Input() public gobalDocType: any;
  @Input() public gobalDocId: any;
  @Input() public gobalEquId: any;
  @ViewChild('myTable') table: any;
  @ViewChild('fileupload') public file: FileUploadForDocComponent;
  @ViewChild('modalUsers') modalUsers: any;
  @ViewChild('date') date: MyDatePicker;
  datePipeFormat = 'dd-MM-yyyy';
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: this.datePipeFormat,
    disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
  };
  public onTaskForm: FormGroup;
  data: any;
  filterData: any;
  modal: ProjectTaskDTO = new ProjectTaskDTO();
  timerTrackingDTO: TaskTimerTrackingDTO = new TaskTimerTrackingDTO();
  public rowsOnPage = 10;
  public filterQuery = '';
  spinnerFlag = false;
  iscreate: boolean = false;
  isUpdate: boolean = false;
  isSave: boolean = false;
  locationList: any;
  priorityList: any = [];
  taskCategoryList: any = [];
  statusList: any = [];
  topStatusList: any = [];
  selectedStatusItems = [];
  usersList: any = [];
  documentTypeList: any = [];
  documentTypeIdList: any = [];
  selectedStatusIds = [];
  public today: any = new Date();
  public validDate: any;
  mainDocumentTypeList: any[];
  projectTaskDocuments: ProjectTaskDocuments[] = new Array<ProjectTaskDocuments>();
  fileList: any = [];
  public tableView: boolean = false;
  selectedPriority: String = "";
  selectedStatus: String = "";
  selectedTaskCategory: String = "";
  taskBoardData: TaskBoardDTO[] = new Array<TaskBoardDTO>();
  viewIndividualTaskData: boolean = false;
  viewData: any;
  viewTimeTrackingData: any
  frequencyList: any[];
  isRemainderFlag: boolean = false;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  permisionModal: Permissions = new Permissions("190", false);
  userItemList = [];
  selectedUserItems = [];
  settings = {};
  statusSettings = {};
  submitted: boolean = false;
  users: any[] = new Array<any>();
  selectUserList: any[] = new Array<any>();
  public remainingDays: number;
  updateFlag: boolean = false;
  isCancel: boolean = true;
  equipment: Array<IOption> = new Array<IOption>();
  gobalDocumentType: string;
  gobalDocumentId: string;
  @Output() onTaskPopupHide = new EventEmitter();
  roleBackEqupmentId: any = null;
  routeback: any = null;
  redirctUrlFormView: any;
  isManualEntry: string = 'Y';
  isCheckListEntered: boolean = false;
  validation_messages = {
    'taskTitle': [
      { type: 'required', message: 'Task title is Required' },
    ],
    'priority': [
      { type: 'required', message: 'Priority is Required' },
    ],
    'taskCategory': [
      { type: 'required', message: 'TaskCategory is Required' },
    ],
    'dueDate': [
      { type: 'required', message: 'Due Date is Required' },
    ],
    'assignedTo': [
      { type: 'required', message: 'Assigned to is Required' },
    ],
    'status': [
      { type: 'required', message: 'Status to is Required' },
    ],
  }
  isUserInWorkFlow: boolean = false;
  constructor(public configService: ConfigService, public router: Router,
    private comp: AdminComponent, public fb: FormBuilder, private Eservice: EquipmentService,
    public service: TaskCreationService, public helper: Helper, private datePipe: DatePipe,
    public lookUpService: LookUpService, private servie: DateFormatSettingsService,
    public projectsetupService: projectsetupService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loadOrgDateFormatAndTime();
    this.route.queryParams.subscribe(rep => {
      if (rep.id !== undefined && rep.url != '/editTask') {
        this.roleBackEqupmentId = rep.equipmentId;
        this.viewDetails(rep.id);
        if (rep.project) {
          this.comp.onChange(rep.project, true);
        }
        if (rep.url) {
          this.routeback = rep.id;
          this.redirctUrlFormView = rep.url;
        }
      }
    });
    this.configService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
      this.selectedUserItems.push({ id: this.currentUser.id, itemName: this.currentUser.name });
      this.loadUsers();
      this.loadStatusList();
      this.loadPriorityList();
      this.loadDocumentTypes();
      this.loadTaskCategory();
      this.loadEquipment();
      this.loadAll();
    });
    let now = new Date();
    let tempData = new NgbDateISOParserFormatter;
    this.today = tempData.parse(now.toISOString());
    this.comp.setUpModuleForHelpContent(this.helper.TASK_CREATION);
    this.comp.taskDocType = this.helper.TASK_CREATION;
    this.configService.loadPermissionsBasedOnModule(this.helper.TASK_CREATION).subscribe(resp => {
      this.permisionModal = resp
    });

    this.onTaskForm = this.fb.group({
      taskTitle: ['', Validators.compose([
        Validators.required
      ])],
      priority: ['', Validators.compose([
        Validators.required
      ])],
      dueDate: ['', Validators.compose([
        Validators.required
      ])],
      assignedTo: ['', Validators.compose([
        Validators.required
      ])],
      status: ['', Validators.compose([
        Validators.required
      ])],
      documentType: [],
      documentId: [],
      description: [],
      remainderFlag: [],
      frequency: [],
      taskCategory: [],
      selectedEquipment: [],
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("dueDateFrequency").subscribe(res => {
      this.frequencyList = res.response;
    });
    this.settings = {
      singleSelection: false,
      text: "Select Users",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
      classes: "myclass custom-class-example"
    };
    this.statusSettings = {
      singleSelection: false,
      text: "Select Status",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1,
      classes: "myclass custom-class-example"
    };
    this.route.queryParams.subscribe(rep => {
      if (rep.id !== undefined) {
        this.service.loadTasksBasedOnId(rep.id).subscribe(rp => {
          if (rep.url != '/editTask')
            this.viewRowDetails(rp.dto);
          else
            this.editTask(rp.dto);
        });
      }
    });
    this.configService.getUserPreference("Task").subscribe(res => {
      if (res.result)
        this.tableView = (res.result === "table");
    });
  }

  changeview(value) {
    this.tableView = value;
    this.configService.saveUserPreference("Task", this.tableView ? "table" : "card").subscribe(res => { });
  }

  loadAll() {
    this.spinnerFlag = true;
    this.service.loadTasks().subscribe(resp => {
      if (resp.result != null) {
        this.data = resp.result;
        this.filterData = resp.result;
        this.onChangeStatus();
        if (this.data)
          this.prepareTaskBoardData();
        this.spinnerFlag = false;
      } else {
        this.spinnerFlag = false;
      }
    }, (err) => {
      this.spinnerFlag = false;
    });
  }

  loadEquipment() {
    this.Eservice.loadEquipmentsByuser().subscribe(response => {
      if (response.result != null) {
        this.equipment = response.result.map(option => ({ value: option.id, label: option.name }));
      }
    }, error => { this.spinnerFlag = false });
  }

  onCloseUrsPopup(flag) {
    if (flag) {
      this.modal.selectedUsers = this.selectUserList.filter(data => data.selected).map(a => a.id);
      this.onTaskForm.get("assignedTo").setValue(this.modal.selectedUsers)
    } else {
      let ids = this.onTaskForm.get("assignedTo").value;
      this.selectUserList.filter(f => (!ids.includes(f.id))).forEach(element => element.selected = false);
    }
  }

  onChangeUsers(event) {
    this.modal.selectedUsers = event;
    this.users.forEach(element => { element.selected = false; });
    if (this.modal.selectedUsers != undefined) {
      this.modal.selectedUsers.forEach(data => {
        this.users.forEach(element => {
          if (element.id === data)
            element.selected = true;
        });
      });
    }
  }

  loadPriorityList() {
    this.lookUpService.getlookUpItemsBasedOnCategory("TaskPrioirty").subscribe(result => {
      this.priorityList = result.response;
    });
  }

  loadTaskCategory() {
    this.lookUpService.getlookUpItemsBasedOnCategory("TaskCategory").subscribe(result => {
      this.taskCategoryList = result.response;
    });
  }

  loadStatusList() {
    this.lookUpService.getlookUpItemsBasedOnCategory("TaskReportStatus").subscribe(result => {
      this.statusList = result.response.map(option => ({ id: +option.key, itemName: option.value }));;
    });
    this.selectedStatusItems.push({ id: 1, itemName: "Open" });
    this.selectedStatusItems.push({ id: 3, itemName: "In Progress" });
    this.lookUpService.getlookUpItemsBasedOnCategory("TaskStatus").subscribe(result => {
      this.topStatusList = result.response;
    });
  }

  loadUsers() {
    this.selectUserList = new Array();
    this.projectsetupService.loadUsersByProject(this.currentUser.projectId).subscribe(resp => {
      if (resp.list != null && this.isManualEntry == 'Y') {
        this.users = resp.list;
        this.selectUserList = resp.list.map(option => ({ selected: false, ...option }));
        this.usersList = resp.list.map(option => ({ value: option.id, label: option.userName }));
        this.userItemList = resp.list.map(option => ({ id: option.id, itemName: option.userName }));
      }
    });
  }

  loadDocumentTypes() {
    this.configService.HTTPPostAPI("", "admin/loadDocumentForTask").subscribe(resp => {
      this.documentTypeList = resp.map(option => ({ value: option.key, label: option.value }))
    })
  }

  onClickCreate() {
    this.isRemainderFlag = false;
    this.isSave = true;
    this.iscreate = true;
    this.isUpdate = false;
    this.onTaskForm.reset();
    this.modal.id = 0;
    this.isManualEntry = "Y";
    this.modal.checklist = [];
    this.onTaskForm.get("priority").setValue("Medium");
    this.onTaskForm.get("status").setValue("Open");
    this.onTaskForm.get("taskCategory").setValue("Task");
    this.onTaskForm.controls['status'].disable();
    this.modal.files = [];
    this.isUserInWorkFlow = true;
    this.loadUsers();
    setTimeout(() => {
      $('#taskTitle').focus();
    }, 600);
  }

  onClickCancel() {
    this.comp.taskDocType = "";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.iscreate = false;
    this.loadAll();
  }

  onChangeFilters() {
    this.filterData = [];
    this.filterData = this.data;
    if (this.selectedPriority)
      this.filterData = this.filterData.filter(f => f.priority == this.selectedPriority);
    if (this.selectedTaskCategory)
      this.filterData = this.filterData.filter(f => f.taskCategory == this.selectedTaskCategory);
    if (this.selectedUserItems.length > 0)
      this.filterData = this.filterData.filter(f => this.selectedUserItems.some(r => f.selectedUsers.includes(+r.id)));
    if (this.selectedStatusItems.length > 0) {
      let status = this.selectedStatusItems.map(m => m.itemName);
      this.filterData = this.filterData.filter(f => status.some(r => f.status.includes(r)));
    }
  }

  onChangeDocumentType(event: any) {
    let data: ProjectTaskDTO = new ProjectTaskDTO();
    data.selectedDocumentTypes = event
    data.projectVersionId = this.currentUser.versionId;
    this.service.loadAllDocumentIds(data).subscribe(resp => {
      if (resp.result != null) {
        this.mainDocumentTypeList = resp.result;
        this.documentTypeIdList = resp.result.map(option => ({ value: option.key, label: option.value }))
      }
    });
  }

  onClickSave() {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    this.submitted = true;
    if (this.onTaskForm.valid && !this.isCheckListEntered) {
      this.submitted = false;
      this.populateModal();
      this.spinnerFlag = true;
      let files: FileDTO[] = new Array<FileDTO>();
      for (let index = 0; index < this.fileList.length; index++) {
        let file = this.fileList[index];
        let dto: FileDTO = new FileDTO();
        dto.fileName = file.name;
        files.push(dto);
      }
      this.modal.files = files;
      this.modal.isManualEntry = this.isManualEntry;
      this.service.createTask(this.modal).subscribe(resp => {
        this.file.uploadFileList(resp.data, this.helper.TASK_CREATION).then(re => {
          if (resp.result === "success") {
            this.spinnerFlag = false;
            let timerInterval;
            if (!this.isUpdate)
              swal({
                title: '',
                text: 'Task Saved Successfully',
                type: 'success',
                timer: this.helper.swalTimer,
                showConfirmButton: false,
                onClose: () => {
                  if (!this.createFlag) {
                    this.loadAll();
                    this.iscreate = false;
                  }
                  clearInterval(timerInterval)
                }
              });
            else {
              this.isManualEntry = 'Y';
              swal({
                title: '',
                text: 'Task Updated Successfully',
                type: 'success',
                timer: this.helper.swalTimer,
                showConfirmButton: false,
                onClose: () => {
                  this.loadAll();
                  this.iscreate = false;
                  clearInterval(timerInterval)
                }
              });
            }
          } else {
            this.spinnerFlag = false;
            swal({
              title: 'Error',
              text: 'Task has not been saved.',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            });
          }
        },
          err => {
            this.spinnerFlag = false;
            swal({
              title: 'Error',
              text: 'Task has not been saved.',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            });
          });
      }
      );
    }
  }

  uploadFileList(id: any) {
    let timerInterval;
    const formdata: FormData = new FormData();
    for (let index = 0; index < this.fileList.length; index++) {
      let file = this.fileList[index];
      let fileName = file.name;
      formdata.append('file', this.fileList[index], fileName);
    }
    if (this.fileList.length > 0) {
      this.service.saveMultipleFile(formdata, id).subscribe(jsonResp => {
        if (jsonResp.result === "success") {
          this.spinnerFlag = false;
          if (!this.isUpdate)
            swal({
              title: '',
              text: 'Task Saved Successfully',
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
              onClose: () => {
                this.loadAll();
                this.iscreate = false;
                clearInterval(timerInterval)
              }
            });
          else
            swal({
              title: '',
              text: 'Task Updated Successfully',
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
              onClose: () => {
                this.loadAll();
                this.iscreate = false;
                clearInterval(timerInterval)
              }
            });
        }
      });
    } else {
      this.spinnerFlag = false;
      if (!this.isUpdate)
        swal({
          title: '',
          text: 'Task Saved Successfully',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.loadAll();
            this.iscreate = false;
            clearInterval(timerInterval)
          }
        });
      else
        swal({
          title: '',
          text: 'Task Updated Successfully',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.loadAll();
            this.iscreate = false;
            clearInterval(timerInterval)
          }
        });
    }
  }

  populateModal() {
    this.modal.loginUserId = this.currentUser.id;
    this.modal.globalProjectId = this.currentUser.projectId;
    this.modal.projectVersionId = this.currentUser.versionId
    this.modal.taskTitle = this.onTaskForm.get("taskTitle").value;
    this.modal.priority = this.onTaskForm.get("priority").value;
    this.modal.taskCategory = this.onTaskForm.get("taskCategory").value;
    this.modal.status = this.onTaskForm.get("status").value;
    this.modal.selectedUsers = this.onTaskForm.get("assignedTo").value;
    this.modal.description = this.onTaskForm.get("description").value;
    this.modal.remainderFlag = this.onTaskForm.get("remainderFlag").value;
    this.modal.frequency = this.onTaskForm.get("frequency").value;
    this.modal.dueDate = this.datePipe.transform(this.setJsonToDate(this.onTaskForm.get("dueDate").value.date), 'yyyy-MM-dd hh:mm:ss');
    this.modal.equipmentId = this.onTaskForm.get("selectedEquipment").value;
    this.projectTaskDocuments = new Array<ProjectTaskDocuments>();
    let selectedDocumentTypes = this.onTaskForm.get("documentType").value;
    let selectedDocumentIds = this.onTaskForm.get("documentId").value;
    if (this.createFlag) {
      selectedDocumentIds = [this.onTaskForm.get("documentId").value];
    }
    if (!this.helper.isEmpty(selectedDocumentTypes)) {
      selectedDocumentTypes.forEach(type => {
        let dto: ProjectTaskDocuments = new ProjectTaskDocuments();
        dto.documentType = type;
        let ids: ProjectTaskDocumentsIdDTO[] = new Array<ProjectTaskDocumentsIdDTO>();
        if (!this.helper.isEmpty(selectedDocumentIds)) {
          selectedDocumentIds.forEach(id => {
            this.mainDocumentTypeList.forEach(element => {
              if (element.key === id && element.documentType === type) {
                let dto: ProjectTaskDocumentsIdDTO = new ProjectTaskDocumentsIdDTO();
                dto.documentId = element.key;
                dto.documentCode = element.value;
                ids.push(dto);
              }
            });
          });
        }
        dto.selectedDocumentIds = ids;
        this.projectTaskDocuments.push(dto);
      });
      this.modal.documents = this.projectTaskDocuments;
    }
  }

  getMonthFromDate(date: any): any {
    let result;
    if (!this.helper.isEmpty(date)) {
      this.validDate = date;
      result = this.validDate.month;
    } else {
      result = "";
    }
    return result;
  }

  populateSaveDate(date: any): any {
    let result;
    if (!this.helper.isEmpty(date)) {
      this.validDate = date;
      result = this.validDate.day + "-" + this.validDate.month + "-" + this.validDate.year;
    } else {
      result = "";
    }
    return result;
  }

  populateDate(date: any): any {
    let result;
    if (!this.helper.isEmpty(date)) {
      let tempData = new NgbDateISOParserFormatter;
      let dateString = date.split("-");
      let validDate = new Date();
      validDate.setDate(dateString[2]);
      validDate.setMonth(dateString[1] - 1);
      validDate.setFullYear(dateString[0]);
      result = tempData.parse(validDate.toISOString());
    } else {
      result = "";
    }
    return result;
  }

  editTask(dto: ProjectTaskDTO) {
    this.modal = dto;
    console.log(this.modal);
    this.remainingDays = dto.remaingDays;
    this.fileList = [];
    this.onTaskForm.controls['status'].enable();
    this.modal.id = dto.id;
    this.modal.taskCode = dto.taskCode;
    this.modal.status = dto.status;
    this.modal.startTimerFlag = dto.startTimerFlag;
    this.modal.endTimerFlag = dto.endTimerFlag;
    setTimeout(() => {
      this.spinnerFlag = true;
      this.file.loadFileListForEdit(dto.id, dto.taskTitle);
      this.spinnerFlag = false;
    }, 1000);
    this.modal.files = dto.files;
    this.modal.status = dto.status;
    this.modal.startTimerFlag = dto.startTimerFlag;
    this.modal.endTimerFlag = dto.endTimerFlag;
    this.modal.taskCode = dto.taskCode;
    this.onChangeDocumentType(dto.selectedDocumentTypes);
    if (dto.documentConstant != this.helper.CLEAN_ROOM_VALUE) {
      if (dto.selectedDocumentTypes && dto.selectedDocumentTypes.length > 0) {
        this.configService.isUserInWorkFlow(dto.selectedDocumentTypes).subscribe(resp => {
          this.isUserInWorkFlow = resp;
        });
      } else {
        this.isUserInWorkFlow = true;
      }
    } else {
      this.isUserInWorkFlow = dto.levelUserList.filter(f => f.organizationId == this.currentUser.id).length > 0 ? true : false;
    }
    this.isManualEntry = dto.isManualEntry;
    if (dto.isManualEntry == 'T') {
      this.usersList = dto.levelUserList.map(option => ({ value: option.id, label: option.userName }));
      this.selectUserList = dto.levelUserList.map(option => ({ id: option.id, userName: option.userName, designation: option.designation, departmentIdName: option.departmentIdName, selected: false }));
    } else if (dto.isManualEntry == 'N') {
      this.usersList = dto.levelUserList.map(option => ({ value: option.organizationId, label: option.firstName }));
      this.selectUserList = dto.levelUserList.map(option => ({ id: option.organizationId, userName: option.firstName, designation: option.designation, departmentIdName: option.departmentIdName, selected: false }));
    } else {
      this.loadUsers();
    }
    this.onChangeRemainderFlag(dto.remainderFlag);
    this.onTaskForm.get("taskTitle").setValue(dto.taskTitle);
    this.onTaskForm.get("priority").setValue(dto.priority);
    this.onTaskForm.get("taskCategory").setValue(dto.taskCategory);
    this.onTaskForm.get("status").setValue(dto.status);
    this.onTaskForm.get("assignedTo").setValue(dto.selectedUsers);
    this.selectUserList.filter(f => dto.selectedUsers.includes(f.id)).forEach(element => element.selected = true);
    this.onTaskForm.get("selectedEquipment").setValue(dto.equipmentId);
    this.onTaskForm.get("documentType").setValue(dto.selectedDocumentTypes);
    this.onTaskForm.get("documentId").setValue(dto.selectedDocumentIds);
    this.onTaskForm.get("description").setValue(dto.description);
    this.onTaskForm.get("remainderFlag").setValue(dto.remainderFlag);
    this.onTaskForm.get("frequency").setValue(dto.frequency);
    if (!this.helper.isEmpty(dto.dueDate))
      this.onTaskForm.get("dueDate").setValue(this.setDate(dto.dueDate));
    this.iscreate = true;
    this.isUpdate = true;
    this.isSave = false;
  }

  openSuccessCancelSwal(dataObj) {
    var classObject = this;
    swal({
      title: 'Are you sure?',
      text: 'You wont be able to revert',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonClass: 'btn btn-danger',
      allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      classObject.deleteTask(dataObj);
    });
  }

  deleteTask(dataObj): string {
    let timerInterval;
    let status = '';
    let data = new ProjectTaskDTO();
    data.id = dataObj.id;
    data.loginUserId = this.currentUser.id;
    data.globalProjectId = this.currentUser.projectId;
    this.service.deleteTask(data)
      .subscribe((response) => {
        let responseMsg: string = response.result;
        if (responseMsg === "success") {
          swal({
            title: 'Deleted!',
            text: 'Task has been deleted.',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.loadAll();
              clearInterval(timerInterval)
            }
          });
        } else {
          status = "failure";
          swal({
            title: 'Not Deleted!',
            text: 'Facility  has not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer
          }
          );
        }
      }, (err) => {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: dataObj.taskTitle + 'is not deleted...Something went wrong',
          type: 'error',
          timer: this.helper.swalTimer
        }
        );
      });
    return status;
  }

  onChangeCompleteFlag(row: any) {
    this.spinnerFlag = true;
    this.service.completeTask(row).subscribe(result => {
      this.loadAll();
      this.spinnerFlag = false;
    });
  }

  statusChange(row) {
    this.spinnerFlag = true;
    this.service.statusChange(row).subscribe(result => {
      this.loadAll();
      this.spinnerFlag = false;
    });
  }

  onChangeStatus() {
    this.spinnerFlag = true;
    this.selectedStatusIds = [];
    this.selectedStatusItems.forEach(obj => {
      this.selectedStatusIds.push(obj.itemName);
    });
    this.filterData = [];
    for (let i = 0; i < this.selectedStatusIds.length; i++) {
      for (let j = 0; j < this.data.length; j++) {
        if (this.selectedStatusIds[i] == this.data[j].status) {
          this.filterData.push(this.data[j]);
        }
      }
    }
    this.spinnerFlag = false;
  }

  prepareTaskBoardData() {
    this.taskBoardData = new Array<TaskBoardDTO>();
    let docName: any[] = new Array();
    this.data.forEach(item => {
      if (item.selectedDocumentTypeNames && item.selectedDocumentTypeNames.length > 0) {
        item.selectedDocumentTypeNames.forEach(doc => {
          if (!docName.includes(doc))
            docName = [...docName, doc];
        });
      } else if (!docName.includes('Others')) {
        docName = [...docName, 'Others'];
      }
    })
    docName.forEach(item => {
      let list: ProjectTaskDTO[] = this.data.filter(f => (f.selectedDocumentTypeNames && f.selectedDocumentTypeNames.length > 0 ? f.selectedDocumentTypeNames : 'Others').includes(item));
      let dto = new TaskBoardDTO();
      dto.name = item;
      dto.list = list;
      this.taskBoardData.push(dto);
    });
  }

  viewRowDetails(row) {
    this.viewData = row;
    this.viewIndividualTaskData = true;
    setTimeout(() => {
      this.file.loadFileListForEdit(this.viewData.id, this.viewData.taskTitle);
    }, 1000)
    this.loadTimeTrackingData(this.viewData.id);
  }

  viewDetails(id) {
    this.service.loadTasksBasedOnId(id).subscribe(result => {
      this.viewData = result;
      console.log(this.viewData);
      this.viewIndividualTaskData = true;
      setTimeout(() => {
        this.file.loadFileListForEdit(this.viewData.id, this.viewData.taskTitle);
      }, 1000)
      this.loadTimeTrackingData(id);
    });
  }

  routeView(row: any, id: any) {
    if (row.url.indexOf('dynamicForm') >= 0) {
      this.comp.redirect(row.url, '/taskCreation')
    }
    if (row.url.indexOf('dynamicForm') < 0) {
      this.router.navigate([row.url], { queryParams: { id: row.documentId, status: '/taskCreation', roleBack: id } });
    }
  }

  taskRouteView(row) {
    if (row.url) {
      if (row.permissionCategory.includes("Template")) {
        this.comp.redirect(row.url)
      } else if (row.documentId.length > 0 && row.documentConstant == this.helper.VENDOR_VALIDATION_VALUE) {
        this.router.navigate([row.url], { queryParams: { id: row.documentTypeIds[0].documentId, status: '/taskCreation' } });
      } else
        this.comp.taskURLNavigation(row);
    }
  }

  onChangeRemainderFlag(event: any) {
    this.isRemainderFlag = event;
  }

  loadTimeTrackingData(rowId: any) {
    this.service.loadTimeTrackingData(rowId).subscribe(result => {
      this.viewTimeTrackingData = result;
    });
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
    this.service.saveTimer(this.timerTrackingDTO).subscribe(result => {
      if (result.result == "success") {
        if (this.modal.startTimerFlag == 'Y') {
          this.modal.startTimerFlag = 'N';
          this.modal.endTimerFlag = 'Y';
        } else {
          this.modal.startTimerFlag = 'Y';
          this.modal.endTimerFlag = 'N';
        }
        this.loadAll();
        if (this.iscreate) {
          this.iscreate = false;
        }
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

  endTimer(row: any, value: any) {
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
    this.timerTrackingDTO.comments = value;
    this.service.saveTimer(this.timerTrackingDTO).subscribe(result => {
      if (result.result == "success") {
        if (this.modal.startTimerFlag == 'Y') {
          this.modal.startTimerFlag = 'N';
          this.modal.endTimerFlag = 'Y';
        } else {
          this.modal.startTimerFlag = 'Y';
          this.modal.endTimerFlag = 'N';
        }
        this.spinnerFlag = false;
        if (this.iscreate) {
          this.iscreate = false;
        }
        this.loadAll();
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

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (result && result.datePattern) {
        this.datePipeFormat = result.datePattern.replace("YYYY", "yyyy");
        this.myDatePickerOptions.dateFormat = this.datePipeFormat;
        if (this.date)
          this.date.setOptions();
      }
    });
  }

  navigate() {
    let queryParams = {};
    if (this.roleBackEqupmentId) {
      queryParams = { id: this.roleBackEqupmentId }
      this.router.navigate([this.redirctUrlFormView], { queryParams: queryParams });
    } else {
      this.comp.redirect(this.redirctUrlFormView)
    }
  }

  loadUserModal() {
    if (this.isUserInWorkFlow && (this.isManualEntry == 'N' || this.isManualEntry == 'Y')) {
      this.modalUsers.show();
    }
  }

  openBtnClicked() {
    if (!this.date.disabled) {
      if (!this.date.showSelector)
        this.date.openBtnClicked();
    }
  }

  setJsonToDate(json: { year, month, day }) {
    return new Date(json.year, json.month - 1, json.day, 0, 0, 0, 0);
  }

  setDate(date: String) {
    let json = {};
    if (date) {
      let dateArray = date.split('-');
      if (dateArray.length == 3) {
        json = {
          date: {
            year: +dateArray[0],
            month: +dateArray[1],
            day: +dateArray[2]
          }
        }
      }
    }
    return json;
  }

  addChecklistItem() {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName))
        this.isCheckListEntered = true;
    });
    if (!this.isCheckListEntered) {
      let data = new CheckListEquipmentDTO();
      data.id = 0;
      data.checklistName = "";
      data.displayOrder = this.modal.checklist.length + 1;
      data.focusFlag = true;
      this.modal.checklist.push(data);
    }
    setTimeout(() => {
      $('#check_list_name_id_' + (this.modal.checklist.length - 1)).focus();
    }, 600);
  }

  deleteCheckList(data) {
    this.modal.checklist = this.modal.checklist.filter(event => event !== data);
  }

}
