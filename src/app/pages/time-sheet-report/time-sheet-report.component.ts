import { Component, OnInit, ViewChild } from '@angular/core';
import { Helper } from '../../shared/helper';
import { DatePipe } from '@angular/common';
import { ConfigService } from '../../shared/config.service';
import { LocationService } from '../location/location.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { TaskCreationService } from '../task-creation/task-creation.service';
import { TaskTimeSheetDTO } from '../../models/model';
import { IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'app-time-sheet-report',
  templateUrl: './time-sheet-report.component.html',
  styleUrls: ['./time-sheet-report.component.css']
})
export class NewTimeSheetReportComponent implements OnInit {
  @ViewChild('date1') date1: any;
  @ViewChild('date2') date2: any;
  @ViewChild('taskTable') taskTable: any;
  spinnerFlag: boolean = false;
  taskTimeSheetDTO: TaskTimeSheetDTO = new TaskTimeSheetDTO();
  locationList: any;
  location: any;
  projectList = [];
  project = [];
  projectDropdownSettings = {
    singleSelection: true,
    text: "Select Project",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  filterQuery = '';
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
  };
  fromDate: any;
  toDate: any;
  taskDataList: any[] = new Array();

  constructor(public helper: Helper, public datePipe: DatePipe, public configService: ConfigService, public taskService: TaskCreationService,
    public projectsetupService: projectsetupService, public locationService: LocationService) { }

  ngOnInit() {
    this.loadcurrentProjectDetail();
  }

  loadcurrentProjectDetail() {
    this.projectsetupService.loadCurrentLocationOfProject().subscribe(jsonResp => {
      this.location = jsonResp.result.id;
      this.project.push({ id: jsonResp.project.id, itemName: jsonResp.project.projectName })
      this.loadProjectsOnLocation().then(resp => {
        this.loadLocation();
      });
    });
  }

  loadProjectsOnLocation(): Promise<void> {
    return new Promise<void>(resolve => {
      this.configService.loadprojectOfUserAndCreatorForLocation(this.location).subscribe(response => {
        this.projectList = response.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
        resolve();
      }, err => {
        resolve();
      })
    });
  }

  loadLocation() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationList = response.result;
      let date1 = new Date(new Date().getFullYear(), 0, 1);
      this.fromDate = {
        date: { year: date1.getFullYear(), month: date1.getMonth() + 1, day: date1.getDate() },
      }
      this.toDate = {
        date: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
      }
      this.loadTaskTimeSheetForDateRange();
    });
  }

  openBtnClicked() {
    if (!this.date1.showSelector)
      this.date1.openBtnClicked();
    if (!this.date2.showSelector)
      this.date2.openBtnClicked();
  }

  onChangeLocation() {
    this.project = [];
    this.taskDataList = [];
  }

  onChangeProject() {
    this.taskDataList = [];
  }

  loadTaskTimeSheetForDateRange() {
    if (this.project.length > 0 && this.fromDate && this.toDate) {
      var startDate = this.fromDate.date.year + "-" + this.fromDate.date.month + "-" + this.fromDate.date.day + ' 00:00:00';
      var endDate = this.toDate.date.year + "-" + this.toDate.date.month + "-" + this.toDate.date.day + ' 00:00:00';
      this.spinnerFlag = true;
      this.taskTimeSheetDTO.projectId = this.project[0].id;
      this.taskTimeSheetDTO.fromDate = startDate;
      this.taskTimeSheetDTO.toDate = endDate;
      this.taskService.loadTaskTimeSheetForDateRange(this.taskTimeSheetDTO).subscribe(response => {
        if (response.result) {
          this.taskDataList = response.data;
          this.spinnerFlag = false;
        }
      }, err => {
        this.spinnerFlag = false;
      })
    }
  }

  toggleExpandRow(row) {
    this.taskTable.rowDetail.toggleExpandRow(row);
  }

}
