import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class EquipmentDashboardService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

  url_load: string = this.helper.common_URL + 'dynamicForm/loadMasterDynamicFormsByEquipment';


  loadFormsData(data:any) {
    return this.http.post(this.url_load, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}