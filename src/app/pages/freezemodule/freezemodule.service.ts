import { Injectable } from "../../../../node_modules/@angular/core";
import { Http } from "../../../../node_modules/@angular/http";
import { Helper } from "../../shared/helper";
import { ConfigService } from "../../shared/config.service";
import { Observable } from "../../../../node_modules/rxjs";

@Injectable()
export class freezeModuleService {

  url_get_all_modules: string = this.helper.common_URL + "common/getfreezevalidationDocuments";
  url_save_or_update_modules : string = this.helper.common_URL + "common/saveChanges";

  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }



  loadAllOrgs() {
    return this.http.post(this.url_get_all_modules,"",this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
   .catch(res => {
       return Observable.throw(res.json());
     });
  }


  saveOrUpdate(data : any) {
    return this.http.post(this.url_save_or_update_modules, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}
