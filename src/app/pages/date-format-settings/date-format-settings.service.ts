import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class DateFormatSettingsService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'organization/saveOrgDateFormat';
  url_load: string = this.helper.common_URL + 'organization/getOrgDateFormat';
  url_validate: string = this.helper.common_URL + 'common/isValidDateFormat';
  url_load_date_pattern: string = this.helper.common_URL + 'organization/getOrgDateFormatForDatepicker';

  saveOrgDateFormat(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getOrgDateFormat() {
    return this.http.post(this.url_load, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  validateOrgDateFormat(dateFormat: string,timeZone:any) {
    let json={dateFormat:dateFormat,timeZone:timeZone}
    return this.http.post(this.url_validate, json, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getOrgDateFormatForDatePicker() {
    return this.http.post(this.url_load_date_pattern, "", this.config.getRequestOptionArgs())
    .map((resp) => resp.text())
    .catch(res => {
      return '';
    });
  }
}