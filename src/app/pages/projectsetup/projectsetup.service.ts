import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { ProjectSetup } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class projectsetupService {

  constructor(private http: Http, public config: ConfigService) { }
  url_save: string = this.config.helper.common_URL + 'projectsetup/createnew';
  url_All_load: string = this.config.helper.common_URL + 'projectsetup/loadAllproject';
  url_edit: string = this.config.helper.common_URL + 'projectsetup/editproject';
  url_delete: string = this.config.helper.common_URL + 'projectsetup/deleteproject';
  load_users_url: string = this.config.helper.common_URL + 'projectsetup/loadUsersByProject';
  load_workFlow_url: string = this.config.helper.common_URL + 'projectsetup/loadWorkFlowUsers';
  url_publish: string = this.config.helper.common_URL + 'projectsetup/publish';
  url_documents_order: string = this.config.helper.common_URL + 'projectsetup/loadDocumentOrderList';
  url_create_projectUsingWizard: string = this.config.helper.common_URL + 'projectsetup/createProjectUsingWizard';
  url_loadAllDocumentsByProjectId: string = this.config.helper.common_URL + 'projectsetup/loadAllDocumentsByProjectId';
  url_static_documents_order: string = this.config.helper.common_URL + 'projectsetup/loadStaticDocumentOrderList';
  url_save_default_project: string = this.config.helper.common_URL + 'projectsetup/setDefaultproject';
  url_project_limit: string = this.config.helper.common_URL + 'projectsetup/canCreateProjectForOrganization';
  url_load_workFlow_levels: string = this.config.helper.common_URL + 'workflowConfiguration/loadWorkFlowLevels';
  url_loadProjectSummaryStepper3: string = this.config.helper.common_URL + 'projectsetup/loadProjectSummaryStepper3';
  url_isExistsProjectName: string = this.config.helper.common_URL + 'projectsetup/isExistsProjectName';
  url_loadDocumentSummary: string = this.config.helper.common_URL + 'projectsetup/loadDocumentSummary';
  url_pushToDms: string = this.config.helper.common_URL + 'projectsetup/pushProjectsetupPDFtoDMS';
  url_loadDocument_for_currentProject: string = this.config.helper.common_URL + 'projectsetup/loadProjectApprovalCountOfDocument';
  url_saveSystemDescription: string = this.config.helper.common_URL + 'projectsetup/saveSystemDescription';
  url_loadSystemDescription: string = this.config.helper.common_URL + 'projectsetup/loadSystemDescription';
  url_to_findApplicationFileSize: string = this.config.helper.common_URL + 'organization/organizationData';
  url_load_project_for_inventory = this.config.helper.common_URL + 'projectsetup/loadProjectDetailsForInventoryReport';
  inventory_report_excel_export_url = this.config.helper.common_URL + 'projectsetup/inventoryReportExcelExport';
  url_inventory_download_pdf: string = this.config.helper.common_URL + 'projectsetup/inventoryReportPdfDownload';
  url_loadCurrentLocationOfProject: string = this.config.helper.common_URL + 'projectsetup/loadCurrentLocationOfProject';
  url_isExistsGxpForProject: string = this.config.helper.common_URL + 'projectsetup/isExistsGxpForProject';

  //projectsetup --save
  createproject(data: ProjectSetup, wizzardFlag) {
    let url = (!wizzardFlag) ? this.url_save : this.url_create_projectUsingWizard;
    return this.http.post(url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveSystemDescription(data: any) {
    return this.http.post(this.url_saveSystemDescription, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadSystemDescription(data: any) {
    return this.http.post(this.url_loadSystemDescription, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  //projectsetup --load
  loadAllproject(locationId, page, tab, statusList) {
    return this.http.post(this.url_All_load + "/" + locationId + "/" + page + "/" + tab, statusList, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  //projectsetup --edit
  editproject(id: any) {
    return this.http.post(this.url_edit, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  //projectsetup --delete
  deleteproject(id: any) {
    return this.http.post(this.url_delete, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadUsersByProject(projectId: any) {
    return this.http.post(this.load_users_url, projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadWorkFlowConfig(data: any) {
    return this.http.post(this.load_workFlow_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  publishProjects(data: any) {
    return this.http.post(this.url_publish, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDocumentOrderList() {
    return this.http.post(this.url_documents_order, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  createprojectUsingWizard(data: ProjectSetup) {
    return this.http.post(this.url_create_projectUsingWizard, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllDocumentsByProjectId(data: any) {
    return this.http.post(this.url_loadAllDocumentsByProjectId, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadStaticDocumentOrderList(projectId: any) {
    return this.http.post(this.url_static_documents_order, projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveDefaultProject(data: any) {
    return this.http.post(this.url_save_default_project, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  ListOfRulesForUser() {
    return this.http.post(this.config.helper.common_URL + 'user/LoadEmailSettings', "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  SaveRulesForUser(row: any) {
    return this.http.post(this.config.helper.common_URL + 'user/SaveEmailSettings', row, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadWorkFlowLevels(): any {
    return this.http.post(this.url_load_workFlow_levels, '', this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  canCreateProject() {
    return this.http.post(this.url_project_limit, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadProjectSummaryStepper3(projectId) {
    return this.http.post(this.url_loadProjectSummaryStepper3, projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  isExistsProjectName(projectName) {
    return this.http.post(this.url_isExistsProjectName, projectName, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDocumentSummary(documentType) {
    return this.http.post(this.url_loadDocumentSummary, documentType, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  pushToDms(projectId: any) {
    return this.http.post(this.url_pushToDms, projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllDocumentofproject() {
    return this.http.post(this.url_loadDocument_for_currentProject, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  applicationFileSize(data: any): any {
    return this.http.post(this.url_to_findApplicationFileSize, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadProjectDetailsForInventory() {
    return this.http.post(this.url_load_project_for_inventory, '', this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  inventoryReportExcelExport() {
    return this.http.post(this.inventory_report_excel_export_url, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  generateInventoryPdf(status,location,year) {
    return this.http.post(this.url_inventory_download_pdf+"/"+location+"/"+year, status, this.config.getRequestOptionArgs())
      .map((resp) => resp)
      .catch(res => {
        return Observable.throw(res);
      });
  }

  //load Current location Details of Project
  loadCurrentLocationOfProject() {
    return this.http.post(this.url_loadCurrentLocationOfProject, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  isExistsGxpForProject(projectId) {
    return this.http.post(this.url_isExistsGxpForProject, projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}
