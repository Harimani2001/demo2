import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { CssDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class pdfPreferencesServices {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

  saveStyles_URL: string = this.helper.common_URL + "pdfSetting/saveApplicationCssForProject";
  saveCustom_URL: string = this.helper.common_URL + "pdfSetting/saveCustomPdfSettingsData";
  loadApplicationCssBasedOnDocTypeForProject_URL: string = this.helper.common_URL + "pdfSetting/loadApplicationCssBasedOnDocTypeForProject";
  load_custom_data: string = this.helper.common_URL + "pdfSetting/loadCustomPdfSettingsData";
  url_download_preview_document: string = this.helper.common_URL + "pdfSetting/downloadCustomDocument";
  url_default_preview_document: string = this.helper.common_URL + "pdfSetting/loadDefaultPdf";
  get_sheet_names_url: string = this.helper.common_URL + "pdfSetting/getSheetsFormExcel";
  save_uploaded_file_url: string = this.helper.common_URL + "common/saveUploadedFile";
  load_file_url: string = this.helper.common_URL + "common/loadFile";
  saveCsvVerables: string = this.helper.common_URL + "csvTemp/saveVarables";
  loadCsvTemplateData: string = this.helper.common_URL + "csvTemp/loadData";
  copyheaderOrFooterConfiguration_url: string = this.helper.common_URL + "pdfSetting/copyheaderOrFooterConfiguration";

  saveCssForFormFields(cssDTOModel: CssDTO) {
    return this.http.post(this.saveStyles_URL, cssDTOModel, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadCssDataForFormFields(documentTypeId) {
    const formdata:FormData = new FormData();
    formdata.append("docType", documentTypeId);
    return this.http.post(this.loadApplicationCssBasedOnDocTypeForProject_URL, formdata, this.config.getRequestOptionArgs())
      .map(resp => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadCsvVariables(documentTypeId) {
    return this.http.post(this.loadCsvTemplateData, documentTypeId, this.config.getRequestOptionArgs())
      .map(resp => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveUploadedFile(uploadedFile): any {
    return this.http.post(this.save_uploaded_file_url, uploadedFile, this.config.getRequestOptionArgs())
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
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    return this.http.post(this.load_file_url, fileName, options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
  }

  loadCustomPdfSettings(docType:any,mappingId:any){
    const formdata: FormData = new FormData();
    formdata.append('docType', docType);
    formdata.append('mappingId', mappingId);
    return this.http.post(this.load_custom_data, formdata, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  saveCustomPdfSetting(dto) {
    return this.http.post(this.saveCustom_URL, dto, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  saveCsvTemplatesVariables(dto) {
    return this.http.post(this.saveCsvVerables, dto, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  downloadPreviewDocument(docType:any,mappingId:any): any {
    const formdata: FormData = new FormData();
    formdata.append('docType', docType);
    formdata.append('mappingId', mappingId);
    let options = new RequestOptions({responseType: ResponseContentType.ArrayBuffer});
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', 'Bearer '+localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));

    return this.http.post(this.url_download_preview_document, formdata, options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
  }
  loadDefaultPdf(docType:any): any {
    let options = new RequestOptions({responseType: ResponseContentType.ArrayBuffer});
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', 'Bearer '+localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    return this.http.post(this.url_default_preview_document, docType, options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
  }
  getSheetNamesFormExcel(data): any {
    return this.http.post(this.get_sheet_names_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  copyheaderOrFooterConfiguration(cssDTOModel: CssDTO) {
    return this.http.post(this.copyheaderOrFooterConfiguration_url, cssDTOModel, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
}