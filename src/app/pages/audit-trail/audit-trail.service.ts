import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Http, Response } from '@angular/http';
import { Helper } from './../../shared/helper';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class AuditTrailService {

  getemailHistorylistURL: string = this.helper.common_URL + "common/loademailhistory";
  getauditlistURL: string = this.helper.common_URL + "common/loadAuditTrail";
  getDataBasedOnDateRangeURL: string = this.helper.common_URL + "common/loadAuditTrailOnDateRange"
  getDataBasedOn_permissionsConstants: string = this.helper.common_URL + "common/loadAuditTrailBasedOnPermission"
  getDataBasedOn_permissionsConstants_id: string = this.helper.common_URL + "common/loadAuditTrailBasedOnPermissionAndId"
  csvDownloadaudit: string = this.helper.common_URL + "common/csvExportAudit"
  url_download_pdf: string = this.helper.common_URL + 'common/downloadPDFServiceAuditrial';
  url_to_get_projectList: string = this.helper.common_URL + 'projectsetup/loadprojectOfUserAndCreator';
  getauditlistURLByLoginUser: string = this.helper.common_URL + "common/loadAuditTrailByLoginUser";
  utl_get_eventLIST: string = this.helper.common_URL + "common/loadEvents";

  constructor(private http: Http, public helper: Helper,public config:ConfigService) { }

  getAuditList() {
    return this.http.post(this.getauditlistURL, "",this.config.getRequestOptionArgs())
      .map(resp => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }


  getEmailHistoryDataBasedOnDateRange(data: any) {
    return this.http.post(this.getemailHistorylistURL, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getDataBasedOnDateRange(data: any) {
    return this.http.post(this.getDataBasedOnDateRangeURL, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getDataBasedOnPermissionConstants(data: any) {
    return this.http.post(this.getDataBasedOn_permissionsConstants, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getDataBasedOnPermissionConstantsAndId(permission,id) {
    const formdata: FormData = new FormData();
    formdata.append('id', id);
    formdata.append("permission", permission)
    return this.http.post(this.getDataBasedOn_permissionsConstants_id, formdata,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  csvDownloadAudit(data: any) {
    return this.http.post(this.csvDownloadaudit, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  generatePdf() {
    return this.http.post(this.url_download_pdf, "",this.config.getRequestOptionArgs())
      .map((resp) => resp)
      .catch(res => {
        return Observable.throw(res);
      });
  }
  getAuditListByLoginUser() {
    return this.http.post(this.getauditlistURLByLoginUser, "",this.config.getRequestOptionArgs())
      .map(resp => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getProjectList() {
    return this.http.post(this.url_to_get_projectList, "",this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res);
      });
  }

  getEvent(modal: any) {
    return this.http.post(this.utl_get_eventLIST, modal,this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res);
    });
  }

}
