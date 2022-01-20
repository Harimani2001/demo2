import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class AdvencedSearchService {

  searchData_URL:string = this.helper.common_URL + "search/searchDocumentData";
  
  constructor(private http: Http, public helper: Helper,public config:ConfigService) { }

  loadDocuments(documentTypes:any,searchData:any): any {
    return this.http.post(this.searchData_URL, {"document":documentTypes,"searchData":searchData},this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  
}