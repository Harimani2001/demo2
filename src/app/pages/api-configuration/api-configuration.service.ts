import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class ApiConfigurationService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'apiConfiguration/saveApiConfiguration';
  url_load: string = this.helper.common_URL + 'apiConfiguration/loadAll';
  url_delete: string = this.helper.common_URL + 'apiConfiguration/deleteById';
  url_loadByProjectAndDocument: string = this.helper.common_URL + 'apiConfiguration/loadByProjectAndDocument';
  url_loadAllForms: string = this.helper.common_URL + 'projectsetup/loadAllFormForProject';
  url_loadFormJsonData: string = this.helper.common_URL + 'apiConfiguration/loadFormJsonData';
  url_getAPIData: string = this.helper.common_URL + 'apiConfiguration/getAPIData';
  url_getAPIDataForForm: string = this.helper.common_URL + 'apiConfiguration/getAPIDataForForm';
  url_getAPIParameters: string = this.helper.common_URL + 'apiConfiguration/getAPIParameters';
  url_getAPIConstants: string = this.helper.common_URL + 'apiConfiguration/getAPIConstants';

  saveApiConfiguration(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAll() {
    return this.http.post(this.url_load,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteById(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadByProjectAndDocument(projectId:any,documentType:any) {
    const formdata: FormData = new FormData();
    formdata.append('projectId', projectId);
    formdata.append('documentType', documentType);
    return this.http.post(this.url_loadByProjectAndDocument, formdata, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  loadAllForms(projectId:any) {
    return this.http.post(this.url_loadAllForms,projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadFormJsonData(projectId:any,docType:any,mappingId:any){
    const formdata: FormData = new FormData();
    formdata.append('docType', docType);
    formdata.append('mappingId', mappingId);
    formdata.append('projectId', projectId);
    return this.http.post(this.url_loadFormJsonData, formdata, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  getAPIData(data: any) {
    return this.http.post(this.url_getAPIData, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  getAPIDataForForm(data: any) {
    return this.http.post(this.url_getAPIDataForForm, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  getAPIParameters(mappingId:any,docType:any){
    const formdata: FormData = new FormData();
    formdata.append('mappingId', mappingId);
    formdata.append('docType', docType);
    return this.http.post(this.url_getAPIParameters, formdata, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  getAPIConstants(){
    return this.http.post(this.url_getAPIConstants, '', this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
}