import { Injectable } from '@angular/core';
import {Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { RiskAssessment } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class RiskAssessmentService {

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'risk-assessment/save';
  url_load: string = this.helper.common_URL + 'risk-assessment/load';
  url_delete: string = this.helper.common_URL + 'risk-assessment/delete';
  url_edit: string = this.helper.common_URL + 'risk-assessment/edit';
  url_Mapped_testcase: string = this.helper.common_URL + 'risk-assessment/getTestCaseMappingDetails';
  url_load_risk: string = this.helper.common_URL + 'risk-assessment/loadRiskDataOnTab';
  url_loadAllRiskData: string = this.helper.common_URL + 'risk-assessment/loadAllRiskData';
  url_loadAllPublishedRiskData: string = this.helper.common_URL + 'risk-assessment/loadAllPublishedRisks';
  getDefaultRiskAssessmentDetailsURL: string = this.helper.common_URL + 'risk-assessment/loadDefaultRiskAssessment';
  excel_export_url: string = this.helper.common_URL + 'risk-assessment/excelExport';
  url_publish: string = this.helper.common_URL + 'risk-assessment/publish';
  singleurl_publish: string = this.helper.common_URL + 'risk-assessment/singlePublish';
  url_load_RiskMasterNames: string = this.helper.common_URL + 'risk-assessment/getRiskMasterNames';
  url_load_RPNlookupValues: string = this.helper.common_URL + 'risk-assessment/getCategoryItemByNameForRisk';
  url_load_all_priority: string = this.helper.common_URL + 'priority/loadAllPriorityDetails';
  url_load_preview_document: string = this.helper.common_URL + "risk-assessment/downloadRiskDocument";
  url_load_preview_for_multiple_document: string = this.helper.common_URL + "pdfSetting/downloadMultipleDocument";
  create(data: RiskAssessment) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  load() {
    return this.http.post(this.url_load, '', this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  delete(testCaseData: RiskAssessment) {
    return this.http.post(this.url_delete, testCaseData, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  edit(data: any) {
    return this.http.post(this.url_edit, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  mappedTestCaseDetails(data: any) {
    return this.http.post(this.url_Mapped_testcase, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadRiskDataOnTab(page,tabName) {
    return this.http.post(this.url_load_risk+"/"+page,tabName, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllRiskData() {
    return this.http.post(this.url_loadAllRiskData,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllPublishedRiskData() {
    return this.http.post(this.url_loadAllPublishedRiskData,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDefaultRiskAssessment() {
    return this.http.post(this.getDefaultRiskAssessmentDetailsURL,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  excelExport() {
    return this.http.post(this.excel_export_url,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  publishRiskAssessment(data: any) {
    return this.http.post(this.url_publish, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  singlePublishRiskAssessment(data: any) {
    return this.http.post(this.singleurl_publish, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  loadRiskMasterNames() {
    return this.http.post(this.url_load_RiskMasterNames, '', this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadRiskLookupValues(lookUpCategory) {
    return this.http.post(this.url_load_RPNlookupValues, {"categoryName":lookUpCategory,"orgId":0}, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllPriority(){
    return this.http.post(this.url_load_all_priority,"",this.config.getRequestOptionArgs())
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
  loadPreviewForMultipleDocument(docExtention:any,docType:any){
    let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
    if (options.headers == null) {
      options.headers = new Headers();
    }
    const formdata: FormData = new FormData();
    formdata.append('docExtention', docExtention);
    formdata.append('docType', docType);
    options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    return this.http.post(this.url_load_preview_for_multiple_document, formdata, options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
  }
}
