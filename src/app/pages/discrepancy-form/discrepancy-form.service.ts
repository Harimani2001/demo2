import { Injectable } from '@angular/core';
import { Http,RequestOptions, ResponseContentType, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class DiscrepancyFormRoutesService {

    constructor(private http: Http, public helper: Helper,public config:ConfigService) { }

    url_getStatus: string = this.helper.common_URL + 'discrepancy/getStatus';
    url_saveDfData:string = this.helper.common_URL + 'discrepancy/saveDF';
    url_getFailDocument:string = this.helper.common_URL + 'discrepancy/failDoc';
    url_getDFData:string = this.helper.common_URL + 'discrepancy/getDfData';
    url_getDFDataById:string = this.helper.common_URL + 'discrepancy/getDfDataById';
    url_isTestCaseCreated:string = this.helper.common_URL + 'discrepancy/isVersionCreated';
    url_deleteData:string = this.helper.common_URL + 'discrepancy/deleteDfById';
    url_publishData:string = this.helper.common_URL + 'discrepancy/publish';
    url_getVideoFile:string = this.helper.common_URL + 'discrepancy/getVideo';
    url_getImageFile:string = this.helper.common_URL + 'discrepancy/getImage';
    url_delete_file:string=this.helper.common_URL+'discrepancy/deleteFile'
    url_save_checklist: string = this.helper.common_URL + "discrepancy/saveCheckList";
    URL_DF_DropDown_List: string = this.helper.common_URL + "discrepancy/getAllDFDropDownListForProject";

    getDFStatus() {
        return this.http.post(this.url_getStatus, "",this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    saveDF(DFData :any) {
        return this.http.post(this.url_saveDfData, DFData,this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    deleteFile(id, dfId){
        const formdata: FormData = new FormData();
        formdata.append("id", id);
        formdata.append("dfId", dfId);
        return this.http.post(this.url_delete_file, formdata, this.config.getRequestOptionArgs())
          .map((resp) => resp.json())
          .catch(res => {
            return Observable.throw(res.json());
          });
      }

    populateFailDocument(testCaseStatus:any,testCaseId:any){
        let data ={"testCasesStatus":testCaseStatus,"testCaseId":testCaseId}
        return this.http.post(this.url_getFailDocument, data,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }


    getDfData(tabId){
        return this.http.post(this.url_getDFData, tabId,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }
    
    deleteFormData(deleteObj:any){
        return this.http.post(this.url_deleteData,deleteObj,this.config.getRequestOptionArgs())
        .map((resp)=>resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    getDfDataById(id:any){
        return this.http.post(this.url_getDFDataById,id,this.config.getRequestOptionArgs())
        .map((resp)=>resp.json())
        .catch(res =>{
            return Observable.throw(res.json());
        })
    }

    isTestCaseCreated(id:any){
        return this.http.post(this.url_isTestCaseCreated,id,this.config.getRequestOptionArgs())
        .map((resp)=>resp.json())
        .catch(res =>{
            return Observable.throw(res.json());
        })
    }

    publishTestCases(data:any){
        return this.http.post(this.url_publishData,data,this.config.getRequestOptionArgs())
        .map((resp)=>resp.json())
        .catch(res =>{
            return Observable.throw(res.json());
        })
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
  saveCheckList(data: any) {
    return this.http.post(this.url_save_checklist, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getAllDFDropDownListForProject(projectId?){
    return this.http.post(this.URL_DF_DropDown_List,projectId?projectId: "",this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }


}
