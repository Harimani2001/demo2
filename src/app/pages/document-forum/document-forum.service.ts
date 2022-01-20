import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
@Injectable()
export class DocumentForumService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'documentForum/saveDocumentForum';
  url_user_like: string = this.helper.common_URL + 'documentForum/saveUserLike';
  url_load: string = this.helper.common_URL + 'documentForum/loadAllDocumentForum';
  url_delete: string = this.helper.common_URL + 'documentForum/deleteDocumentForum';
  url_isCommentsForDocument: string = this.helper.common_URL + 'documentForum/isCommentsForDocument';
  url_strickComment: string = this.helper.common_URL + 'documentForum/strickComment';
  url_loadExternalApprovalDetails: string = this.helper.common_URL + 'externalApproval/loadExternalApprovalDetails';
  url_project_doc_users_new: string = this.helper.common_URL + 'externalApproval/getAllUsersForProjectAndDocumentType'
  url_project_doc_users: string = this.helper.common_URL + 'documentForum/getAllUsersForProjectAndDocumentType'

  createDocumentForum(data: any, isExterApproval: boolean) {
    return this.http.post(this.url_save, data, isExterApproval ? this.config.getRequestOptionArgsForLogin() : this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteDocumentForum(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveuserLikes(data: any) {
    return this.http.post(this.url_user_like, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDocumentForum(documentType: any, itemId: any, documentId: any, pageNo: any, versionId: any, isExterApproval: boolean, groupingFlag, isShowCheckedItems) {
    const formdata: FormData = new FormData();
    formdata.append('documentType', documentType);
    formdata.append('itemId', itemId);
    formdata.append('documentId', documentId);
    formdata.append('pageNo', pageNo);
    formdata.append('versionId', versionId);
    formdata.append('groupingFlag', groupingFlag);
    formdata.append('checkedFlag', isShowCheckedItems);
    return this.http.post(this.url_load, formdata, isExterApproval ? this.config.getRequestOptionArgsForLogin() : this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  isCommentsForDocument(documentType: any, documentId: any) {
    const formdata: FormData = new FormData();
    formdata.append('documentType', documentType);
    formdata.append('documentId', documentId);
    return this.http.post(this.url_isCommentsForDocument, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  strickComment(id: any, isExterApproval: boolean) {
    return this.http.get(this.url_strickComment + "/" + id, isExterApproval ? this.config.getRequestOptionArgsForLogin() : this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadExternalApprovalDetails(id: any) {
    return this.http.get(this.url_loadExternalApprovalDetails + "/" + id, this.config.getRequestOptionArgsForLogin())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getAllUsersForProjectAndDocumentType(projectId?, documentType?) {
    const formdata: FormData = new FormData();
    formdata.append('projectIdString', projectId == undefined ? "" : projectId);
    formdata.append("documentType", documentType == undefined ? "" : documentType)
    return this.http.post(this.url_project_doc_users_new, formdata, this.config.getRequestOptionArgsForLogin())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllUsersForProjectAndDocumentType(projectId?, documentType?, documentId?) {
    const formdata: FormData = new FormData();
    formdata.append('projectIdString', projectId == undefined ? "" : projectId);
    formdata.append("documentType", documentType == undefined ? "" : documentType)
    formdata.append("documentId", documentId == undefined ? "" : documentId)
    return this.http.post(this.url_project_doc_users, formdata, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}