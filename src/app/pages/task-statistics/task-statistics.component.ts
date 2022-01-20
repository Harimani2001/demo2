import { Component, OnInit } from '@angular/core';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { LocationService } from '../location/location.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { TaskCreationService } from '../task-creation/task-creation.service';

@Component({
  selector: 'app-task-statistics',
  templateUrl: './task-statistics.component.html',
  styleUrls: ['./task-statistics.component.css']
})
export class TaskStatisticsComponent implements OnInit {

  spinnerFlag: boolean = false;
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
  taskStatisticsList: any[] = new Array();

  constructor(public helper: Helper, public configService: ConfigService, public taskService: TaskCreationService,
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
      this.loadTaskStatistics();
    });
  }

  onChangeLocation() {
    this.project = [];
    this.taskStatisticsList = [];
  }

  onChangeProject() {
    this.taskStatisticsList = [];
  }

  loadTaskStatistics() {
    if (this.project.length > 0) {
      this.taskService.loadTaskStatistics(this.project[0].id).subscribe(response => {
        if (response.result) {
          this.taskStatisticsList = response.data;
          this.spinnerFlag = false;
        }
      }, err => {
        this.spinnerFlag = false;
      })
    }
  }

}
