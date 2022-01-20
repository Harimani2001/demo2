import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, ResponseContentType } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { TestCaseModel } from './../../models/model';
@Injectable()
export class IQTCService {

  constructor(private http: Http, public helper: Helper,public config : ConfigService) { } 
  url_save: string = this.helper.common_URL + 'testCase/saveIqtc';
  url_load: string = this.helper.common_URL + 'testCase/getIqtcDetails';
  url_load_for_navigation: string = this.helper.common_URL + 'testCase/loadDataAfterPublish';
  url_delete: string = this.helper.common_URL + 'testCase/deteleTestCase';
  url_delete_if_file_Upload_fails: string = this.helper.common_URL + 'testCase/deteleTestCaseById';
  url_load_by_id: string = this.helper.common_URL + 'testCase/getIqtcDetailsById';
  url_level_permission: string = this.helper.common_URL + 'workFlow/levelPermission';
  url_pending_list: string = this.helper.common_URL + 'testCase/testcaseWorkFlowPendingList';
  url_get_first: string = this.helper.common_URL + 'testCase/onClickFirst';
  url_get_last: string = this.helper.common_URL + 'testCase/onClickLast';
  url_get_next: string = this.helper.common_URL + 'testCase/onClickNext';
  url_get_previous: string = this.helper.common_URL + 'testCase/onClickPrevious';
  url_videoUpload:string = this.helper.common_URL + 'testCase/uploadVideo';
  url_file_upload:string = this.helper.common_URL + 'testCase/uploadMultipleFile';
  url_audit_for_file:string = this.helper.common_URL + 'testCase/auditForMultiFileUpload';
  url_audit_for_file_download:string = this.helper.common_URL + 'testCase/auditForMultiFileDownload';
  url_file_delete:string = this.helper.common_URL + 'testCase/deleteFile';
  url_imageUpload:string = this.helper.common_URL + 'testCase/uploadImage';
  url_getVideoFile:string = this.helper.common_URL + 'testCase/loadVideo';
  url_getImageFile:string = this.helper.common_URL + 'testCase/loadImage';
  url_updateSatus:string = this.helper.common_URL + 'testCase/updateStatus';
  excel_export_url: string = this.helper.common_URL + 'testCase/excelExport';
  downloadSampleTestCaseFileURL: string = this.helper.common_URL + 'testCase/downloadSampleForTestcase';
  saveBulkTestCaseURL: string = this.helper.common_URL + 'testCase/saveBulkTestCases';
  //Publish URLS
  url_single_publish: string = this.helper.common_URL + 'testCase/singlePublish';
  url_publish: string = this.helper.common_URL + 'testCase/publish';

  url_single_publish_to_master: string = this.helper.common_URL + 'testCase/singlePublishToMaster';
  url_publish_to_master: string = this.helper.common_URL + 'testCase/publishToMaster';

  //
  url_update_checklist: string = this.helper.common_URL + 'testCase/updateChecklist';
  url_loadDF:string = this.helper.common_URL + "discrepancy/getDFData";
  url_load_preview_document: string = this.helper.common_URL + "testCase/downloadTestCaseDocument";
  url_load_preview_for_multiple_document: string = this.helper.common_URL + "pdfSetting/downloadMultipleDocument";
  url_save_checklist: string = this.helper.common_URL + "testCase/saveCheckList";
  url_save_testCaseSummary: string = this.helper.common_URL + "testCase/saveTestCaseSummary";
  url_load_testCaseSummary: string = this.helper.common_URL + "testCase/loadTestCaseSummary";
  url_setTestRun_Active_User:string =  this.helper.common_URL + "testCase/setTestRunActiveOfUser";
  url_loadDFDataForTestcase:string = this.helper.common_URL + "discrepancy/loadDFDataForTestcase";

  //IQTC --save
  createIQTC(data: TestCaseModel) {
    return this.http.post(this.url_save, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  //IQTC --load
  loadIQTC(testCaseType: string,tabId,testRunId?) {
    if(tabId===undefined){
      tabId = "";
    }
    if(!testRunId){
      testRunId="0";
    }
    let data = {"testCaseType": testCaseType,"tabId":tabId,"testRunId":testRunId}
    return this.http.post(this.url_load, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadTestCase(testCaseType: string, tabId,page:any, testRunId?,) {
    if (!tabId) {
      tabId = "";
    }
    if (!testRunId) {
      testRunId = "0";
    }
    let data = { "testCaseType": testCaseType, "tabId": tabId, "testRunId": testRunId };

    return this.http.post(this.helper.common_URL + 'testCase/loadTestCaseBaseOnTab/'+page, data,this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  loadDataAfterPublishForNavigation(testCaseType: string, type :any){
    let data = { "testCaseType": testCaseType,"type":type}
    return this.http.post(this.url_load_for_navigation, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteTestCase(testCaseData:TestCaseModel) {
    return this.http.post(this.url_delete, testCaseData,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteTestCaseById(id) {
    return this.http.post(this.url_delete_if_file_Upload_fails, id,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  updateTestCase(testCaseData: TestCaseModel) {
    return this.http.post(this.url_save, testCaseData,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getDataForEdit(ursId: any,viewFlag:boolean) {
    return this.http.post(this.url_load_by_id+"/"+viewFlag, ursId,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getPendingList(dto) {
    return this.http.post(this.url_pending_list,dto,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getFirstData(ursId: any,viewFlag:boolean){
    return this.http.post(this.url_get_first+"/"+viewFlag,ursId,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getLastData(ursId: any,viewFlag:boolean){
    return this.http.post(this.url_get_last+"/"+viewFlag,ursId ,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getNextData(ursId: any,viewFlag:boolean){
    return this.http.post(this.url_get_next+"/"+viewFlag,ursId ,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getPreviousData(ursId: any,viewFlag:boolean){
    return this.http.post(this.url_get_previous+"/"+viewFlag,ursId,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  excelExport(testCase) {
    return this.http.post(this.excel_export_url,testCase,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  downloadSampleTestCaseFile() {
    return this.http.post(this.downloadSampleTestCaseFileURL,"",this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }
  saveBulkTestCases(formData, headers) {
    let options = new RequestOptions({ headers: headers });
    options.headers.append('Authorization', 'Bearer '+localStorage.getItem("token"));
    return this.http.post(this.saveBulkTestCaseURL, formData, options)
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  publishTestCase(data:any){
    return this.http.post(this.url_single_publish, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  publishTestCases(data: any[]) {
    return this.http.post(this.url_publish, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
 
  publishTestCaseToMaster(data: any) {
    return this.http.post(this.url_single_publish_to_master, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  publishTestCasesToMaster(data: any[]) {
    return this.http.post(this.url_publish_to_master, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  loadDFData(testCaseId: any) {
    return this.http.post(this.url_loadDF, testCaseId, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  saveRecordedVideo(videoFile, documentName, iqId, dfId,documentType){
    const formdata: FormData = new FormData();
    let data = { "documentName": documentName,"iqId":iqId,"dfId":dfId,"fileType":"video","documentType":documentType}
    formdata.append('file', videoFile);
    formdata.append("jsonData", JSON.stringify(data))
    return this.http.post(this.url_videoUpload, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveMultipleFile(formdata, documentName,iqId){
    let data = { "documentName": documentName, "iqId":iqId,"fileType":"file"}
    formdata.append("jsonData", JSON.stringify(data))
    return this.http.post(this.url_file_upload, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveMultipleFileForDiscrepancy(formdata, documentType,documentCode,dfId){
    let data = { "documentName": "discrepancy_form", "iqId":null,"fileType":"file","dfId":dfId,"documentType":documentType,"documentCode":documentCode}
    formdata.append("jsonData", JSON.stringify(data))
    return this.http.post(this.url_file_upload, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  auditForMultipleFile(documentName,fileName,value,docId){
    let data = { "documentName": documentName,"fileName":fileName,"value":value,"id":docId};
    return this.http.post(this.url_audit_for_file, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  auditForMultipleFileDownload(documentName,fileName,value,id){
    let data = { "documentName": documentName,"fileName":fileName,"value":value,"id":id};
    return this.http.post(this.url_audit_for_file_download, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteFile(id, testcaseId){
    const formdata: FormData = new FormData();
    formdata.append("id", id);
    formdata.append("testcaseId", testcaseId);
    return this.http.post(this.url_file_delete, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveScreenShotImage(image, documentName, iqId, dfId){
    const formdata: FormData = new FormData();
    let data = { "documentName": documentName,"iqId":iqId,"dfId":dfId,"fileType":"image"}
    formdata.append('image', image);
    formdata.append("jsonData", JSON.stringify(data))
    return this.http.post(this.url_imageUpload, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadVideoFile(id,fileName){
    const formdata: FormData = new FormData();
    formdata.append('id', id);
    formdata.append("fileName", fileName)
    return this.http.post(this.url_getVideoFile, formdata, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadImageFile(id,fileName){
    const formdata: FormData = new FormData();
    formdata.append('id', id);
    formdata.append("fileName", fileName)
    return this.http.post(this.url_getImageFile, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  updateStatus(status, id){
    const formdata: FormData = new FormData();
    formdata.append('id', id);
    formdata.append("status", status);
    return this.http.post(this.url_updateSatus, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  updateChecklist(data:any) {
    return this.http.post(this.url_update_checklist, data,this.config.getRequestOptionArgs())
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

  saveCheckList(data: any) {
    return this.http.post(this.url_save_checklist, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveTestCaseSummary(data: any) {
    return this.http.post(this.url_save_testCaseSummary, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadTestCaseSummary(data: any) {
    return this.http.post(this.url_load_testCaseSummary, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }


  getFileNameAndURL(file: File): any {
    let imgUrl:any='';
    return new Promise<any>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        imgUrl = reader.result;
        resolve(imgUrl);
      }
      reader.readAsDataURL(file);
    });
  }


  testRunActiveOfUser(docType: String) {
    return new Promise<any>((resolve) => {
      this.config.HTTPPostAPI(docType, "testCase/testRunActiveOfUser").subscribe(resp => {
        resolve(resp);
      }, err => {
        resolve(0);
      })
    });
  }
  
  setTestRunActiveOfUser(taskId: string,) {
    return new Promise<any>((resolve) => {
      this.config.HTTPPostAPI(taskId,"testCase/setTestRunActiveOfUser").subscribe(resp => {
      resolve(resp);
    }, err => {
      resolve(0);
    })
  });
  }
  loadDFDataForTestcase(data: any) {
    return this.http.post(this.url_loadDFDataForTestcase, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  saveDFDataForTestcase(url: any) {
    return this.http.get(this.helper.common_URL + url,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
} 
