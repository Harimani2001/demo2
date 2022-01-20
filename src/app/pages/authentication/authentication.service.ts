
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Http } from '@angular/http';
import { User } from '../../models/model';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';

@Injectable()
export class AuthenticationService {

    url_login: string = this.helper.common_URL + "user/newUserLogin";
    url_register: string = this.helper.common_URL + "user/userRegistration";
    url_logOut: string = this.helper.common_URL + "user/logout";
    getUserNameURL: string = this.helper.common_URL + "user/isUserExists";
    changePasswordURL: string = this.helper.common_URL + "user/changePassword";
    isValidatePasswordURL: string = this.helper.common_URL + "user/validatePassword";
    forgetPassword_URL: string = this.helper.common_URL + "user/forgotPassword";
    clear_session_URL: string = this.helper.common_URL + "user/clearSession";
    checkForActiveSessions_URL: string = this.helper.common_URL + "user/checkForActiveSessions";
    getOrgCode_URL: string = this.helper.saas_URL+"/noAuth/signin";
    constructor(private http: Http, public helper: Helper,public config:ConfigService) { }
    loginCall(userName,password) {
        return this.http.post(this.url_login, {emailOrUsername:userName,password:password},this.config.getRequestOptionArgsForLoginCall())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
    signUpCall(userReg: User) {
        return this.http.post(this.url_register, userReg,this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
    onChangeGetUserDetails(value: User) {
        return this.http.post(this.getUserNameURL, value,this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    changePassword(user: User) {
        return this.http.post(this.changePasswordURL, user,this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    isPasswordIsExist(user: User) {
        return this.http.post(this.isValidatePasswordURL, user,this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
    logOut(user: any) {
        return this.http.post(this.url_logOut, user,this.config.getRequestOptionArgs())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
    forgetPassword(email: User) {
        return this.http.post(this.forgetPassword_URL, email,this.config.getRequestOptionArgsForLogin())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
    clearSession(userName:any) {
        return this.http.post(this.clear_session_URL, userName,this.config.getRequestOptionArgsForsession())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    checkForActiveSessions(userNameOrEmail: any) {
        return this.http.post(this.checkForActiveSessions_URL,userNameOrEmail,this.config.getRequestOptionArgsForLogin())
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    getOrgCode(userNameOrEmailObj: any) {
        return this.http.post(this.getOrgCode_URL,userNameOrEmailObj)
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }
}
