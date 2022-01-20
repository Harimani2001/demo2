import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Helper } from '../../shared/helper';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class WorkFlowDynamicTemplateService {
  url_load_data_for_work_flow: string = this.helper.common_URL + 'masterTemplateWorkFlow/loadMasterTemplateForWorkFlow';
  url_level_approve_submit: string = this.helper.common_URL + 'masterTemplateWorkFlow/saveMasterWorkFlowData';
  url_load_comments_log: string = this.helper.common_URL + 'masterTemplateWorkFlow/masterWorkFlowCommentLog';
  
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  
  levelApproveSubmit(row: any) {
    return this.http.post(this.url_level_approve_submit, row, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadLogOfMasterFormWorkFlow(id: any) {
    return this.http.post(this.url_load_comments_log, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  
  loadMasterTemplateForWorkFlow(){
    return this.http.post(this.url_load_data_for_work_flow,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}
