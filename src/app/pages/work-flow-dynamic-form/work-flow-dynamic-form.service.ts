import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Helper } from '../../shared/helper';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class WorkFlowDynamicFormService {

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_load_data_for_work_flow: string = this.helper.common_URL + 'masterFormWorkFlow/loadMasterFormForWorkFlow';
  url_load_doc_status: string = this.helper.common_URL + 'common/getDocStatus';
  url_level_approve_submit: string = this.helper.common_URL + 'masterFormWorkFlow/saveMasterWorkFlowData';
  url_load_comments_log: string = this.helper.common_URL + 'masterFormWorkFlow/masterWorkFlowCommentLog';
  url_form_limit: string = this.helper.common_URL + 'dynamicForm/canCreateFormForOrganization';
  url_mapping_dynamic_form_load_all: string = this.helper.common_URL + 'dynamicForm/loadAllMasterDynamicFormGrouping';
  url_mapping_dynamic_form_load_by_id: string = this.helper.common_URL + 'dynamicForm/loadByIdMasterDynamicFormGrouping';
  url_mapping_dynamic_form_save_or_update: string = this.helper.common_URL + 'dynamicForm/saveOrUpdateMasterDynamicFormGrouping';
  url_previewFileIfAttached: string = this.helper.common_URL + 'common/previewFileIfAttached';
  url_checkWorkFlowStartedForFormGroup: string = this.helper.common_URL + 'workflowConfiguration/checkWorkFlowStartedForFormGroup';
  url_save_masterFormDates: string = this.helper.common_URL + 'dynamicForm/saveMasterFormDates';
  url_import_json_file: string = this.helper.common_URL + 'dynamicForm/importDynamicForm';

  loadMasterFormForWorkFlow(departmentId:any) {
    return this.http.get(this.url_load_data_for_work_flow+'?deptId='+Number(departmentId), this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDocStatus(id: any, docType: any) {
    const formdata: FormData = new FormData();
    formdata.append('docType', docType);
    formdata.append('id', id);
    return this.http.post(this.url_load_doc_status, formdata, this.config.getRequestOptionArgs())
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

  canCreateForm() {
    return this.http.post(this.url_form_limit, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllMasterDynamicFormGrouping() {
    return this.http.post(this.url_mapping_dynamic_form_load_all, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadByIdMasterDynamicFormGrouping(id) {
    return this.http.post(this.url_mapping_dynamic_form_load_by_id, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveOrUpdateMasterDynamicFormGrouping(dto) {
    return this.http.post(this.url_mapping_dynamic_form_save_or_update, dto, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  previewFileIfAttached(json: { 'globalProjectId': number; 'flag': boolean; 'key': any; }) {
    return this.http.post(this.url_previewFileIfAttached, json, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  checkWorkFlowStartedForFOrmGroup(id) {
    return this.http.post(this.url_checkWorkFlowStartedForFormGroup, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  
  saveMasterFormDates(data: any) {
    return this.http.post(this.url_save_masterFormDates, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  extractJSONFile(formData: any) {
    return this.http.post(this.url_import_json_file, formData, this.config.getRequestOptionArgs())
        .map((resp) => resp.json()).catch(res => {
            return Observable.throw(res.json());
        });
}

}
