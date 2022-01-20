import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
@Injectable()
// tslint:disable-next-line:class-name

export class RolesService {

  url_save: string = this.helper.common_URL + 'admin/saveRoles';
  url_edit: string = this.helper.common_URL + 'roles/';
  //url_delete: string = this.helper.common_URL + 'roles/delete';

    constructor( private http: Http, public helper: Helper,public config:ConfigService ) { }

    //roles--save
     createRoles(roleName:string,roleId:number) {
      return this.http.post(this.url_save, ({"roleName":roleName,"roleid":roleId}) ,this.config.getRequestOptionArgs())
       .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }
      editRoles(id:any) {
        return this.http.post(this.url_edit,id,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }





}
