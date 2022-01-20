import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class IndividualDocumentSummaryService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  Api(data, url) {
    return this.http.post(this.helper.common_URL + url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }
  getApi(url) {
    return this.http.get(this.helper.common_URL + url, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }
}