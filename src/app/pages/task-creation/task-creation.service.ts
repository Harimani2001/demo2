import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()

export class TaskCreationService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'projectTask/saveTask';
  url_reAssignTaskUsers: string = this.helper.common_URL + 'projectTask/reAssignTaskUsers';
  url_load: string = this.helper.common_URL + 'projectTask/loadAllTasks';
  url_loadOpenInProgressTasksForProjDocs: string = this.helper.common_URL + 'projectTask/loadAllOpenInProgressTasksForProjectDocuments';
  url_loadbasedOnid: string = this.helper.common_URL + 'projectTask/loadTaskById';
  url_delete: string = this.helper.common_URL + 'projectTask/deleteTaskById';
  url_load_document_ids: string = this.helper.common_URL + 'projectTask/loadAllDcoumentIds';
  url_complete_task: string = this.helper.common_URL + 'projectTask/completeTask';
  url_status_change: string = this.helper.common_URL + 'projectTask/statusChange';
  url_file_upload: string = this.helper.common_URL + 'projectTask/saveUploadedFile';
  url_file_delete: string = this.helper.common_URL + 'projectTask/deleteFile';
  url_save_timer: string = this.helper.common_URL + 'projectTask/saveTimer';
  url_load_Equipments_For_Forms: string = this.helper.common_URL + 'projectTask/loadEquipmentForForms';
  url_load_Time_Tracking_data: string = this.helper.common_URL + 'projectTask/loadTimeTracking';
  url_load_tasks_for_document: string = this.helper.common_URL + 'projectTask/loadTasksForDocument';
  url_loadTaskTimeSheetForDateRange: string = this.helper.common_URL + 'projectTask/loadTaskTimeSheetForDateRange';
  url_loadTaskStatistics: string = this.helper.common_URL + 'projectTask/loadTaskStatistics';

  createTask(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  reAssignTaskUsers(data: any) {
    return this.http.post(this.url_reAssignTaskUsers, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadTasks() {
    return this.http.post(this.url_load, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadOpenInProgressTasksForProjDocs() {
    return this.http.post(this.url_loadOpenInProgressTasksForProjDocs, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadTasksBasedOnId(id) {
    return this.http.post(this.url_loadbasedOnid, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteTask(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllDocumentIds(data: any) {
    return this.http.post(this.url_load_document_ids, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  completeTask(data: any) {
    return this.http.post(this.url_complete_task, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  statusChange(data: any) {
    return this.http.post(this.url_status_change, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveMultipleFile(formdata, id) {
    formdata.append("id", id)
    return this.http.post(this.url_file_upload, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteFile(id) {
    return this.http.post(this.url_file_delete, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveTimer(data: any) {
    return this.http.post(this.url_save_timer, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadEquipmentForForms(permissionId: String) {
    return this.http.post(this.url_load_Equipments_For_Forms, permissionId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadTimeTrackingData(rowId: String) {
    return this.http.post(this.url_load_Time_Tracking_data, rowId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadTasksForDocument(data: any) {
    return this.http.post(this.url_load_tasks_for_document, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadTaskTimeSheetForDateRange(data: any) {
    return this.http.post(this.url_loadTaskTimeSheetForDateRange, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadTaskStatistics(projectId: any) {
    return this.http.post(this.url_loadTaskStatistics, projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}