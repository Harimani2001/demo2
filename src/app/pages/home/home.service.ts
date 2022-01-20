import { Injectable } from "../../../../node_modules/@angular/core";
import { Http } from "../../../../node_modules/@angular/http";
import { Helper } from "../../shared/helper";
import { ConfigService } from "../../shared/config.service";
import { Observable } from "../../../../node_modules/rxjs";

@Injectable()
export class HomeService {
  

  url_loaduserShortcutModules: string = this.helper.common_URL + "home/loadHomePageData";
  url_loaduserLastActions: string = this.helper.common_URL + "home/lastActions";
  url_loadUserModules: string = this.helper.common_URL + "home/userModules";
  url_loadUserShortEnableData: string = this.helper.common_URL + 'home/loadUserShortCutEnableData';
  url_loadTaskDetailsOfTheUser: string = this.helper.common_URL + 'home/loadTaskDetailsOfTheUser';
  url_loadEquipmentListOfUserAndPeriod: string = this.helper.common_URL + 'home/loadEquipmentListOfUserAndPeriod';
  url_loadApprovalCountOfDocument: string = this.helper.common_URL + 'home/loadApprovalCountOfDocument';
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }


  loadUserShortCutEnableData() {
    return this.http.post(this.url_loadUserShortEnableData,"",this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
   .catch(res => {
       return Observable.throw(res.json());
     }); 
  }

  loadTaskDetailsOfTheUser(){
    return this.http.post(this.url_loadTaskDetailsOfTheUser,"",this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
   .catch(res => {
       return Observable.throw(res.json());
     }); 
  }
  loadEquipmentListOfUserAndPeriod(){
    return this.http.post(this.url_loadEquipmentListOfUserAndPeriod,"",this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
   .catch(res => {
       return Observable.throw(res.json());
     }); 
  }

  loaduserShortcutModules() {
    return this.http.post(this.url_loaduserShortcutModules,"",this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
   .catch(res => {
       return Observable.throw(res.json());
     });
  }

  loadApprovalCountOfDocument(){
    return this.http.post(this.url_loadApprovalCountOfDocument,"",this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
   .catch(res => {
       return Observable.throw(res.json());
     });
  }

  loaduserLastActions() {
    return this.http.post(this.url_loaduserLastActions,"",this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
   .catch(res => {
       return Observable.throw(res.json());
     });
  }

  loadnotification(data?, url?) {
    return this.http.post(this.helper.common_URL + url, data, this.config.getRequestOptionArgs())
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
  }
}
