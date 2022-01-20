import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import swal from 'sweetalert2';
import '../../../../assets/charts/echart/echarts-all.js';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { CommonModel, flowNotificationDto, User, UserPrincipalDTO, UserShortcutsDTO, RolePermissions, AuditTrail, dropDownDto } from '../../../models/model';
import { projectsetupService } from '../../../pages/projectsetup/projectsetup.service';
import { ConfigService } from '../../../shared/config.service';
import { Helper } from '../../../shared/helper';
import { AuditTrailService } from '../../audit-trail/audit-trail.service';
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { UservsEquipmentService } from '../../user-mapping/user-mapping.service';
import { UserService } from '../../userManagement/user.service';
import { userRoleservice } from '../../role-management/role-management.service';
import { ModalBasicComponent } from '../../../shared/modal-basic/modal-basic.component';
import { IOption } from 'ng-select';
import { PermissionCategory } from '../../../models/permissioncategory';
import { DateFormatSettingsService } from '../../date-format-settings/date-format-settings.service';
import { DatePipe } from '@angular/common';
import { IMyDpOptions } from 'mydatepicker/dist';
import { NgForm } from '@angular/forms';
import { LocationService } from '../../location/location.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})

export class ProfileComponent implements OnInit {
  oldTable = { column: new Array, rows: new Array() };
  newTable = { column: new Array, rows: new Array() };
  @ViewChild('auditForTable') tableModal;
  @ViewChild('emailNotificationSetting') emailNotificationSetting: any;
  @ViewChild('myTable') table: any;
  @ViewChild('sendMailRequest') sendMailModal: ModalBasicComponent;
  @ViewChild('date') date: any;
  @ViewChild('date1') date1: any;
  editProfile = true;
  editProfileIcon = 'icofont-edit';
  editAbout = true;
  editAboutIcon = 'icofont-edit';
  public auditTrailList: any;
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  profitChartOption: any;
  userModel: User = new User();
  public userEmailSettingList = new Array();
  user: User = new User();
  public roleName: string;
  isLoading: boolean = false;
  userName: string;
  public userProjectsList: any;
  submitted: boolean = false;
  equipmentMailingListOfUser = [];
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  userSign: any = '';
  enableEsign: boolean = false;
  error: string = '';
  uploadedFileView: boolean = false;
  errorFlag: boolean = false;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 540,
    'canvasHeight': 100,
    // 'penColor':'rgb(41, 4, 6)',
  };
  public notificationModalList: flowNotificationDto[] = new Array();
  docList: any;
  projectVersionId: any;
  isModulesSelected: boolean = false;
  userShortcutsDTO: UserShortcutsDTO = new UserShortcutsDTO();
  moduleList: any[] = new Array();
  mySign: any = '';
  count: number = 0;
  drawStartFlag: boolean = false;
  spinnerFlag: boolean = false;
  totalPermission: RolePermissions[] = new Array();
  permission: RolePermissions[] = new Array();
  userroleid: any;
  remarksForEmail: any;
  selectedUsersForEmail: User[] = new Array();
  public userList: Array<IOption> = new Array<IOption>();
  selectedUsers: any;
  dropdownSettings = {
    singleSelection: false,
    text: "Select User",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
  };
  emailRequest: any;
  mapData: Map<string, string[]>;
  datePipeFormat = 'dd-MM-yyyy';
  public startdate1: any;
  public Enddate1: any;
  public dataXls: any;
  public today: any;
  eventSearch: any;
  documentSearch: any;
  modal: AuditTrail = new AuditTrail();
  projectList: any = [];
  documentList: dropDownDto[] = new Array<dropDownDto>();
  eventList: dropDownDto[] = new Array<dropDownDto>();
  userlist: dropDownDto[] = new Array<dropDownDto>();
  userSearch: any = 0;
  tableOffset: number = 0;
  public data: any;
  currentUsers: any;
  public isDisable: boolean = false;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
  };
  location = [];
  locationsList = [];
  locDropdownSettings = {
    singleSelection: true,
    text: "Select Location",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  projectDataList: any[] = new Array();
  auditUser: any;
  category: any = 6;
  categoryList: any[] = new Array();

  constructor(public configService: ConfigService, private comp: AdminComponent, public http: Http, public locationService: LocationService,
    public userManagementService: UserService, public helper: Helper, public dateFormatSettingsService: DateFormatSettingsService,
    public projectsetupService: projectsetupService, public auditTrailService: AuditTrailService, public datePipe: DatePipe,
    public uservsEquipmentService: UservsEquipmentService, public lookUpService: LookUpService,
    private userRoleServices: userRoleservice, private permissionCategory: PermissionCategory) {
  }

  ngOnInit() {
    this.configService.loadCurrentUserDetails().subscribe(resp => {
      this.currentUser = resp;
      this.userroleid = this.currentUser.roleId;
      this.configService.HTTPPostAPI('', 'common/loadPermissionCategory').subscribe(jsonResp => {
        this.categoryList = jsonResp;
        this.getdocdata();
      });
      this.loadOrgDateFormatAndTime();
      this.today = new Date();
      this.spinnerFlag = true;
      this.startdate1 = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
      this.Enddate1 = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
      this.eventChange();
      this.projectsetupService.loadCurrentLocationOfProject().subscribe(jsonResp => {
        this.modal.selectedLocation = jsonResp.result.id;
        this.onChangeLocation(this.modal.selectedLocation);
        this.modal.selectedProject = jsonResp.project.id;
        this.loadAuditDateRange();
      });
      this.loadEmailSettings();
      this.roleName = this.currentUser.roleName;
      this.loadUserProfileDetails();
      this.loadAllLocation();
      this.loadProjects();
      this.loadEquipmentMailingAccessForUser();
      this.loadAllModules();
      this.documentSearch = "";
    });
    this.uploadedFileView = false;
  }

  loadOrgDateFormatAndTime() {
    this.dateFormatSettingsService.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.myDatePickerOptions.dateFormat = result.datePattern.replace("YYYY", "yyyy");
        this.startdate1 = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
        this.Enddate1 = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
        if (this.date)
          this.date.setOptions();
        if (this.date1)
          this.date1.setOptions();
        this.datePipeFormat = result.datePattern.replace("mm", "MM")
        this.datePipeFormat = this.datePipeFormat.replace("YYYY", "yyyy");
      }
    });
  }

  eventChange() {
    this.eventSearch = "";
    if (this.documentSearch === "") {
      this.modal.selectedDocument = null;
    } else {
      this.modal.selectedDocument = this.documentList[this.documentSearch]
    }
    if (this.modal.selectedLocation === "") {
      this.modal.selectedLocation = null;
    }
    if (this.modal.selectedProject === "") {
      this.modal.selectedProject = null;
    }
    if (this.startdate1) {
      this.modal.fromDate = this.startdate1.date['year'] + "-" + this.startdate1.date['month'] + "-" + this.startdate1.date['day'];
    } else {
      this.modal.fromDate = null;
    }
    if (this.Enddate1) {
      let day = this.Enddate1.date['day']
      day = day + 1;
      this.modal.toDate = this.Enddate1.date['year'] + "-" + this.Enddate1.date['month'] + "-" + day.toLocaleString();
    } else {
      this.modal.toDate = this.today.getFullYear() + "-" + this.today.getMonth() + 1 + "-" + (this.today.getDate() + 1);
    }
    this.auditTrailService.getEvent(this.modal).subscribe(resp => {
      if (resp != null) {
        this.eventList = resp;
      } else
        this.eventList = new Array<dropDownDto>();
    })
  }

  loadAuditDateRange() {
    this.spinnerFlag = true;
    if (this.documentSearch === "") {
      this.modal.selectedDocument = null;
    } else {
      this.modal.selectedDocument = this.documentList[this.documentSearch]
    }
    if (this.eventSearch === "") {
      this.modal.event = null;
    } else {
      this.modal.event = this.eventSearch;
    }
    if (this.userSearch == 0) {
      this.modal.selectedUser = null;
    } else
      this.modal.selectedUser = this.userSearch;
    if (this.startdate1) {
      this.modal.fromDate = this.startdate1.date['year'] + "-" + this.startdate1.date['month'] + "-" + this.startdate1.date['day'];
    } else {
      this.modal.fromDate = null;
    }
    if (this.Enddate1) {
      let day = this.Enddate1.date['day']
      day = day + 1;
      this.modal.toDate = this.Enddate1.date['year'] + "-" + this.Enddate1.date['month'] + "-" + day.toLocaleString();
    } else {
      this.modal.toDate = this.today.getFullYear() + "-" + this.today.getMonth() + 1 + "-" + (this.today.getDate() + 1);
    }
    this.auditTrailService.getDataBasedOnDateRange(this.modal).subscribe(jsonResp => {
      this.tableOffset = 0;
      this.data = jsonResp.result;
      this.auditUser = jsonResp.admin;
      this.data.forEach(element => {
        if (!this.helper.isEmpty(element.systemRemarks)) {
          element.systemRemarks = this.createRemarkList(element.systemRemarks);
          if (element.tableAudit.length > 0 && element.systemRemarks.length > 0 && element.systemRemarks[0] === "No changes has been made") {
            element.systemRemarks[0] = "Please find the below table section for more details."
          }
        }
        if (!this.helper.isEmpty(element.userRemarks)) {
          element.userRemarks = this.createRemarkList(element.userRemarks);
        }
      });
      if (this.auditUser == 'Y') {
        this.loadAllUsersOnProject()
      }
      this.spinnerFlag = false;
      this.dataXls = jsonResp.listXls;
    });
  }

  onChangeLocation(lcationId) {
    this.modal.selectedProject = ""
    this.documentSearch = ""
    this.modal.selectedDocument = "";
    this.documentList = new Array<dropDownDto>();
    this.eventChange();
    if (lcationId != "") {
      this.isDisable = true
      this.configService.loadprojectOfUserAndCreatorForLocation(lcationId).subscribe(resp => {
        if (resp != null) {
          let array = [];
          this.projectList = [];
          resp.projectList.forEach(element => {
            if (!array.includes(element.id)) {
              array.push(element.id);
              this.projectList.push(element);
            }
          });
        }
        this.isDisable = false;
      })
    } else {
      this.isDisable = false;
    }
  }

  onChangeProject(projectId) {
    this.documentSearch = ""
    this.modal.selectedDocument = "";
    this.eventChange();
    if (projectId != "") {
      this.isDisable = true
      this.configService.loadDocBasedOnProject(projectId).subscribe(resp => {
        if (resp != null) {
          this.documentList = resp;
        }
        this.isDisable = false;
      })
    } else {
      this.documentList = new Array<dropDownDto>();
      this.isDisable = false;
    }
  }

  onChangePage(event: any): void {
    this.tableOffset = event.offset;
  }

  rowsAfterFilter() {
    this.tableOffset = 0;
  }

  loadAllUsersOnProject() {
    this.spinnerFlag = true;
    this.userManagementService.loadAllUserBasedOnOrganization().subscribe(jsonResp => {
      if (jsonResp.result != null) {
        jsonResp.result.forEach(element => {
          this.userlist.push(({ 'key': element.id, 'value': element.firstName + " " + element.lastName, 'mappingId': "0", 'mappingFlag': false }))
        });
      }
      this.spinnerFlag = false;
    }, err => { this.spinnerFlag = false; });
  }

  openBtnClicked(event) {
    if (!this.date.showSelector)
      this.date.openBtnClicked();
    if (!this.date1.showSelector)
      this.date1.openBtnClicked();
  }

  startDateChange(data: any) {
    this.startdate1 = data
    this.eventChange()
  }

  endDateChange(data: any) {
    this.Enddate1 = data
    this.eventChange();
  }

  drawComplete() {
    this.mySign = this.signaturePad.toDataURL();
  }

  clear() {
    if (this.drawStartFlag) {
      this.signaturePad.clear();
      if (this.mySign != '') {
        this.mySign = '';
        swal(
          'New Signature Cleared Successfully!',
          '',
          'success'
        );
      }
    }
  }

  drawStart() {
    this.drawStartFlag = true;
  }

  toggleEditProfile() {
    this.editProfileIcon = (this.editProfileIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editProfile = !this.editProfile;
    this.uploadedFileView = true;
    this.enableEsign = false;
    this.populateUserDetails();
    if (this.mySign == null) {
      this.mySign = '';
    }
  }

  onFileChange(event) {
    this.error = '';
    this.uploadedFileView = false;
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      if (file.size > 25000) {
        this.error = "Image size should be below 25KB"
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.mySign = reader.result;
          this.uploadedFileView = true
        };
        reader.readAsDataURL(file);
      }
    }
  }

  toggleEditAbout() {
    this.editAboutIcon = (this.editAboutIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editAbout = !this.editAbout;
  }

  saveAndGoto() {
    if (this.helper.isEmpty(this.user.firstName) || this.helper.isEmpty(this.user.lastName)) {
      this.submitted = true;
      this.isLoading = false;
      return;
    } else {
      this.isLoading = true;
      this.userModel.isDefault = 'false';
      this.userModel.loginUserId = this.currentUser.id;
      this.userModel.createdBy = this.currentUser.id;
      this.userModel.updatedBy = this.currentUser.id;
      this.userModel.firstName = this.user.firstName;
      this.userModel.lastName = this.user.lastName;
      this.userModel.phoneNo = this.user.phoneNo;
      if (this.mySign != '')
        this.userSign = this.mySign;
      this.userModel.sig = this.userSign;
      this.userManagementService.saveAndGoto(this.userModel).subscribe(jsonResp => {
        let responseMsg: string = jsonResp.result;
        if (responseMsg === "success") {
          if (this.userSign != '' || this.userSign != null) {
            this.userManagementService.saveUserSign(this.userSign).subscribe(resp => {
            });
          }
          this.isLoading = false;
          this.drawStartFlag = false;
          this.mySign = '';
          swal(
            'Updated Successfully!',
            this.userModel.userName + ' Details has been updated',
            'success'
          ).then(responseMsg => {
            this.loadUserProfileDetails();
            this.toggleEditProfile();
          });
        } else {
          this.isLoading = false;
          swal(
            'Error in Updating',
            this.userModel.userName + 'Details has not been updated',
            'error'
          );
        }
      });
    }
  }

  switch() {
    this.uploadedFileView = false;
    this.mySign = '';
    if (this.enableEsign) {
      this.enableEsign = false
    } else {
      this.enableEsign = true
    }
  }

  loadUserProfileDetails() {
    this.userManagementService.getDataForEdit(this.currentUser.id).subscribe(jsonResp => {
      this.userModel = jsonResp.result;
      this.populateUserDetails();
      this.userName = this.userModel.userName;
      this.userSign = this.userModel.sig;
    },
      err => {
      }
    );
  }

  populateUserDetails() {
    this.user.firstName = this.userModel.firstName;
    this.user.lastName = this.userModel.lastName;
    this.user.phoneNo = this.userModel.phoneNo;
  }

  loadAllLocation() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationsList = response.result.map(option => ({ id: option.id, itemName: option.name }));
    });
  }

  loadProjects() {
    this.projectsetupService.loadCurrentLocationOfProject().subscribe(jsonResp => {
      if (null != jsonResp.result)
        this.location = [{ id: jsonResp.result.id, itemName: jsonResp.result.name }];
      this.configService.loadprojectOfUserAndCreator().subscribe(response => {
        this.populate(response);
      });
    });
  }

  populate(response) {
    response.projectList.forEach(element => {
      element.locationName = element.locationName != "null" ? element.locationName : '';
      if (element.startDate && element.startDate != "null") {
        try {
          element.startDate = JSON.parse(element.startDate);
          element.startDate = this.datePipe.transform(new Date(element.startDate.year,
            element.startDate.month - 1, element.startDate.day), this.datePipeFormat);
        } catch (error) {
          element.startDate = "";
        }
      } else {
        element.startDate = "";
      }
      if (element.endDate && element.endDate != "null") {
        try {
          element.endDate = JSON.parse(element.endDate);
          element.endDate = this.datePipe.transform(new Date(element.endDate.year, element.endDate.month - 1,
            element.endDate.day), this.datePipeFormat);
        } catch (error) {
          element.endDate = "";
        }
      } else {
        element.endDate = "";
      }
    });
    this.userProjectsList = response.projectList;
    let id: any[] = this.location.map(m => m.id);
    if (id.length > 0)
      this.projectDataList = this.userProjectsList.filter(f => f.location === id[0]);
  }

  loadAuditTrail() {
    this.auditTrailService.getAuditListByLoginUser().subscribe(result => {
      if (result != null) {
        this.auditTrailList = result.result;
        this.auditTrailList.forEach(element => {
          if (!this.helper.isEmpty(element.systemRemarks)) {
            element.systemRemarks = this.createRemarkList(element.systemRemarks);
          }
          if (!this.helper.isEmpty(element.userRemarks)) {
            element.userRemarks = this.createRemarkList(element.userRemarks);
          }
        });
      }
    }
    );
  }

  createRemarkList(data) {
    let returnArray = [];
    let array = [];
    array = data.split("<#goval#>");
    if (array.length == 1)
      array = data.split(",");
    array.forEach(element => {
      if (element != "") {
        element = element.replace(/\\n/g, '').trim();
        returnArray.push(element);
      }
    });
    return returnArray;
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  toggleExpandRowForProduct(row) {
    this.docList = [];
    this.projectVersionId = row.id;
    this.table.rowDetail.toggleExpandRow(row);
    this.configService.loadDocBasedOnProject(this.projectVersionId).subscribe(resp => {
      if (resp != null) {
        this.docList = resp.map(option => ({ value: option.key, label: option.value }));
      }
    })
  }

  loadFlowDatasOfDocument(data) {
    const model: CommonModel = new CommonModel();
    model.projectSetupconstantName = data.value;
    model.projectSetupProjectId = this.projectVersionId
    this.userManagementService.loadFlowData(model).subscribe((resp) => {
      if (resp.result != null) {
        this.notificationModalList = resp.result;
        this.emailNotificationSetting.show();
      }
    });
  }

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  loadEmailSettings() {
    this.projectsetupService.ListOfRulesForUser().subscribe(jsonResp => {
      this.userEmailSettingList = jsonResp.data;
    });
  }

  saveChanges(row) {
    this.projectsetupService.SaveRulesForUser(row).subscribe(jsonResp => {
      let timerInterval;
      swal({
        title: '',
        text: 'Updated Successfully',
        type: 'success',
        timer: this.helper.swalTimer,
        showConfirmButton: false,
        onClose: () => {
          clearInterval(timerInterval)
        }
      });
    });
  }

  onDefaultProjectChange(event: any, data: any) {
    this.projectDataList.forEach(element => {
      if (Number(data.id) === element.id) {
        element.defaultFlag = true;
      } else {
        element.defaultFlag = false;
      }
    });
    if (this.location.length > 0) {
      this.configService.saveDefaultProjectForUser({ "projectId": data.id, "locationId": this.location[0].id }).subscribe(rep => {
        this.populate(rep);
      }, err => this.loadProjects());
    }
  }

  loadEquipmentMailingAccessForUser() {
    this.uservsEquipmentService.loadEquipmentMailingAccessForUser().subscribe(resp => {
      this.equipmentMailingListOfUser = resp.result;
    })
  }

  saveChangesEquipmentMailing(row) {
    this.uservsEquipmentService.activateOrDeactivateEmailService(row.id, row.emailFlag).subscribe(jsonResp => {
      let timerInterval;
      if (jsonResp.result) {
        swal({
          title: '',
          text: 'Updated Successfully',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            clearInterval(timerInterval)
          }
        });
        this.loadEquipmentMailingAccessForUser();
      }
    });
  }

  saveNotificationDetails() {
    this.userManagementService.saveFlowData(this.notificationModalList).subscribe((resp) => {
      if (resp.result == "success") {
        swal({ title: '', text: 'Notification for Documents Saved Successfully', type: 'success', timer: 2000, showConfirmButton: false });
        this.emailNotificationSetting.hide();
      }
    });
  }

  loadAllModules() {
    this.isModulesSelected = false;
    this.userManagementService.loadAllModulesForUser().subscribe(resp => {
      this.userShortcutsDTO = resp;
      this.moduleList = this.userShortcutsDTO.modulesList;
      this.moduleList.forEach(data => {
        data.selectedItems = data.modulesList.filter(f => f.selected == true).map(option => ({ id: option.key, itemName: option.value, key: option.key, mappingId: option.mappingId, mappingFlag: option.mappingFlag }));
        data.modulesList = data.modulesList.map(option => ({ id: option.key, itemName: option.value, key: option.key, mappingId: option.mappingId, mappingFlag: option.mappingFlag }));
        data.settings = {
          singleSelection: false,
          text: "Select " + data.moduleType + " Modules",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          badgeShowLimit: 7,
          classes: "myclass custom-class-example"
        };
      })
    });
  }

  saveUserShortcuts() {
    this.spinnerFlag = true;
    let selectedModules: any[] = new Array();
    this.isModulesSelected = false;
    this.moduleList.forEach(data => {
      data.selectedItems.forEach(seletedItem => {
        selectedModules.push(seletedItem);
      });
    });
    this.userShortcutsDTO.selectedModules = selectedModules;
    this.userManagementService.saveAllModulesForUser(this.userShortcutsDTO).subscribe(resp => {
      let timerInterval;
      if (resp.result) {
        swal({
          title: '',
          text: 'Saved Successfully',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            clearInterval(timerInterval)
          }
        });
        this.spinnerFlag = false;
        this.loadAllModules();
      }
    });
  }

  cancel() {
    this.mySign = '';
  }

  clearNewSign() {
    this.mySign = '';
    swal(
      'New Signature Cleared Successfully!',
      '',
      'success'
    );
  }

  loadTableChanges(table) {
    this.oldTable = table.old;
    this.newTable = table.new;
    this.tableModal.show();
    setTimeout(() => {
      $("table#newTableId>tbody>tr").each(function (iIndex, ele) {
        let newColumn = $(this).find("td");
        for (let index = 0; index < newColumn.length; index++) {
          const newElement = newColumn[index];
          const oldElement = document.getElementById('oldtd_' + iIndex + '_' + index);
          if (oldElement) {
            if (newElement.innerHTML != oldElement.innerHTML) {
              (<any>$(this).find("td")[index]).style.backgroundColor = "#90EE90";
              oldElement.style.backgroundColor = '#F08080';
            } else if (newElement.innerHTML == oldElement.innerHTML) {
              (<any>$(this).find("td")[index]).style.backgroundColor = "white";
              oldElement.style.backgroundColor = "white"
            }
          } else {
            (<any>$(this).find("td")[index]).style.backgroundColor = "#FBE870";
          }
        }
      });
    }, 10);
  }

  getdocdata() {
    this.userRoleServices.permission('', this.userroleid).subscribe(result => {
      this.mapData = this.permissionCategory.permissionSet();
      this.totalPermission = result.result.filter(p => p.groupCategoryId != 0);
      this.totalPermission = this.totalPermission.sort((a, b) => a.groupCategoryId - b.groupCategoryId);
      this.permission = this.totalPermission.filter(f => this.category === f.groupCategoryId);
      this.spinnerFlag = false
    });
  }

  onChangeCategory(category) {
    if (category)
      this.permission = this.totalPermission.filter(f => +category == f.groupCategoryId);
  }

  sendReminder() {
    this.userManagementService.getAllAdminUser().subscribe((resp) => {
      if (resp.result == "success") {
        this.userList = resp.list.map(option => ({ value: option.id, label: option.userName, email: option.email, userName: option.userName, message: '' }));
        this.sendMailModal.show();
      }
    });
  }

  cancelEmail(form: NgForm) {
    this.errorFlag = false;
    this.selectedUsersForEmail = [];
    this.sendMailModal.hide();
    form.resetForm();
  }

  sendEmail(form: NgForm) {
    this.selectedUsers = []
    if (form.valid) {
      if (this.selectedUsersForEmail)
        this.selectedUsersForEmail.forEach(element => {
          this.userList.forEach(user => {
            if (user.value == element.toString()) {
              user['message'] = this.remarksForEmail;
              this.selectedUsers.push(user);
            }
          });
        });
      this.sendMailModal.spinnerShow();
      this.userManagementService.sendEmailForRequest(this.selectedUsers).subscribe(jsonResp => {
        if (jsonResp.result == "success") {
          form.resetForm();
          this.sendMailModal.hide();
          this.sendMailModal.spinnerHide();
          this.selectedUsersForEmail = [];
          this.errorFlag = false;
          swal({
            title: 'Success',
            text: 'Request Permission Email is Sent!',
            type: 'success',
            timer: this.helper.swalTimer, showConfirmButton: false
          });
          this.spinnerFlag = false;
        } else {
          form.resetForm();
          this.sendMailModal.spinnerHide();
          swal({
            title: 'Error',
            text: 'Error in Sending Request Permission Email!',
            type: 'error',
            timer: this.helper.swalTimer, showConfirmButton: false,
          });
        }
      }, err => {
        form.resetForm();
        this.sendMailModal.spinnerHide();
      });
    } else {
      this.errorFlag = true;
    }
  }

  filterProjectList(location) {
    let id: any[] = location.map(m => m.id);
    if (id.length > 0 && this.userProjectsList)
      this.projectDataList = this.userProjectsList.filter(f => f.location === id[0]);
  }

}
