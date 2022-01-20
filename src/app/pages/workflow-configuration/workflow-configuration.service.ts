import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';

@Injectable()
export class WorkflowConfigurationService {

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_load: string = this.helper.common_URL + 'workflowConfiguration/loadDocumentsFormsTemplates';
  load_workFlow_loadFlowDataForProjectDocument_url: string = this.helper.common_URL + 'workflowConfiguration/loadFlowDataForProjectDocument';
  loadWorkFlow_loadworkFlowSettingsAndUsers_url: string = this.helper.common_URL + 'workflowConfiguration/loadworkFlowSettingsAndUsers';
  loadWorkFlow_loadworkFlowUsersNotificationSettings_url: string = this.helper.common_URL + 'workflowConfiguration/loadworkFlowUsersNotificationSettings';
  save_workFlow_setting_url: string = this.helper.common_URL + 'workflowConfiguration/saveWorkFlowSetting';
  loadWorkFlow_updateLevelOrderOfDocument_url: string = this.helper.common_URL + 'workflowConfiguration/updateLevelOrderOfDocument';
  load_loadAllWorkFlowSettingDataForDocumentForProject_url: string = this.helper.common_URL + 'workflowConfiguration/loadAllWorkFlowSettingDataForDocumentForProject';
  load_updateDocumentOrderOfProject_url : string = this.helper.common_URL + 'workflowConfiguration/updateDocumentOrderOfProject';
  load_deleteDocumentOfProject_url : string = this.helper.common_URL + 'workflowConfiguration/deleteDocumentOfProject';
  load_deleteLevelOfDocument_url : string = this.helper.common_URL + 'workflowConfiguration/deleteLevelOfDocument';
  load_copyConfiguration_url: string = this.helper.common_URL + 'workflowConfiguration/copyConfiguration';
  load_copyConfigurationOfLevel_url: string = this.helper.common_URL + 'workflowConfiguration/copyConfigurationOfLevel';
  load_documentLockUnlock_url: string = this.helper.common_URL + 'workflowConfiguration/documentLockUnlock';
  permission_for_docLock: string = this.helper.common_URL + 'common/permissionForDocLock';
  CommonWorkflow_url: string = this.helper.common_URL + 'workflowConfiguration/commonworkflowforaddingintoproject';
  load_user_based_on_roles_and_project_dept_url:string = this.helper.common_URL + 'workflowConfiguration/loadUserBasedOnRolesAndProjectDept';
  saveFlowFormGroupSettingsForProject_url:string = this.helper.common_URL + 'workflowConfiguration/saveFlowFormGroupSettingsForProject';
  loadFlowFormGroupSettingsForProject_url:string = this.helper.common_URL + 'workflowConfiguration/loadFlowFormGroupSettingsForProject';
  deleteFlowFormGroupSettingsForProject_url:string = this.helper.common_URL + 'workflowConfiguration/deleteFlowFormGroupSettingsForProject';
  saveStaticDocumentSettingsForProject_url:string = this.helper.common_URL + 'workflowConfiguration/saveStaticDocumentSettingsForProject';
  loadStaticDocumentSettingsForProject_url:string = this.helper.common_URL + 'workflowConfiguration/loadStaticDocumentSettingsForProject';
  loadUserPermissions_url:string = this.helper.common_URL + 'workflowConfiguration/loadUserPermissionsForProject';
  loadDepartmentsForProject_url:string = this.helper.common_URL + 'projectsetup/loadDepartmentsForProject/';
  loadUserBasedOnRolesAndProjectDept_url:string = this.helper.common_URL + 'workflowConfiguration/loadUsersBasedOnRolesAndProjectDepartment';

  loadDocumentsFormsTemplates(projectId) {
    return this.http.post(this.url_load, projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  addCommonWorkflowIntoProject(data) {
    return this.http.post(this.CommonWorkflow_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  documentLockUnlock(data:any) {
    return this.http.post(this.load_documentLockUnlock_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  permissionForDocLock(data:any,projectId:any) {
    const formdata: FormData = new FormData();
        formdata.append('permissionConstant', data);
        formdata.append("projectId", projectId)
    return this.http.post(this.permission_for_docLock, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveWorkFlowData(data: any): any {
    return this.http.post(this.save_workFlow_setting_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadFlowData(data: any): any {
    return this.http.post(this.load_workFlow_loadFlowDataForProjectDocument_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadworkFlowSettingsAndUsers(data: any): any {
    return this.http.post(this.loadWorkFlow_loadworkFlowSettingsAndUsers_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadworkFlowUsersNotificationSettings(data: any): any {
    return this.http.post(this.loadWorkFlow_loadworkFlowUsersNotificationSettings_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  updateLevelOrderOfDocument(list:any[]){
    return this.http.post(this.loadWorkFlow_updateLevelOrderOfDocument_url, list, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  loadAllWorkFlowSettingDataForDocumentForProject(modal){
    return this.http.post(this.load_loadAllWorkFlowSettingDataForDocumentForProject_url, modal, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  updateDocumentOrderOfProject(list:any[],projectId){
    return this.http.post(this.load_updateDocumentOrderOfProject_url, {list:JSON.stringify(list) ,projectId:projectId}, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteDocumentOfProject(projectId,documentConstant,isGroupForm,userRemarks){
    return this.http.post(this.load_deleteDocumentOfProject_url, {projectSetupProjectId:projectId ,projectSetupconstantName:documentConstant,flag:isGroupForm,userRemarks:userRemarks}, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteLevelOfDocument(flowId:any,saveType:any,userRemarks){
    return this.http.post(this.load_deleteLevelOfDocument_url, {currentCommonLevel:flowId,saveType:saveType,userRemarks:userRemarks}, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });

  }

  copyConfiguration(list,documentConstant,projectId){
    return this.http.post(this.load_copyConfiguration_url, {'projectId':projectId,'documentConstant':documentConstant,'list':list}, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  copyConfigurationOfLevel(list, item) {
    return this.http.post(this.load_copyConfigurationOfLevel_url, { 'dto': JSON.stringify(item), 'list': list }, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadUserBasedOnRolesAndProjectDept(list,projectId){
    return this.http.post(this.load_user_based_on_roles_and_project_dept_url, {'projectId':projectId,'roles':list}, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  loadUsersBasedOnRolesAndProjectDepartment(rolesList,deptList,projectId){
    return this.http.post(this.loadUserBasedOnRolesAndProjectDept_url, {'projectId':projectId,'roles':rolesList,'departments':deptList}, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  saveFlowFormGroupSettingsForProject(data:any) {
    return this.http.post(this.saveFlowFormGroupSettingsForProject_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadFlowFormGroupSettingsForProject(projectId:any,mappingId:any){
    const formdata: FormData = new FormData();
    formdata.append('projectId', projectId);
    formdata.append('mappingId', mappingId);
    return this.http.post(this.loadFlowFormGroupSettingsForProject_url, formdata, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  deleteFlowFormGroupSettingsForProject(projectId:any,mappingId:any){
    const formdata: FormData = new FormData();
    formdata.append('projectId', projectId);
    formdata.append('mappingId', mappingId);
    return this.http.post(this.deleteFlowFormGroupSettingsForProject_url, formdata, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  saveStaticDocumentSettingsForProject(data:any) {
    return this.http.post(this.saveStaticDocumentSettingsForProject_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadStaticDocumentSettingsForProject(projectId:any){
    return this.http.post(this.loadStaticDocumentSettingsForProject_url, projectId, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  loadUserPermissionsForProject(data:any){
    return this.http.post(this.loadUserPermissions_url, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  loadDepartmentsForProject(projectId){
    return this.http.get(this.loadDepartmentsForProject_url+projectId, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
}
