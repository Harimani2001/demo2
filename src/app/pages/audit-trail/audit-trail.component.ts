import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { AdminComponent } from '../../layout/admin/admin.component';
import { AuditTrail, dropDownDto } from '../../models/model';
import { Helper } from '../../shared/helper';
import { DashBoardService } from '../dashboard/dashboard.service';
import { AuditTrailService } from './audit-trail.service';
import { ConfigService } from '../../shared/config.service';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { IMyDpOptions } from 'mydatepicker/dist';
import { UserService } from '../userManagement/user.service';
import { Router } from '@angular/router';
import { LocationService } from '../location/location.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';

@Component({
  selector: 'app-audit-trail',
  host: {
    '(document:click)': 'onClick($event)',
  },
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent implements OnInit {
  oldTable = { column: new Array, rows: new Array() };
  newTable = { column: new Array, rows: new Array() };
  @ViewChild('auditForTable') tableModal;
  @ViewChild('myTable') table: any;
  @ViewChild('date') date: any;
  @ViewChild('date1') date1: any;
  public data: any;
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  public spinnerFlag: boolean = false;
  public isDisable: boolean = false;
  public startdate1: any;
  public Enddate1: any;
  public dataXls: any;
  public today: any;
  tableOffset: number = 0;
  public dynamicId: any;
  public isClicked: boolean = false;
  modal: AuditTrail = new AuditTrail();
  locationList: any = [];
  projectList: any = [];
  documentList: dropDownDto[] = new Array<dropDownDto>();
  eventList: dropDownDto[] = new Array<dropDownDto>();
  userlist: dropDownDto[] = new Array<dropDownDto>();
  userSearch: any = 0;
  documentSearch: any;
  eventSearch: any;
  currentUser: any;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
  };
  showSearch: boolean = false;

  constructor(private comp: AdminComponent, private _eref: ElementRef,
    public http: Http, public helper: Helper, private config: ConfigService,
    public auditService: AuditTrailService, private userService: UserService,
    public dashBoardService: DashBoardService, private servie: DateFormatSettingsService,
    private router: Router, public locationService: LocationService, public projectsetupService: projectsetupService) { }

  ngOnInit() {
    this.loadOrgDateFormatAndTime()
    this.today = new Date();
    this.spinnerFlag = true;
    this.startdate1 = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
    this.Enddate1 = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
    this.eventChange();
    this.projectsetupService.loadCurrentLocationOfProject().subscribe(jsonResp => {
      if (jsonResp.result)
        this.modal.selectedLocation = jsonResp.result.id;
      else
        this.modal.selectedLocation = "";
      this.onChangeLocation(this.modal.selectedLocation);
      if (jsonResp.project)
        this.modal.selectedProject = jsonResp.project.id;
      else
        this.modal.selectedProject = "";
      this.loadAuditDateRange();
    });
    this.comp.setUpModuleForHelpContent("102");
    this.comp.taskDocType = "102";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.comp.taskEnbleFlag = false;
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationList = response.result;
    });
    this.documentSearch = "";
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  loadAll() {
    this.spinnerFlag = true;
    this.auditService.getAuditList().subscribe(result => {
      if (result != null) {
        this.spinnerFlag = false;
        this.data = result.result;
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
        this.dataXls = result.listXls;
      } else {
        this.spinnerFlag = false;
      }
    });
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
    this.auditService.getDataBasedOnDateRange(this.modal).subscribe(jsonResp => {
      this.tableOffset = 0;
      this.data = jsonResp.result;
      this.currentUser = jsonResp.admin;
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
      if (this.currentUser == 'Y') {
        this.loadAllUsersOnProject();
      }
      this.spinnerFlag = false;
      this.dataXls = jsonResp.listXls;
    });
  }

  downloadFile() {
    this.auditService.csvDownloadAudit("Audit Trail").subscribe();
    var nameOfFileToDownload;
    var blob: Blob = this.b64toBlob(this.dataXls, 'application/xls');
    nameOfFileToDownload = "auditTrail.xls";
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, nameOfFileToDownload);
    } else {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = nameOfFileToDownload;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    this.loadAll();
  }

  onChangePage(event: any): void {
    this.tableOffset = event.offset;
  }

  rowsAfterFilter() {
    this.tableOffset = 0;
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  openDatepicker(id) {
    this.dynamicId = id;
    this.isClicked = true;
  }

  onClick(event) {
    let path = event.path;
    let check = false;
    for (var index = 0; index < path.length; index++) {
      if (path[index].id == "inputgroup") {
        check = true;
        break;
      }
    }
    if (this.isClicked && !check) {
      this.dynamicId.close();
    }
    else if (!this._eref.nativeElement.contains(event.target)) {
      let self = this;
      setTimeout(function () {
        if (self.dynamicId)
          self.dynamicId.close();
      }, 10);
    }
  }

  pdfdownload() {
    this.spinnerFlag = true;
    this.auditService.generatePdf().subscribe(res => {
      var blob: Blob = this.b64toBlob(res._body, 'application/pdf');
      let name = "AuditTrial" + new Date().toLocaleDateString() + ".pdf";
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, name);
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      this.spinnerFlag = false
    });
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

  onChangeLocation(lcationId) {
    this.modal.selectedProject = ""
    this.documentSearch = ""
    this.modal.selectedDocument = "";
    this.documentList = new Array<dropDownDto>();
    this.eventChange();
    if (lcationId != "") {
      this.isDisable = true
      this.config.loadprojectOfUserAndCreatorForLocation(lcationId).subscribe(resp => {
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
      this.config.loadDocBasedOnProject(projectId).subscribe(resp => {
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

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.myDatePickerOptions.dateFormat = result.datePattern.replace("YYYY", "yyyy");
        this.startdate1 = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
        this.Enddate1 = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
        this.date.setOptions();
        this.date1.setOptions();
      }
    });
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
    this.auditService.getEvent(this.modal).subscribe(resp => {
      if (resp != null) {
        this.eventList = resp;
      } else
        this.eventList = new Array<dropDownDto>();
    })
  }

  loadAllUsersOnProject() {
    this.spinnerFlag = true;
    this.userlist = [];
    this.userService.loadAllUserBasedOnOrganization().subscribe(jsonResp => {
      if (jsonResp.result != null) {
        jsonResp.result.forEach(element => {
          this.userlist.push(({ 'key': element.id, 'value': element.firstName + " " + element.lastName, 'mappingId': "0", 'mappingFlag': false }))
        });
      }
      this.spinnerFlag = false;
    }, err => { this.spinnerFlag = false; });
  }

  onClickTableOfContent() {
    this.router.navigate(['/table-of-content'], { queryParams: { docId: this.helper.AUDIT_TRAIL_VALUE, status: document.location.pathname }, skipLocationChange: true });
  }

}
