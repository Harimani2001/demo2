import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
@Injectable()
export class BatchCreationService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'batchCreation/savebatch';
  url_load: string = this.helper.common_URL + 'batchCreation/loadAllBatchs';
  url_delete: string = this.helper.common_URL + 'batchCreation/deleteBatchById';
  url_edit: string = this.helper.common_URL + 'batchCreation/loadBatchById';
  url_loadForms: string = this.helper.common_URL + 'batchCreation/loadForms';
  url_loadBatchStatus: string = this.helper.common_URL + 'batchCreation/loadBatchStatus';
  url_downloadExcel: string = this.helper.common_URL + 'batchCreation/sampleExcel';
  url_extractExcelFile: string = this.helper.common_URL + 'batchCreation/extractExcelFile';
  url_saveBulk: string = this.helper.common_URL + 'batchCreation/saveBulk';

  createBatch(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadForms(data: any) {
    return this.http.post(this.url_loadForms, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadBatchStatus() {
    return this.http.post(this.url_loadBatchStatus, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  downloadSampleBatchFile() {
    return this.http.post(this.url_downloadExcel, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAll() {
    return this.http.post(this.url_load, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteBatch(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  editBatch(data: any) {
    return this.http.post(this.url_edit, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  extractExcelFile(formData: any) {
    return this.http.post(this.url_extractExcelFile, formData, this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveBulk(list) {
    return this.http.post(this.url_saveBulk, list, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}