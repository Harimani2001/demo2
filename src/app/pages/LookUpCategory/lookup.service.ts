
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { LookUpCategory, LookUpItem } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';








@Injectable()
export class LookUpService {

  url_getCategoriesList: string = this.helper.common_URL+ "lookup/getCategoriesList"; 
  url_addCategory = this.helper.common_URL+ "lookup/insertCategory";
  url_getLookUpItems : string =this.helper.common_URL+  "lookup/getCategoryItemById";
  url_updateLookUpItem = this.helper.common_URL+ "lookup/updateLookUpItem";
  url_addLookUpItem =this.helper.common_URL+  "lookup/insertCategoryItem";
  url_deletelookUpItem : string =this.helper.common_URL+  "lookup/deleteLookUpItem"; 
  url_getLookUpItemsBasedOnCategory:string=this.helper.common_URL+ "lookup/getCategoryItemByName";
  url_loadDocumentForTableOfContentOnPermissions=this.helper.common_URL+ "admin/loadDocumentForTableOfContentOnPermissions";
  url_loadDocumentForCustomPdfSetting=this.helper.common_URL+ "admin/loadDocumentForPdfCustomSetting";

  constructor(private http: Http,public helper:Helper,public config: ConfigService) { }

/*  */
  getCategoryList() {
    return this.http.post(this.url_getCategoriesList,"",this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getlookUpItems(lookUpCategory :LookUpCategory) {
    return this.http.post(this.url_getLookUpItems, lookUpCategory,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  updateCategoryItem(lookUpItem : LookUpItem){
    let url  : string = (lookUpItem.id == 0)?this.url_addLookUpItem :this.url_updateLookUpItem;
    return this.http.post(url, lookUpItem,this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });

  }


  deleteCategoryItem(lookUpItem : LookUpItem){
      
    return this.http.post(this.url_deletelookUpItem, lookUpItem,this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }


  addCategory(lookUpCategory : LookUpCategory){
    return this.http.post(this.url_addCategory, lookUpCategory,this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  getlookUpItemsBasedOnCategory(lookUpCategory) {
      return this.http.post(this.url_getLookUpItemsBasedOnCategory,{"categoryName":lookUpCategory,"orgId":0} ,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
          return Observable.throw(res.json());
        });
    }

    loadDocumentForTableOfContentOnPermissions(){
      return this.http.post(this.url_loadDocumentForTableOfContentOnPermissions, "",this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
    }

    loadDocumentForPdfcustomSetting(){
      return this.http.post(this.url_loadDocumentForCustomPdfSetting, "",this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
    }

}
