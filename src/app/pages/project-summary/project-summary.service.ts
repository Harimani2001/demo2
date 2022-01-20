import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
@Injectable()
export class ProjectSummaryService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_load: string = this.helper.common_URL + 'projectsetup/getProjectSummary';
  url_load_vsr_summary: string = this.helper.common_URL + 'projectsetup/getVSRSummary';
  url_documentSummary_lock: string = this.helper.common_URL + 'workflowConfiguration/checkforadocumentType';
  url_load_version: string = this.helper.common_URL + 'projectsetup/getProjectVersions';
  permission_for_docLock: string = this.helper.common_URL + 'common/permissionForDocLockForProjectSummary';
  url_to_projectFileSize: string = this.helper.common_URL + 'projectsetup/projectSize';

  loadProjectSummary(versionId) {
    return this.http.post(this.url_load, versionId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadVSRSummary() {
    return this.http.post(this.url_load_vsr_summary, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  docLockStatus(constant, versionId) {
    return this.http.post(this.url_documentSummary_lock, { constantName: constant, versionId: versionId }, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  docLockPermissions(constant, versionId) {
    const formdata: FormData = new FormData();
    formdata.append('constant', constant);
    formdata.append("version", versionId);
    return this.http.post(this.permission_for_docLock, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.text())
      .catch(res => {
        return "";
      });
  }

  loadProjectVersions(projectId) {
    return this.http.post(this.url_load_version, projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadProjectFTPSize(data: any): any {
    return this.http.post(this.url_to_projectFileSize, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}
