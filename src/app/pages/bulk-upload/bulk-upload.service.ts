import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class BulkUploadService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_document_list: string = this.helper.common_URL + 'admin/loadDocumentsForBulkUpload';
  url_file_exist: string = this.helper.common_URL + 'common/checkAttachFileExists';

  downloadSampleFile(url: any,data:any) {
    return this.http.post(this.helper.common_URL + url,data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }
  saveBulkDocuments(formData: any, url: any) {
    return this.http.post(this.helper.common_URL + url, formData, this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadDocumentsList() {
    return this.http.post(this.url_document_list, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }
  saveBulkDocumentsForForms(formData: any, url: any) {
    return this.http.post(this.helper.common_URL + url, formData, this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }
  isFileExists(templateName: any) {
    return this.http.post(this.url_file_exist, templateName, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}