import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { OrganizationDetails } from "../../models/model";
import { Observable } from "rxjs/Observable";
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
@Injectable()
export class OraganizationService {

    constructor( private http: Http,public helper:Helper,public config : ConfigService ) { }
     saveorganizationDetailsURL: string = this.helper.common_URL+"organization/saveOrganizationDetails";
     getCheckEmailURL: string = this.helper.common_URL+"organization/isOrganizationExists";
     getNameURL: string = this.helper.common_URL+"organization/isOrganizationName";
     getorganizationListURL: string = this.helper.saas_URL+"/company/getOrganizationDetails";
     getorganizationDetailsByIdURL: string = this.helper.saas_URL+"/company/loadByOrgId";
     getorganizationDetailsById: string = this.helper.common_URL+"organization/loadOrganizationDetails";
     deleteorganizationURL: string = this.helper.saas_URL+"/company/deleteOrganization";
     updateKbUrl: string = this.helper.common_URL+"organization/updateDefaultKnowledgeBase";
     updateEmailTemplateUrl: string = this.helper.common_URL+"organization/updateDefaultEmailTemplate";
     updateEmailRuleUrl: string = this.helper.common_URL+"organization/updateDefaultEmailRule";
    getTimezoneListURL: string = this.helper.common_URL+"common/getTimeZoneList";
    deactivateorganizationURL: string = this.helper.saas_URL+"/company/deactiveOrg";
    saveOrgInLicenseDBURL: string = this.helper.saas_URL+ "/company/saveOrganizationDetails";
    checkEmailExistsURL: string = this.helper.saas_URL+"/company/isOrgEmailExists";
    checkOrgNameURL: string = this.helper.saas_URL+"/company/isOrgNameExists";
    readGXPExcelFileURL: string = this.helper.common_URL+"organization/uploadGXPQuestionsFromExcel";
    updateBuildStatus_url: string = this.helper.saas_URL+"/company/updateBuildStatus";
    downloadGxpQuestionsURL: string = this.helper.common_URL+"organization/downloadGxpQuestions";
      saveAndGoto( organizationDetails: OrganizationDetails ) {
         return this.http.post( this.saveorganizationDetailsURL, organizationDetails,this.config.getRequestOptionArgsForOrganizationCreation(organizationDetails.organizationName))
             .map(( resp ) => resp.json() )
             .catch( res => {
                 return Observable.throw( res.json() );
            } );
    }
    onChangeGetorganizationDetails( checkEmail: string ) {
        return this.http.post( this.getCheckEmailURL, checkEmail ,this.config.getRequestOptionArgs())
            .map(( resp ) => resp.json() )
            .catch( res => {
                return Observable.throw( res.json() );
            } );
    }

   isOrgNameExist( orgName: string ) {
        return this.http.post( this.getNameURL, orgName ,this.config.getRequestOptionArgs())
            .map(( resp ) => resp.json() )
            .catch( res => {
                return Observable.throw( res.json() );
            } );
    }

     getorganizationList(loginId:any) {
         return this.http.get( this.getorganizationListURL )
             .map(( resp ) => resp.json()
            )
             .catch( res => {
                return Observable.throw( res.json() );
             } );
     }
     getDataForEdit( id: any ) {
         return this.http.post( this.getorganizationDetailsByIdURL, id,this.config.getRequestOptionArgs())
             .map(( resp ) => resp.json() )
             .catch( res => {
                 return Observable.throw( res.json() );
             } );
     }

     getDataForEditFromIndvDb( id: any ) {
        return this.http.post( this.getorganizationDetailsById, id,this.config.getRequestOptionArgs())
            .map(( resp ) => resp.json() )
            .catch( res => {
                return Observable.throw( res.json() );
            } );
    }

     deleteorganization( organizationDetails: OrganizationDetails ) {
         return this.http.post( this.deleteorganizationURL, organizationDetails ,this.config.getRequestOptionArgs())
             .map(( resp ) => resp.json() )
             .catch( res => {
               return Observable.throw( res.json() );
             } );
     }

    updateDefaultKb(id) {
        return this.http.post( this.updateKbUrl, id ,this.config.getRequestOptionArgs())
            .map(( resp ) => resp.json() )
            .catch( res => {
              return Observable.throw( res.json() );
        } );
    }

    updateDefaultEmailTemplate(id) {
        return this.http.post( this.updateEmailTemplateUrl, id ,this.config.getRequestOptionArgs())
            .map(( resp ) => resp.json() )
            .catch( res => {
              return Observable.throw( res.json() );
        } );
    }

    updateDefaultEmailRule(id) {
        return this.http.post( this.updateEmailRuleUrl, id ,this.config.getRequestOptionArgs())
            .map(( resp ) => resp.json() )
            .catch( res => {
              return Observable.throw( res.json() );
        } );
    }
     
     getTimezoneList() {
        return this.http.post( this.getTimezoneListURL,"",this.config.getRequestOptionArgs() )
            .map(( resp ) => resp.json()
           )
            .catch( res => {
               return Observable.throw( res.json() );
            } );
    }

    saveOrgDetailsInLicenseDb(organizationDetails: OrganizationDetails) {
        return this.http.post(this.saveOrgInLicenseDBURL,organizationDetails)
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
    deactivateOrganization( id: any ) {
        return this.http.post( this.getorganizationDetailsByIdURL, id,this.config.getRequestOptionArgs())
            .map(( resp ) => resp.json() )
            .catch( res => {
                return Observable.throw( res.json() );
            } );
    }

    checkEmailExists( email: string) {
        return this.http.post(this.checkEmailExistsURL,email)
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
    checkNameExists( email: string) {
        return this.http.post(this.checkOrgNameURL,email)
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
    uploadFxpFile(formData,orgName) {
        return this.http.post( this.readGXPExcelFileURL, formData,this.config.getRequestOptionArgsForOrganizationCreation(orgName))
            .map(( resp ) => resp.json() )
            .catch( res => {
                return Observable.throw( res.json() );
           } );
   }

   updateBuildStatus( id:any) {
    return this.http.get(this.updateBuildStatus_url+"/"+id)
        .map((resp) => resp.json())
        .catch(res => {
            return Observable.throw(res.json());
        });
    }
    downloadGxpQuestions(orgName) {
        return this.http.get( this.downloadGxpQuestionsURL,this.config.getRequestOptionArgsForOrganizationCreation(orgName))
        .map(( resp ) => resp.json() )
        .catch( res => {
            return Observable.throw( res.json() );
       });
    }
}
