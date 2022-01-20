import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class SmtpSetupMasterService {
    constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

    url_saveEmailConfig:string = this.helper.common_URL + 'emailConfig/save';
    url_getOrgList:string = this.helper.common_URL + 'organization/getOrgList';
    url_getEmailConfig:string = this.helper.common_URL + 'emailConfig/getEmailConfig';
    url_testEmailConfig:string = this.helper.common_URL + 'emailConfig/testEmail';

    saveEmailConfig(data:any){
        return this.http.post(this.url_saveEmailConfig, data ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    getOrgList(data:any){
        return this.http.post(this.url_getOrgList, data ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    getEmailConfigBasedOnOrgId(data:any){
        return this.http.post(this.url_getEmailConfig, data ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    testMail(data:any){
        return this.http.post(this.url_testEmailConfig, data ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }
}