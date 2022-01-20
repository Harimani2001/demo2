import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class TaskReportService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

  url_load_all_project: string = this.helper.common_URL + 'projectsetup/loadprojectOfUserAndCreator';
  url_loadAllData_for_project: string = this.helper.common_URL +'taskReport/loadIndividualtaskData';

  loadAllProjects() {
    return this.http.post(this.url_load_all_project,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadData(projectIds:any,apiUrl:string){
    return this.http.post(this.helper.common_URL +apiUrl,projectIds, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  loadDataByDateRange(data:any,apiUrl:string){
    return this.http.post(this.helper.common_URL +apiUrl,data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  loadProjectData(flag:boolean,location?,projectIds?){
    if(!location){
      location="0";
    }
    let data = {"flag": flag, "location":location, "projectIds":projectIds}
    return this.http.post(this.url_loadAllData_for_project,data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  
  downloadExcel(selectedStatusIds:any,url:string){
    return this.http.post(this.helper.common_URL +url,selectedStatusIds, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  
}