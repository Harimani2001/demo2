import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class EquipmentStatusUpdateService {
  
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'equipmentStatus/saveEquipmentStatus';
  url_load: string = this.helper.common_URL + 'equipmentStatus/loadEquipmentStatus';
  url_load_all: string = this.helper.common_URL + 'equipmentStatus/loadAllEquipmentStatus';
  url_delete:string = this.helper.common_URL + 'equipmentStatus/deleteEquipmentStatus';
  url_download_pdf: string = this.helper.common_URL + 'common/downloadPdfForEquipmentStatus';
  url_loadById: string = this.helper.common_URL + 'equipmentStatus/loadEquipmentStatusById';
  url_load_dynamicForm_data: string = this.helper.common_URL + 'dynamicForm/loadEquipmemtStatusDynamicForms';
  url_load_by_EquipmentId:string = this.helper.common_URL + 'equipmentStatus/loadByEquipmentId';
  url_get_holiday:string = this.helper.common_URL + 'equipmentStatus/getHolidayDate';
  url_getBatch:string = this.helper.common_URL + 'equipmentStatus/batchData';
  url_load_Status = this.helper.common_URL + 'equipmentStatus/loadAllStatus';
  url_load_Task_description = this.helper.common_URL + 'equipmentStatus/loadDescriptions';
  Url_complete_status = this.helper.common_URL + 'equipmentStatus/changeCompleteStatus';
  url_load_batch_product = this.helper.common_URL + 'batchCreation/loadBatchById'
  saveEquipmentStatus(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadAllStatus(equipmentId){
    return this.http.post(this.url_load_Status, equipmentId,this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  loadEquipmentStatus(equipmentId:any,batchId:any) {
    return this.http.post(this.url_load, {"equipmentId":equipmentId,"batchId":batchId}, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  delete(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  findHoliday(date:any){
    return this.http.post(this.url_get_holiday,date, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadByEquipmentId(data:any){
    return this.http.post(this.url_load_by_EquipmentId, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadAllEquipmentStatus() {
    return this.http.post(this.url_load_all,"", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  generatePdf(type:any) {
    return this.http.post(this.url_download_pdf,type,this.config.getRequestOptionArgs())
      .map((resp) => resp)
      .catch(res => {
        return Observable.throw(res);
      });
  }
  loadEquipmentStatusById(id:any) {
    return this.http.post(this.url_loadById, id, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  loadTaskDescriptionByEquipmentId(equipmentId:any) {
    return this.http.post(this.url_load_Task_description, equipmentId, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  loadAllEquipmentStatusFormData(data:any) {
    return this.http.post(this.url_load_dynamicForm_data, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  
  loadBatch(data:any){
    return this.http.post(this.url_getBatch, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  changeCompleteStatus(data){
    return this.http.post(this.Url_complete_status, data, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }

  loadBatchProduct(batchId:any){
    return this.http.post(this.url_load_batch_product, batchId, this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  }
  
}