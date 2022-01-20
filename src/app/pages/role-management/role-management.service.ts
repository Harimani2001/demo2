import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { RolePermissionSave } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
@Injectable()
// tslint:disable-next-line:class-name
export class userRoleservice {

    constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
    url_roles: string = this.helper.common_URL + 'common/listOfRoles';
    url_rolesList: string = this.helper.common_URL + 'common/loadListOfRoles';
    url_permission: string = this.helper.common_URL + 'admin/getAdminPermissionsCategory';
    url_save: string = this.helper.common_URL + 'admin/saveRoles';
    saveRolePermissionsUrl: string = this.helper.common_URL + 'admin/saveRolePermission';
    url_edit: string = this.helper.common_URL + 'roles/';
    url_list_of_roles: string = this.helper.common_URL + 'common/loadRoles';
    isRoleNameExists_URL: string = this.helper.common_URL + 'admin/isRoleNameExists';
    loadModulesUrl: string = this.helper.common_URL + 'modules/getmodules';
    saveModulesUrl: string = this.helper.common_URL + 'modules/savemodules';
    url_list_of_roles_if_user_exists: string = this.helper.common_URL + 'common/listofrolesifuserexists';
    listofuserforrolesUrl: string = this.helper.common_URL + 'common/listofuserforroles';
    loadUsersBasedOnRolesAndDepts_url: string = this.helper.common_URL + 'common/loadUsersBasedOnRolesAndDepts';
    url_loadAllUsersAndRolesOnDepartmentIds: string = this.helper.common_URL + 'common/loadAllUsersAndRolesOnDepartmentIds';
    url_isRoleIsMapped: string = this.helper.common_URL + 'common/isRoleIsMapped';
    url_loadUsersForWorkFlowConfig: string = this.helper.common_URL + 'common/loadUsersForWorkFlowConfig';
    url_loadUsersForIndividualWorkFlowConfig: string = this.helper.common_URL + 'common/loadUsersForIndividualWorkFlowConfig';

    loadroles() {
        return this.http.post(this.url_roles, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadrolesList() {
        return this.http.post(this.url_rolesList, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    isRoleIsMapped(roleId) {
        return this.http.post(this.url_isRoleIsMapped, roleId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadUsersBasedOnRolesAndDepts(rolesList, deptList) {
        return this.http.post(this.loadUsersBasedOnRolesAndDepts_url, { 'roles': rolesList, 'departments': deptList }, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadAllUsersAndRolesOnDepartmentIds(deptIds) {
        return this.http.post(this.url_loadAllUsersAndRolesOnDepartmentIds, deptIds, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadListOfusers(ids: any) {
        return this.http.post(this.listofuserforrolesUrl, ids, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadListOfrolesIfUserExists() {
        return this.http.post(this.url_list_of_roles_if_user_exists, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    permission(permissionCategory, roleId) {
        return this.http.post(this.url_permission, ({ "category": permissionCategory, "roleId": roleId }), this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    savePermission(permissionArray: RolePermissionSave) {
        return this.http.post(this.saveRolePermissionsUrl, ({ "rolePermissions": permissionArray }), this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    saveRolePermissions(permissionArray: RolePermissionSave) {
        return this.http.post(this.saveRolePermissionsUrl, permissionArray, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    createRoles(roleName: string, activeFlag, roleId: number, userRemarks?) {
        return this.http.post(this.url_save, ({ "roleName": roleName, "activeFlag": activeFlag, "roleid": roleId, "userRemarks": userRemarks }), this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    editRoles(id: any) {
        return this.http.post(this.url_edit, id, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    isRoleNameExists(data: any) {
        return this.http.post(this.isRoleNameExists_URL, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadListOfroles(orgId: any) {
        return this.http.post(this.url_list_of_roles, orgId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadModules(roleId) {
        return this.http.post(this.loadModulesUrl, roleId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    SaveModules(moduleDto) {
        return this.http.post(this.saveModulesUrl, moduleDto, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
    
    loadUsersForWorkFlowConfig(deptIds, projectId, permissionConstant, levelId) {
        return this.http.post(this.url_loadUsersForWorkFlowConfig + "/" + projectId + "/" + permissionConstant + "/" + levelId, deptIds, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadUsersForIndividualWorkFlowConfig(rolesList, deptList, permissionConstant, documentId, levelId) {
        return this.http.post(this.url_loadUsersForIndividualWorkFlowConfig + "/" + permissionConstant + "/" + documentId + "/" + levelId, { 'roles': rolesList, 'departments': deptList }, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

}
