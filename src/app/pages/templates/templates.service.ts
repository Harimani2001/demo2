import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Helper } from '../../shared/helper';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
import { MasterDynamicWorkFlowConfigDTO } from '../../models/model';
@Injectable()
export class TemplateService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'dynamicTemplate/saveMasterTemplate';
  url_template_load: string = this.helper.common_URL + 'dynamicTemplate/loadTemplate';
  url_delete: string = this.helper.common_URL + 'dynamicTemplate/deleteMasterTemplate';
  url_edit: string = this.helper.common_URL + 'dynamicTemplate/editMasterTemplate';
  url_template_exist: string = this.helper.common_URL + 'dynamicTemplate/isExists';
  url_published_template_load: string = this.helper.common_URL + 'dynamicTemplate/loadPublishedMasterDynamicTemplate';
  url_load_level_for_template: string = this.helper.common_URL + 'dynamicTemplate/loadNumberOfLevelsForMasterDynamicTemplate';
  url_load_all: string = this.helper.common_URL + 'masterTemplateWorkFlow/loadWorkFlowConfigDataOfMasterDynamicTemplate';
  url_save_work_flow_config_master = this.helper.common_URL + 'masterTemplateWorkFlow/saveWorkFlowLevelForMasterDynamicTemplate';
  url_load_data_for_work_flow: string = this.helper.common_URL + 'masterTemplateWorkFlow/loadMasterTemplateForWorkFlow';
  url_level_approve_submit: string = this.helper.common_URL + 'masterTemplateWorkFlow/saveMasterWorkFlowData';
  url_load_comments_log: string = this.helper.common_URL + 'masterTemplateWorkFlow/masterWorkFlowCommentLog';
  url_save_masterTemplateDates: string = this.helper.common_URL + 'dynamicTemplate/saveMasterTemplateDates';
  url_load_users_for_work_flow: string = this.helper.common_URL + 'dynamicTemplate/loadUsersForMasterDynamicTemplates';


  createMasterDynamicTemplate(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadTemplate() {
    return this.http.post(this.url_template_load, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteTemplate(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });

  }

  editDynamicTemplate(id: any) {
    return this.http.post(this.url_edit, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });

  }

  isTemplateExists(templateName: any) {
    return this.http.post(this.url_template_exist, templateName, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadPublishedMasterDynamicTemplate() {
    return this.http.post(this.url_published_template_load, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadNumberOfLevelsForMasterDynamicTemplate(masterDynamicId: any) {
    return this.http.post(this.url_load_level_for_template, masterDynamicId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAll(id: any) {
    return this.http.post(this.url_load_all, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }


  saveWorkFlowData(workFlowDto: MasterDynamicWorkFlowConfigDTO) {
    return this.http.post(this.url_save_work_flow_config_master, workFlowDto, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  levelApproveSubmit(row: any) {
    return this.http.post(this.url_level_approve_submit, row, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadLogOfMasterFormWorkFlow(id: any) {
    return this.http.post(this.url_load_comments_log, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadMasterTemplateForWorkFlow(departmentId: any) {
    return this.http.get(this.url_load_data_for_work_flow + '?deptId=' + Number(departmentId), this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveMasterTemplateDates(data: any) {
    return this.http.post(this.url_save_masterTemplateDates, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadUserBasedOnRolesAndMasterTemplateDept(list, masterTemplateId) {
    return this.http.post(this.url_load_users_for_work_flow, { 'masterTemplateId': masterTemplateId, 'roles': list }, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  
}