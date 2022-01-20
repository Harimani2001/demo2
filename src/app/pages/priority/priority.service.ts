import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { Priority } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
@Injectable()
// tslint:disable-next-line:class-name
export class priorityService {

    constructor( private http: Http, public helper: Helper ,public config:ConfigService) { }
    url_save: string = this.helper.common_URL + 'priority/saveOrUpdatePriorityDetails';
    url_load: string = this.helper.common_URL + 'priority/load';
    url_load_all_priority: string = this.helper.common_URL + 'priority/loadAllPriorityDetails';
    url_load_priority_based_on_id:string=this.helper.common_URL + 'priority/loadPriorityDetailsBasedOnId';
    url_delete_priority_based_on_id:string=this.helper.common_URL + 'priority/deletePriorityDetailsBasedOnId';
    url_checkPriority_used:string=this.helper.common_URL + 'priority/checkIsPriorityUsed';
    url_load_default_priority: string = this.helper.common_URL + 'priority/loadDefaultPriorityDetailsForOrg';

     createPriority (data: Priority) {
      return this.http.post(this.url_save, data,this.config.getRequestOptionArgs() )
       .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }

      //priority --load
      loadPriority(id:any) {
        return this.http.post(this.url_load,id,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }

      loadAllPriority(){
        return this.http.post(this.url_load_all_priority,"",this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }

      loadDefaultPriorityDetailsForOrg(){
        return this.http.post(this.url_load_default_priority,"",this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }

      loadPriorityBasedOnId(id){
        return this.http.post(this.url_load_priority_based_on_id,id,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }

      deletePriorityBasedOnId(object:any){
        return this.http.post(this.url_delete_priority_based_on_id,object,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }


    checkPriority(id:any){
      return this.http.post(this.url_checkPriority_used,id,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
     .catch(res => {
         return Observable.throw(res.json());
       });
    }
}

