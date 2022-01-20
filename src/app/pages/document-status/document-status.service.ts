import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class DocStatusService {

    constructor(private http: Http, public helper: Helper,public config:ConfigService) { }

    url_load: string = this.helper.common_URL + 'documentStatus/loadDocStatusListBasedOnProjectId';
    url_changeStatus = this.helper.common_URL + 'documentStatus/changeStatus';
    url_bulkSave:string= this.helper.common_URL + 'documentStatus/bulkDocumentStatusChange';
    loadDocStatusListBasedOnRoleIdAndDocType(docType: string) {
        return this.http.post(this.url_load, docType,this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    changeStatus(status: string, type: string, id: number,comments:string) {
        let data = { "status": status, "type": type, "id": id,"comments":comments }
        return this.http.post(this.url_changeStatus, data,this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    bulkSave(data) {
        return this.http.post(this.url_bulkSave, data,this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }


    
}
