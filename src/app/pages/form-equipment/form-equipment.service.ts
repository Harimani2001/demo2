import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class FormvsEquipmentService {
  
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'equipment/saveEquipmentsForForm';
  url_load: string = this.helper.common_URL + 'dynamicForm/loadEquipmentListForForm';
  url_load_all: string = this.helper.common_URL + 'equipment/loadEquipmentsForForm';
  url_delete:string = this.helper.common_URL + 'equipment/deleteEquipmentsForForm';
  saveEquipmentForForm(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadEquipment(formId:any) {
    return this.http.post(this.url_load, formId, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  loadAllEquipmentStatus() {
    return this.http.post(this.url_load_all, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  deleteEquipment(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
    return Observable.throw(res.json());
    });
    }
    
}