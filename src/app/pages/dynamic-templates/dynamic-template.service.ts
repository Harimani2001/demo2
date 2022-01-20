import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Helper } from '../../shared/helper';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { DynamicTemplateDto, RevisionDto } from '../../models/model';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class DynamicTemplateService {

  constructor( private http: Http, public helper: Helper,public config : ConfigService) { }
 
  url_loadAllDynamicformTemplates: string =this.helper.common_URL+'dynamicTempletes/loadDynamicTemplatesByProject';
  url_loadDynamicTemplateDataBasedOnId:string =this.helper.common_URL+'dynamicTempletes/loadDynamicTemplateDataBasedOnId';
  url_loadDynamicTemplateData:string =this.helper.common_URL+'dynamicTempletes/update';
  url_loadDynamicTempleteDataBasedOnTitleOrganisationAndDocumentStatus: string = this.helper.common_URL + 'dynamicTempletes/loadIndividualDynamicTempleteDataBasedOnTitleOrganisationAndDocumentStatus';
  url_loadAllRevisionData:string =this.helper.common_URL+'dynamicTempletes/loadAllRevisionData';
  
  loadDynamicformTemplateData () {  
    return this.http.post(this.url_loadAllDynamicformTemplates,this.config.getRequestOptionArgs())
     .map((resp) => resp.json())
     .catch(res => {
         return Observable.throw(res.json());
       });
    }

    loadDynamicTemplateDataBasedOnId (rowId:any) {  
      return this.http.post(this.url_loadDynamicTemplateDataBasedOnId, rowId ,this.config.getRequestOptionArgs())
       .map((resp) => resp.json())
       .catch(res => {
           return Observable.throw(res.json());
         });
      }
     
      UpdateDynamicTemplateData (data: DynamicTemplateDto) {  
        return this.http.post(this.url_loadDynamicTemplateData, data ,this.config.getRequestOptionArgs())
         .map((resp) => resp.json())
         .catch(res => {
             return Observable.throw(res.json());
           });
        }

        loadIndividualDynamicTempleteDataBasedOnTitleOrganisationAndDocumentStatus (title) {  
          return this.http.post(this.url_loadDynamicTempleteDataBasedOnTitleOrganisationAndDocumentStatus, title,this.config.getRequestOptionArgs())
           .map((resp) => resp.json())
           .catch(res => {
               return Observable.throw(res.json());
             });
          }
        
          loadAllRevisionData (dto:RevisionDto) {  
            return this.http.post(this.url_loadAllRevisionData, dto,this.config.getRequestOptionArgs())
             .map((resp) => resp.json())
             .catch(res => {
                 return Observable.throw(res.json());
               });
            }
}
