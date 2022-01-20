import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
@Injectable()
export class EmailTemplateConfigService {
    constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

    url_saveEmailTemplate:string = this.helper.common_URL + 'emailTemplate/save';
    url_loadEmailTemplate:string = this.helper.common_URL + 'emailTemplate/loadTemplate';
    url_getOrgList:string = this.helper.common_URL + 'organization/getOrgList';

    saveEmailTemplate(data:any){
        return this.http.post(this.url_saveEmailTemplate, data ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    getEmailTemplateBasedOnOrgId(data:any){
        return this.http.post(this.url_loadEmailTemplate, data ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }

    getOrgList(){
        return this.http.post(this.url_getOrgList, "" ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }
}