import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
@Injectable()
export class NewEquipmemtDashboardService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_load: string = this.helper.common_URL + 'equipment/loadEquipmentDashboardDetails';
  url_load_by_id: string = this.helper.common_URL + 'equipment/loadEquipmentDashboardDetailsById';
  
  loadEquipmentsDetails() {
    return this.http.post(this.url_load,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadEquipmentsDetailsById(equipmentId:any) {
    return this.http.post(this.url_load_by_id,equipmentId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
}