import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';

@Injectable()
export class MasterControlService {

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_saveOrUpdateFormExtendToDocument: string = this.helper.common_URL + 'formExtend/saveOrUpdateFormExtendToDocument';
  url_loadFormExtendDocumentsOfTheProject: string = this.helper.common_URL + 'formExtend/loadFormExtendDocumentsOfTheProject';
  url_loadFormExtendOfTheProjectParticularDocument: string = this.helper.common_URL + 'formExtend/loadFormExtendOfTheProjectParticularDocument';
  url_loadJsonOfDocumentIfActive: string = this.helper.common_URL + 'formExtend/loadJsonOfDocumentIfActive';

  saveFormExtendToDocument(data: any) {
    return this.http.post(this.url_saveOrUpdateFormExtendToDocument, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  loadFormExtendDocumentsOfTheProject(projectId) {
    return this.http.post(this.url_loadFormExtendDocumentsOfTheProject, projectId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });

  }

  loadFormExtendOfTheProjectParticularDocument(projectId, documentConstant) {
    return this.http.post(this.url_loadFormExtendOfTheProjectParticularDocument, { projectId: projectId, documentConstant: documentConstant }, this.config.getRequestOptionArgs())
      .map((resp) => resp.json().dto)
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadJsonOfDocumentIfActive(documentConstant) {
    return this.http.post(this.url_loadJsonOfDocumentIfActive, documentConstant, this.config.getRequestOptionArgs())
    .map((resp) => resp.json().dto)
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
}

