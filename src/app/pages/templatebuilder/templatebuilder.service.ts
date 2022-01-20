import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
import { templateBuilder } from '../../models/model';
@Injectable()
export class TemplateBuiderService {
    constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

    url_saveEmailTemplate: string = this.helper.common_URL + 'emailTemplate/save';
    url_loadEmailTemplateList: string = this.helper.common_URL + 'emailTemplate/loadTemplateList';
    url_loadTemplate: string = this.helper.common_URL + 'emailTemplate/loadTemplate';
    url_delete: string = this.helper.common_URL + 'emailTemplate/delete';
    url_email: string = this.helper.common_URL + 'emailTemplate/testEmail';
    url_email_workflow_reminder: string = this.helper.common_URL + 'workFlow/sendreminder';
    url_email_setting: string = this.helper.common_URL + 'emailTemplate/savedefaultitems';
    url_email_setting_load: string = this.helper.common_URL + 'emailTemplate/Load';
    url_isTemplateUsed:string = this.helper.common_URL + 'emailTemplate/isTemplateUsed';

    saveEmailTemplate(data: templateBuilder) {
        return this.http.post(this.url_saveEmailTemplate, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getEmailTemplateBasedOnOrgId() {
        return this.http.post(this.url_loadEmailTemplateList, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadSettingsListByProjectId(data: any) {
        return this.http.post(this.url_email_setting_load, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getmodal(data: any) {
        return this.http.post(this.url_loadTemplate, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    deletemodal(data: any) {
        return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    saveSettings(data: any) {
        return this.http.post(this.url_email_setting, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    test(data: any) {
        return this.http.post(this.url_email, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
   
    sendReminder(data: any) {
        return this.http.post(this.url_email_workflow_reminder, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    templateIsUsed(templateId){
        return this.http.post(this.url_isTemplateUsed, templateId, this.config.getRequestOptionArgs())
          .map((resp) => resp.json())
          .catch(res => {
            return Observable.throw(res.json());
          });
      }

}
