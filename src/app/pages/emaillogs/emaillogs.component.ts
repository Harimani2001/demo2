import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {Http} from '@angular/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Helper } from '../../shared/helper';
import { AuditTrailService } from '../audit-trail/audit-trail.service';
import { NgbDateISOParserFormatter } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import { EmailHistoryDTO } from '../../models/model';

@Component({
  selector: 'app-emaillogs',
  templateUrl: './emaillogs.component.html',
  styleUrls: ['./emaillogs.component.css']
})
export class EmaillogsComponent implements OnInit {

  @ViewChild('myTable') table: any;
  public data: any;
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  public spinnerFlag: boolean = false;
  public startdate1: NgbDateStruct;
  public Enddate1: NgbDateStruct;
  public dataXls: any;
  public today: NgbDateStruct;
  public dynamicId: any;
  public isClicked: boolean = false;
  modal: EmailHistoryDTO = new EmailHistoryDTO();
  constructor(private comp: AdminComponent,private _eref: ElementRef, public http: Http, public helper: Helper, public auditService: AuditTrailService) { }
  ngOnInit() {
    let now = new Date();
    let maxMonth: number = now.getMonth() + 1;
    let maxYear: number = now.getFullYear();
    let maxDate: number = now.getDate();
    let test = new NgbDateISOParserFormatter;
    this.spinnerFlag = true;
    this.startdate1 = test.parse(now.toISOString());
    this.Enddate1 = test.parse(now.toISOString());
    this.today = test.parse(now.toISOString());
    this.comp.setUpModuleForHelpContent("188");
  }
  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }


  loadAuditDateRange() {
    this.modal.fromDate = this.startdate1['year'] + "-" + this.startdate1['month'] + "-" + this.startdate1['day'];
    var day = +this.Enddate1['day'];
    day = day + 1;
    this.modal.toDate = this.Enddate1['year'] + "-" + this.Enddate1['month'] + "-" + day.toLocaleString();
    this.auditService.getEmailHistoryDataBasedOnDateRange(this.modal).subscribe(jsonResp => {
      this.data = jsonResp.result;
      this.dataXls = jsonResp.listXls;
    });
  }
  downloadFile() {
    var nameOfFileToDownload;
    var blob: Blob = this.b64toBlob(this.dataXls, 'application/xls');
    nameOfFileToDownload = "emailHistory.xls";
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
        self.dynamicId.close();
      }, 10);
    }
  }

  pdfdownload() {
    this.spinnerFlag = true;
    this.auditService.generatePdf().subscribe(res => {
      var blob: Blob = this.b64toBlob(res._body, 'application/pdf');
      let name = "emailHistory" + new Date().toLocaleDateString(); +".pdf";
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
    let array=[];
    array = data.split("<#goval#>");
    if(array.length==1)
    array = data.split(",");
    array.forEach(element => {
      if (element != "") {
        element=element.replace(/\\n/g, '').trim();
        returnArray.push(element);
      }
    });
    return returnArray;
  }
}
