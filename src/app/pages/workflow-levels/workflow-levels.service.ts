import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
@Injectable()
export class WorkFlowLevelsService {

  save_workFlow_url: string = this.helper.common_URL + "workflowConfiguration/saveWorkFlowLevel";
  loadWorkFlow_url: string = this.helper.common_URL + "workflowConfiguration/loadWorkFlowLevelsForSettings";
  levelIsExist_url: string = this.helper.common_URL + "workflowConfiguration/levelIsExist";
  loadAllWorkFlow_url: string = this.helper.common_URL + "workflowConfiguration/loadAllWorkFlowLevels";
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

  saveWorkFlow(data: any): any {
    return this.http.post(this.save_workFlow_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadWorkFlow(): any {
    return this.http.post(this.loadWorkFlow_url, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllWorkFlow(): any {
    return this.http.post(this.loadAllWorkFlow_url, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  isExist(id): any {
    return this.http.post(this.levelIsExist_url, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}
