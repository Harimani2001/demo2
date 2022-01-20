import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, ResponseContentType } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { Urs } from "../../models/model";
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class UrsService {
    constructor(private http: Http,public config: ConfigService) { }
    saveursDetailsURL: string = this.config.helper.common_URL + "urs/saveOrUpdateURSDetails";
    getDropDownOfPublishedURSURL: string = this.config.helper.common_URL + "urs/getDropDownOfPublishedURS";
    getUsrListURL_based_on_tab: string = this.config.helper.common_URL + "urs/loadAllURSBasedOnTab";
    getUsrBasedOnId: string = this.config.helper.common_URL + "urs/loadURSBasedOnId";
    getUsrBasedOnIdForUrsMapping: string = this.config.helper.common_URL + "urs/getUrsMappingDetails";
    deleteUrs_URL: string = this.config.helper.common_URL + "urs/deleteUrs";
    downloadSampleURSFileURL: string = this.config.helper.common_URL + "urs/downloadSampleForURS";
    saveBulkURSURL: string = this.config.helper.common_URL + "urs/saveBulkURS";
    excel_export_url: string = this.config.helper.common_URL + "urs/excelExport";
    getTestCaseTypesURL: string = this.config.helper.common_URL + "common/loadTestCaseTypes";
    publishURL: string = this.config.helper.common_URL + "urs/publish";
    singlepublishURL: string = this.config.helper.common_URL + "urs/singlePublish";
    getUsrListURLForProject: string = this.config.helper.common_URL + "urs/loadAllURSForProject";
    getUrsAndSpecListForProject: string = this.config.helper.common_URL + "urs/loadAllUrsAndSpecForProject";
    loadAll_URS_Mapped_Published_Spec_Details: string = this.config.helper.common_URL + "urs/loadAllURSMappedPublishedSpecDetails";
    getUrs_deatils: string = this.config.helper.common_URL + "urs/getUrsDetails";
    getUrsAndSpecification_Details: string = this.config.helper.common_URL + "urs/getUrsAndSpecificationDetails";
    getSelectedUrsAndSpecAndRisk_Details: string = this.config.helper.common_URL + "urs/getSelectedUrsAndSpecAndRiskDetails";
    loadAllURSDetails: string = this.config.helper.common_URL + "urs/loadAllURSDetails";
    url_load_preview_document: string = this.config.helper.common_URL + "urs/downloadURSDocument";
    url_load_preview_for_multiple_document: string = this.config.helper.common_URL + "pdfSetting/downloadMultipleDocument";
    url_load_requirement_summary: string = this.config.helper.common_URL + "urs/loadRequirementSummary";
    url_load_ursSpecMappingDetails: string = this.config.helper.common_URL + "urs/getUrsSpecMappingDetails";
    url_load_ursRiskMappingDetails: string = this.config.helper.common_URL + "urs/getUrsRiskMappingDetails";
    url_load_ursTestcasesMappingDetails: string = this.config.helper.common_URL + "urs/getUrsTestcasesMappingDetails";
    url_load_ursAdHocMappingDetails: string = this.config.helper.common_URL + "urs/getUrsAdHocMappingDetails";
    url_save_update_order: string = this.config.helper.common_URL + "urs/updateUrsCodeOrder";

    saveAndGoto(ursDetails: Urs) {
        return this.http.post(this.saveursDetailsURL, ursDetails, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    updateUrsCodeOrder(list: any) {
        return this.http.post(this.url_save_update_order, list, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getDropDownOfPublishedURS() {
        return this.http.post(this.getDropDownOfPublishedURSURL, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json()
            )
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getUsrListBasedOnCurrentTab(page,tabId) {
        return this.http.post(this.getUsrListURL_based_on_tab+"/"+page, tabId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json()
            )
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getDataForEdit(ursId: any) {
        return this.http.post(this.getUsrBasedOnId, ursId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getDataForEditForUrsMapping(ursId: any) {
        return this.http.post(this.getUsrBasedOnIdForUrsMapping, ursId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    deleteUrs(urs: Urs) {
        return this.http.post(this.deleteUrs_URL, urs, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });

    }

    downloadSampleURSFile() {
        return this.http.post(this.downloadSampleURSFileURL, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json()).catch(res => {
                return Observable.throw(res.json());
            });
    }

    saveBulkURS(formData: any) {
        let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
        options.headers.append('X-tenant',localStorage.getItem("tenant"));
        return this.http.post(this.saveBulkURSURL, formData, options)
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

    loadTestCaseTypes() {
        return this.http.post(this.getTestCaseTypesURL, "", this.config.getRequestOptionArgs())
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

    singlePublish(data: any) {
        return this.http.post(this.singlepublishURL, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getUsrListForProject() {
        return this.http.post(this.getUsrListURLForProject, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json()
            )
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getUrsAndSpecForProject() {
        return this.http.post(this.getUrsAndSpecListForProject, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json()
            )
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    loadAllURSMappedPublishedSpecDetails() {
        return this.http.post(this.loadAll_URS_Mapped_Published_Spec_Details, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json()
            )
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getAllUsrDetails() {
        return this.http.post(this.loadAllURSDetails, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json()
            )
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getUrsDeatils(ids) {
        return this.http.post(this.getUrs_deatils, ids, this.config.getRequestOptionArgs())
            .map((resp) => resp.json()
            )
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getUrsAndSpecificationDetails(ursIds, specIds) {
        let formData: FormData = new FormData();
        formData.append('ursIds', ursIds);
        formData.append('specIds', specIds);
        return this.http.post(this.getUrsAndSpecification_Details, formData, this.config.getRequestOptionArgs())
            .map((resp) => resp.json()).catch(res => {
                return Observable.throw(res.json());
            });
    }

    getSelectedUrsAndSpecAndRiskDetails(data: any) {
        return this.http.post(this.getSelectedUrsAndSpecAndRisk_Details, data, this.config.getRequestOptionArgs())
            .map((resp) => resp.json()).catch(res => {
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

    loadRequirementSummary(projectId) {
        return this.http.post(this.url_load_requirement_summary, projectId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getUrsSpecMappingDetails(ursId: any) {
        return this.http.post(this.url_load_ursSpecMappingDetails, ursId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getUrsRiskMappingDetails(ursId: any) {
        return this.http.post(this.url_load_ursRiskMappingDetails, ursId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getUrsTestcasesMappingDetails(ursId: any) {
        return this.http.post(this.url_load_ursTestcasesMappingDetails, ursId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getUrsAdHocMappingDetails(ursId: any) {
        return this.http.post(this.url_load_ursAdHocMappingDetails, ursId, this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
 generateCompliancePdf() {
    return this.http.post( this.config.helper.common_URL + "urs/compliancePdfDownload", "", this.config.getRequestOptionArgs())
      .map((resp) => resp)
      .catch(res => {
        return Observable.throw(res);
      });
  }
}
