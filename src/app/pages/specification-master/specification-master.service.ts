import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
import { SpecificationMasterDTO } from '../../models/model';
@Injectable()
export class SpecificationMasterService {
    constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

    url_save: string = this.helper.common_URL + 'sp_Master/save';
    url_load_data_by_tab = this.helper.common_URL + 'sp_Master/loadData';
    url_getUsrBasedOnId = this.helper.common_URL + 'sp_Master/loadById';
    deleteUrs_URL = this.helper.common_URL + 'sp_Master/delete';
    publishURL = this.helper.common_URL + 'sp_Master/publish';
    url_load_preview_for_multiple_document: string = this.helper.common_URL + "pdfSetting/downloadMultipleDocument";
    singlepublishURL: string = this.helper.common_URL + 'sp_Master/singlePublish';
    loadAllpublishURL: string = this.helper.common_URL + 'sp_Master/loadAllPublish';
    excel_export_url: string = this.helper.common_URL + "sp_Master/excelExport";
    getDetailsBasedOnIdForSpecMapping: string = this.helper.common_URL + "sp_Master/getSpecMappingDetails";
    url_load_preview_document: string = this.helper.common_URL + "sp_Master/downloadSpecDocument";
    getDropDownOfPublishedSpec_URL: string = this.helper.common_URL + "sp_Master/getDropDownOfPublishedSpec";

    saveSP(data: any) {
        return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getUsrListBasedOnCurrentTab(page,tabId) {
        return this.http.post(this.url_load_data_by_tab+"/"+page, tabId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json()
            )
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getDataForEdit(ursId: any) {
        return this.http.post(this.url_getUsrBasedOnId, ursId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    deleteUrs(spData: SpecificationMasterDTO) {
        return this.http.post(this.deleteUrs_URL, spData, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    publish(data: any) {
        return this.http.post(this.publishURL, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadPreviewForMultipleDocument(docExtention: any, docType: any) {
        let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
        if (options.headers == null) {
            options.headers = new Headers();
        }
        const formdata: FormData = new FormData();
        formdata.append('docExtention', docExtention);
        formdata.append('docType', docType);
        options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
        options.headers.append('X-tenant',localStorage.getItem("tenant"));
        return this.http.post(this.url_load_preview_for_multiple_document, formdata, options)
            .map((response: Response) => response.arrayBuffer())
            .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
            .first();
    }

    singlePublish(data: any) {
        return this.http.post(this.singlepublishURL, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadAllPublish() {
        return this.http.post(this.loadAllpublishURL, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    excelExport() {
        return this.http.post(this.excel_export_url, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getDataForEditForSpecMapping(specId: any) {
        return this.http.post(this.getDetailsBasedOnIdForSpecMapping,specId,this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadPreviewDocument(data: any): any {
        let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
        if (options.headers == null) {
          options.headers = new Headers();
        }
        options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
        options.headers.append('X-tenant',localStorage.getItem("tenant"));
        return this.http.post(this.url_load_preview_document, data, options)
          .map((response: Response) => response.arrayBuffer())
          .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
          .first();
      }

      getDropDownOfPublishedSpec() {
        return this.http.post(this.getDropDownOfPublishedSpec_URL, "",this.config.getRequestOptionArgs())
            .map((resp) => resp.json()
            )
            .catch(res => {
                return Observable.throw(res.json());
            });
    }


}