import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';

@Injectable()
export class DashBoardService {
    constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
    url_setindividualWorkflow: string = this.helper.common_URL + 'workFlow/approveOrReject';
    url_loadAllEsignDoc: string = this.helper.common_URL + "dashboard/downloadpdf";
    url_loadNewDashboard: string = this.helper.common_URL + 'dashboard/loadNewDashBoard';
    url_loadBoardViewData: string = this.helper.common_URL + 'dashboard/loadBoardViewData';
    url_loadDetailViewData: string = this.helper.common_URL + 'dashboard/loadDetailViewData';

    SetIndividualWorkflow(data: any) {
        return this.http.post(this.url_setindividualWorkflow, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    downloadDocumentPdf(documentConstantName, versionId, from?) {
        return this.http.post(this.url_loadAllEsignDoc, { "documentConstantName": documentConstantName, "versionId": versionId, "From": from }, this.config.getRequestOptionArgs())
            .map((resp) => resp)
            .catch(res => {
                return Observable.throw(res);
            });
    }

    loadNewDashboard(locationId, projectIds) {
        return this.http.post(this.url_loadNewDashboard, { "locationId": locationId, "projectIds": projectIds }, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadBoardViewData(locationId: any) {
        return this.http.post(this.url_loadBoardViewData, locationId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadDetailViewData(projectId: any) {
        return this.http.post(this.url_loadDetailViewData, projectId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

}
