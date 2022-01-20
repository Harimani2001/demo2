import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { Department } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class DepartmentService {

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'department/save';
  url_load: string = this.helper.common_URL + 'department/load';
  url_loadDepartmentOnProject: string = this.helper.common_URL + 'department/loadDepartmentOnProject';
  url_loadDepartmentOnLocation: string = this.helper.common_URL + 'department/loadDepartmentOnLocation';
  url_delete: string = this.helper.common_URL + 'department/delete';
  url_edit: string = this.helper.common_URL + 'department/edit';
  url_isDepartmentUsed: string = this.helper.common_URL + 'department/isDepartmentUsed';
  url_loadDepartmentsbyMultipleLocations: string = this.helper.common_URL + 'department/loadDepartmentsbyMultipleLocations';

  createDepartment(data: Department) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDepartment() {
    return this.http.post(this.url_load, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDepartmentOnLocation(locationId: any) {
    return this.http.post(this.url_loadDepartmentOnLocation, locationId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDepartmentOnProjectId(projectId: any) {
    return this.http.post(this.url_loadDepartmentOnProject, projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteDepartment(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  editDepartment(data: any) {
    return this.http.post(this.url_edit, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  departmentIsUsed(departmentId) {
    return this.http.post(this.url_isDepartmentUsed, departmentId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDepartmentsbyMultipleLocations(locationIds: any) {
    return this.http.post(this.url_loadDepartmentsbyMultipleLocations, locationIds, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}
