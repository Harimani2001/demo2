import { IMyDpOptions, MyDatePicker } from 'mydatepicker/dist';
import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ViewChildren, QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { isSameDay, isSameMonth, startOfDay } from 'date-fns';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CalendarColorDTO, CalendarEventDTO, UserPrincipalDTO, WeekDaysDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { CalenderViewService } from './calender-view.service';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';

@Component({
  selector: 'app-calender-view',
  templateUrl: './calender-view.component.html',
  styleUrls: ['./calender-view.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})

export class CalenderViewComponent implements OnInit {
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
  position = -1;
  view: string = "month";
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  refresh: Subject<any> = new Subject();
  events: any[] = new Array();
  calenderEvents: any[] = new Array();
  holidayEvents: any[] = new Array();
  activeDayIsOpen: boolean = false;
  spinnerFlag = false;
  public weekDaysList: WeekDaysDTO[] = new Array();
  permissionData: any = new Array<Permissions>();
  permissionModal: Permissions = new Permissions("173", false);
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  frequencyList = new Array();
  minDate = startOfDay(new Date());
  @ViewChildren('fromDateView') fromDateView: QueryList<MyDatePicker>;
  @ViewChildren('toDateView') toDateView: QueryList<MyDatePicker>;
  public myDatePickerOptions: IMyDpOptions = {};
  calendarViewFlag = false;
  submitted = false;
  constructor(private adminComponent: AdminComponent, public permissionService: ConfigService,
    private modal: NgbModal, public helper: Helper, public service: CalenderViewService,
    public datePipe: DatePipe, private lookUpService: LookUpService, private dateService: DateFormatSettingsService) {
  }

  ngOnInit() {
    this.loadOrgDateFormat()
    this.loadAll();
    this.lookUpService.getlookUpItemsBasedOnCategory("dueDateFrequency").subscribe(res => {
      this.frequencyList = res.response;
    });
    this.permissionService.loadCurrentUserDetails().subscribe(resp => {
      this.currentUser = resp;
    });
    this.permissionService.loadPermissionsBasedOnModule("173").subscribe(resp => {
      this.permissionModal = resp;
    });
    this.adminComponent.setUpModuleForHelpContent("173");
  }

  loadAll() {
    this.spinnerFlag = true;
    this.service.loadCalendarEvents().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.events = response.result;
        this.events.forEach(e => {
          if (e.startCalender)
            e.startCalender = { date: JSON.parse(e.startCalender) };
          if (e.endCalender)
            e.endCalender = { date: JSON.parse(e.endCalender) };
        })
        this.holidayEvents = response.result;
      }
    }, error => { this.spinnerFlag = false });
  }

  loadWeekdays() {
    return new Promise<boolean>(resolve => {
      this.service.loadWeekdays().subscribe(response => {
        if (response.result != null) {
          this.weekDaysList = response.result;
          resolve(true)
        } else {
          resolve(true)
        }
      }, err => resolve(true));
    })

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
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
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { action, event };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.position = -1;
    this.holidayEvents = [
      ...this.holidayEvents,
      {
        id: 0,
        title: 'New event',
        start: { date: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() } },
        end: '',
        color: this.colors.red,
        holidayFlag: 'N',
        frequency: 'noreminder'
      }
    ];
  }

  openSuccessCancelSwal(eventToDelete, i) {
    if (eventToDelete.id == 0) {
      this.holidayEvents.splice(i, 1);
      return;
    }
    swal({
      title: "Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    })
      .then((value) => {
        if (value) {
          eventToDelete.userRemarks = "Comments : " + value;
          this.deleteEvent(eventToDelete);
        } else {
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });
        }
      });
  }

  deleteEvent(eventToDelete: any) {
    this.refresh.next();
    this.holidayEvents = this.holidayEvents.filter(event => event !== eventToDelete);
    eventToDelete.loginUserId = this.currentUser.id;
    eventToDelete.organizationOfLoginUser = this.currentUser.orgId;
    eventToDelete.start = '';
    eventToDelete.end = '';
    eventToDelete.startCalender = "";
    eventToDelete.endCalender = "";
    this.service.deleteCalendarEvent(eventToDelete).subscribe(jsonResp => {
      if (jsonResp.result === "success") {
        this.spinnerFlag = false;
        this.activeDayIsOpen = false;
        this.loadAll();
        swal({
          title: '', text: 'Event Deleted Successfully', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
          onClose: () => {
          }
        });
      } else {
        swal({
          title: '', text: 'Something went Wrong ...Try Again', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false
        });
      }
    },
      err => {
        swal({
          title: '', text: 'Something went Wrong ...Try Again', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false
        });
        this.spinnerFlag = false
      }
    );
  }

  setView(view) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  saveEvent(event: any, index) {
    if (!event.endCalender) {
      this.position = index;
      this.submitted = true;
      return
    } else {
      this.spinnerFlag = true;
      this.position = -1
      let dto: CalendarEventDTO = new CalendarEventDTO();
      let color: CalendarColorDTO = new CalendarColorDTO();
      dto.id = event.id;
      dto.title = event.title;
      dto.start = JSON.stringify(event.startCalender.date);
      dto.end = JSON.stringify(event.endCalender.date);
      color.primary = event.color.primary;
      color.secondary = event.color.secondary;
      dto.color = color;
      dto.frequency = '';
      dto.holidayFlag = event.holidayFlag;
      this.service.createCalendarEvent(dto).subscribe(jsonResp => {
        this.spinnerFlag = false;
        let responseMsg: string = jsonResp.result;
        if (responseMsg === "success") {
          this.loadAll();
          swal({
            title: '', text: 'Event Added Successfully', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
            onClose: () => {
            }
          });
        } else {
          swal({
            title: '', text: 'Something went Wrong ...Try Again', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false
          });
        }
      },
        err => {
          swal({
            title: '', text: 'Something went Wrong ...Try Again', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false
          });
          this.spinnerFlag = false;
        }
      );
    }
  }

  beforeMonthViewRender(renderEvent: any): void {
    renderEvent.body.forEach(day => {
      this.weekDaysList.forEach(weekday => {
        if (!weekday.selectedFlag && day.date.getDay() == weekday.weekdayCode)
          day.cssClass = 'bg-gray';
      });
      this.calenderEvents.forEach(event => {
        let start = new Date(event.start);
        let end = new Date(event.end);
        if (event.holidayFlag === 'Y') {
          let oneDay = 24 * 60 * 60 * 1000;
          let startDate = start;
          let diffDays = Math.round(Math.abs((+start - +end) / oneDay));
          for (let i = 1; i <= diffDays; i++) {
            startDate.setDate(startDate.getDate() + 1);
            if (this.datePipe.transform(startDate, 'yyyy-MM-dd') === this.datePipe.transform(day.date, 'yyyy-MM-dd'))
              day.cssClass = 'bg-gray';
          }
          if (this.datePipe.transform(start, 'yyyy-MM-dd') === this.datePipe.transform(day.date, 'yyyy-MM-dd')) {
            day.cssClass = 'bg-gray';
          }
        } else {
          this.weekDaysList.forEach(weekday => {
            if (weekday.selectedFlag && day.date.getDay() == weekday.weekdayCode) {
              if (this.datePipe.transform(start, 'yyyy-MM-dd') === this.datePipe.transform(day.date, 'yyyy-MM-dd')) {
                day.cssClass = 'bg-white';
              }
            }
          });
        }
      });
    });
  }

  saveWeekdays(flag) {
    this.service.saveWeekdays(this.weekDaysList).subscribe(jsonResp => {
      this.spinnerFlag = false;
      let responseMsg: string = jsonResp.result;
      if (responseMsg === "success") {
        this.loadAll();
        this.loadWeekdays();
        if (flag)
          swal({
            title: '',
            text: 'Saved Successfully',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
            }
          });
      } else {
        if (flag)
          swal({
            title: '', text: 'Something went Wrong ...Try Again', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false
          })
      }
    },
      err => {
        swal({
          title: '', text: 'Something went Wrong ...Try Again', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false
        })
        this.spinnerFlag = false
      }
    );
  }

  tabChange(id: any) {
    this.calendarViewFlag = false;
    switch (id) {
      case "holiday":
        this.loadAll();
        break;
      case "calendar":
        this.loadWeekdays().then(resp => {
          this.calendarViewFlag = true;
          this.calenderEvents = JSON.parse(JSON.stringify(this.events));
          this.calenderEvents.forEach(event => {
            event.start = new Date(event.start);
            event.end = new Date(event.end);
          });
        })
        break;
      case "weekday":
        this.loadWeekdays();
        break;
      default:
        break;
    }
  }

  getMinDate(start) {
    try {
      if (this.datePipe.transform(start, "yyyy-MM-dd") < this.datePipe.transform(this.minDate, "yyyy-MM-dd"))
        return start;
      else
        return this.minDate;
    } catch (err) {
      return this.minDate;
    }
  }

  loadOrgDateFormat() {
    this.dateService.getOrgDateFormat().subscribe(result => {
      if (result) {
        this.myDatePickerOptions.dateFormat = result.datePattern.replace("YYYY", "yyyy");
      }
    });
  }

  onDateChanged(date, flag: boolean, index) {
    let newDate = new Date(date.date.year, date.date.month - 1, date.date.day);
    let dateOffset = (24 * 60 * 60 * 1000) * 1;
    if (flag) {
      newDate.setTime(newDate.getTime() - dateOffset);
      let dataJson = { "year": newDate.getFullYear(), "month": newDate.getMonth() + 1, "day": newDate.getDate() }
      this.toDateView.toArray()[index].opts.disableUntil = dataJson;
      this.toDateView.toArray()[index].setOptions();
    } else {
      newDate.setTime(newDate.getTime() + dateOffset);
      let dataJson = { "year": newDate.getFullYear(), "month": newDate.getMonth() + 1, "day": newDate.getDate() }
      this.fromDateView.toArray()[index].opts.disableSince = dataJson;
      this.fromDateView.toArray()[index].setOptions();
    }
  }

}
