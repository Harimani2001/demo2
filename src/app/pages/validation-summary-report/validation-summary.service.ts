import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { VsrDTO } from "../../models/model";
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class VsrService {
    constructor(private http: Http, public helper: Helper,public config:ConfigService) { }

    url_saveReport:string = this.helper.common_URL + 'validationReport/saveReport';
    url_getAllReport:string = this.helper.common_URL + 'validationReport/getAllReport';
    url_deleteRecord:string = this.helper.common_URL + 'validationReport/deleteById';
    url_publishRecord:string = this.helper.common_URL + 'validationReport/publishRecord';
    url_getRecordById:string = this.helper.common_URL + 'validationReport/getRecordById';
    url_getRecordByProjectId:string = this.helper.common_URL + 'validationReport/getRecordByProject';
    url_getDocLockStatus:string = this.helper.common_URL + 'validationReport/getDocumentLockStatus';
    url_download_pdf:string = this.helper.common_URL + 'common/downloadPdfForVSR';

    saveReport(data:any){
        return this.http.post(this.url_saveReport, data ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    getAllReports(){
        return this.http.post(this.url_getAllReport,"" ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    deleteReport(id:any){
        return this.http.post(this.url_deleteRecord,id,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    publishRecord(data:any){
        return this.http.post(this.url_publishRecord,data,this.config.getRequestOptionArgs())
        .map((resp)=>resp.json())
        .catch(res =>{
            return Observable.throw(res.json());
        })
    }

    getReportById(id:any){
        return this.http.post(this.url_getRecordById, id ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    getReportByProjectId(){
        return this.http.post(this.url_getRecordByProjectId,"" ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    getdocLockStatus(id){
        return this.http.post(this.url_getDocLockStatus,id ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    generatePdf() {
        return this.http.post(this.url_download_pdf,"",this.config.getRequestOptionArgs())
          .map((resp) => resp)
          .catch(res => {
            return Observable.throw(res);
          });
      }

    
}