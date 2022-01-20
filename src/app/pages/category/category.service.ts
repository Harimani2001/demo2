import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { Category } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
@Injectable()
// tslint:disable-next-line:class-name

export class CategoryService {

  url_save: string = this.helper.common_URL + 'category/createnew';
  url_load: string = this.helper.common_URL + 'category/load';
  url_edit: string = this.helper.common_URL + 'category/edit';
  url_delete: string = this.helper.common_URL + 'category/delete';
  url_checkifUsed:string = this.helper.common_URL + 'category/checkCategoryIsUsed';

    constructor( private http: Http, public helper: Helper,public config:ConfigService ) { }

    //category--save
     createCategory (data: any) {
      return this.http.post(this.url_save, data,this.config.getRequestOptionArgs() )
       .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }

      //category --load
      loadCategory() {
        return this.http.post(this.url_load,"",this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }
      //category --edit
      editCategory(id:any) {
        return this.http.post(this.url_edit,id,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }
       //category --delete
       deleteCategory(data:any) {
        return this.http.post(this.url_delete,data,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }


     checkCategory(data:any) {
      return this.http.post(this.url_checkifUsed,data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
     .catch(res => {
         return Observable.throw(res.json());
       });
    }

}
