import { Injectable } from '@angular/core';
import { Http , RequestOptions, Headers, ResponseContentType, Response} from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Helper } from '../shared/helper';
import { ConfigService } from '../shared/config.service';

@Injectable()
export class CommonFileFTPService {
  url_single_file_upload= this.helper.common_URL + 'common/saveFileForSingleFileUpload';
  convert_to_pdf_url: string = this.helper.common_URL+"common/docToParse";
  load_file_url:string=this.helper.common_URL+"common/fetchFromFtp";
  download_file_url:string=this.helper.common_URL+"common/auditForDownload";
  compare_two_files_url:string=this.helper.common_URL+"common/compareTwoFile";
  audit_revision:string=this.helper.common_URL+"common/revisionAudit";
  convert_excel_to_pdf_url:string=this.helper.common_URL+"common/convertExcelToPDF";

  constructor(private http: Http, public helper: Helper,public config:ConfigService) { }


  loadFile(fileName:any): any {
    let options = new RequestOptions({responseType: ResponseContentType.ArrayBuffer});
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', 'Bearer '+localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
      return this.http.post(this.load_file_url, fileName,options)
        .map((response: Response) => response.arrayBuffer())
        .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
        .first();
  }

  downloadFileAudit(fileName:any,documentName,documentId,uniqId,masterTemplateId?,masterformId?):any {
    if(masterTemplateId === undefined)
      masterTemplateId = null;
    let data = { "documentName": documentName,"fileName":fileName,"documentType":documentId,"id":masterTemplateId,"uniqId":uniqId,"masterFormId":masterformId};
    return this.http.post(this.download_file_url, data, this.config.getRequestOptionArgs()).map((resp) => resp.json())
    .catch(res => {
        return Observable.throw(res.json());
    });
  }

  singleFileUpload(formdata){
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Accept', 'application/json');
    options.headers.append('Authorization', 'Bearer '+localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    return this.http.post(this.url_single_file_upload, formdata,options)
    .map((resp) => resp.json())
    .catch(res => {
        return Observable.throw(res.json());
    });
  }

  getContentType(type):string{
    let contentType=""
    switch(type){
      case "doc":contentType ="application/msword"; break;
      case "pdf":contentType ="application/pdf"; break;
      case "txt":contentType ="application/txt"; break;
      case "docx":contentType ="application/vnd.openxmlformats-officedocument.wordprocessingml.document"; break;
      case "mp4":contentType ="video/mp4"; break;
      case "webm":contentType ="video/webm"; break;
      case "zip":contentType ="application/zip"; break;
      default:contentType="image/png";break;
    }
    return contentType;
  }


  convertToPDF(form): any {
    let options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Accept', 'application/json');
    options.headers.append('Authorization', 'Bearer '+localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    return this.http.post(this.convert_to_pdf_url, form,options)
      .map((resp) => resp)
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  convertFileToPDF(blob,fileName): Promise<any>
  {
    return new Promise<any>((resolve, reject) => {
      var b :any= blob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    const formData: FormData = new FormData();
    formData.append('file', b, fileName);
    this.convertToPDF(formData).subscribe(resp => {
      var binary = atob(resp._body);
      var array = [];
    for (var i = 0; i < binary.length; i++) {
       array.push(binary.charCodeAt(i));
    }
      setTimeout( () => {
        
          resolve(new Blob([new Uint8Array(array)], {type: 'application/pdf'}));
      }, 1500);
  },err=>resolve(''));
    
});
}

compareTwoFile(jsonObject){
  return this.http.post(this.compare_two_files_url, jsonObject,this.config.getRequestOptionArgs())
  .map((resp) => resp.json())
  .catch(res => {
      return Observable.throw(res.json());
  });
}

auditRevision(jsonObject){
  return this.http.post(this.audit_revision, jsonObject,this.config.getRequestOptionArgs())
  .map((resp) => resp.json())
  .catch(res => {
      return Observable.throw(res.json());
  });
}
convertExcelToPDF(fileName:any): any {
  let options = new RequestOptions({responseType: ResponseContentType.ArrayBuffer});
  if (options.headers == null) {
    options.headers = new Headers();
  }
  options.headers.append('Authorization', 'Bearer '+localStorage.getItem("token"));
  options.headers.append('X-tenant',localStorage.getItem("tenant"));
    return this.http.post(this.convert_excel_to_pdf_url, fileName,options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
}
}
