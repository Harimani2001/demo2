import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { TemplateLibraryDTO, VendorValidationDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class TemplatelibraryService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

  convert_to_pdf_url: string = this.helper.common_URL + "common/docToParse";
  update_vendor_validation_url: string = this.helper.common_URL + "vendor/updateVendorValidationDetails";
  update_vendor_validation_without_file_url: string = this.helper.common_URL + "vendor/updateVendorValidationDetailsWithOutFile";
  load_vendor_validation_details_based_on_project_id_url: string = this.helper.common_URL + "vendor/loadAllVendorDocumentsBasedOnTab";
  load_vendor_validation_details_based_on_id_url: string = this.helper.common_URL + "vendor/loadVendorValidationDetailsBasedOnId";
  delete_vendor_validation_details_url: string = this.helper.common_URL + "vendor/deleteVendorValidationDetails";
  load_file_url: string = this.helper.common_URL + "vendor/loadVendorValidationFile";
  save_uploaded_file_url: string = this.helper.common_URL + "vendor/saveUploadedFile";
  is_document_exists_url: string = this.helper.common_URL + "vendor/isDocumentNameExists";
  excel_export_url: string = this.helper.common_URL + "vendor/excelExport";
  publish_url: string = this.helper.common_URL + "vendor/publish";
  singlePublish_url: string = this.helper.common_URL + "vendor/singlePublish";
  audit_download: string = this.helper.common_URL + "vendor/fileDownload";
  url_load_preview_document: string = this.helper.common_URL + "vendor/downloadVendorDocument";
  url_summary: string = this.helper.common_URL + 'vendor/loadDocumentSummaryForVendor';
  url_load: string = this.helper.common_URL + 'templateLibrary/loadAllTemplateLibraryDetails';
  save_templatelibrary_url: string = this.helper.common_URL + "templateLibrary/saveDetails";
  Update_templatelibrary_url: string = this.helper.common_URL + "templateLibrary/updateDetails";
  load_templatelibrary_details_based_on_id_url: string = this.helper.common_URL + "templateLibrary/loadTemplateLibraryDetailsBasedOnId";
  delete_templatelibrary_details_url: string = this.helper.common_URL + "templateLibrary/delete";
  url_load_organization: string = this.helper.common_URL + "organization/loadOrganizationDetails";
  url_getLookUpItemsBasedOnCategory: string = this.helper.common_URL + "lookup/getCategoryItemByName";
  url_downloadExcel: string = this.helper.common_URL + 'templateLibrary/downloadSampleExcel';
  loadAllTemplateLibraryForOrg_URL: string = this.config.helper.saas_URL + "/templateLibrary/loadAllTemplateLibraryForOrg/";
  getTemplateLibraryFilePath_URL: string = this.config.helper.saas_URL + "/templateLibrary/getTemplateLibraryFilePath/";
  readTemplateLibraryFile_URL: string = this.helper.common_URL + 'templateLibrary/readTemplateLibraryFile';

  loadTableData(page, data) {
    return this.http.post(this.url_load + "/" + page, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveTemplateLibrary(data): any {
    return this.http.post(this.save_templatelibrary_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  updateTemplateLibrary(data): any {
    return this.http.post(this.Update_templatelibrary_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadTemplateLibraryDetailsBasedOnId(id): any {
    return this.http.post(this.load_templatelibrary_details_based_on_id_url, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteTemplateLibrary(model: TemplateLibraryDTO): any {
    return this.http.post(this.delete_templatelibrary_details_url, model, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadOrganization() {
    return this.http.post(this.url_load_organization, '', this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getlookUpItemsBasedOnCategory(lookUpCategory) {
    return this.http.post(this.url_getLookUpItemsBasedOnCategory, { "categoryName": lookUpCategory, "orgId": 0 }, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  convertToPDF(form): any {
    return this.http.post(this.convert_to_pdf_url, form, this.config.getRequestOptionArgs())
      .map((resp) => resp)
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  updateVendorValidation(form, header): any {
    return this.http.post(this.update_vendor_validation_url, form, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  updateVendorValidationWithouFile(model: VendorValidationDTO): any {
    return this.http.post(this.update_vendor_validation_without_file_url, model, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadVendorValidationDetailsBasedOnProject(page, tab): any {
    return this.http.post(this.load_vendor_validation_details_based_on_project_id_url + "/" + page, tab, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadVendorValidationFile(fileName): any {
    let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.post(this.load_file_url, fileName, options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
  }

  saveUploadedFile(uploadedFile): any {
    return this.http.post(this.save_uploaded_file_url, uploadedFile, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  auditForFileDownload(fileName, id) {
    let data = { "fileName": fileName, "id": id };
    return this.http.post(this.audit_download, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  isDocumentNameExists(documentName) {
    return this.http.post(this.is_document_exists_url, documentName, this.config.getRequestOptionArgs())
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

  publish(data: any): any {
    return this.http.post(this.publish_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  singlePublish(data: any): any {
    return this.http.post(this.singlePublish_url, data, this.config.getRequestOptionArgs())
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
    return this.http.post(this.url_load_preview_document, data, options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
  }

  loadSummary() {
    return this.http.post(this.url_summary, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  downloadSampleTemplateLibFile() {
    return this.http.post(this.url_downloadExcel, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllTemplateLibraryForOrg(orgId: any) {
    return this.http.get(this.loadAllTemplateLibraryForOrg_URL + orgId)
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }

  getTemplateLibraryFilePath(templateLibId: any) {
    return this.http.get(this.getTemplateLibraryFilePath_URL + templateLibId)
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }

  readTemplateLibraryFile(filePath: any) {
    return this.http.post(this.readTemplateLibraryFile_URL, filePath, this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }

}