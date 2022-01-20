import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
import * as Bowser from "bowser";
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response, ResponseContentType } from '@angular/http';

@Injectable()
export class ElectronicSignatureService {
  userAgent: any;
  constructor(private http: Http, public helper: Helper, public config: ConfigService) {
    this.userAgent = Bowser.parse(window.navigator.userAgent);
   }

  postApi(data, url) {
    return this.http.post(this.helper.common_URL + url, data, this.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }

  getApi(url) {
    return this.http.get(this.helper.common_URL + url,this.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }

  getRequestOptionArgs(options?: RequestOptionsArgs): any {
    if (options == null) {
        options = new RequestOptions();
    }
    if (options.headers == null) {
        options.headers = new Headers();
        options.headers.append('Api-User-Agent', this.convertinostring(this.userAgent));
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
}