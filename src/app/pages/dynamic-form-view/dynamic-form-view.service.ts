import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Helper } from '../../shared/helper';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class DynamicFormViewService {

  constructor(public http: Http, public helper: Helper,public config:ConfigService) { }
  url_load_all_multiple_dynamic_form: string = this.helper.common_URL + 'dynamicForm/loadAllDataOfMultipleDynamicForm';
 
  loadAllDataForProject(data: any) {
    return this.http.post(this.url_load_all_multiple_dynamic_form, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}
