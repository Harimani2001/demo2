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
export class traceabilitymatrixService {

    url_download_pdf: string = this.helper.common_URL + 'common/downloadPDFServiceForTraceabilityMatirx';
    url_traceabilityMatrix: string = this.helper.common_URL + 'common/traceabilityMatrix';
    url_traceDetailData: string = this.helper.common_URL + 'common/getTraceDetails';
    url_traceabilityNoTestcases: string = this.helper.common_URL + 'common/getTraceDetailsForNoTestcases';

    constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

    generatePdf() {
        return this.http.post(this.url_download_pdf, "", this.config.getRequestOptionArgs())
            .map((resp) => resp)
            .catch(res => {
                return Observable.throw(res);
            });
    }

    generatematrix() {
        return this.http.post(this.url_traceabilityMatrix, "", this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getTraceDetailData() {
        return this.http.post(this.url_traceDetailData, "", this.config.getRequestOptionArgs()).map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
    loadTraceabilityNoTestcasesData() {
        return this.http.post(this.url_traceabilityNoTestcases, "", this.config.getRequestOptionArgs()).map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

}
