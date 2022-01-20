import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
import { DynamicTemplateDTO } from '../../models/model';
@Injectable()
export class DynamicTemplateService {

  load_file_url: string = this.helper.common_URL + "common/fetchFromFtp";
  url_save_template_for_project: string = this.helper.common_URL + 'dynamicTemplate/saveDynamicTemplate';
  url_load_dynamic_data: string = this.helper.common_URL + 'dynamicTemplate/loadDynamicTemplateForProject'
  url_delete_dynamic_template: string = this.helper.common_URL + 'dynamicTemplate/deleteDynamicTemplate';
  url_dynamic_template_log: string = this.helper.common_URL + 'dynamicTemplate/loadDynamicTemplateLogBasedOnId';
  url_publish: string = this.helper.common_URL + 'dynamicTemplate/publish';
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

  loadFile(fileName: any): any {
    let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    return this.http.post(this.load_file_url, fileName, options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
  }

  saveDynamicTemplateForProject(dynamicTemplate: DynamicTemplateDTO) {
    return this.http.post(this.url_save_template_for_project, dynamicTemplate, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteDynamicTemplate(dynamicTemplate: DynamicTemplateDTO) {
    return this.http.post(this.url_delete_dynamic_template, dynamicTemplate, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDynamicTemplateForProject(jsonData) {
    return this.http.post(this.url_load_dynamic_data, jsonData, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDynamicTemplateLogBasedOnId(jsonData) {
    return this.http.post(this.url_dynamic_template_log, jsonData, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  publish(data: any) {
    return this.http.post(this.url_publish, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}