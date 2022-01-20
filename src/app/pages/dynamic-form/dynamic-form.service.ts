import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, ResponseContentType } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';

@Injectable()
export class DynamicFormService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }

  url_save_form_for_project: string = this.helper.common_URL + 'dynamicForm/saveDynamicFormForProject';
  url_load_dynamic_data: string = this.helper.common_URL + 'dynamicForm/loadDynamicFormForProject'
  url_delete_dynamic_form: string = this.helper.common_URL + 'dynamicForm/deleteDynamicForm';
  url_publish: string = this.helper.common_URL + 'dynamicForm/publish';
  url_publish_MultipleDynamicForm: string = this.helper.common_URL + 'dynamicForm/publishMultipleDynamicForm';
  url_load_batch: string = this.helper.common_URL + 'batchCreation/loadBatchBasedOnEquipmentId';
  url_load_equipment_by_master_id: string = this.helper.common_URL + 'dynamicForm/loadEquipmentListForForm';
  url_load_preview_document: string = this.helper.common_URL + 'dynamicForm/previewDocumentForm';
  url_download_preview_document: string = this.helper.common_URL + 'dynamicForm/downloadPreviewDocument';
  url_load_dynamic_data_based_on_id: string = this.helper.common_URL + 'dynamicForm/loadDynamicFormBasedOnId';
  url_getMinimalInfoBasedOnId: string = this.helper.common_URL + 'dynamicForm/getMinimalInfoBasedOnId';
  url_load_batch_for_equ_register: string = this.helper.common_URL + 'batchCreation/loadBatchForEquipmentRegister';
  url_for_qr_code: string = this.helper.common_URL + 'dynamicForm/generateQR';
  load_linked_master_form_url: string = this.helper.common_URL + 'dynamicForm/loadLinkedMasterForm';
  save_linked_master_form_url: string = this.helper.common_URL + 'dynamicForm/saveLinkedMasterForm';
  loadMasterFormForDropDownURL: string = this.helper.common_URL + 'dynamicForm/loadMasterFormForDropDown';
  loadFormDataOfMasterFormIdsURL: string = this.helper.common_URL + 'dynamicForm/loadFormDataOfMasterFormIds';
  loadLinkedFormAsDropDownURL: string = this.helper.common_URL + 'dynamicForm/loadLinkedMasterFormForDynamicForm';
  loadFormDataOfMasterFormDataIdsForViewURL: string = this.helper.common_URL + 'dynamicForm/loadFormDataOfMasterFormDataIds';
  loadDocumentSpecifiedFormDataURL: string = this.helper.common_URL + 'dynamicForm/loadDocumentSpecifiedFormData/';

  saveDynamicFormForProject(data: any) {
    return this.http.post(this.url_save_form_for_project, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDynamicFormForProject(jsonData) {
    return this.http.post(this.url_load_dynamic_data, jsonData, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadDynamicFormBasedOnId(id) {
    return this.http.post(this.url_load_dynamic_data_based_on_id, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  getMinimalInfoBasedOnId(id) {
    return this.http.post(this.url_getMinimalInfoBasedOnId, id, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteDynamicForm(data: any) {
    return this.http.post(this.url_delete_dynamic_form, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  publish(data: any) {
    return this.http.post(this.url_publish, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  publishMultipleDynamicForm(data: any) {
    return this.http.post(this.url_publish_MultipleDynamicForm, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadBatchBasedOnEquipmentId(equipmentId) {
    return this.http.post(this.url_load_batch, equipmentId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadBatchForEquipmentRegister(equipmentId) {
    return this.http.post(this.url_load_batch_for_equ_register, equipmentId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadEquipmentListForForm(masterDynamicFormId: any, formMappingId: any) {
    let data = { "masterDynamicFormId": masterDynamicFormId, "formMappingId": formMappingId }
    return this.http.post(this.url_load_equipment_by_master_id, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadPreviewDocument(data: any): any {
    let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    return this.http.post(this.url_load_preview_document, data, options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
  }

  downloadPreviewDocument(data: any): any {
    let options = new RequestOptions({ responseType: ResponseContentType.ArrayBuffer });
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    return this.http.post(this.url_download_preview_document, data, options)
      .map((response: Response) => response.arrayBuffer())
      .map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
      .first();
  }

  generateQRCode(data: any) {
    return this.http.post(this.url_for_qr_code, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.text())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadLinkedMasterForm(documentType) {
    return this.http.post(this.load_linked_master_form_url, documentType, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveLinkedMasterForm(dto) {
    return this.http.post(this.save_linked_master_form_url, dto, this.config.getRequestOptionArgs())
      .map((resp) => resp)
      .catch(res => {
        return Observable.throw(res);
      });
  }

  loadMasterFormForDropDown() {
    return this.http.post(this.loadMasterFormForDropDownURL, '', this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadFormDataOfMasterFormIds(ids, permissionConstant) {
    let json = { masterReferenceIds: ids, documentType: permissionConstant }
    return this.http.post(this.loadFormDataOfMasterFormIdsURL, json, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadFormDataOfMasterFormDataIdsForView(ids) {
    return this.http.post(this.loadFormDataOfMasterFormDataIdsForViewURL, ids, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadLinkedFormAsDropDown(documentType) {
    return this.http.post(this.loadLinkedFormAsDropDownURL, documentType, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  
  loadDocumentSpecifiedFormData(documentType: any, masterId: any) {
    return this.http.get(this.loadDocumentSpecifiedFormDataURL + documentType + "/" + masterId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}
