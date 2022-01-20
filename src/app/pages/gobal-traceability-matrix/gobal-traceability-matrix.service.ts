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

// tslint:disable-next-line:class-name
export class GobalTraceabilitymatrixService {

  
  url_traceDetailData:string = this.helper.common_URL + 'matrix/loadMatrixData';


    constructor( private http: Http, public helper: Helper ,public config:ConfigService) { }

        getTraceDetailData(testCaseId:any){
            return this.http.post(this.url_traceDetailData,testCaseId, this.config.getRequestOptionArgs()).map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
        }

}
