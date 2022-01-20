import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {Helper} from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
@Component({
  selector: 'app-auth',
  template: '<router-outlet><app-spinner></app-spinner></router-outlet>'
})
export class AuthComponent implements CanActivate  {

    constructor(public router: Router,public helper:Helper,public config: ConfigService) {}
    canActivate(): boolean{
        if(!this.config.isTokenPresent()){
            this.router.navigate(["/login"])
            return false;
        }else{
            return true; 
        }
    }
  

}
