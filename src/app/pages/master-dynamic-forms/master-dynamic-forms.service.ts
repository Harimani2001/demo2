import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Helper } from '../../shared/helper';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class MasterDynamicFormsService {

  constructor(private http: Http, public helper: Helper,public config:ConfigService) { }
  url_save: string = this.helper.common_URL + 'dynamicForm/save';
  url_template_load: string = this.helper.common_URL + 'dynamicForm/loadTemplate';
  url_published_template_load: string = this.helper.common_URL + 'dynamicForm/loadPublishedTemplate';
  url_delete: string = this.helper.common_URL + 'dynamicForm/delete';
  url_edit: string = this.helper.common_URL + 'dynamicForm/edit';
  url_template_exist: string = this.helper.common_URL + 'dynamicForm/isExists';
  url_load_forms: string = this.helper.common_URL + 'dynamicForm/loadAllForms';
  url_published_template_by_equipment_batch_load: string = this.helper.common_URL + 'dynamicForm/loadMasterDynamicFormsByEquipmentAndBatch';
 url_published_template_by_equipment_load: string = this.helper.common_URL + 'dynamicForm/loadPublishedTemplateByEquipment';
 url_does_mapping_exists: string = this.helper.common_URL + 'dynamicForm/findByFormIdsDoesMappingExists';
 url_loadFormOrMappedFormBasedOnProject: string = this.helper.common_URL + 'dynamicForm/loadFormOrMappedFormBasedOnProject';
 url_loadEquipmentMappingForms: string = this.helper.common_URL + 'dynamicForm/loadEquipmentMappingForms';
 url_cloneMasterForm: string = this.helper.common_URL + 'dynamicForm/cloneOfMasterForm';

  createMasterDynamicForm(data: any) {
    return this.http.post(this.url_save, data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  loadTemplate() {
    return this.http.post(this.url_template_load,"",this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  
  loadPublishedTemplate(){
      return this.http.post(this.url_published_template_load, "",this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
        .catch(res => {
          return Observable.throw(res.json());
        });
    }

  deleteTemplate(data: any) {
    return this.http.post(this.url_delete,data,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });

  }

  editDynamicForm(id: any) {
    return this.http.post(this.url_edit, id,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });

  }

  loadDynamicForm(Orgid: any) {
    return this.http.post(this.url_load_forms, Orgid,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });

  }

  isTemplateExists(templateName: any) {
    return this.http.post(this.url_template_exist,templateName,this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  loadMasterDynamicFormsByEquipmentAndBatch(data:any){
    return this.http.post(this.url_published_template_by_equipment_batch_load, data,this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  
  loadPublishedTemplateByEquipment(equipmentId:any){
    return this.http.post(this.url_published_template_by_equipment_load, equipmentId,this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  
  findByFormIdsDoesMappingExists(masterFormIds){
    return this.http.post(this.url_does_mapping_exists, masterFormIds,this.config.getRequestOptionArgs())
    .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

 loadFormOrMappedFormBasedOnProject(onlyMultipleForm){
  return this.http.post(this.url_loadFormOrMappedFormBasedOnProject, onlyMultipleForm,this.config.getRequestOptionArgs())
  .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  
 }
 loadEquipmentMappingForms(){
  return this.http.post(this.url_loadEquipmentMappingForms, "",this.config.getRequestOptionArgs())
  .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  
 }
 
 cloneMasterForm(json){
  return this.http.post(this.url_cloneMasterForm,json,this.config.getRequestOptionArgs())
  .map((resp) => resp.json())
    .catch(res => {
      return Observable.throw(res.json());
    });
  
 }
}

