import { Component, OnInit, EventEmitter, ViewChild, Output } from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { LocationService } from '../location/location.service';
import { ImportUrsDataDTO } from '../../models/model';
import { Helper } from '../../shared/helper';
import { IMyDpOptions } from 'mydatepicker';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
@Component({
  selector: 'app-error-logs',
  templateUrl: './error-logs.component.html',
  styleUrls: ['./error-logs.component.css']
})
export class ErrorLogsComponent implements OnInit {
  @ViewChild('date') date: any;
  @ViewChild('date1') date1: any;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
  };
  public startdate1: any;
  public Enddate1: any;
  public today: any;
  errorLogsList: any;
  spinnerFlag: boolean = false;
  exceptionString:string="";
  constructor(public permissionService: ConfigService, public helper: Helper, private servie: DateFormatSettingsService) { }
  ngOnInit() {
    this.today = new Date();
    this.startdate1 = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
    this.Enddate1 = { date: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() } };
    this.loadExceptionsByDateRange();
  }
  loadExceptionsByDateRange() {
    this.spinnerFlag = true;
    let fromDate;
    let toDate;
    if (this.startdate1 && this.Enddate1) {
      fromDate = this.startdate1.date['year'] + "-" + this.startdate1.date['month'] + "-" + this.startdate1.date['day'];

      let day = this.Enddate1.date['day']
      day = day + 1;
      toDate = this.Enddate1.date['year'] + "-" + this.Enddate1.date['month'] + "-" + day.toLocaleString();

      this.permissionService.HTTPGetAPI("common/loadExceptionsByDate/"+fromDate+"/"+toDate).subscribe(jsonResp => {
        this.errorLogsList = jsonResp.result;
        this.spinnerFlag = false;
      });
    }
  }

  startDateChange(data: any) {
    this.startdate1 = data
    this.loadExceptionsByDateRange();
  }

  endDateChange(data: any) {
    this.Enddate1 = data
    this.loadExceptionsByDateRange();
  }

  clickView(row){
    this.exceptionString=row.exception;
  }
}
