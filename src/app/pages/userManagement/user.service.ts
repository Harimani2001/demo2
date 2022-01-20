
import { User } from '../../models/model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Http } from '@angular/http';
import { Helper } from '../../../app/shared/helper';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class UserService {

  url_saveEmployeeDetails: string = this.helper.common_URL + "user/userRegistration";
  url_loadAllUserBasedOnOrganization: string = this.helper.common_URL + "user/loadAllUserBasedOnOrganization";
  url_loadAllUsersForTemplatesAndForms: string = this.helper.common_URL + "user/loadAllUsersForTemplatesAndForms";
  url_deleteEmployee: string = this.helper.common_URL + "user/deleteUser";
  url_getEmpForEdit: string = this.helper.common_URL + "user/loadUserBasedOnId";
  saveEmployeeURL: string = this.helper.common_URL + "user/saveUser";
  getUserNameURL: string = this.helper.saas_URL + "/user/isUsernameExists";
  getEmailURL: string = this.helper.saas_URL + "/user/isUserEmailExists";
  getOrganizationListURL: string = this.helper.common_URL + "organization/loadOrganizationDetails";
  loadAllUserBasedOnDepartmentURL: string = this.helper.common_URL + "user/loadAllUserBasedOnDepartmentIds";
  checkLicenceAndUserCreationLimitURL: string = this.helper.common_URL + "user/checkLicenceAndUserCreationLimit";
  loadAllUserBasedOnProjectURL: string = this.helper.common_URL + "user/loadAllUserBasedOnProject";
  signSave: string = this.helper.common_URL + "user/saveSign";
  url_project_doc_new: string = this.helper.common_URL + 'workflowConfiguration/getDocumentForProject'
  loadFlowDataForProjectDocument_url: string = this.helper.common_URL + 'workflowConfiguration/loadFlowDataForNotificationSetting';
  saveFlowDataForProjectDocument_url: string = this.helper.common_URL + 'workflowConfiguration/savelevelNotificationSettingData';
  url_loadAllModulesForUser = this.helper.common_URL + "user/loadUserShortcuts";
  url_saveAllModulesForUser = this.helper.common_URL + "user/saveUserShortcuts";
  url_downloadExcel: string = this.helper.common_URL + 'user/sampleExcel';
  url_extractExcelFile: string = this.helper.common_URL + 'user/extractExcelFile';
  url_saveBulkUsers: string = this.helper.common_URL + "user/saveBulkUsers";
  getFirstNameURL: string = this.helper.common_URL + "user/isFirstNameExists";
  getLastNameURL: string = this.helper.common_URL + "user/isLastNameExists";
  getListOfAdminURL: string = this.helper.common_URL + "user/listOfAdmin";
  sendEmailForAdminURL: string = this.helper.common_URL + "user/emailForRequestPermission";
  url_isUserUsed: string = this.helper.common_URL + 'user/isUserUsed';

  constructor(private http: Http, private helper: Helper, public config: ConfigService) { }

  saveAndGoto(Employee: User) {
    Employee.active = "y";
    return this.http.post(this.saveEmployeeURL, Employee, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveBulkUsers(list) {
    return this.http.post(this.url_saveBulkUsers, list, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllUserBasedOnOrganization() {
    return this.http.post(this.url_loadAllUserBasedOnOrganization, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json()
      )
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllUsersForTemplatesAndForms() {
    return this.http.post(this.url_loadAllUsersForTemplatesAndForms, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json()
      )
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  updateEmployee(editableEmployee: User) {
    return this.http.post(this.saveEmployeeURL, editableEmployee, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteEmployee(deleteableEmployee: User) {
    return this.http.post(this.url_deleteEmployee, deleteableEmployee, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getDataForEdit(employee: any) {
    return this.http.post(this.url_getEmpForEdit, employee, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  onChangeGetUserDetails(username: any) {
    return this.http.post(this.getUserNameURL, username, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  onChangeGetEmailDetails(email: any) {
    return this.http.post(this.getEmailURL, email, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getOrganizationList() {
    return this.http.post(this.getOrganizationListURL, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json()
      )
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllUserBasedOnDepartment(deaprtmentId) {
    return this.http.post(this.loadAllUserBasedOnDepartmentURL, deaprtmentId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json()
      )
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  checkLicenceAndUserCreationLimit() {
    return this.http.post(this.checkLicenceAndUserCreationLimitURL, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllUserBasedOnProject() {
    return this.http.post(this.loadAllUserBasedOnProjectURL, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveUserSign(sign: any) {
    return this.http.post(this.signSave, sign, this.config.getRequestOptionArgs()).map((resp) => resp.json()).catch(res => {
      return Observable.throw(res.json());
    })
  }

  loadFlowData(data: any): any {
    return this.http.post(this.loadFlowDataForProjectDocument_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveFlowData(data: any): any {
    return this.http.post(this.saveFlowDataForProjectDocument_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllModulesForUser() {
    return this.http.post(this.url_loadAllModulesForUser, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveAllModulesForUser(data: any) {
    return this.http.post(this.url_saveAllModulesForUser, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  downloadSampleUserFile() {
    return this.http.post(this.url_downloadExcel, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }

  extractExcelFile(formData: any) {
    return this.http.post(this.url_extractExcelFile, formData, this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }

  onChangeGetFirstNameDetails(CheckUser: User) {
    return this.http.post(this.getFirstNameURL, CheckUser, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  onChangeGetLastNameDetails(CheckUser: User) {
    return this.http.post(this.getLastNameURL, CheckUser, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getAllAdminUser() {
    return this.http.post(this.getListOfAdminURL, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  sendEmailForRequest(data: any) {
    return this.http.post(this.sendEmailForAdminURL, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  userIsUsed(userId) {
    return this.http.post(this.url_isUserUsed, userId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}
