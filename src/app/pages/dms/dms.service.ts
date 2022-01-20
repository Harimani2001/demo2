import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class DMSService {

  load_file_url: string = this.helper.common_URL + "pdfSetting/loadDMSFileWithCustomSetting";
  url_to_load_comment_log: string = this.helper.common_URL + "common/loadEsignCommentLog";
  url_to_findApplicationFileSize: string = this.helper.common_URL + "common/applicationSize";
  url_to_check_settings: string = this.helper.common_URL + "csvTemp/isCsvTemp";
  url_to_create_excel: string = this.helper.common_URL + "csvTemp/downloadExcel";
  url_merge_pdf: string = this.helper.common_URL + "pdfMerge/dmsPdfMerge";
  url_enable_download: string = this.helper.common_URL + "common/checkDownloadSummaryCertificate";

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

  applicationFileSize(data: any): any {
    return this.http.post(this.url_to_findApplicationFileSize, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  enableDMSCertificate(data:any) {
    return this.http.post(this.url_enable_download, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  loadDMSFileFromFTP(fileName: any, filePath, docType): any {
    let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    return this.http.post(this.load_file_url, { 'fileName': fileName, 'filePath': filePath, 'docType': docType }, options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
  }
  

  loadDocumentCommentLog(data: any) {
    return this.http.post(this.url_to_load_comment_log, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  excelExport(documentType: any) {
    return this.http.post(this.url_to_create_excel, documentType, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  checkCsvSettings(data: any) {
    return this.http.post(this.url_to_check_settings, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  downloadMergePdf(filePathList: any) {
    let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    return this.http.post(this.url_merge_pdf, filePathList, options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
  }

}