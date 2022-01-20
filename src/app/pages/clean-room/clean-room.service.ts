import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
import { CleanRoomInfo, CleanRoomSpecificationDTO } from '../../models/model';

@Injectable()
export class CleanRoomService {

    constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

    url_saveOrUpdateRoom: string = this.helper.common_URL + 'cleanroom/saveBasicInfo';
    url_loadRoomInfoOnId = this.helper.common_URL + 'cleanroom/loadBasedOnId';
    url_downloadExcel: string = this.helper.common_URL + 'cleanroom/sampleExcel';
    url_extractExcelFile: string = this.helper.common_URL + 'cleanroom/extractExcelFile';
    url_saveOrUpdateRoomSpecification: string = this.helper.common_URL + 'cleanroom/saveOrUpdateCleanRoomSpecification';
    url_bulkPublish: string = this.helper.common_URL + 'cleanroom/bulkPublishCleanRoom';
    url_deleteRoom: string = this.helper.common_URL + 'cleanroom/deleteCleanRoomDocument';
    url_uploadExcelFile: string = this.helper.common_URL + 'cleanroom/uploadExcelFile';

    saveOrUpdateRoom(data: CleanRoomInfo) {
        return this.http.post(this.url_saveOrUpdateRoom, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadRoomInfoOnId(id: any) {
        return this.http.post(this.url_loadRoomInfoOnId, id, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    downloadSampleSpecification(data) {
        return this.http.post(this.url_downloadExcel, data, this.config.getRequestOptionArgs())
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

    saveOrUpdateRoomSpecification(data: CleanRoomSpecificationDTO) {
        return this.http.post(this.url_saveOrUpdateRoomSpecification, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    bulkRoomItemPublish(ids: any) {
        return this.http.post(this.url_bulkPublish, ids, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    deleteCleanRoom(data: any) {
        return this.http.post(this.url_deleteRoom, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    uploadExcelFile(formData: any) {
        return this.http.post(this.url_uploadExcelFile, formData, this.config.getRequestOptionArgs())
            .map((resp) => resp.json()).catch(res => {
                return Observable.throw(res.json());
            });
    }

}