import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { VendorValidationDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class EsignService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  convert_to_pdf_url: string = this.helper.common_URL + "common/docToParse";
  save_esign_validation_url: string = this.helper.common_URL + "eSign/saveSignatureDetails";
  update_esign_validation_without_file_url: string = this.helper.common_URL + "eSign/loadAllSignatureDocumentsBasedOnTab";
  load_esign_validation_details_based_on_id_url: string = this.helper.common_URL + "eSign/loadSignatureDetailsBasedOnId";
  delete_esign_validation_details_url: string = this.helper.common_URL + "eSign/deleteESignatureDetails";
  publish_url: string = this.helper.common_URL + "eSign/publish";
  singlePublish_url: string = this.helper.common_URL + "eSign/singlePublish";
  url_summary: string = this.helper.common_URL + 'eSign/summaryForESignature';
  extetnal_esign_save_url: string = this.helper.common_URL + 'eSignExternalApproval/saveWorkFlow';

  convertToPDF(form): any {
    return this.http.post(this.convert_to_pdf_url, form, this.config.getRequestOptionArgs())
      .map((resp) => resp)
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveVendorValidation(data): any {
    return this.http.post(this.save_esign_validation_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadVendorValidationDetailsBasedOnProject(page, tab): any {
    return this.http.post(this.update_esign_validation_without_file_url + "/" + page,
      tab, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadVendorValidationDetailsBasedOnId(id): any {
    return this.http.post(this.load_esign_validation_details_based_on_id_url, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteVendorValidation(model: VendorValidationDTO): any {
    return this.http.post(this.delete_esign_validation_details_url, model, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  publish(data: any): any {
    return this.http.post(this.publish_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  singlePublish(data: any): any {
    return this.http.post(this.singlePublish_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadSummary() {
    return this.http.post(this.url_summary, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  emailValidation(url): any {
    return this.http.get(this.helper.common_URL + url, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }

  externalEsignSaveWorkflow(data): any {
    return this.http.post(this.extetnal_esign_save_url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  postApi(data, url) {
    return this.http.post(this.helper.common_URL + url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }

  getApi(url) {
    return this.http.get(this.helper.common_URL + url, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }

  getDeleteWorkflow(url) {
    return this.http.get(this.helper.common_URL + url, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }

  getApiLoadWorkflow(url) {
    return this.http.get(this.helper.common_URL + url, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }

}