import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { NgbDateISOParserFormatter } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter";
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';
import { equipmentErrorTypes } from '../../shared/constants';
import { FormExtendedComponent } from '../form-extended/form-extended.component';
import { LocationService } from '../location/location.service';
import { MasterControlService } from '../master-control/master-control.service';
import { CheckListEquipmentDTO, Equipment } from './../../models/model';
import { Permissions } from './../../shared/config';
import { Helper } from './../../shared/helper';
import { EquipmentService } from './equipment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { DatePipe } from '@angular/common';
import { IOption } from 'ng-select';
import { DepartmentService } from '../department/department.service';
import { UserService } from '../userManagement/user.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { FileUploader } from 'ng2-file-upload';
const URL_For_Upload = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
  host: { '(document:click)': 'onClick($event)' },
})
export class EquipmentComponent implements OnInit {
  @ViewChild('formExtendedId') private formExtendedComponent: FormExtendedComponent;
  @ViewChild('equipmentTab') tabs: any;
  @ViewChild('TaskModal') private TaskModal: any;
  @ViewChild('bulkEquipmentModal') public bulkEquipmentModal: ModalBasicComponent;
  @ViewChild('equipmentName') equipmentName: any;
  public inputField: any = [];
  submitted: boolean = false;
  @ViewChild('myTable') table: any;
  @ViewChild('a') a: any;
  @ViewChild('b') b: any;
  @ViewChild('c') c: any;
  @ViewChild('d') d: any;
  @ViewChild('e') e: any;
  @ViewChild('f') f: any;
  @ViewChild('g') g: any;
  @ViewChild('h') h: any;
  @ViewChild('i') i: any;
  @ViewChild('j') j: any;
  public onEquipmentForm = null;
  data: any;
  equipmentData: any;
  modal: Equipment = new Equipment();
  public rowsOnPage = 10;
  public filterQuery = '';
  spinnerFlag = false;
  iscreate: boolean = false;
  isUpdate: boolean = false;
  isSave: boolean = false;
  public today: NgbDateStruct;
  public validDate: NgbDateStruct;
  location = [];
  locationList = [];
  permissionsfromlocalstorage: any;
  permissionModal: Permissions = new Permissions('', false);
  isValidName: boolean = false;
  selecetdFile: File;
  isAddChecklist: boolean = false;
  isAddChecklistName: boolean = false;
  editing = {};
  equipmentCountFlag = true;
  isCheckListEntered: boolean = false;
  isValidDocumentOrder: boolean = false;
  viewIndividualEquipmentData: boolean = false;
  equipmentViewData: any;
  popupdata = [];
  completeTaskList: any[] = new Array();
  pendingTaskList: any[] = new Array();
  datePipeFormat = 'yyyy-MM-dd';
  pattern = "d-m-Y";
  departmentList: Array<IOption> = new Array<IOption>();
  userList: Array<IOption> = new Array<IOption>();
  equipmentCategoryList = [];
  qualificationList = [];
  gxpRelevanceList = [];
  showSearch: boolean = false;
  groupedData: any;
  equipmentGroupedData: any;
  public tableView: boolean = false;
  locationDropdownSettings = {
    singleSelection: true,
    text: "Select Location",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  equipmentTask: any[] = new Array();
  showAudit: boolean = false;
  showTasks: boolean = false;
  openTaskList: any[] = new Array();
  totalUsersList: any[] = new Array();
  isUploaded: boolean = false;
  excelData: any[] = new Array();
  public validationMessage: string = "";
  fileList: any;
  public uploader: FileUploader = new FileUploader({
    url: URL_For_Upload,
    isHTML5: true
  });
  formExtendedColumns: any;
  qualificationStatus = [
    { id: "Initiated", itemName: "Initiated" },
    { id: "Validation Ongoing", itemName: "Validation Ongoing" },
    { id: "Technically Released", itemName: "Technically Released" },
  ];
  statusDropdownSettings = {
    singleSelection: false,
    text: "Select Qualification Status",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  enableImportButton: boolean = false;

  constructor(public permissionService: ConfigService, private comp: AdminComponent, public fb: FormBuilder, public service: EquipmentService,
    public helper: Helper, public locationService: LocationService, public _eref: ElementRef, public equipmentErrorTypes: equipmentErrorTypes,
    public masterControlService: MasterControlService, public router: Router, private route: ActivatedRoute, private servie: DateFormatSettingsService,
    private datePipe: DatePipe, public deptService: DepartmentService, private userService: UserService, public lookUpService: LookUpService,
    public projectService: projectsetupService) { }

  ngOnInit() {
    this.loadOrgDateFormat();
    this.loadOrgDateFormatAndTime();
    this.canCreateEquipment();
    this.getEquipmentCategory();
    this.getQualification();
    this.getGxpRelevance();
    this.loadAllActiveLocations();
    this.modal.selectedFile = "";
    this.comp.setUpModuleForHelpContent("141");
    this.comp.taskDocType = "141";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEnbleFlag = true;
    this.comp.taskEquipmentId = 0;
    this.route.queryParams.subscribe(rep => {
      if (rep.id != undefined) {
        this.viewRowDetails(rep.id);
      }
    });
    let now = new Date();
    let tempData = new NgbDateISOParserFormatter;
    this.today = tempData.parse(now.toISOString());
    this.loadAll();
    this.onEquipmentForm = this.fb.group({
      category: new FormControl([]),
      code: ['', Validators.required],
      name: ['', Validators.required],
      dateOfPurchase: new FormControl([]),
      manufacturer: new FormControl([]),
      soldBy: new FormControl([]),
      model: new FormControl([]),
      totalCapacity: new FormControl([]),
      usageCapacity: new FormControl([]),
      locationId: new FormControl([]),
      departments: new FormControl([]),
      systemOwner: new FormControl([]),
      description: new FormControl([]),
      component: new FormControl([]),
      qualificationStatus: new FormControl([]),
      gxpRelevence: new FormControl([]),
      IQCompletionDate: new FormControl([]),
      OQCompletionDate: new FormControl([]),
      releaseDate: new FormControl([]),
      periodicReview: new FormControl([]),
      checklistName: new FormControl([]),
      sequence: new FormControl([]),
      active: new FormControl([]),
    });
    this.permissionService.loadPermissionsBasedOnModule("141").subscribe(resp => {
      this.permissionModal = resp
    });
  }

  ngAfterViewChecked(): void {
    if (this.tabs) {
      this.tabs.select(this.helper.decode(localStorage.getItem('equipmentTab')));
    }
  }

  getEquipmentCategory() {
    this.lookUpService.getlookUpItemsBasedOnCategory("equipmentCategory").subscribe(response => {
      if (response.result == "success") {
        this.equipmentCategoryList = response.response;
      }
    });
  }

  getQualification() {
    this.lookUpService.getlookUpItemsBasedOnCategory("projectSetupValidationStatus").subscribe(response => {
      if (response.result == "success") {
        this.qualificationList = response.response.map(option => ({ id: option.key, itemName: option.value }));
      }
    });
  }

  getGxpRelevance() {
    this.lookUpService.getlookUpItemsBasedOnCategory("gxpRelevanceStatus").subscribe(response => {
      if (response.result == "success") {
        this.gxpRelevanceList = response.response;
      }
    });
  }

  canCreateEquipment() {
    this.service.canCreateEquipment().subscribe(res => {
      this.equipmentCountFlag = res;
    });
  }

  onTabChange(id: any) {
    this.tabs.activeId = id;
  }

  loadAllActiveLocations() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      if (response.result) {
        this.locationList = response.result.map(option => ({ id: option.id, itemName: option.name }));
      }
    });
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onSelectFile(event) {
    this.selecetdFile = event.target.files[0];
    this.spinnerFlag = true;
    this.permissionService.checkIsValidFileSize(event.target.files[0].size).subscribe(fileRes => {
      this.spinnerFlag = false;
      if (fileRes) {
        const reader = new FileReader();
        reader.onload = () => {
          this.modal.selectedFile = reader.result;
          this.modal.selectedFileName = event.target.files[0].name;
        };
        reader.readAsDataURL(this.selecetdFile);
      } else {
        this.helper.fileSizeWarning();
        event.target.value = "";
      }
    });
  }

  onClickCreate() {
    this.isSave = true;
    this.iscreate = true;
    this.isUpdate = false;
    this.onEquipmentForm.reset();
    this.modal.id = 0;
    this.modal.checklist = [];
    this.onEquipmentForm.get("active").setValue(true);
    this.onEquipmentForm.get("category").setValue("");
    this.onEquipmentForm.get("locationId").setValue("");
    this.onEquipmentForm.get("qualificationStatus").setValue("");
    this.onEquipmentForm.get("gxpRelevence").setValue("");
    this.modal.selectedFile = "";
    this.laodJsonStrucutre();
    var timer = setInterval(() => {
      if (this.equipmentName) {
        this.equipmentName.nativeElement.focus();
        clearInterval(timer);
      }
    })
  }

  onChangeLocation(locId) {
    this.onEquipmentForm.get("departments").setValue(new Array());
    this.onEquipmentForm.get("systemOwner").setValue(new Array());
    this.userList = [];
    this.deptService.loadDepartmentOnLocation(locId).subscribe(jsonResp => {
      this.departmentList = [];
      this.departmentList = jsonResp.result.map(m => ({ value: m.id, label: m.value }));
    })
  }

  onDeSelectDepartment(deptIds) {
    let ids1 = this.totalUsersList.filter(f => f.mappingId === '' + deptIds.value).map(m => +m.key);
    let ids2 = this.onEquipmentForm.get("systemOwner").value;
    for (let i = 0; i < ids1.length; i++) {
      for (let j = 0; j < ids2.length; j++) {
        if (ids1[i] === ids2[j])
          ids2.splice(j, 1);
      }
    }
    this.onEquipmentForm.get("systemOwner").setValue(ids2);
  }

  getDeptUsers() {
    let ids = this.onEquipmentForm.get("departments").value;
    if (!this.helper.isEmpty(ids)) {
      this.userService.loadAllUserBasedOnDepartment(ids).subscribe(jsonResp => {
        this.totalUsersList = jsonResp.result;
        this.userList = jsonResp.result.map(option => ({ value: +option.key, label: option.value }));
      })
    }
  }

  addChecklistItem() {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    if (!this.isCheckListEntered) {
      let data = new CheckListEquipmentDTO();
      data.id = 0;
      data.checklistName = "";
      data.displayOrder = this.modal.checklist.length + 1;
      this.modal.checklist.push(data);
    }
    setTimeout(() => {
      $('#name-' + (this.modal.checklist.length - 1)).focus();
    }, 600);
  }

  deleteCheckList(data) {
    this.modal.checklist = this.modal.checklist.filter(event => event !== data);
  }

  editRow(rowIndex) {
    for (let index = 0; index < this.modal.checklist.length; index++) {
      if (rowIndex == index)
        this.editing[index] = true;
      else
        this.editing[index] = false;
    }
  }

  onClickCancel() {
    this.iscreate = false;
    this.ngOnInit();
  }

  loadAll() {
    this.spinnerFlag = true;
    this.projectService.loadCurrentLocationOfProject().subscribe(resp => {
      if (resp.result) {
        this.location = [{ id: resp.result.id, itemName: resp.result.name }];
      }
      this.permissionService.getUserPreference("Equipment").subscribe(res => {
        if (res.result) {
          switch (res.result) {
            case 'Table':
              this.tableView = true;
              this.loadEquipmentData();
              break;
            case 'Card':
              this.tableView = false;
              this.loadEquipmentData();
              break;
            case 'Tasks':
              this.tabs.select('tasks');
              this.showTasksTab();
              break
          }
        } else {
          this.loadEquipmentData();
        }
      });
    }, error => {
      this.spinnerFlag = false;
    });
  }

  loadEquipmentData() {
    this.service.loadEquipment().subscribe(response => {
      this.spinnerFlag = false
      if (response.result) {
        this.data = response.result;
      }
      let id = this.location.map(m => m.id);
      let status = this.qualificationStatus.map(m => m.itemName);
      if (id.length > 0) {
        this.equipmentData = this.data.filter(f => (f.locationId === id[0]) && (status.includes(f.qualificationStatus)));
        this.groupedData = this.groupBy(this.data.filter(f => (f.locationId === id[0]) && (status.includes(f.qualificationStatus))), item => item.qualificationStatus);
      } else {
        this.equipmentData = this.data.filter(f => status.includes(f.qualificationStatus));
        this.groupedData = this.groupBy(this.data.filter(f => status.includes(f.qualificationStatus)), item => item.qualificationStatus);
      }
    }, error => { this.spinnerFlag = false });
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    let itemList: any[] = new Array();
    map.forEach((value: any, key: string) => {
      itemList = [...itemList, { key: key, value: value }];
    });
    return itemList;
  }

  onChangeName() {
    this.isValidName = false;
    this.data.forEach(element => {
      if (element.name === this.onEquipmentForm.get("name").value && this.modal.id != element.id)
        this.isValidName = true;
    });
  }

  editEquipmet(data: Equipment) {
    this.iscreate = true;
    this.isSave = false;
    this.isUpdate = true;
    this.modal = data;
    if (this.modal.jsonExtraData != null && this.modal.jsonExtraData != '[]') {
      this.inputField = JSON.parse(this.modal.jsonExtraData);
    } else {
      this.laodJsonStrucutre();
    }
    this.onChangeLocation(data.locationId);
    this.onEquipmentForm.reset();
    this.onEquipmentForm.get("active").setValue(data.active === 'Y' ? true : false);
    this.onEquipmentForm.get("sequence").setValue(data.selectedFile);
    this.onEquipmentForm.get("code").setValue(data.code);
    this.onEquipmentForm.get("name").setValue(data.name);
    this.onEquipmentForm.get("category").setValue(data.category);
    this.onEquipmentForm.get("departments").setValue(data.departments);
    this.getDeptUsers();
    this.onEquipmentForm.get("systemOwner").setValue(data.systemOwner);
    this.onEquipmentForm.get("description").setValue(data.description);
    this.onEquipmentForm.get("component").setValue(data.component);
    this.onEquipmentForm.get("qualificationStatus").setValue(data.qualificationStatus);
    this.onEquipmentForm.get("gxpRelevence").setValue(data.gxpRelevence);
    this.onEquipmentForm.get("locationId").setValue(data.locationId);
    this.onEquipmentForm.get("manufacturer").setValue(data.manufacturer);
    this.onEquipmentForm.get("soldBy").setValue(data.soldBy);
    this.onEquipmentForm.get("model").setValue(data.model);
    this.onEquipmentForm.get("totalCapacity").setValue(data.totalCapacity);
    this.onEquipmentForm.get("usageCapacity").setValue(data.usageCapacity);
    if (!this.helper.isEmpty(data.dateOfPurchase)) this.onEquipmentForm.get("dateOfPurchase").setValue(data.dateOfPurchase);
    if (!this.helper.isEmpty(data.iqCompletionDate)) this.onEquipmentForm.get("IQCompletionDate").setValue(data.iqCompletionDate);
    if (!this.helper.isEmpty(data.oqCompletionDate)) this.onEquipmentForm.get("OQCompletionDate").setValue(data.oqCompletionDate);
    if (!this.helper.isEmpty(data.releaseDate)) this.onEquipmentForm.get("releaseDate").setValue(data.releaseDate);
    if (!this.helper.isEmpty(data.periodicReview)) this.onEquipmentForm.get("periodicReview").setValue(data.periodicReview);
    this.isAddChecklist = true;
    var timer = setInterval(() => {
      if (this.equipmentName) {
        this.equipmentName.nativeElement.focus();
        clearInterval(timer);
      }
    })
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

  openSuccessCancelSwal(dataObj, id) {
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
          dataObj.userRemarks = "Comments : " + value;
          this.deleteLocation(dataObj);
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

  deleteLocation(dataObj): string {
    let timerInterval;
    let status = '';
    let equipment = new Equipment();
    equipment.id = dataObj.id;
    equipment.userRemarks = dataObj.userRemarks;
    this.service.deleteEquipment(equipment).subscribe((response) => {
      let responseMsg: string = response.result;
      if (responseMsg === "success") {
        swal({
          title: 'Deleted!',
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
          text: 'Equipment ' + dataObj.code + '  has not been deleted.',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }
        );
      }
    }, (err) => {
      status = "failure";
      swal({
        title: 'Not Deleted!',
        text: dataObj.name + 'is not deleted...Something went wrong',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      });
    });
    return status;
  }

  openSuccessUpdateSwal(onEquipmentForm) {
    this.isCheckListEntered = false;
    this.isValidDocumentOrder = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    let valueArr = this.modal.checklist.map(function (item) { return String(item.displayOrder) });
    this.isValidDocumentOrder = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx
    });
    if (onEquipmentForm.valid && this.onEquipmentForm.get("locationId").value != "" && this.onEquipmentForm.get("qualificationStatus").value != "" && this.formExtendedComponent.validateChildForm()) {
      if (!this.isValidName && !this.isCheckListEntered && !this.isValidDocumentOrder) {
        swal({
          title: "Write your comments here:",
          input: 'textarea',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Update',
          showLoaderOnConfirm: true,
          allowOutsideClick: false,
        })
          .then((value) => {
            if (value) {
              let userRemarks = "Comments : " + value;
              this.onClickSave(onEquipmentForm, userRemarks);
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
    }
  }

  onClickSave(onEquipmentForm, userRemarks?) {
    this.submitted = false;
    let timerInterval;
    this.isCheckListEntered = false;
    this.isValidDocumentOrder = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    let valueArr = this.modal.checklist.map(function (item) { return String(item.displayOrder) });
    this.isValidDocumentOrder = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx
    });
    if (onEquipmentForm.valid && this.onEquipmentForm.get("locationId").value != "" && this.onEquipmentForm.get("qualificationStatus").value != "" && this.formExtendedComponent.validateChildForm()) {
      if (!this.isValidName && !this.isCheckListEntered && !this.isValidDocumentOrder) {
        this.spinnerFlag = true;
        this.modal.code = this.onEquipmentForm.get("code").value;
        this.modal.name = this.onEquipmentForm.get("name").value;
        this.modal.locationId = this.onEquipmentForm.get("locationId").value;
        this.modal.manufacturer = this.onEquipmentForm.get("manufacturer").value;
        this.modal.soldBy = this.onEquipmentForm.get("soldBy").value;
        this.modal.model = this.onEquipmentForm.get("model").value;
        this.modal.totalCapacity = this.onEquipmentForm.get("totalCapacity").value;
        this.modal.usageCapacity = this.onEquipmentForm.get("usageCapacity").value;
        this.modal.jsonExtraData = JSON.stringify(this.inputField);
        this.modal.category = this.onEquipmentForm.get("category").value;
        this.modal.departments = null != this.onEquipmentForm.get("departments").value ? this.onEquipmentForm.get("departments").value : [];
        this.modal.departmentName = this.departmentList.filter(d => this.modal.departments.includes(d.value)).sort((a, b) => a.label.localeCompare(b.label)).map(d => d.label).toString();
        this.modal.systemOwner = null != this.onEquipmentForm.get("systemOwner").value ? this.onEquipmentForm.get("systemOwner").value : [];
        this.modal.systemOwnerName = this.userList.filter(d => this.modal.systemOwner.includes(d.value)).sort((a, b) => a.label.localeCompare(b.label)).map(d => d.label).toString();
        this.modal.description = this.onEquipmentForm.get("description").value;
        this.modal.component = this.onEquipmentForm.get("component").value;
        this.modal.qualificationStatus = this.onEquipmentForm.get("qualificationStatus").value;
        this.modal.gxpRelevence = this.onEquipmentForm.get("gxpRelevence").value;
        if (this.onEquipmentForm.get("active").value)
          this.modal.active = "Y";
        else
          this.modal.active = "N";
        if (this.onEquipmentForm.get("sequence").value)
          this.modal.sequence = "Y";
        else
          this.modal.sequence = "N";
        if (!this.helper.isEmpty(this.onEquipmentForm.get("dateOfPurchase").value))
          this.modal.dateOfPurchase = this.datePipe.transform(new Date(this.onEquipmentForm.get("dateOfPurchase").value), 'yyyy-MM-dd hh:mm:ss');
        else
          this.modal.dateOfPurchase = null;
        if (!this.helper.isEmpty(this.onEquipmentForm.get("IQCompletionDate").value))
          this.modal.iqCompletionDate = this.datePipe.transform(new Date(this.onEquipmentForm.get("IQCompletionDate").value), 'yyyy-MM-dd hh:mm:ss');
        else
          this.modal.iqCompletionDate = null;
        if (!this.helper.isEmpty(this.onEquipmentForm.get("OQCompletionDate").value))
          this.modal.oqCompletionDate = this.datePipe.transform(new Date(this.onEquipmentForm.get("OQCompletionDate").value), 'yyyy-MM-dd hh:mm:ss');
        else
          this.modal.oqCompletionDate = null;
        if (!this.helper.isEmpty(this.onEquipmentForm.get("releaseDate").value))
          this.modal.releaseDate = this.datePipe.transform(new Date(this.onEquipmentForm.get("releaseDate").value), 'yyyy-MM-dd hh:mm:ss');
        else
          this.modal.releaseDate = null;
        if (!this.helper.isEmpty(this.onEquipmentForm.get("periodicReview").value))
          this.modal.periodicReview = this.datePipe.transform(new Date(this.onEquipmentForm.get("periodicReview").value), 'yyyy-MM-dd hh:mm:ss');
        else
          this.modal.periodicReview = null;
        this.modal.userRemarks = userRemarks;
        this.service.createEquipment(this.modal).subscribe(jsonResp => {
          this.spinnerFlag = false;
          let responseMsg: string = jsonResp.result;
          if (responseMsg === "success") {
            this.loadAll();
            this.canCreateEquipment();
            let mes = 'New Equipment is created';
            if (this.isUpdate) {
              mes = "Equipment is updated"
            }
            swal({
              title: '',
              text: mes,
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
              onClose: () => {
                this.iscreate = false;
                clearInterval(timerInterval)
              }
            });
          } else {
            swal({
              title: '',
              text: 'Something went Wrong ...Try Again',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false
            })
          }
        },
          err => {
            this.spinnerFlag = false
          }
        );
      }
    } else {
      this.submitted = true;
      Object.keys(this.onEquipmentForm.controls).forEach(field => {
        const control = this.onEquipmentForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  openDatepicker(id) {
    id.toggle()
  }

  onClick(event) {
    // let path = event.path;
    // let a = false, b = false, c = false, d = false, e = false, f = false, g = false, h = false;
    // for (var index = 0; index < path.length; index++) {
    //   if(this.a)
    //   if (path[index].id == this.a._elRef.nativeElement.name) {
    //     a = true;
    //     break;
    //   }
    //   if(this.b)
    //   if (path[index].id == this.b._elRef.nativeElement.name) {
    //     b = true;
    //     break;
    //   }
    //   if(this.c)
    //   if (path[index].id == this.c._elRef.nativeElement.name) {
    //     c = true;
    //     break;
    //   }
    //   if(this.d)
    //   if (path[index].id == this.d._elRef.nativeElement.name) {
    //     d = true;
    //     break;
    //   }
    //   if(this.e)
    //   if (path[index].id == this.e._elRef.nativeElement.name) {
    //     e = true;
    //     break;
    //   }
    //   if(this.f)
    //   if (path[index].id == this.f._elRef.nativeElement.name) {
    //     f = true;
    //     break;
    //   }
    //   if(this.g)
    //   if (path[index].id == this.g._elRef.nativeElement.name) {
    //     g = true;
    //     break;
    //   }
    //   if(this.h)
    //   if (path[index].id == this.h._elRef.nativeElement.name) {
    //     h = true;
    //     break;
    //   }
    // }
    // if (!a) { this.a.close(); }
    // if (!b) { this.b.close(); }
    // if (!c) { this.c.close(); }
    // if (!d) { this.d.close(); }
    // if (!e) { this.e.close(); }
    // if (!f) { this.f.close(); }
    // if (!g) { this.g.close(); }
    // if (!h) { this.h.close(); }
  }

  laodJsonStrucutre() {
    this.masterControlService.loadJsonOfDocumentIfActive(this.helper.EQUIPMENT_VALUE).subscribe(res => {
      if (res != null)
        this.inputField = JSON.parse(res.jsonStructure);
    });
  }

  viewRowDetails(row) {
    this.comp.taskEquipmentId = row;
    this.service.editEquipment(row).subscribe(response => {
      if (response.result) {
        this.equipmentViewData = response.result;
        this.popupdata = [];
        this.equipmentViewData.formData = JSON.parse(this.equipmentViewData.jsonExtraData);
        this.popupdata.push(this.equipmentViewData);
        this.service.loadEquipmentTasks(row).subscribe(res => {
          if (res.completeList && res.pendingList) {
            this.completeTaskList = res.completeList;
            this.pendingTaskList = res.pendingList;
          }
        });
        this.viewIndividualEquipmentData = true;
      }
    });
  }

  redirect(row, equipmentId) {
    this.router.navigate(["taskCreation"], { queryParams: { id: row.id, equipmentId: equipmentId, url: '/equipment' } })
  }

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.datePipeFormat = result.datePattern.replace("mm", "MM")
        this.datePipeFormat = this.datePipeFormat.replace("YYYY", "yyyy");
      }
    });
  }

  loadOrgDateFormat() {
    this.servie.getOrgDateFormatForDatePicker().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.pattern = result.replace("y", "Y");
      }
    });
  }

  cloneOfEquipment(data) {
    this.service.cloneOfEquipment(data).subscribe((resp) => {
      if (resp.result != 'failure') {
        swal({
          title: 'Copied Successfully!',
          text: ' ',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.ngOnInit();
          }
        });
      } else {
        swal({
          title: 'Error',
          text: 'Some Internal Issue has been occured. We will get back to You',
          type: 'error',
          timer: this.helper.swalTimer
        })
      }
    }, err => {
      swal({
        title: 'Error',
        text: 'Some Internal Issue has been occured. We will get back to You',
        type: 'error',
        timer: this.helper.swalTimer
      })
    });
  }

  changeview(value: any) {
    this.spinnerFlag = true;
    this.tabs.select('draft');
    this.permissionService.saveUserPreference("Equipment", value ? "Table" : "Card").subscribe(res => { });
    this.tableView = value;
    this.loadEquipmentData();
  }

  filterEquipment(location, qualStatus) {
    let id = location.map(m => m.id);
    let status = qualStatus.map(m => m.itemName);
    if (id.length > 0) {
      this.equipmentData = this.data.filter(f => (f.locationId === id[0]) && (status.includes(f.qualificationStatus)));
      this.groupedData = this.groupBy(this.data.filter(f => (f.locationId === id[0]) && (status.includes(f.qualificationStatus))), item => item.qualificationStatus);
    } else {
      this.equipmentData = [];
      this.groupedData = [];
    }
  }

  showTaskModel(data: any, status: any) {
    if (status == 'open')
      this.equipmentTask = data.equipmentTask.pendingList;
    else if (status == 'completed')
      this.equipmentTask = data.equipmentTask.completeList;
    if (this.equipmentTask)
      this.TaskModal.show();
  }

  showAuditTab() {
    this.showAudit = !this.showAudit
    if (this.showAudit)
      this.tabs.activeId = 'audit';
  }

  showTasksTab() {
    this.showTasks = !this.showTasks
    if (this.showTasks && this.location.length > 0) {
      this.tabs.activeId = 'tasks';
      this.permissionService.saveUserPreference("Equipment", "Tasks").subscribe(res => { });
      this.service.loadOpenEquipmentTasksForLocation(this.location[0].id).subscribe(jsonResp => {
        this.openTaskList = this.groupBy(jsonResp.openTaskList, item => item.equipmentName);
        this.spinnerFlag = false;
      }, error => {
        this.spinnerFlag = false;
      })
    }
  }

  navigateToTask(taskId) {
    this.router.navigate(['/taskCreation'], { queryParams: { id: taskId, url: "/equipment" }, skipLocationChange: true });
  }

  resetBulk() {
    this.validationMessage = "";
    this.uploader.queue = new Array();
  }

  closeBulkEquipmentModel() {
    this.isUploaded = false;
    this.excelData = new Array();
    this.ngOnInit();
  }

  sampleBatchDownload() {
    this.bulkEquipmentModal.spinnerShow();
    this.service.downloadSampleEquipmentFile().subscribe(res => {
      this.bulkEquipmentModal.spinnerHide();
      var blob: Blob = this.helper.b64toBlob(res.body, 'application/xls');
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, 'sampleEquipmentFile.xls');
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'sampleEquipmentFile.xls';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }, err => this.bulkEquipmentModal.spinnerHide());
  }

  extractFile(event: any) {
    this.validationMessage = "";
    if (event.target.files[0].name.match('.xls')) {
      this.fileList = event.target.files;
      if (this.uploader.queue.length > 1) {
        this.uploader.queue = new Array(this.uploader.queue[1]);
      }
      this.onClickOfUploadButton();
      event.target.value = '';
    } else {
      this.validationMessage = "Please upload .xls file";
    }
  }

  onClickOfUploadButton() {
    this.bulkEquipmentModal.spinnerShow();
    if (this.fileList.length > 0) {
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.service.extractExcelFile(formData).subscribe(resp => {
        this.bulkEquipmentModal.spinnerHide();
        let dataList = resp.list;
        let validationMsg = resp.validationMsg;
        if (!this.helper.isEmpty(dataList) && this.helper.isEmpty(validationMsg)) {
          this.validationMessage = file.name + " file read successfully done";
          this.excelData = dataList;
          this.excelData.forEach(u => {
            this.checkEquipmentName(this.excelData, u);
            this.checkEquipmentCode(this.excelData, u);
            this.checkLocation(this.excelData, u);
            this.checkQualificationStatus(this.excelData, u);
            if (!this.helper.isEmpty(u.jsonExtraData) && u.jsonExtraData != []) {
              u.jsonExtraData = JSON.parse(u.jsonExtraData);
              this.formExtendedColumns = u.jsonExtraData;
            }
          })
          this.isUploaded = true;
        }
        if (!this.helper.isEmpty(validationMsg)) {
          swal({
            title: 'Are you sure?',
            text: validationMsg + ', Do you want to continue with first ' + resp.list.length + (resp.list.length == 1 ? 'Equipment' : ' Equipments'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok, proceed',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success m-r-10',
            cancelButtonClass: 'btn btn-danger',
            allowOutsideClick: false,
            buttonsStyling: false
          }).then(resp => {
            this.validationMessage = file.name + " file read successfully done";
            this.excelData = dataList;
            this.isUploaded = true;
            this.disableImportButton(this.excelData);
          });
        }
      }, err => {
        this.validationMessage = 'Error in Excel File';
        this.bulkEquipmentModal.spinnerHide();
      }
      );
    }
  }

  checkEquipmentName(list: any[], rowData) {
    if (!this.helper.isEmpty(list) && rowData.name)
      rowData.equipmentNameValMsg = '';
    else
      rowData.equipmentNameValMsg = 'Equipment Name is required';
    this.disableImportButton(list);
  }

  checkEquipmentCode(list: any[], rowData) {
    if (!this.helper.isEmpty(list) && rowData.code)
      rowData.equipmentCodeValMsg = '';
    else
      rowData.equipmentCodeValMsg = 'Equipment Code is required';
    this.disableImportButton(list);
  }

  checkLocation(list: any[], rowData) {
    if (!this.helper.isEmpty(list) && rowData.locationId != 0)
      rowData.locationValMsg = '';
    else
      rowData.locationValMsg = 'Please select Location';
    this.disableImportButton(list);
  }

  checkQualificationStatus(list: any[], rowData) {
    if (!this.helper.isEmpty(list) && rowData.qualificationStatus)
      rowData.qualificationStatusValMsg = '';
    else
      rowData.qualificationStatusValMsg = 'Please select Qualification Status';
    this.disableImportButton(list);
  }

  disableImportButton(list) {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element.equipmentCodeValMsg == '' && element.equipmentCodeValMsg == '' && element.locationValMsg == '' &&
        element.qualificationStatusValMsg == '') {
        this.enableImportButton = false;
      } else {
        this.enableImportButton = true;
        break;
      }
    }
  }

  onBulkChangeLocation(locId, row) {
    row.departments = [];
    row.systemOwner = [];
    row.systemOwnerList = [];
    this.deptService.loadDepartmentOnLocation(locId).subscribe(jsonResp => {
      row.departmentList = [];
      row.departmentList = jsonResp.result.map(m => ({ value: m.id, label: m.value }));
    })
  }

  onBulkDeSelectDepartment(deptIds, row) {
    let ids1 = row.totalBulkUsersList.filter(f => f.mappingId === '' + deptIds.value).map(m => +m.key);
    let ids2 = row.systemOwner;
    for (let i = 0; i < ids1.length; i++) {
      for (let j = 0; j < ids2.length; j++) {
        if (ids1[i] === ids2[j])
          ids2.splice(j, 1);
      }
    }
    row.systemOwner = ids2;
  }

  getBulkDeptUsers(row) {
    if (!this.helper.isEmpty(row.departments)) {
      this.userService.loadAllUserBasedOnDepartment(row.departments).subscribe(jsonResp => {
        row.totalBulkUsersList = jsonResp.result;
        row.systemOwnerList = jsonResp.result.map(option => ({ value: +option.key, label: option.value }));
      })
    }
  }

  fieldValidation(jsonObject: any) {
    if (!this.helper.isEmpty(jsonObject.value))
      jsonObject.fieldError = false;
    else
      jsonObject.fieldError = true;
  }

  importData() {
    if (this.excelData.length > 0) {
      this.bulkEquipmentModal.spinnerShow();
      for (let element of this.excelData) {
        if (element.dateOfPurchase && !isNaN(element.dateOfPurchase.getTime()))
          element.dateOfPurchase = this.datePipe.transform(new Date(element.dateOfPurchase), 'yyyy-MM-dd hh:mm:ss');
        else
          element.dateOfPurchase = null;

        if (element.iqCompletionDate && !isNaN(element.iqCompletionDate.getTime()))
          element.iqCompletionDate = this.datePipe.transform(new Date(element.iqCompletionDate), 'yyyy-MM-dd hh:mm:ss');
        else
          element.iqCompletionDate = null;

        if (element.oqCompletionDate && !isNaN(element.oqCompletionDate.getTime()))
          element.oqCompletionDate = this.datePipe.transform(new Date(element.oqCompletionDate), 'yyyy-MM-dd hh:mm:ss');
        else
          element.oqCompletionDate = null;

        if (element.releaseDate && !isNaN(element.releaseDate.getTime()))
          element.releaseDate = this.datePipe.transform(new Date(element.releaseDate), 'yyyy-MM-dd hh:mm:ss');
        else
          element.releaseDate = null;

        if (element.periodicReview && !isNaN(element.periodicReview.getTime()))
          element.periodicReview = this.datePipe.transform(new Date(element.periodicReview), 'yyyy-MM-dd hh:mm:ss');
        else
          element.periodicReview = null;
      }
      let list = JSON.parse(JSON.stringify(this.excelData));
      for (let json of list) {
        json.jsonExtraData = JSON.stringify(json.jsonExtraData);
      }
      this.service.saveBulk(list).subscribe(resp => {
        this.bulkEquipmentModal.spinnerHide();
        this.bulkEquipmentModal.hide();
        if (resp.result) {
          swal({
            title: '', text: 'Saved Successfully', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
            onClose: () => {
              this.isUploaded = false;
              this.excelData = new Array();
              this.ngOnInit();
            }
          });
        } else { swal({ title: 'Error', text: 'Something went Wrong ...Try Again', type: 'error', timer: 2000 }) }
      }, err => { this.bulkEquipmentModal.spinnerHide(); });
    }
  }

}
