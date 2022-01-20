import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { MasterDynamicWorkFlowConfigDTO } from './../../models/model';
@Injectable()
export class WorkFlowConfigurationDynamicFormService {

  url_load_level_for_work_flow: string = this.helper.common_URL + 'dynamicForm/loadNumberOfLevelsForMasterDynamicForm';
  url_save_work_flow_config_master: string = this.helper.common_URL + 'workFlow/saveWorkFlowLevelForMasterDynamicForm';
  url_load_all: string = this.helper.common_URL + 'workFlow/loadWorkFlowConfigDataOfMasterDynamicForm';
  url_deactivate_workflow_config: string = this.helper.common_URL + 'workFlow/deactivateLevelOfMasterDynamicForm';
  url_load_users_for_work_flow: string = this.helper.common_URL + 'dynamicForm/loadUsersForMasterDynamicForm';

  constructor(private config: ConfigService, private helper: Helper, private http: Http) { }


  loadNumberOfLevelsForMasterDynamicForm(masterDynamicId: any) {
    return this.http.post(this.url_load_level_for_work_flow, masterDynamicId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadUserBasedOnRolesAndMasterFormDept(list,masterFormId){
    return this.http.post(this.url_load_users_for_work_flow, {'masterFormId':masterFormId,'roles':list}, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  saveData(workFlowDto: MasterDynamicWorkFlowConfigDTO) {
    return this.http.post(this.url_save_work_flow_config_master, workFlowDto, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  loadAll(id:any) {
    return this.http.post(this.url_load_all, id, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  deactivate(dto:any) {
    return this.http.post(this.url_deactivate_workflow_config, dto, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }



}
