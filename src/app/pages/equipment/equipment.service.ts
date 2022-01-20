import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class EquipmentService {
  constructor(private http: Http, public helper: Helper, public config: ConfigService) { }
  url_save: string = this.helper.common_URL + 'equipment/saveEquipment';
  url_load: string = this.helper.common_URL + 'equipment/loadAllEquipments';
  url_loadActiveEquipments = this.helper.common_URL + 'equipment/loadAllActiveEquipments';
  url_delete: string = this.helper.common_URL + 'equipment/deleteEquipmentById';
  url_edit: string = this.helper.common_URL + 'equipment/loadEquipmentById';
  url_load_equipments_by_user: string = this.helper.common_URL + 'equipment/loadEquipmentsByUser';
  url_form_limit: string = this.helper.common_URL + 'equipment/canCreateEquipmentForOrganization';
  url_equipment_tasks: string = this.helper.common_URL + 'projectTask/loadTasksForEquipment';
  url_clone_equipment: string = this.helper.common_URL + 'equipment/cloneEquipment';
  url_downloadExcel: string = this.helper.common_URL + 'equipment/sampleExcel';
  url_loadActiveEquipmentsForLocations = this.helper.common_URL + 'equipment/loadAllActiveEquipmentsForLocations';
  url_extractExcelFile: string = this.helper.common_URL + 'equipment/extractExcelFile';
  url_saveBulk: string = this.helper.common_URL + 'equipment/saveBulk';
  url_loadOpenEquipmentTasksForLocation: string = this.helper.common_URL + 'projectTask/loadOpenEquipmentTasksForLocation';

  createEquipment(data: any) {
    return this.http.post(this.url_save, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadEquipment() {
    return this.http.post(this.url_load, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadAllActiveEquipment() {
    return this.http.post(this.url_loadActiveEquipments, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadActiveEquipmentsForLocations(locations: any[]) {
    return this.http.post(this.url_loadActiveEquipmentsForLocations, locations, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  deleteEquipment(data: any) {
    return this.http.post(this.url_delete, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  editEquipment(data: any) {
    return this.http.post(this.url_edit, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadEquipmentsByuser() {
    return this.http.post(this.url_load_equipments_by_user, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  canCreateEquipment() {
    return this.http.post(this.url_form_limit, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadEquipmentTasks(equipmentId: any) {
    return this.http.post(this.url_equipment_tasks, equipmentId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  cloneOfEquipment(data: any) {
    return this.http.post(this.url_clone_equipment, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  downloadSampleEquipmentFile() {
    return this.http.post(this.url_downloadExcel, "", this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }

  extractExcelFile(formData: any) {
    return this.http.post(this.url_extractExcelFile, formData, this.config.getRequestOptionArgs())
      .map((resp) => resp.json()).catch(res => {
        return Observable.throw(res.json());
      });
  }

  saveBulk(list) {
    return this.http.post(this.url_saveBulk, list, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadOpenEquipmentTasksForLocation(locationId: any) {
    return this.http.post(this.url_loadOpenEquipmentTasksForLocation, locationId, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}