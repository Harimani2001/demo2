import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Permissions } from '../../shared/config';
import { IMyDpOptions } from 'mydatepicker';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Helper } from '../../shared/helper';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { ConfigService } from '../../shared/config.service';
import swal from 'sweetalert2';
import { VsrService } from '../validation-summary-report/validation-summary.service';
import { FormEsignVerificationComponent } from '../form-esign-verification/form-esign-verification.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../location/location.service';
import { LookUpService } from '../LookUpCategory/lookup.service';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InventoryReportComponent implements OnInit {
  permissionModal: Permissions = new Permissions(this.helper.Inventory_Report_Value, false);
  public tableData: any[] = new Array();
  @ViewChild("shareInvetoryReport") shareInvetoryReport: any;
  @ViewChild('formVerification') formVerification: FormEsignVerificationComponent;
  spinnerFlag: boolean = false;
  public filterQuery = '';
  datePipeFormat = 'dd-mm-yyyy';
  @ViewChild('date') date: any;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: this.datePipeFormat,
    disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
  };
  temDate: any;
  mailRemarks: any;
  selectedUsers: any[] = new Array();
  userList = new Array();
  dropdownSettings = {
    singleSelection: false,
    text: "Select Users",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    classes: "myclass custom-class",
  };
  projectId: any;
  isSubmitted: boolean = false;
  @ViewChild('myTable') table: any;
  showSearch: boolean = false;
  locationsList = [];
  location = [];
  selectedYear:any;
  locationDropdownSettings = {
    singleSelection: true,
    text: "Select",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  
  actualDate: any;
  validationStatus = [
    { id: "Validated", itemName: "Validated" }
  ];
  yearList = [];
  statusDropdownSettings = {
    singleSelection: false,
    text: "Select Validation Status",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  viewFlag:boolean=false;
  constructor(private adminComponent: AdminComponent, public helper: Helper, public datePipe: DatePipe, public configService: ConfigService,
    private dateFormatSettingService: DateFormatSettingsService, public projectService: projectsetupService, public vsrService: VsrService,
    private router: Router, public locationService: LocationService, public lookUpService: LookUpService, private route: ActivatedRoute,) {
    this.route.queryParams.subscribe(query => {
      if (query.locationId && query.valStatus) {
        this.validationStatus = [];
        this.location = [{ id: +query.locationId, itemName: query.locationName }];
        this.validationStatus = [{ id: query.valStatus, itemName: query.valStatus }];
      }
    });
    this.loadPermissions();
    this.loadOrgDateFormatAndTime();
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.adminComponent.setUpModuleForHelpContent(this.helper.Inventory_Report_Value);
    this.configService.HTTPGetAPI("projectsetup/loadYearsForInventoryReport").subscribe(response => {
      if (response.result) {
        this.yearList = response.result.map(option => ({ id: option.key, itemName: option.value }));
      }
    });
    this.loadProjectDetailsForInventory();
    this.loadAllLocation();
  }

  loadPermissions() {
    this.configService.loadPermissionsBasedOnModule(this.helper.Inventory_Report_Value).subscribe(resp => {
      this.permissionModal = resp;
    });
  }

  loadOrgDateFormatAndTime() {
    this.dateFormatSettingService.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.myDatePickerOptions.dateFormat = result.datePattern.replace("YYYY", "yyyy");
        this.datePipeFormat = result.datePattern.replace("MM", "mm");
        if (this.date)
          this.date.setOptions();
      }
    });
  }

  loadProjectDetailsForInventory() {
    this.spinnerFlag = true;
    this.projectService.loadCurrentLocationOfProject().subscribe(jsonResp => {
      if (jsonResp.result && this.location.length == 0) {
        this.location = [{ id: jsonResp.result.id, itemName: jsonResp.result.name }];
        this.selectedYear=[{ id: new Date().getFullYear()+'', itemName: +new Date().getFullYear()+'' }];
        this.loadAll(this.location,this.validationStatus,this.selectedYear);
      }
    });
  }

  loadAll(location, valStatus,year) {
    this.viewFlag=false;
    this.configService.HTTPPostAPI(valStatus.map(d =>d.id),"projectsetup/loadProjectDetailsForInventoryReport/"+location[0].id+"/"+year[0].id).subscribe(resp => {
      if (resp.projectList) {
        this.tableData = resp.projectList;
        this.tableData.forEach(element =>{
          if (element.actualDate) {
                element.actualDate = { date: JSON.parse(element.actualDate) };
          }
        });
       
        this.spinnerFlag = false;
      }
    }, err => { this.spinnerFlag = false; })
  }

  loadAllLocation() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationsList = response.result.map(option => ({ id: option.id, itemName: option.name }));
    });
  }

  oldDate(event) {
    this.temDate = event;
  }

  onChangeFromDate(date: any, row) {
    let newDate = date ? JSON.stringify(date.date) : "";
    let that = this;
    swal({
      title: "Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      allowOutsideClick: false,
    })
      .then((value) => {
        if (value) {
          that.updateNextReviewDate(row.id, newDate, value);
        } else {
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: this.configService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              that.onChangeFromDate(newDate, row);
            }
          });
        }
      }).catch(() => {
        row.updatedBy = this.temDate;
      });
  }

  updateNextReviewDate(projectId, newDate, comment) {
    this.temDate = null;
    this.configService.changeReviewDate(projectId, newDate, comment).subscribe(resp => {
      if (resp.result) {
        swal({
          title: 'saved',
          text: 'Next Review Date is saved!!',
          type: 'success',
          showConfirmButton: false,
          timer: 3000, allowOutsideClick: true
        });
      }
    })
  }

  excelExport() {
    this.projectService.inventoryReportExcelExport().subscribe(resp => {
      if (resp.result) {
        var nameOfFileToDownload = resp.sheetName + ".xls";
        this.adminComponent.previewOrDownloadByBase64(nameOfFileToDownload, resp.sheet, false);
      }
    })
  }

  loadModal(projectId) {
    this.loadAllWorkFlowUsersForProject(projectId).then(() => {
      this.shareInvetoryReport.show();
    })
  }

  navigateToProjectSummary(projectId) {
    let id = this.location[0].id
    this.adminComponent.onChange(projectId, id, true).then(response => {
      this.spinnerFlag = false;
      this.adminComponent.router.navigate(['/projectSummary'], { queryParams: { projectId: projectId }, skipLocationChange: true });
    })
  }

  loadAllWorkFlowUsersForProject(projectId) {
    return new Promise<void>(resolve => {
      this.projectId = projectId;
      this.configService.HTTPPostAPI(this.projectId, 'workflowConfiguration/findUserForInvenotyModule').subscribe(resp => {
        this.userList = resp.map(option => ({ id: option.id, itemName: option.userName }));
        resolve();
      }, err => resolve())
    })
  }

  onClose() {
    this.mailRemarks = "";
    this.selectedUsers = [];
    this.shareInvetoryReport.hide();
    this.isSubmitted = false;
  }

  sendReportMail() {
    if (this.selectedUsers.length > 0) {
      this.spinnerFlag = true;
      this.selectedUsers = this.selectedUsers.map(m => m.id);
      let docData = this.tableData.filter(f => this.projectId === f.id);
      let dataJson: any;
      dataJson = docData.length > 0 ? docData[0] : {};
      dataJson.updatedBy = JSON.stringify(dataJson.updatedBy.date);
      let json = { remarks: this.mailRemarks, users: this.selectedUsers, data: dataJson };
      this.configService.HTTPPostAPI(json, "projectsetup/sendInventoryReportEmail").subscribe(resp => {
        this.onClose();
        this.shareInvetoryReport.hide();
        this.isSubmitted = false;
        if (resp.result == "success") {
          this.spinnerFlag = false;
          swal({
            title: 'Success',
            text: 'Email is Sent!',
            type: 'success',
            timer: this.helper.swalTimer, showConfirmButton: false
          });
        } else {
          this.spinnerFlag = false;
          swal({
            title: 'Error',
            text: 'Error in Sending Email!',
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

  pdfdownload() {
    this.spinnerFlag = true;
    this.projectService.generateInventoryPdf(this.validationStatus.map(d =>d.id),this.location[0].id,this.selectedYear[0].id).subscribe(res => {
      var blob: Blob = this.b64toBlob(res._body, 'application/pdf');
      let name = "Inventory_Report_" + new Date().toLocaleDateString(); +".pdf";
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
      this.spinnerFlag = false;
    });
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

  verify(documentType, documentCode, documentId) {
    this.formVerification.openNewMyModal(documentType, documentCode, documentId,this.selectedYear[0].id);
  }

  onClickTableOfContent() {
    this.router.navigate(['/table-of-content'], { queryParams: { docId: this.helper.Inventory_Report_Value, status: document.location.pathname }, skipLocationChange: true });
  }

  onChangeActualDate(event) {
    this.actualDate = event;
  }

  saveActualDate(date: any, row) {
    let newDate = date ? JSON.stringify(date.date) : "";
    let that = this;
    swal({
      title: "Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      allowOutsideClick: false,
    })
      .then((value) => {
        if (value) {
          that.updateActualDate(row.id, newDate, value);
        } else {
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: this.configService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              that.saveActualDate(newDate, row);
            }
          });
        }
      }).catch(() => {
        row.actualDate = this.actualDate;
      });
  }

  updateActualDate(projectId, newDate, comment) {
    this.actualDate = null;
    this.configService.HTTPPostAPI(newDate, "projectsetup/updateActualDate/" + projectId + "/" + comment).subscribe(resp => {
      if (resp.result) {
        this.loadAll(this.location,this.validationStatus,this.selectedYear);
        swal({
          title: 'saved',
          text: 'Actual Date is saved!!',
          type: 'success',
          showConfirmButton: false,
          timer: 3000, allowOutsideClick: true
        });
      }
    })
  }
}