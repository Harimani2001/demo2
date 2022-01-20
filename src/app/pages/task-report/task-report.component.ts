import { Component, OnInit, ViewChild } from '@angular/core';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { UserPrincipalDTO, TaskFilterDto, TaskReportDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { TaskReportService } from './task-report.service';
import { Helper } from '../../shared/helper';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateISOParserFormatter } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import { AdminComponent } from '../../layout/admin/admin.component';
import { IMyDpOptions } from '../../../../node_modules/mydatepicker/dist';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { LocationService } from '../location/location.service';
@Component({
  selector: 'app-task-report',
  templateUrl: './task-report.component.html',
  styleUrls: ['./task-report.component.css']
})
export class TaskReportComponent implements OnInit {
  @ViewChild('date') date:any;
  @ViewChild('date1') date1:any;
  @ViewChild('myTable') table: any;
  showSearch:boolean=false;
  filterQuery='';
  UserSettings = {};
  statusSettings = {};
  taskCateSettings = {};
  projectSett = {};
  equipmentSettings = {};
  docTypeSettings = {};
  statusSett ={};
  locationSett = {};
  userItemList = [];
  projectList = [];
  equipmentList = [];
  documentTypeList =[];
  users:any[]=new Array<any>();
  statusList: any = [];
  taskCategoryList: any = [];
  selectedUserItems = [];
  selectedStatusItems = [];
  selectedStatus:any= [];
  selectedTaskCategory = [];
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  selectedProject = [];
  selectedDocuType = [];
  selectedEqu=[];
  selectedProjectIds = [];
  selectedStatusIds = [];
  data: any;
  filterData: any;
  spinnerFlag:boolean = false;
  selectedPriority: String = "";
  public startdate1: NgbDateStruct;
  public Enddate1: NgbDateStruct;
  public today: NgbDateStruct;
  public taskFilterModal:TaskFilterDto = new TaskFilterDto();
  public taskReportDto:TaskReportDTO = new TaskReportDTO();
  public isAdvancedReport:boolean = false;
  public basicExcel: any;
  public advanceExcel:any;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
};
locationsList =[];
location=[];
  constructor(private servie: DateFormatSettingsService,private comp: AdminComponent,public helper: Helper,public service:TaskReportService,public lookUpService: LookUpService,public configService: ConfigService, public projectsetupService: projectsetupService,public locationService:LocationService) { }

  ngOnInit() {
    this.showSearch=false;
    this.loadOrgDateFormatAndTime();
    this.comp.setUpModuleForHelpContent("194");
    this.comp.taskDocType = "194";
        this.comp.taskDocTypeUniqueId = "";
        this.comp.taskEquipmentId = 0;
    let now = new Date();
    let test = new NgbDateISOParserFormatter;
     this.configService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
      this.selectedProject.push({ id: this.currentUser.projectId, itemName: this.currentUser.projectName });
      this.selectedUserItems.push({id: this.currentUser.id,itemName:this.currentUser.name});
      this.selectedProjectIds.push(this.currentUser.projectId);
      this.spinnerFlag = true;
      this.loadUsers();
      this.loadStatusList();
      this.loadTaskCategory();
      this.loadLocation()
      // this.loadAllProjects();
      this.loadBasicTaskReportData();
      this.loadDocumentTypes();
      this.loadEquipments();

      //this.startdate1 = test.parse(now.toISOString());
      //this.Enddate1 = test.parse(now.toISOString());
      this.today = test.parse(now.toISOString());
      
      
    });
    this.UserSettings = {
      singleSelection: false, 
      text: "Assigned To",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true, 
      badgeShowLimit: 1,
      classes: "myclass custom-class-example"
    };
    this.statusSettings = {
      singleSelection: false, 
      text: "Status",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true, 
      badgeShowLimit: 1,
      classes: "myclass custom-class-example"
    };
    this.taskCateSettings = {
      singleSelection: false, 
      text: "Category",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 1, 
      classes: "myclass custom-class-example"
    };
this.equipmentSettings = {
  singleSelection: false, 
  text: "Equipment",
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  enableSearchFilter: true, 
  badgeShowLimit: 1,
  classes: "myclass custom-class-example"
};
this.docTypeSettings = {
  singleSelection: false, 
  text: "DocType",
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  enableSearchFilter: true, 
  badgeShowLimit: 1,
  classes: "myclass custom-class-example"
};
    this.projectSett = {
      singleSelection: false, 
      text: "Project",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true, 
      badgeShowLimit: 1,
      classes: "myclass custom-class-example"
    };

    this.locationSett ={
      singleSelection: true, 
      text: "Location",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true, 
      badgeShowLimit: 1,
      classes: "myclass custom-class-example"
    };

    this.statusSett = {
      singleSelection: false, 
      text: "Status",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true, 
      classes: "myclass custom-class-example"
    };
  }

  loadUsers() {
    this.projectsetupService.loadUsersByProject(this.currentUser.projectId).subscribe(resp => {
      if (resp.list != null) {
        this.users= resp.list;
        this.userItemList = resp.list.map(option => ({ id: option.id, itemName: option.userName }));
      }
    });
  }


  funcOpen()
  {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
  
  }
  funcClose()
  {
    let modal = document.getElementById("myModal");
    modal.style.display = "none"; 
  }

  loadTaskCategory(){
    this.lookUpService.getlookUpItemsBasedOnCategory("TaskCategory").subscribe(result => {
      this.taskCategoryList = result.response.map(option => ({ id: option.key, itemName: option.value }));
    });
  }
  loadStatusList() {
    this.lookUpService.getlookUpItemsBasedOnCategory("TaskReportStatus").subscribe(result => {
      this.statusList = result.response.map(option => ({ id: +option.key, itemName: option.value }));
    });
    this.selectedStatusItems.push({id: 1,itemName:"Open"});
    this.selectedStatusItems.push({id: 3,itemName:"In Progress"});
  }

  loadLocation(){
    this.locationService.loadAllActiveLocations().subscribe(response =>{
        this.locationsList=response.result.map(option => ({ id: option.id, itemName: option.name }));;
        this.loadcurrentProjectDetail();
      });
    }

    loadcurrentProjectDetail() {
      this.projectsetupService.editproject(this.currentUser.projectId).subscribe(jsonResp => {
        if (jsonResp.result === 'success' && null != jsonResp.data.location) {
          this.locationsList.forEach(list => {
            if (list.id == jsonResp.data.location)
              this.location.push(list);
          })
          this.loadProjects();
        }
      });
    }

  loadProjects(): Promise<any> {
    return new Promise<any>(resolve => {
      this.projectList  =[];
      this.selectedProject =[];
      if(this.location.length !=0)
        this.configService.loadprojectOfUserAndCreatorForLocation(this.location[0].id).subscribe(response => {
            if(response.projectList != []){
                this.projectList  = response.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
                this.projectList.forEach(list=>{
                  if(list.id == this.currentUser.projectId)
                  this.selectedProject.push(list);
                  })   
              }
            resolve('');
        });
    })
}
  // loadAllProjects(){ 
  //   this.service.loadAllProjects().subscribe(result =>{
  //     if(result.projectList != []){
  //   this.projectList  = result.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
  //     }
  //   })
  // }
  loadTaskReportData(id:any){
    if(id === "advanced"){
      this.isAdvancedReport = true;
    }else{
      this.isAdvancedReport = false;
    }
  }
onChangeProject(){
  this.selectedProjectIds = [];
  this.selectedProject.forEach(obj =>{
     this.selectedProjectIds.push(obj.id);
  });
  this.loadBasicTaskReportData();
}
loadOrgDateFormatAndTime() {
  this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
          this.myDatePickerOptions.dateFormat=result.datePattern.replace("YYYY", "yyyy");
          this.date.setOptions();
          this.date1.setOptions();
      }
  });
}
openBtnClicked(event){
  if(!this.date.showSelector)
  this.date.openBtnClicked();
  if(!this.date1.showSelector)
  this.date1.openBtnClicked();
}

onChangeStatus(){
 this.spinnerFlag = true;
  this.selectedStatusIds = [];
  this.selectedStatusItems.forEach(obj =>{
    this.selectedStatusIds.push(obj.itemName);
  });
  this.filterData = [];
  for(let i = 0; i<this.selectedStatusIds.length; i++){
    for(let j=0;j<this.data.length;j++){
       if(this.selectedStatusIds[i] == this.data[j].status){
         this.filterData.push(this.data[j]);
       }
    }
  }
  this.spinnerFlag = false;

}

  loadBasicTaskReportData(){
    this.service.loadData(this.selectedProjectIds,"taskReport/loadBasicData").subscribe(res =>{
      this.spinnerFlag = false;
     this.data = res.data;
     this.taskReportDto = res.data;
     this.filterData = res.data;
     this.onChangeStatus();
    },error => { this.spinnerFlag = false });
  }
loadEquipments(){
  this.service.loadData(this.selectedProjectIds,"taskReport/loadequipmentData").subscribe(result =>{
    if(result != []){
      this.equipmentList  = result.map(option => ({ id: option.key, itemName: option.value }));
        }
  });
}
excelDownload(){
  this.spinnerFlag = true;
  var data = this.selectedStatusItems.map(result => result.itemName);
  if(this.isAdvancedReport){
   this.advancedReportExcelDownload(data);
  }else{
    this.basicReportExcelDownload(data);
  }
}
basicReportExcelDownload(selectedStatus:any){
  this.service.downloadExcel(selectedStatus,"taskReport/downloadBasicReport").subscribe(resp =>{
    this.spinnerFlag = false;
    if (resp.result) {
      var nameOfFileToDownload = resp.sheetName + ".xls";
      this.comp.previewOrDownloadByBase64(nameOfFileToDownload, resp.sheet, false);
    }
  },(err)=>{
     this.spinnerFlag = false;
  });

}
advancedReportExcelDownload(selectedStatus:any){
  this.service.downloadExcel(selectedStatus,"taskReport/downloadAdvinceReport").subscribe(resp =>{
    this.spinnerFlag = false;
    if (resp.result) {
      var nameOfFileToDownload = resp.sheetName + ".xls";
      this.comp.previewOrDownloadByBase64(nameOfFileToDownload, resp.sheet, false);
    }
  },(err)=>{
    this.spinnerFlag = false;
 });
}


loadDocumentTypes(){
  this.service.loadData(this.selectedProjectIds,"taskReport/loaddocTypeData").subscribe(result =>{
    if(result != []){
      this.documentTypeList  = result.map(option => ({ id: option.key, itemName: option.value }));
        }
  });
}
  onChangeFilters() {
    this.filterData = [];
    this.data.forEach(element => {
      if (!this.helper.isEmpty(this.selectedStatus) && !this.helper.isEmpty(this.selectedPriority) && this.selectedUserItems.length>0) {
        if (this.selectedUserItems.some(r=> element.selectedUsers.includes(+r.id)) && element.priority === this.selectedPriority && element.status === this.selectedStatus)
          this.filterData.push(element);
      } else if (!this.helper.isEmpty(this.selectedStatus) && !this.helper.isEmpty(this.selectedPriority)) {
        if (element.priority === this.selectedPriority && element.status === this.selectedStatus)
          this.filterData.push(element);
      } 
      
      else if (!this.helper.isEmpty(this.selectedTaskCategory) ) {
        if (element.category === this.selectedTaskCategory)
          this.filterData.push(element);
      }
      else if (!this.helper.isEmpty(this.selectedDocuType) ) {
        this.selectedDocuType.forEach(obj =>{
          if (element.documentType === obj.itemName){
             this.filterData.push(element);
          }
        });
        
      }
      else if (!this.helper.isEmpty(this.selectedEqu) ) {
        this.selectedEqu.forEach(obj =>{
          if (element.equipmentName === obj.itemName){
               this.filterData.push(element);
          }
        });
       
      }
      else if (!this.helper.isEmpty(this.selectedPriority) && this.selectedUserItems.length>0) {
        if (this.selectedUserItems.some(r=> element.selectedUsers.includes(+r.id)) && element.priority === this.selectedPriority)
          this.filterData.push(element);
      } else if (!this.helper.isEmpty(this.selectedStatus) && this.selectedUserItems.length>0) {
        if (element.selectedUsers.includes(+this.selectedUserItems) && element.status === this.selectedStatus)
          this.filterData.push(element);
       } else if (this.selectedUserItems.length>0) {
        if (this.selectedUserItems.some(r=> element.selectedUsers.includes(+r.id)))
          this.filterData.push(element);
      } else if (!this.helper.isEmpty(this.selectedPriority)) {
        if (element.priority === this.selectedPriority)
          this.filterData.push(element);
      } else if (!this.helper.isEmpty(this.selectedStatus)) {
        if (element.status === this.selectedStatus)
          this.filterData.push(element);
      } else {
        this.filterData = this.data;
      }
    });
  }
  loadAdvancedTaskReport(){

  }

  openDatepicker(id,value:any) {
    id.toggle();
   }
   fromDateChange(data:any){
    this.startdate1= data
    this.compare()
  }
  
  toDateChange(data:any){
    this.Enddate1=data
    this.compare();
  }
  compare(){
    if(this.startdate1 && this.Enddate1){
    var startDate = this.startdate1['year'] + "-" + this.startdate1['month'] + "-" + this.startdate1['day'];
    var day = +this.Enddate1['day'];
    day = day + 1;
    var endDate = this.Enddate1['year'] + "-" + this.Enddate1['month'] + "-" + day.toLocaleString();
    this.taskFilterModal.formDate = startDate;
    this.taskFilterModal.toDate = endDate;
    this.taskFilterModal.projectIds = this.selectedProjectIds;
    this.service.loadDataByDateRange(this.taskFilterModal,"taskReport/loadDataByDateRange").subscribe(result =>{
       this.data = result;
       this.filterData = result;
    });
  }
   }
}
