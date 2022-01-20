import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class LocationService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'location/saveLocation';
  url_load: string = this.helper.common_URL + 'location/loadAllLocations';
  url_loadActiveLocation: string = this.helper.common_URL + 'location/loadAllActiveLocations';
  url_delete: string = this.helper.common_URL + 'location/deleteLocationById';
  url_edit: string = this.helper.common_URL + 'location/loadLocationById';
  url_load_stepList: string = this.helper.common_URL + 'location/loadStep';
  url_isLocationIsMappedToProject: string = this.helper.common_URL + 'location/isLocationIsMappedToProject';
  
  createLocation(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadLocation() {
    return this.http.post(this.url_load,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllActiveLocations() {
    return this.http.post(this.url_loadActiveLocation,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteLocation(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  editLocation(data: any) {
    return this.http.post(this.url_edit, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadStepList(data:any){
    return this.http.post(this.url_load_stepList,data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  isLocationIsMappedToProject(locId){
    return this.http.post(this.url_isLocationIsMappedToProject, locId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}