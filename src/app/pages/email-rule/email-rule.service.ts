import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';

@Injectable()
export class EmailRuleService {

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

  saveEmailRule(data: any) {
    return this.http.post(this.helper.common_URL + 'emailRule/save', data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getAllEmailRules() {
    return this.http.post(this.helper.common_URL + 'emailRule/getAllEmailRules',"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadEmailRule(id: any) {
    return this.http.post(this.helper.common_URL + 'emailemailRule/loadEmailRule', id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  isExistsRuleForOrg(ruleName) {
    return this.http.post(this.helper.common_URL + 'emailRule/isExistsRule', ruleName, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}
