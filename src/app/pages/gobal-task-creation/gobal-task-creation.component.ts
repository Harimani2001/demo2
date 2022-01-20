import { IMyDpOptions } from 'mydatepicker/dist';
import { Component, OnInit, ViewChild, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { FileUploadForDocComponent } from '../file-upload-for-doc/file-upload-for-doc.component';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { FileDTO, ProjectTaskDocuments, ProjectTaskDocumentsIdDTO, ProjectTaskDTO, TaskBoardDTO, UserPrincipalDTO, TaskTimerTrackingDTO, CheckListEquipmentDTO } from './../../models/model';
import { IOption } from '../../../../node_modules/ng-select';
import { EquipmentService } from '../equipment/equipment.service';
import { TaskCreationService } from '../task-creation/task-creation.service';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { DatePipe } from '../../../../node_modules/@angular/common';
import { MyDatePicker } from 'mydatepicker';

@Component({
  selector: 'app-gobal-task-creation',
  templateUrl: './gobal-task-creation.component.html',
  styleUrls: ['./gobal-task-creation.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})

export class GobalTaskCreationComponent implements OnInit {
  @Input() public createFlag: any;
  @Input() public gobalDocType: any;
  @Input() public gobalDocId: any;
  @Input() public gobalEquId: any;
  @ViewChild('myTable') table: any;
  @ViewChild('fileupload') public file: FileUploadForDocComponent;
  datePipeFormat = 'dd-MM-yyyy';
  @ViewChild('date') date: MyDatePicker;
  @ViewChild('searchBox') searchBox: any;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: this.datePipeFormat,
    disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
  };
  public gobalTaskForm: FormGroup;
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
  usersList: any = [];
  documentTypeList: any = [];
  documentTypeIdList: any = [];
  public today: any = new Date();
  public validDate: any;
  mainDocumentTypeList: any[];
  projectTaskDocuments: ProjectTaskDocuments[] = new Array<ProjectTaskDocuments>();
  fileList: any = [];
  public tableView: boolean = true;
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
  submitted: boolean = false;
  users: any[] = new Array<any>();
  public remainingDays: number;
  updateFlag: boolean = false;
  isCancel: boolean = true;
  equipmentList: Array<IOption> = new Array<IOption>();
  gobalDocumentType: string;
  gobalDocumentId: string;
  @Output() onTaskPopupHide = new EventEmitter<any>();
  roleBackEqupmentId: any = null;
  routeback: any = null;
  disableItems: boolean = false;
  fileUploadDesable: boolean = false;
  redirctUrlFormView: any;
  pattern = "d-m-Y";
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
  isManualEntry: string = 'Y';

  constructor(public configService: ConfigService, public router: Router, private datePipe: DatePipe,
    private comp: AdminComponent, public fb: FormBuilder, public projectsetupService: projectsetupService,
    public service: TaskCreationService, public helper: Helper, private servie: DateFormatSettingsService,
    public lookUpService: LookUpService, private Eservice: EquipmentService) {
  }

  ngOnInit() {
    this.loadOrgDateFormatAndTime();
    this.loadOrgDateFormat();
    this.configService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
      this.loadUsers();
      this.loadPriorityList();
      this.loadStatusList();
      this.loadTaskCategory();
      this.loadEquipment();
    });
    this.comp.setUpModuleForHelpContent(this.helper.TASK_CREATION);
    this.comp.taskDocType = this.helper.TASK_CREATION;
    this.configService.loadPermissionsBasedOnModule(this.helper.TASK_CREATION).subscribe(resp => {
      this.permisionModal = resp
    });

    this.gobalTaskForm = this.fb.group({
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
  }

  loadUsers() {
    this.projectsetupService.loadUsersByProject(this.currentUser.projectId).subscribe(resp => {
      if (resp.list != null) {
        this.users = resp.list;
        this.usersList = resp.list.map(option => ({ value: option.id, label: option.userName }));
        this.userItemList = resp.list.map(option => ({ id: option.id, itemName: option.userName }));
      }
    });
  }

  loadEquipment() {
    this.Eservice.loadEquipmentsByuser().subscribe(response => {
      if (response.result != null) {
        this.equipmentList = response.result.map(option => ({ value: option.id, label: option.name }));
      }
    }, error => { this.spinnerFlag = false });
  }

  onChangeRemainderFlag(event: any) {
    this.isRemainderFlag = event;
  }

  taskPopupData() {
    if (this.createFlag) {
      this.gobalDocumentType = this.gobalDocType;
      this.iscreate = this.createFlag;
      this.isSave = true;
      this.isCancel = false;
      this.setTaskGobalValues(this.gobalDocType, this.gobalDocId, this.gobalEquId);
    }
  }

  setTaskGobalValues(docType: any, docId: any, equipmentId: number, dueDate?, title?) {
    this.isSave = true;
    this.iscreate = true;
    this.disableItems = false;
    this.fileUploadDesable = false;
    this.viewIndividualTaskData = false;
    this.gobalTaskForm.reset();
    this.gobalTaskForm.controls['status'].disable();
    this.gobalTaskForm.get("priority").setValue("Medium");
    this.modal.files = [];
    this.loadDocumentTypes();
    if (equipmentId && equipmentId != 0) {
      this.gobalTaskForm.get("selectedEquipment").setValue([equipmentId]);
      this.gobalTaskForm.controls['selectedEquipment'].disable();
    } else {
      this.gobalTaskForm.controls['selectedEquipment'].enable();
    }
    this.gobalTaskForm.get("status").setValue("Open");
    if (docType == '108' || docType == '109' || docType == '110' || docType == '207' || docType == '208') {
      this.gobalTaskForm.get("taskCategory").setValue("Bug");
    } else {
      this.gobalTaskForm.get("taskCategory").setValue("Task");
    }
    if (docType) {
      this.loadDocumentTypes();
      this.gobalTaskForm.get("documentType").setValue([docType]);
    }
    if (docId) {
      this.onChangeDocumentType([docType]);
      this.gobalTaskForm.get("documentId").setValue('' + docId);
    }
    if (dueDate) { //json due date
      this.gobalTaskForm.get("dueDate").setValue({ date: dueDate });
    }
    if (title) { // taskTitle
      this.gobalTaskForm.get("taskTitle").setValue(title);
    }
    this.isSave = true;
    this.iscreate = true;
    this.viewIndividualTaskData = false;
    if (this.currentUser.id != undefined && this.currentUser.id != "") {
      this.onChangeUsers([this.currentUser.id]);
      this.onCloseUrsPopup();
    }
  }

  onCloseUrsPopup() {
    this.modal.selectedUsers = this.users.filter(data => data.selected).map(a => a.id);
    this.gobalTaskForm.get("assignedTo").setValue(this.modal.selectedUsers)
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

  onChangeDocumentType(event: any): Promise<any> {
    return new Promise<any>((resolve) => {
      if (event) {
        let data: ProjectTaskDTO = new ProjectTaskDTO();
        data.selectedDocumentTypes = event
        data.projectVersionId = this.currentUser.versionId;
        this.service.loadAllDocumentIds(data).subscribe(resp => {
          if (resp.result != null) {
            this.mainDocumentTypeList = resp.result;
            this.documentTypeIdList = resp.result.map(option => ({ value: option.key, label: option.value }))
            resolve(true);
          } else {
            resolve(true);
          }
        }, err => resolve(true));
      } else {
        resolve(true);
        this.documentTypeIdList = new Array();
        this.mainDocumentTypeList = new Array();
      }
    })
  }

  loadDocumentTypes() {
    this.configService.HTTPPostAPI('', "admin/loadDocumentForTask").subscribe(resp => {
      this.documentTypeList = resp.map(option => ({ value: option.key, label: option.value }))
    })
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
    this.lookUpService.getlookUpItemsBasedOnCategory("TaskStatus").subscribe(result => {
      this.statusList = result.response;
    });
  }

  onClickCreate() {
    this.isSave = true;
    this.iscreate = true;
    this.isUpdate = false;
    this.gobalTaskForm.reset();
    this.modal.id = 0;
    this.gobalTaskForm.get("priority").setValue("Medium");
    this.gobalTaskForm.get("status").setValue("Open");
    this.gobalTaskForm.get("taskCategory").setValue("Task");
    this.gobalTaskForm.controls['status'].disable();
    this.modal.files = [];
    this.modal.checklist = [];
    var timer = setInterval(() => {
      if (this.searchBox) {
        this.searchBox.nativeElement.focus();
        clearInterval(timer);
      }
    }, 1000);
  }

  onClickSave() {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    this.submitted = true;

    if (this.gobalTaskForm.valid && !this.isCheckListEntered) {
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
      this.fileUploadDesable = true;
      this.modal.isManualEntry = this.isManualEntry;
      this.service.createTask(this.modal).subscribe(resp => {
        this.file.uploadFileList(resp.data, this.helper.TASK_CREATION).then(re => {
          this.fileUploadDesable = false;
          this.disableItems = false;
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
                    this.iscreate = false;
                  } else {
                    this.onTaskPopupHide.emit(resp.data);
                    this.onClickCreate();
                    this.taskPopupData();
                  }
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
                  this.fileUploadDesable = false;
                  this.disableItems = false;
                  this.iscreate = false;
                  clearInterval(timerInterval)
                }
              });
            this.navigateToModule(this.router.url);
          } else {
            this.spinnerFlag = false;
            this.disableItems = false;
            this.fileUploadDesable = false;
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
            this.disableItems = false;
            this.fileUploadDesable = false;
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

  navigateToModule(url: any) {
    this.router.navigate(['/MainMenu']).then(res => {
      if (res)
        switch (url) {
          case '/equipment':
            this.router.navigate(['/equipment']);
            break;
        }
    });
  }

  populateModal() {
    this.modal.loginUserId = this.currentUser.id;
    this.modal.globalProjectId = this.currentUser.projectId;
    this.modal.projectVersionId = this.currentUser.versionId
    this.modal.taskTitle = this.gobalTaskForm.get("taskTitle").value;
    this.modal.priority = this.gobalTaskForm.get("priority").value;
    this.modal.taskCategory = this.gobalTaskForm.get("taskCategory").value;
    this.modal.status = "Open";
    this.modal.selectedUsers = this.gobalTaskForm.get("assignedTo").value;
    this.modal.description = this.gobalTaskForm.get("description").value;
    this.modal.remainderFlag = this.gobalTaskForm.get("remainderFlag").value;
    this.modal.frequency = this.gobalTaskForm.get("frequency").value;
    this.modal.dueDate = this.datePipe.transform(this.setJsonToDate(this.gobalTaskForm.get("dueDate").value.date), 'yyyy-MM-dd hh:mm:ss');
    this.modal.equipmentId = this.gobalTaskForm.get("selectedEquipment").value;
    this.projectTaskDocuments = new Array<ProjectTaskDocuments>();
    let selectedDocumentTypes = this.gobalTaskForm.get("documentType").value;
    let selectedDocumentIds = this.gobalTaskForm.get("documentId").value;
    if (this.createFlag) {
      selectedDocumentIds = [this.gobalTaskForm.get("documentId").value];
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

  setJsonToDate(json: { year, month, day }) {
    return new Date(json.year, json.month, json.day, 0, 0, 0, 0);
  }

  loadOrgDateFormat() {
    this.servie.getOrgDateFormatForDatePicker().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.pattern = result.replace("y", "Y");
      }
    });
  }

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (result && result.datePattern) {
        this.datePipeFormat = result.datePattern.replace("YYYY", "yyyy");
        this.myDatePickerOptions.dateFormat = this.datePipeFormat;
        this.datePipeFormat = result.datePattern.replace("mm", "MM");
        if (this.date)
          this.date.setOptions();
      }
    });
  }

  openBtnClicked() {
    if (!this.date.showSelector)
      this.date.openBtnClicked();
  }

  enableItems() {
    if (this.disableItems) {
      this.disableItems = false;
      this.fileUploadDesable = false;
    } else {
      this.disableItems = true;
      this.fileUploadDesable = true;
    }
    var timer = setInterval(() => {
      if (this.searchBox) {
        this.searchBox.nativeElement.focus();
        clearInterval(timer);
      }
    }, 1000);
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
      $('#task_global_check_list_name_id_' + (this.modal.checklist.length - 1)).focus();
    }, 600);
  }

  deleteCheckList(data) {
    this.modal.checklist = this.modal.checklist.filter(event => event !== data);
  }

}
