import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, ResponseContentType } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AdhocTestCase } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
@Injectable()
export class UnscriptedService {

  constructor(private http: Http, public helper: Helper,public config : ConfigService) { } 
  url_save: string = this.helper.common_URL + 'unscripted/saveUnscriptedTest';
  url_load: string = this.helper.common_URL + 'unscripted/getUnscriptedTestDetails';
  url_load_byId: string = this.helper.common_URL + 'unscripted/getUnscriptedTestDetailsById';
  url_esign: string = this.helper.common_URL + 'unscripted/esign';
  url_validate :string = this.helper.common_URL + 'workFlow/validEsignUser';
  url_summary: string = this.helper.common_URL + 'unscripted/loadDocumentSummaryForUnscriptTest';
  url_publish:string=this.helper.common_URL+'unscripted/publish';
  url_single_publish:string=this.helper.common_URL+'unscripted/singlePublish';
  url_load_preview_document=this.helper.common_URL+'unscripted/previewDocumentForm';
  url_load_byId_For_view: string = this.helper.common_URL + 'unscripted/getUnscriptedTestDetailsForView';
  //Unscripted --save
  createIQTC(data: AdhocTestCase) {
    return this.http.post(this.url_save, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  //Unscripted --load
  loadIQTC(page,data:any) {
    return this.http.post(this.url_load+"/"+page, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDataById(id: string,){
    return this.http.post(this.url_load_byId, id,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDataByIdForView(id: string,){
    return this.http.post(this.url_load_byId_For_view, id,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  esignUnscriptedTestCase(testCaseData: AdhocTestCase) {
    return this.http.post(this.url_esign, testCaseData,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  checkUserIsPresent(data) {
    return this.http.post(this.url_validate, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  summary() {
    return this.http.post(this.url_summary, "",this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  publish(data:any) {
    return this.http.post(this.url_publish, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  singlePublish(data: any) {
    return this.http.post(this.url_single_publish, data, this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
}
loadPreviewDocument(data: any): any {
  let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
  if (options.headers == null) {
    options.headers = new Headers();
  }
  options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
  options.headers.append('X-tenant',localStorage.getItem("tenant"));
  return this.http.post(this.url_load_preview_document, data, options)
    .map((response: Response) => response.arrayBuffer())
    .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
    .first();
}
}