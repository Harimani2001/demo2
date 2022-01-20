import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class VendorMasterService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

  url_load_all_project: string = this.helper.common_URL + 'projectsetup/loadprojectOfUserAndCreator';
  url_save_data:string = this.helper.common_URL + 'vendorMaster/saveorUpdate';
  url_load:string = this.helper.common_URL + 'vendorMaster/loadAll';
  url_delete:string = this.helper.common_URL + 'vendorMaster/deleteData';
  
  loadAllProjects() {
    return this.http.post(this.url_load_all_project,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  createVendorMaster(data: any) {
    return this.http.post(this.url_save_data, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadVendorMaster() {
    return this.http.post(this.url_load,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteVendorMaster(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  
  
}