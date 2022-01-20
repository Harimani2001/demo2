import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class ComplianceAssessmentService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  
  
  url_save: string = this.helper.common_URL + 'complianceAssessment/saveOrUpdate';
  createComplianceAssessment(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  url_load: string = this.helper.common_URL + 'complianceAssessment/loadDetails';
  loadComplianceAssessment(pageNo) {
    return this.http.post(this.url_load, pageNo, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  url_delete: string = this.helper.common_URL + 'complianceAssessment/delete';
  deleteComplianceAssessment(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}