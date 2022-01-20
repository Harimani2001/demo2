import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, RequestOptionsArgs, Response, ResponseContentType } from '@angular/http';
import { NavigationEnd, Router } from '@angular/router';
import * as Bowser from "bowser";
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Config } from './config';
import { Helper } from './helper';

@Injectable()
export class ConfigService {

    private configUrl = this.helper.common_URL + 'admin/getPermissionBasedOnRoleId';
    private loadDocumentsOrderUrl = this.helper.common_URL + 'projectsetup/loadStaticDocumentOrderList';
    check_session_URL: string = this.helper.common_URL + 'user/checkSession';
    public config: Config;
    private routingPermission: string = this.helper.common_URL + 'common/routingPermission'
    url_load_current_user: string = this.helper.common_URL + 'user/loadCurrentUserDetails';
    url_load_org_date: string = this.helper.common_URL + 'common/loadOrgDate'
    save_default_project_url: string = this.helper.common_URL + 'user/saveDefaultProjectForUser';
    load_permissions_for_module = this.helper.common_URL + 'admin/getModulePermissionBasedOnRoleId';
    load_getCurrentDate = this.helper.common_URL + 'common/getCurrentDate';
    url_load_project = this.helper.common_URL + 'projectsetup/loadproject';
    url_loadprojectOfUserAndCreator = this.helper.common_URL + 'projectsetup/loadprojectOfUserAndCreator';
    url_saveCurrentProject = this.helper.common_URL + 'projectsetup/saveCurrentProject'
    url_project_doc_new: string = this.helper.common_URL + 'workflowConfiguration/getDocumentForProject'
    url_project_doc_new_approval: string = this.helper.common_URL + 'workflowConfiguration/getDocumentsOfProjectForUserForApproval';
    url_project_doc_users_new: string = this.helper.common_URL + 'workflowConfiguration/getAllUsersForProjectAndDocumentType'
    url_to_load_comment_log: string = this.helper.common_URL + 'common/loadDocumentStatusCommentLog';
    url_onClickFirst: string = this.helper.common_URL + 'common/onClickFirst'
    url_onClickNext: string = this.helper.common_URL + 'common/onClickNext'
    url_onClickLast: string = this.helper.common_URL + 'common/onClickLast'
    url_onClickPrevious: string = this.helper.common_URL + 'common/onClickPrevious'
    url_isWorkflowDocumentOrderSequence: string = this.helper.common_URL + 'common/isWorkflowDocumentOrderSequence';
    url_isUserInWorkFlow: string = this.helper.common_URL + 'common/userIsInWorkFlow';
    is_MultiplePDF: string = this.helper.common_URL + 'common/isMultiplePDF'
    check_module_permission_URL: string = this.helper.common_URL + 'modules/checkIndividualModulePermission';
    url_forpdfgeneration: string = this.helper.common_URL + 'workFlow/getPdfViewForDocumentStatus';
    url_validEsignUser: string = this.helper.common_URL + 'workFlow/validEsignUser'
    url_getAllDocumentsForProject: string = this.helper.common_URL + 'workflowConfiguration/getAllDocumentsForProject';
    url_load_org_modules: string = this.helper.common_URL + 'organization/loadModulesForOrg';
    check_Form_group_module_permission_URL: string = this.helper.common_URL + 'modules/checkGroupFormModulePermission';
    url_loadprojectOfUserAndCreator_forlocation = this.helper.common_URL + 'projectsetup/loadProjectOfUserAndCreatorForLocation';
    url_loadAllProjectsForSftpDropDown = this.helper.common_URL + 'projectsetup/loadProjectsForSftpDropDown';
    userAgent: any;
    url_getdocumentStepper: string = this.helper.common_URL + 'workFlow/getDocumentTimeLine';
    url_changeReviewDate: string = this.helper.common_URL + 'validationReport/changeReviewDate';
    url_loadDocumentForumCodes: string = this.helper.common_URL + 'documentForum/loadDocumentForumCodes';
    url_disablePopUpModel: string = this.helper.common_URL + 'user/disablePopUpModel';

    constructor(public http: Http, public helper: Helper, private router: Router) {
        this.userAgent = Bowser.parse(window.navigator.userAgent);
    }

    loadDocumentOrderList() {
        return this.http.post(this.loadDocumentsOrderUrl, '', this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getPermssionsExists(data: string) {
        if (this.helper.isEmpty(this.config)) {
            return false;
        } else {
            for (var i = 0; i < this.config.permissions.length; i++) {
                if (this.config.permissions[i].permissionValue == data) {
                    return true;
                }
            }
        }
    }

    isPermissionExist(url: string) {
        return this.http.post(this.routingPermission, url, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    getCategoryItem(category: string, key: string) {
        let item = '';
        for (let cat of this.config.categories[category]) {
            if (cat.code == key) {
                return cat.value;
            }
        }
        return item;
    }

    isTokenPresent(): boolean {
        if (localStorage.getItem('token'))
            return true;
        return false;
    }

    loadPermissionForLoggedInUser(): any {
        return this.http.post(this.configUrl, '', this.getRequestOptionArgs()).map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadOrgModules(): any {
        return this.http.post(this.url_load_org_modules, '', this.getRequestOptionArgs()).map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadPermissionsBasedOnModule(permissionConstant: any, groupFormPermission?, groupId?): any {
        return this.http.post(this.load_permissions_for_module, { permissionConstant: permissionConstant, groupFormPermission: groupFormPermission == undefined ? '' : groupFormPermission, groupId: groupId == undefined ? '' : groupId }, this.getRequestOptionArgs()).map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getRequestOptionArgs(options?: RequestOptionsArgs): any {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        if (localStorage.getItem('token')) {
            options.headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
            options.headers.append('Api-User-Agent', this.convertinostring(this.userAgent));
            options.headers.append('X-Frame-Options', 'SAMEORIGIN');          
        } else {
            this.router.navigate(["/login"]);   
        }
        options.headers.append('X-tenant',localStorage.getItem("tenant"));
        options.headers.append('X-Frame-Options', 'SAMEORIGIN');   
        return options;
    }

    getRequestOptionArgsForOrganizationCreation(tenant:any,options?: RequestOptionsArgs): any {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        if (localStorage.getItem('token')) {
           options.headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
            options.headers.append('Api-User-Agent', this.convertinostring(this.userAgent));
            options.headers.append('X-Frame-Options', 'SAMEORIGIN');   
        } else {
            this.router.navigate(["/login"]);
        }
        options.headers.append('X-tenant',tenant);
        options.headers.append('X-Frame-Options', 'SAMEORIGIN');   
        return options;
    }

    getRequestOptionArgsForLogin(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.append('Api-User-Agent', this.convertinostring(this.userAgent));
        options.headers.append('X-tenant',localStorage.getItem("tenant"));
        options.headers.append('X-Frame-Options', 'SAMEORIGIN');   
        return options;
    }

    getRequestOptionArgsForLoginCall(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.append('Api-User-Agent', this.convertinostring(this.userAgent));
        options.headers.append('X-tenant',localStorage.getItem("tenant"));
        options.headers.append('X-Frame-Options', 'SAMEORIGIN');   
        return options;
    }


    getRequestOptionArgsForsession(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.append('X-tenant',localStorage.getItem("tenant"));
        options.headers.append('X-Frame-Options', 'SAMEORIGIN');   
        return options;
    }

    convertinostring(userAgent) {
        let data = "";
        let browserdata = userAgent.browser.name + " - " + userAgent.browser.version;
        let os = userAgent.os.name + " " + userAgent.os.versionName;
        let device = userAgent.platform.type;
        data = "browser:" + browserdata + ",os:" + os + ",device:" + device;
        return data;
    }

    getRequestOptionArgsForFile(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
        options.headers.append('Content-Type', 'multipart/form-data');
        options.headers.append('Accept', 'application/json');
        options.headers.append('X-tenant',localStorage.getItem("tenant"));
        options.headers.append('X-Frame-Options', 'SAMEORIGIN');   
        return options;
    }

    checkSessionIfNotRedirectToLogin() {
        this.checkSession().subscribe(jsonResp => {
        },
            err => {
                if (null != localStorage.getItem('token')) {
                    this.router.navigate(['/MainMenu'])
                }
                else {
                    this.router.navigate(['/login'])
                }
            });
    }

    checkSession(): Observable<any[]> {
        return this.http.post(this.check_session_URL, '', this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadCurrentUserDetails() {
        return this.http.post(this.url_load_current_user, '', this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    disablePopUpModel() {
        return this.http.post(this.url_disablePopUpModel, '', this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    generatePdfForDocStatus(docType: any, ispending: any) {
        const formdata: FormData = new FormData();
        formdata.append('docType', docType);
        formdata.append("ispendingDoc", ispending)
        return this.http.post(this.url_forpdfgeneration, formdata, this.getRequestOptionArgs())
            .map((resp) => resp)
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getOrginDate(date: any) {
        return this.http.post(this.url_load_org_date, date, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    saveDefaultProjectForUser(data: any) {
        return this.http.post(this.save_default_project_url, data, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getCurrentDate(date?) {
        return this.http.post(this.load_getCurrentDate, date == undefined ? 0 : date, this.getRequestOptionArgs())
            .map((resp) => resp.text())
            .catch(res => {
                return '';
            });
    }

    saveCurrentProject(data: any) {
        return this.http.post(this.url_saveCurrentProject, data, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadProject() {
        return this.http.post(this.url_load_project, '', this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadprojectOfUserAndCreator() {
        return this.http.post(this.url_loadprojectOfUserAndCreator, '', this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadAllDocumentsForProject(projectId?) {
        return this.http.post(this.url_getAllDocumentsForProject, projectId == undefined ? "" : projectId, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadDocBasedOnProject(projectId?) {
        return this.http.post(this.url_project_doc_new, projectId == undefined ? "" : projectId, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getAllUsersForProjectAndDocumentType(projectId?, documentType?) {
        const formdata: FormData = new FormData();
        formdata.append('projectIdString', projectId == undefined ? "" : projectId);
        formdata.append("documentType", documentType == undefined ? "" : documentType)
        return this.http.post(this.url_project_doc_users_new, formdata, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getDocumentsOfProjectForUserForApproval() {
        return this.http.post(this.url_project_doc_new_approval, '', this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getFirstData(id: any, type: any) {
        const formdata: FormData = new FormData();
        formdata.append('docType', type);
        formdata.append("id", id)
        return this.http.post(this.url_onClickFirst, formdata, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getLastData(id: any, type: any) {
        const formdata: FormData = new FormData();
        formdata.append('docType', type);
        formdata.append("id", id)
        return this.http.post(this.url_onClickLast, formdata, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getNextData(id: any, type: any) {
        const formdata: FormData = new FormData();
        formdata.append('docType', type);
        formdata.append("id", id)
        return this.http.post(this.url_onClickNext, formdata, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getPreviousData(id: any, type: any) {
        const formdata: FormData = new FormData();
        formdata.append('docType', type);
        formdata.append("id", id)
        return this.http.post(this.url_onClickPrevious, formdata, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadDocumentCommentLog(id, type, mappingId?, projectName?) {
        var mapping = true;
        if (mappingId === undefined || mappingId === 0) {
            mapping = false;
        }
        if (!projectName) {
            projectName = null;
        }
        return this.http.post(this.url_to_load_comment_log, { "docId": id, "docTye": type, "mapping": mapping, "mappingId": mappingId, "projectName": projectName }, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    checkIndividualModulePermission(permissionConstant) {
        return this.http.post(this.check_module_permission_URL, permissionConstant, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    checkGroupFormModulePermission(mappingId) {
        return this.http.post(this.check_Form_group_module_permission_URL, mappingId, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadChangeControlFormDropDown() {
        return this.http.post(this.helper.common_URL + 'ccf/loadChangeControlFormDropDown', '', this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    isWorkflowDocumentOrderSequence(documentType: any) {
        return this.http.post(this.url_isWorkflowDocumentOrderSequence, documentType, this.getRequestOptionArgs())
            .map((resp) => resp.text())
            .catch(res => {
                return '';
            });
    }

    isUserInWorkFlow(documentType: any) {
        return this.http.post(this.url_isUserInWorkFlow, documentType, this.getRequestOptionArgs())
            .map((resp) => resp.json()
            ).catch(res => {
                return Observable.throw(res.json());
            });
    }

    validEsignUser(data) {
        return this.http.post(this.url_validEsignUser, data, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    isMultiplePDF(documentType: any) {
        return this.http.post(this.is_MultiplePDF, documentType, this.getRequestOptionArgs())
            .map((resp) => resp.json()
            ).catch(res => {
                return Observable.throw(res.json());
            });
    }

    HTTPPostAPI(data, url) {
        return this.http.post(this.helper.common_URL + url, data, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
    HTTPGetAPI(url) {
        return this.http.get(this.helper.common_URL + url, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    HTTPPostAPIFile(url: string, data): any {
        let options = this.getRequestOptionArgs();
        options.responseType = ResponseContentType.ArrayBuffer;
        return this.http.post(this.helper.common_URL + url, data, options)
            .map((response: Response) => response.arrayBuffer())
            .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
            .first();
    }

    loadprojectOfUserAndCreatorForLocation(location: any,projectStatus?:any) {
        if (location) {
            if(projectStatus == undefined)
                projectStatus=true;
            return this.http.post(this.url_loadprojectOfUserAndCreator_forlocation+"/"+projectStatus, location, this.getRequestOptionArgs())
                .map((resp) => resp.json())
                .catch(res => {
                    return Observable.throw(res.json());
                });
        }
    }

    loadAllProjectsForSftpDropDown(location: any) {
        if (location) {
            return this.http.post(this.url_loadAllProjectsForSftpDropDown, location, this.getRequestOptionArgs())
                .map((resp) => resp.json())
                .catch(res => {
                    return Observable.throw(res.json());
                });
        }
    }

    subscription(router: Router) {
        router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        return router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                router.navigated = false;
            }
        });
    }

    getOrgDateFormat() {
        return this.http.post(this.helper.common_URL + 'organization/getOrgDateFormat', "", this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loaddocumentStepper(data) {
        return this.http.post(this.url_getdocumentStepper, data, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    changeReviewDate(projectId: any, date: any, comment: string) {
        const formdata: FormData = new FormData();
        formdata.append('projectId', projectId);
        formdata.append("date", date);
        formdata.append("comment", comment);
        return this.http.post(this.url_changeReviewDate, formdata, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadDocumentForumCodes(documentType: any) {
        return this.http.post(this.url_loadDocumentForumCodes, documentType, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    downloadFileGetAPI(url) {
        return this.http.get(this.helper.common_URL + url, this.getRequestOptionArgs())
            .map((resp) => resp)
            .catch(res => {
                return Observable.throw(res);
            });
    }

    checkIsValidFileSize(size) {
        return this.http.get(this.helper.common_URL + "common/checkIsValidFileSize/" + size, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res);
            });
    }

    saveUserPreference(documentType: any, tabName: any, json?: {}) {
        return this.http.post(this.helper.common_URL + "common/saveUserPreference/" + documentType + '/' + tabName, json ? json : {}, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res);
            });
    }

    getUserPreference(documentType: any) {
        return this.http.get(this.helper.common_URL + "common/getUserPreference/" + documentType, this.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res);
            });
    }

}
