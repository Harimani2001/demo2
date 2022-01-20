import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class EquipmentDetailedDashboardService {
  
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  
  url_load: string = this.helper.common_URL + 'EqDashboard/equipmentDashboardDetails';
  url_EquipmentDetails: string = this.helper.common_URL + 'EqDashboard/equipmentDetails';
  url_download_csv:string = this.helper.common_URL + 'EqDashboard/loadExcelExportDetails';

  loadEquipmentDashboardDetails() {
    return this.http.post(this.url_load, "", this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  loadEquipmentDetails(data:any) {
    return this.http.post(this.url_EquipmentDetails, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  generatePdf(data:any) {
    return this.http.post(this.url_download_csv,data,this.config.getRequestOptionArgs())
      .map((resp) => resp)
      .catch(res => {
        return Observable.throw(res);
      });
  }
 
  
}