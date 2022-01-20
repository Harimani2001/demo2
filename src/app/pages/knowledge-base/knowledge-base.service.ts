import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
@Injectable()
export class KnowledgeBaseService {

  save_file_url: string = this.helper.common_URL + "knowledgebase/saveContentFile";
  delete_kb_content: string = this.helper.common_URL + "knowledgebase/deleteContent";
  url_download_pdf:string = this.helper.common_URL +"knowledgebase/downloadKBPdf";
  url_getKBFile:string = this.helper.common_URL + 'knowledgebase/loadKBFile';
  url_checkifUsed:string = this.helper.common_URL + 'knowledgebase/checkDisplayIsUsed';
  url_check_DisplayIdUsed:string = this.helper.common_URL + 'knowledgebase/checkDisplayOrderInSubCategory';
  url_loadforDropDownList:string = this.helper.common_URL + 'knowledgebase/loadforDropDownList';
  url_loadActiveSubCategoryList:string = this.helper.common_URL + 'knowledgebase/loadActiveSubCategories';
  constructor(private http: Http, public helper: Helper,public config : ConfigService) { }

  callAPI(url:any,data:any) {
    return this.http.post(this.helper.common_URL+url,data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveFile(form, header: any): any {
    return this.http.post(this.save_file_url, form, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteKbContent(dataObj): any {
    return this.http.post(this.delete_kb_content, dataObj, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  downloadKBPdf(subcategoryId:any) {
    return this.http.post( this.url_download_pdf,subcategoryId,this.config.getRequestOptionArgs())
    .map((resp) => resp)
    .catch(res => {
        return Observable.throw(res);
    });
  }

  loadKBFile(subcategoryId:any){
    return this.http.post(this.url_getKBFile, subcategoryId, this.config.getRequestOptionArgs())
    .map((resp) => resp)
    .catch(res => {
        return Observable.throw(res);
    });
  }

  checkDisplayISExist(data:any) {
    return this.http.post(this.url_checkifUsed,data,this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
   .catch(res => {
       return Observable.throw(res.json());
     });
  }

  checkSubCategoryDisplayISExist(data:any) {
    return this.http.post(this.url_check_DisplayIdUsed,data,this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
   .catch(res => {
       return Observable.throw(res.json());
     });
  }

  loadforDropDownList(orgId:any) {
    return this.http.post(this.url_loadforDropDownList, orgId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadActiveSubCategory(selectedCategory:any) {
    return this.http.post(this.url_loadActiveSubCategoryList, selectedCategory, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}
