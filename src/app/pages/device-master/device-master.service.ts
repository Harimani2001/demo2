import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Helper } from '../../shared/helper';
import { Department, DeviceMaster } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
@Injectable()
// tslint:disable-next-line:class-name
export class DeviceMasterService {

  constructor(private http: Http, public helper: Helper,public config:ConfigService) { }
  url_save: string = this.helper.common_URL + 'device/saveDevice';
  url_saveWithoutFile: string = this.helper.common_URL + 'device/saveWithoutFile';
  url_load: string = this.helper.common_URL + 'device/loadAll';
  url_delete: string = this.helper.common_URL + 'device/delete';
  url_edit: string = this.helper.common_URL + 'device/edit';
  getDeviceTypeURL: string = this.helper.common_URL + 'device/getDeviceTypes';
  download_file:string = this.helper.common_URL + 'device/downloadFile';


  deleteDevice(data: DeviceMaster) {
    return this.http.post(this.url_delete, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  downloadFile(data: DeviceMaster){
    return this.http.post( this.download_file,data,this.config.getRequestOptionArgs())
    .map((resp) => resp)
    .catch(res => {
        return Observable.throw(res);
    });
  }
  loadAll(data:any) {
    return this.http.post(this.url_load, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  saveDevicDetails(form, header: any): any {
    return this.http.post(this.url_save, form, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveDevicDetailsWithOutFile(form, header: any): any {
    return this.http.post(this.url_saveWithoutFile, form, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  editDevice(data: any) {
    return this.http.post(this.url_edit, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });

  }
  

  loadDeviceTypes() {
    return this.http.post( this.getDeviceTypeURL, "" ,this.config.getRequestOptionArgs())
    .map(( resp ) => resp.json() )
    .catch( res => {
        return Observable.throw( res.json() );
    } );
}

}
