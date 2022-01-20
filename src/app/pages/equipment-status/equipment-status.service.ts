import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
@Injectable()
export class EquipmentStatusService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_load: string = this.helper.common_URL + 'dynamicForm/loadDynamicFormsForReports';
  excel_export_url: string = this.helper.common_URL + "dynamicForm/excelExport";
  loadAllForms(data:any) {
    return this.http.post(this.url_load, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  excelExport(data:any) {
    return this.http.post(this.excel_export_url,data,this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
}
}