import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable()
export class CwfService {

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_load: string = this.helper.common_URL + 'workFlow/getallModulesforcommonworkflow';
   loadall() {
    return this.http.post(this.url_load, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }


}
