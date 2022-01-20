import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { Projectplan } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
@Injectable()
// tslint:disable-next-line:class-name
export class projectPlanService {

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_loadActualDate: string = this.helper.common_URL + 'projectPlan/loadActualDate';
  url_load_project_plan: string = this.helper.common_URL + 'projectPlan/loadProjectPlanForProject';
  url_calculationForProjectPlan: string = this.helper.common_URL + 'projectPlan/calculationForProjectPlan';
  url_calculationForProjectPlan_OnTargetEndDate: string = this.helper.common_URL + 'projectPlan/calculationForProjectPlanOnTargetEndDate';
  url_saveProjectPlan: string = this.helper.common_URL + 'projectPlan/saveProjectPlanForProject';
  url_projectPlanEmail: string = this.helper.common_URL + 'projectPlan/projectPlanEmail';
  url_projectPlan_for_permissionConstant: string = this.helper.common_URL + 'projectPlan/loadProjectPlanForPermissionConstant';
  excel_export_url: string = this.config.helper.common_URL + "projectPlan/excelExport";

  calculationForProjectPlan(data: any) {
    return this.http.post(this.url_calculationForProjectPlan, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  calculationForProjectPlanOnTargetEndDate(data: any) {
    return this.http.post(this.url_calculationForProjectPlan_OnTargetEndDate, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadActualDate(documentType: any) {
    return this.http.post(this.url_loadActualDate, documentType, this.config.getRequestOptionArgs())
      .map(resp => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadProjectPlan() {
    return this.http.post(this.url_load_project_plan, '', this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveProjectPlan(data: any) {
    return this.http.post(this.url_saveProjectPlan, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  sendProjectPlanEmail(data: any) {
    return this.http.post(this.url_projectPlanEmail, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadProjectPlanForPermissionConstant(permissionConstant: any) {
    return this.http.post(this.url_projectPlan_for_permissionConstant, permissionConstant, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  excelExport() {
    return this.http.post(this.excel_export_url, '', this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}

