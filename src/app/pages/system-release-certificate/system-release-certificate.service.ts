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
export class SystemCertificateService {

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_getLookUpItemsBasedOnCategory: string = this.helper.common_URL + "lookup/getCategoryItemByName";
  url_loadSytemDetails: string = this.helper.common_URL + "systemRelease/loadDetails";
  url_saveUpdateCheckList: string = this.helper.common_URL + 'systemRelease/saveOrUpdateCheckList';
  url_saveUpdateSystemInfo: string = this.helper.common_URL + 'systemRelease/saveOrUpdateInfo';
  url_publishSystemInfo: string = this.helper.common_URL + 'systemRelease/publishSystemReleaseInfo';

  getlookUpItemsBasedOnCategory(lookUpCategory) {
    return this.http.post(this.url_getLookUpItemsBasedOnCategory, { "categoryName": lookUpCategory, "orgId": 0 }, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadSytemDetails() {
    return this.http.get(this.url_loadSytemDetails, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveUpdateCheckList(data: any) {
    return this.http.post(this.url_saveUpdateCheckList, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveUpdateSystemInfo(data: any) {
    return this.http.post(this.url_saveUpdateSystemInfo, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  publishSystemReleaseInfo(data: number) {
    return this.http.get(this.url_publishSystemInfo + "/" + data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}