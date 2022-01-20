import { Component, OnInit } from '@angular/core';
import { UserPrincipalDTO} from '../../models/model';
import { AdminComponent } from '../../layout/admin/admin.component';
import { TaskReportService } from '../task-report/task-report.service';
import { ConfigService } from '../../shared/config.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.css']
})
export class MyTaskComponent implements OnInit {
  projectList = [];
  selectedUserItems:any;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  selectedProjectIds = [];
  data: any;
  filterData: any=[];
  spinnerFlag:boolean = false;
  windowHeight=window;
  constructor(private adminComponent: AdminComponent,public service:TaskReportService,
    public configService: ConfigService,public router: Router) { }

  ngOnInit() {
    this.adminComponent.taskDocType = "195";
    this.adminComponent.setUpModuleForHelpContent("195");
     this.configService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
      this.selectedUserItems = this.currentUser.id
      this.spinnerFlag = true;
      this.loadBasicTaskReportData();
    });
  }

  loadBasicTaskReportData(){
    this.service.loadProjectData(false).subscribe(res =>{
      for (var key in res.data) {
        res.data[key].forEach(element => {
          element.dueDate = element.dueDate.split(" ")[0];
        });
        this.data = { 'name': key, 'dto': res.data[key].sort((b,a)=>b.remaingDays.localeCompare(a.remaingDays.includes("Overdue"))) }
        this.filterData.push(this.data);
      }
     this.spinnerFlag = false;
    },error => { this.spinnerFlag = false });
  }

  routeView(row) {
    this.spinnerFlag = true;
    this.adminComponent.onChange(row.projectId,row.locationId,true).then(response =>{
      this.spinnerFlag = false;
      if ( row.permissionCategory.includes("Template")) {
        this.adminComponent.redirect(row.url)
      }else
      this.adminComponent.taskURLNavigation(row);
    })
    }
}
