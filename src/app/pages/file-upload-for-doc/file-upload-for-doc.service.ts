import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { FileUploadForDoc } from '../../models/model';
@Injectable()
// tslint:disable-next-line:class-name
export class FileUploadForDocService {

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'fileUploadForDoc/saveFileUploadForDoc';
  url_load: string = this.helper.common_URL + 'fileUploadForDoc/loadFilesBasedOnOrgId';
  url_delete: string = this.helper.common_URL + 'fileUploadForDoc/deleteFile';

  saveFileUploadForDoc(form, data) {
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Accept', 'application/json');
    options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    form.append("jsonData", JSON.stringify(data));
    return this.http.post(this.url_save, form, options)
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadFilesBasedOnOrgId(jsonObject: any) {
    return this.http.post(this.url_load, jsonObject, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteFile(data: FileUploadForDoc) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}
