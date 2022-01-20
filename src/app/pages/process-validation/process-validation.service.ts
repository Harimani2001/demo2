import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class ProcessValidationService {

  constructor(private http: Http, public config: ConfigService) { }

  url_spc_download_pdf: string = this.config.helper.common_URL + 'processValidation/spcPdfDownload';

  generateSpcPdf(data) {
    return this.http.post(this.url_spc_download_pdf, data, this.config.getRequestOptionArgs())
      .map((resp) => resp)
      .catch(res => {
        return Observable.throw(res);
      });
  }

}
