import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class CalenderViewService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'calendar/saveCalendarEvent';
  url_load: string = this.helper.common_URL + 'calendar/loadCalendarEvents';
  url_delete: string = this.helper.common_URL + 'calendar/deleteCalendarEvent';
  url_weekday_save: string = this.helper.common_URL + 'calendar/saveWeekdays';
  url_weekday_load: string = this.helper.common_URL + 'calendar/loadWeekdays';
  url_status: string = this.helper.common_URL + 'calendar/updateStatus';
  url_loadAllData: string = this.helper.common_URL + 'calendar/loadAll';

  createCalendarEvent(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadCalendarEvents() {
    return this.http.post(this.url_load, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllData() {
    return this.http.post(this.url_loadAllData, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  deleteCalendarEvent(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveWeekdays(data: any) {
    return this.http.post(this.url_weekday_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadWeekdays() {
    return this.http.post(this.url_weekday_load, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  updateStatus(data) {
    return this.http.post(this.url_status, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}