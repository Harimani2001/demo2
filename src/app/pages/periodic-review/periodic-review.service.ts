import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class PeriodicReviewService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_load: string = this.helper.common_URL + 'periodicReview/loadAllDocuments';
  url_save: string = this.helper.common_URL + 'periodicReview/saveReviewDatesForDocuments';
  url_save_doc_version:string = this.helper.common_URL + 'periodicReview/savedocVersion';

  loadDocuments(projectId:any) {
    return this.http.post(this.url_load,projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  saveReviewDatesForDocuments(list:any) {
    return this.http.post(this.url_save,list, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveDocumentVersion(list:any) {
    return this.http.post(this.url_save_doc_version,list, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}