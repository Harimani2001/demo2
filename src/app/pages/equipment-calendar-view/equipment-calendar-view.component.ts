import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateISOParserFormatter } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CalendarColorDTO, CalendarEventDTO, UserPrincipalDTO, WeekDaysDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { CalenderViewService } from '../calender-view/calender-view.service';
import { EquipmentStatusUpdateService } from '../equipment-status-update/equipment-status-update.service';
import { EquipmentService } from '../equipment/equipment.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { Permissions } from './../../shared/config';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';

@Component({
  selector: 'app-equipment-calendar-view',
  templateUrl: './equipment-calendar-view.component.html',
  styleUrls: ['./equipment-calendar-view.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class EquipmentCalendarViewComponent implements OnInit {

  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('modalContent1') modalContent1: TemplateRef<any>;
  @ViewChild('addEventmodal') addEventmodal: any;
  dueDatePicker:any;
  view: string = "month";
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  refresh: Subject<any> = new Subject();
  events: any[] = new Array();
  openevents: any[] = new Array();
  completeevents: any[] = new Array();
  holidayEvents: any[] = new Array();
  equipmentEvents: any[] = new Array();
  activeDayIsOpen: boolean = true;
  spinnerFlag = false;
  weekDaysList: WeekDaysDTO[] = new Array();
  equipmentList:any[]=new Array();
  equipmentData:any[]= new Array();
  seletedEquipment:string="";
  public onAddEventForm: FormGroup;
  dueDateMesssage=""
  public today: NgbDateStruct;
  showStatusDropDown = {};
  public validDate: NgbDateStruct;
  selectedEventId:number=0;
  currentUser:UserPrincipalDTO=new UserPrincipalDTO();
  public data:any;
  frequencyList: any[]=new Array();
  permissionModal: Permissions = new Permissions("179",false);
  pattern="d-m-Y";
  datePipeFormat='yyyy-MM-dd';
  oldEvent: any;
  public filterQuery = '';
  @ViewChild('myTable') table: any;
  minDate = new Date();
  constructor(private configService:ConfigService, private adminComponent: AdminComponent,public fb: FormBuilder,private modal: NgbModal,
     public helper: Helper, public service: CalenderViewService, public datePipe: DatePipe,public equipmentService: EquipmentService
     , public lookUpService: LookUpService,public equipmentStatusUpdateService:EquipmentStatusUpdateService,private servie: DateFormatSettingsService) { 
    this.loadWeekdays();
  }

  ngOnInit() {
    this.loadOrgDateFormatAndTime();
    this.loadOrgDateFormat();
    this.configService.loadCurrentUserDetails().subscribe(resp=>{
      this.currentUser=resp;
    });
      this.lookUpService.getlookUpItemsBasedOnCategory("dueDateFrequency").subscribe(res => {
      this.frequencyList = res.response;
    });
    let now = new Date();
    let tempData = new NgbDateISOParserFormatter;
    this.today = tempData.parse(now.toISOString());
    this.loadAllEquipments();
    this.onAddEventForm = this.fb.group({
      description: ['', Validators.compose([
        Validators.required
      ])],
      dueDate: ['', Validators.compose([
        Validators.required
      ])],
      frequency: ['',Validators.required],
    });
    this.configService.loadPermissionsBasedOnModule("179").subscribe(resp=>{
      this.permissionModal=resp
    });
    this.adminComponent.setUpModuleForHelpContent("179");
  }
  loadAll() {
    this.events=[];
    this.spinnerFlag = true;
    this.openevents = [];
    this.completeevents = [];
    this.service.loadCalendarEvents().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.holidayEvents = response.result;
        if(!this.helper.isEmpty(this.seletedEquipment)){
          this.holidayEvents.forEach( data =>{
            if(!this.helper.isEmpty(data.equipmentDto) && ""+this.seletedEquipment === ""+data.equipmentId)
              this.events.push(data);
          });
        }else{
          this.events = response.result;
        }
        this.generateList();
      }
    }, error => { this.spinnerFlag = false 
      swal({title: 'Error',type: 'error',timer: 2000,text: 'Something went wrong will loading data...Try Again'});
    });
    this.service.loadAllData().subscribe(response =>{
      this.data = response.list;
    },error =>{
      this.spinnerFlag = false;
      swal({title: 'Error',type: 'error',timer: 2000,text: 'Something went wrong will loading data...Try Again'});
    });
   
  }

  generateList(){
    this.events.forEach(d=>{
      if(d.status === 'Open' || d.status === '' || d.status === null){
        this.openevents.push(d);
      }else{
        this.completeevents.push(d);
      }
    });
  }

  loadAllEquipments() {
    this.spinnerFlag = true;
    this.equipmentService.loadEquipmentsByuser().subscribe(response => {
      this.spinnerFlag = false;
      if (response.result != null) {
        this.equipmentList = response.result;
        this.equipmentData = response.result.map(option => ({"value":''+option.id,"label":option.name}))
      }
    }, error => { this.spinnerFlag = false });
  }

  loadWeekdays() {
    this.service.loadWeekdays().subscribe(response => {
      if (response.result != null) {
        this.weekDaysList = response.result;
        this.weekDaysList.forEach(day => {
          day.loginUserId =this.currentUser.id;
          day.organizationOfLoginUser = this.currentUser.orgId;
        });

      }
    });
  }

  editStatus(rowIndex) {
    for (let index = 0; index < this.openevents.length; index++) {
      if (rowIndex == index)
        this.showStatusDropDown[index] = true;
      else
        this.showStatusDropDown[index] = false;
    }
  }

  changeStatus(data, index) {
    this.showStatusDropDown[index] = false;
    var obj = this
    swal({
      title: 'Are you sure?',
      text: 'You want to update the status' ,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonClass: 'btn btn-danger',
      allowOutsideClick: false,
      buttonsStyling: false
    }).then((result) => {
      obj.updateStatus(data);
      this.showStatusDropDown[index] = false;
    }).catch(() => {
    });
    this.showStatusDropDown[index] = false;
  }

  completeStatus(row){
    row.status = "Completed";
    this.updateStatus(row);
  }

  updateStatus(data) {
    this.spinnerFlag = true;
    this.service.updateStatus(data).subscribe(jsonResp => {
      if (jsonResp.result === "success") {
        this.openevents = [];
        this.completeevents = [];
        this.loadAll();
        status = "success";
        swal({
          title: 'Updated Successfully!',
          text: ' Status has been updated.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        });
        this.spinnerFlag = false;
      } else {
        swal({
          title: 'Update Failed!',
          text: ' Status has not been updated. Try again!',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }

        );
        this.spinnerFlag = false;
      }
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }:
    CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.generateList();
    this.handleEvent('Dropped or resized', event);
  }
  onClickOnDay(events: any): void {
    if(events.day.events.length>0){
      this.equipmentEvents=events.day.events
      this.modal.open(this.modalContent1, { size: 'lg',backdrop:false });
    }
  }
  onEditEvent(event:any){
    this.seletedEquipment=event.equipmentId;
    this.selectedEventId=event.id;
    this.onAddEventForm.get("description").setValue(event.title);
    this.oldEvent = event.title;
    this.onAddEventForm.get("dueDate").setValue(this.datePipe.transform(new Date(event.start), 'yyyy-MM-dd hh:mm:ss'));
    this.onAddEventForm.get("frequency").setValue(event.frequency);
    this.modal.open(this.addEventmodal, { size: 'lg',backdrop:false });
  }
  onChangeEquipment(){
    this.loadAll();
  }
  handleEvent(action: string, event: any): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent,{ size: 'lg',backdrop:false });
  }

  setView(view) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  beforeMonthViewRender(renderEvent: any): void {
    renderEvent.body.forEach(day => {
      if (this.weekDaysList.length === 0) {
        this.service.loadWeekdays().subscribe(response => {
          if (response.result != null) {
            this.weekDaysList = response.result;
            this.weekDaysList.forEach(weekday => {
              weekday.loginUserId = this.currentUser.id;
              weekday.organizationOfLoginUser = this.currentUser.orgId;
              if (!weekday.selectedFlag && day.date.getDay() == weekday.weekdayCode)
              day.cssClass = 'bg-gray';
            });
          }
        });
      } else {
        this.weekDaysList.forEach(weekday => {
          if (!weekday.selectedFlag && day.date.getDay() == weekday.weekdayCode)
            day.cssClass = 'bg-gray';
        });
      }
      this.events.forEach(event => {
        if (event.holidayFlag === 'Y') {
          let oneDay = 24 * 60 * 60 * 1000;
          let startDate = new Date(event.start);
          let diffDays = Math.round(Math.abs((+new Date(event.start) - +new Date(event.end)) / oneDay));
          for (let i = 1; i <=diffDays; i++) {
            startDate.setDate(startDate.getDate() + 1);
            if (this.datePipe.transform(startDate, 'yyyy-MM-dd') === this.datePipe.transform(day.date, 'yyyy-MM-dd'))
              day.cssClass = 'bg-gray';
          }
          if (this.datePipe.transform(event.start, 'yyyy-MM-dd') === this.datePipe.transform(day.date, 'yyyy-MM-dd')) {
            day.cssClass = 'bg-gray';
          }
        } else {
          if (this.datePipe.transform(event.start, 'yyyy-MM-dd') === this.datePipe.transform(day.date, 'yyyy-MM-dd')){
            if(!this.helper.isEmpty(event.equipmentDto))
              day.cssClass = 'bg-pink';
            
          }else{
            this.weekDaysList.forEach(weekday => {
              if (weekday.selectedFlag && day.date.getDay() == weekday.weekdayCode){
                if (this.datePipe.transform(event.start, 'yyyy-MM-dd') === this.datePipe.transform(day.date, 'yyyy-MM-dd')) {
                  day.cssClass = 'bg-white';
                }
              }
            });
          }
        }
      });
    });
  }
  addEvent(){
    this.onAddEventForm.reset();
    this.dueDateMesssage="";
    this.onAddEventForm.get("frequency").setValue("noreminder");
    this.modal.open(this.addEventmodal, { size: 'lg',backdrop:false });
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  saveEvent(validForm){
    if(this.dueDateMesssage==''&&validForm){
    let dto:CalendarEventDTO=new CalendarEventDTO();
    let color:CalendarColorDTO=new CalendarColorDTO();
    dto.equipmentId=this.seletedEquipment;
    dto.id=this.selectedEventId;
    dto.title=this.onAddEventForm.get("description").value;
    dto.start = this.datePipe.transform(new Date(this.onAddEventForm.get("dueDate").value), 'yyyy-MM-dd hh:mm:ss');
    dto.end = this.datePipe.transform(new Date(this.onAddEventForm.get("dueDate").value), 'yyyy-MM-dd hh:mm:ss');
    color.primary='#ad2121';
    color.secondary='#FAE3E3';
    dto.color=color;
    dto.holidayFlag="N";
    dto.frequency= this.onAddEventForm.get("frequency").value;
    this.service.createCalendarEvent(dto).subscribe(jsonResp => {
      this.spinnerFlag = false;
      let responseMsg: string = jsonResp.result;
      if (responseMsg === "success") {
        this.loadAll();
        $('#closeButtonIdOfAddEvent').click();
        $('#eventDetailsClose').click();
        swal({title: 'Success',type: 'success',showConfirmButton: false,timer: 2000,text: dto.id==0?(dto.title+' Saved Successfully'):(this.oldEvent+" Updated Successfully")});
      } 
    },
      err => {
        this.spinnerFlag = false
      }
    );
    }else{
      return
    }
  }
  populateSaveDate(date:any):Date{
    let result;
    if(!this.helper.isEmpty(date)){
      this.validDate = date;
      result=this.validDate.year+"-"+this.validDate.month + "-"+ +this.validDate.day
    }else{
      result="";
    }
    let now=new Date(result);
    now.setDate(now.getDate());
   return now;
  }

  

  findHolidayDate(date: any) {
    if (!this.helper.isEmpty(date)) {
      this.dueDateMesssage = "";
      let date1 = date.value.split("T");
      let date2 = date1[0].split("-");
      let day3  =  date2[2] + "/" + date2[1] + "/" + date2[0];
      this.equipmentStatusUpdateService.findHoliday(day3).subscribe(result => {
        if (result.result == true) {
          this.dueDateMesssage = 'Selected ' +   date2[0] + "-" + date2[1] + "-" +  date2[2]+ ' is a holiday, please choose some other day';
        }
      });
    }
  }

  onClick(event) {
    let path = event.path;
    let a = false;
    for (var index = 0; index < path.length; index++) {
      if (this.dueDatePicker)
        if (path[index].id == "inputgroup") {
          a = true;
          break;
        }
    }
    if (!a) {
      if (this.dueDatePicker)
        this.dueDatePicker.close();
    }
  }

  loadOrgDateFormat() {
    this.servie.getOrgDateFormatForDatePicker().subscribe(result => {
        if (!this.helper.isEmpty(result)) {
            this.pattern = result.replace("y","Y");
        }
    });
  }

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
        if (!this.helper.isEmpty(result)) {
          this.datePipeFormat=result.datePattern.replace("mm", "MM")
          this.datePipeFormat=this.datePipeFormat.replace("YYYY", "yyyy");
        }
    });
}
}
