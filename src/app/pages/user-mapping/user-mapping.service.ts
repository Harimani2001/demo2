import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class UservsEquipmentService {
  
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'userVSEquipment/save';
  url_load: string = this.helper.common_URL + 'userVSEquipment/loadUsersForEquipment';
  url_load_all: string = this.helper.common_URL + 'userVSEquipment/loadAll';
  url_delete:string = this.helper.common_URL + 'userVSEquipment/delete';
  url_mailing_service_list:string = this.helper.common_URL + 'userVSEquipment/loadEquipmentMailingAccessForUser';
  url_email_service_active_or_deactive:string = this.helper.common_URL + 'userVSEquipment/activateOrDeactivateEmailService';
  saveEquipmentForUser(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadEquipment(data:any) {
    return this.http.post(this.url_load, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  loadAllEquipmentForUser() {
    return this.http.post(this.url_load_all,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  deleteData(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
    return Observable.throw(res.json());
    });
    }

  loadEquipmentMailingAccessForUser() {
    return this.http.post(this.url_mailing_service_list,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }


  activateOrDeactivateEmailService(primaryKey, emailFlag) {
    return this.http.post(this.url_email_service_active_or_deactive, { id: primaryKey, emailFlag: emailFlag }, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
    
}