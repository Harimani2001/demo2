import { Injectable } from '@angular/core';
import { Http,ResponseContentType,Headers,Response,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class CCFService {
  
    constructor( private http: Http, public helper: Helper,public config:ConfigService ) { }
    url_load_dynamicForm_data: string = this.helper.common_URL + 'dynamicForm/loadCcfDynamicForms';
    
    loadCCFStatus(catergoryName:any,url:any) {
        return this.http.post(this.helper.common_URL+url,catergoryName,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }
      loadAllCCFFormData(data:any) {
        return this.http.post(this.url_load_dynamicForm_data, data, this.config.getRequestOptionArgs())
          .map((resp) => resp.json())
          .catch(res => {
            return Observable.throw(res.json());
          });
      }
      loadData(data:any,url:any) {
        return this.http.post(this.helper.common_URL+url,data,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }
      loadPreviewDocument(data: any,url:any): any {
        let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
        if (options.headers == null) {
          options.headers = new Headers();
        }
        options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
        options.headers.append('X-tenant',localStorage.getItem("tenant"));
        return this.http.post(this.helper.common_URL+url, data, options)
          .map((response: Response) => response.arrayBuffer())
          .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
          .first();
      }
      downloadPdf(data: any,url:any): any {
        let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
        if (options.headers == null) {
          options.headers = new Headers();
        }
        options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
        options.headers.append('X-tenant',localStorage.getItem("tenant"));
        return this.http.post(this.helper.common_URL+url, data, options)
          .map((response: Response) => response.arrayBuffer())
          .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
          .first();
      }
      saveData(data:any,url:string){
        return this.http.post(this.helper.common_URL+url,data,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }

      


}
