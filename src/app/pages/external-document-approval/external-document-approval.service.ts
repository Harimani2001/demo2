import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
import * as Bowser from "bowser";
import { Headers, Http, RequestOptions, RequestOptionsArgs } from '@angular/http';
@Injectable()
export class ExternalDocumentApprovalComponentService {
  userAgent: any;
  url_single_file_upload= this.helper.common_URL + 'externalApproval/saveFileForSingleFileUpload';
  load_getCurrentDate = this.helper.common_URL + 'externalApproval/getCurrentDate';
  getOrgName_URL: string = this.helper.saas_URL+"/company/fetchDbDetailsById/";
  constructor(private http: Http, public helper: Helper, public config: ConfigService) {
    this.userAgent = Bowser.parse(window.navigator.userAgent);
   }

  postApi(data, url,tenant) {
    return this.http.post(this.helper.common_URL + url, data, this.getRequestOptionArgs(tenant))
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }
  getApi(url,tenant) {
    return this.http.get(this.helper.common_URL + url,this.getRequestOptionArgs(tenant))
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }

  getTenantName(orgId) {
    return this.http.get(this.getOrgName_URL+orgId)
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }
  getRequestOptionArgs(orgName:string,options?: RequestOptionsArgs): any {
    if (options == null) {
        options = new RequestOptions();
    }
    if (options.headers == null) {
        options.headers = new Headers();
        options.headers.append('Api-User-Agent', this.convertinostring(this.userAgent));
        options.headers.append('X-tenant',orgName);
    }
    return options;
}
convertinostring(userAgent) {
  let data = "";
  let browserdata = userAgent.browser.name + " - " + userAgent.browser.version;
  let os = userAgent.os.name + " " + userAgent.os.versionName;
  let device = userAgent.platform.type;
  data = "browser:" + browserdata + ",os:" + os + ",device:" + device;
  return data;
}

singleFileUpload(formdata){
  let options = new RequestOptions();
  options.headers = new Headers();
  options.headers.append('Accept', 'application/json');
  
  return this.http.post(this.url_single_file_upload, formdata,options)
  .map((resp) => resp.json())
  .catch(res => {
      return Observable.throw(res.json());
  });
}

getCurrentDate(orgId,date,tenant) {
  return this.http.post(this.load_getCurrentDate+"/"+orgId, date == undefined ? 0 : date, this.getRequestOptionArgs(tenant))
      .map((resp) => resp.text())
      .catch(res => {
          return '';
      });
}
}