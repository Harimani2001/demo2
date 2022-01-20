import { Component, HostListener } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import * as $ from "jquery";
import swal from 'sweetalert2';
import { environment } from './../environments/environment';
import { AdminComponent } from './layout/admin/admin.component';
import { User } from './models/model';
import { projectsetupService } from './pages/projectsetup/projectsetup.service';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-root',
  template: '<router-outlet><app-spinner></app-spinner></router-outlet>',
  styleUrls: ['./app.component.css'],
  host: {
    '(document:click)': 'onClickSessionExtend($event)',
    '(document:keypress)': 'onClickSessionExtend($event)',
  },
  providers: [AdminComponent,projectsetupService]
})
export class AppComponent {
  title = 'app';
  seconds=60;
  subscription: Subscription;
  browserRefresh = false;
  secondsText=`<p id="sessionSecondsText">Redirecting in 60 seconds.</p>`
  constructor(private http:Http,private router: Router){
    let interval;
   if(localStorage.getItem('token')){
      interval= setInterval(() => {
     if(localStorage.getItem('time')){
      let time=new Date().getTime();
      let timeOut=+atob(localStorage.getItem('time'))
      let toShowSessionPopUp= (timeOut - 60000);
      if(time>timeOut){
        this.logOut(interval);
      }else{
        if(time>toShowSessionPopUp&&time<timeOut){
         var ele= document.getElementById('sessionSecondsText');
         if(ele){
          this.seconds=this.seconds-1;
          let secondsText=`Redirecting in `+this.seconds+` seconds.`
          $('#sessionSecondsText').text(secondsText);
         }
        if(this.seconds==60){
          var that=this;
          swal({ title: 'You Session is About to Expire!',type: 'info',
            showCancelButton: true,confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',confirmButtonText: 'Stay Connected',
            cancelButtonText: 'Logout',confirmButtonClass: 'btn btn-primary m-r-10',
            cancelButtonClass: 'btn btn-default',allowOutsideClick: false,
            buttonsStyling: false,html: this.secondsText,timer:62000
          }).then(function (event) {
            that.seconds = 60;
            let  options = new RequestOptions();
            options.headers = new Headers();
            options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
            options.headers.append('X-tenant',localStorage.getItem("tenant"));
            let url=environment.common_URL + "user/checkSession";
           let sessionExtend = setInterval(() => { 
             if(that.http){
              that.http.post(url,'',options).subscribe(res=>{
              });
              clearInterval(sessionExtend);
             }
           });
              }).catch(err => {
            that.logOut(interval);
          });
        }
        }
      }
     }else{
       this.logOut(interval);
     }
   },1000);
  }else{
    if(interval)
    clearInterval(interval);
  }
  this.subscription = router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
      this.browserRefresh = !router.navigated;
    }
  });
  }

  logOut(interval){
    let  options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
    options.headers.append('X-tenant',localStorage.getItem("tenant"));
    let url=environment.common_URL + "user/logout";
      this.http.post(url, new User(),options).subscribe(res=>{
        localStorage.clear();
        if (interval)
          clearInterval(interval);
        document.location.reload();
      },er=>{
 		     if (interval)
          clearInterval(interval);
          document.location.reload();
      })

       
  }
  
  onClickSessionExtend(event) {
    localStorage.setItem("time", btoa('' + (new Date().getTime() + (20 * 60000))));
    new AppComponent(this.http,this.router);
  }

  @HostListener('window:unload', [ '$event' ])
  unloadHandler() {
      let  options = new RequestOptions();
      options.headers = new Headers();
      options.headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"));
      options.headers.append('X-tenant',localStorage.getItem("tenant"));
      let url=environment.common_URL + "user/onCloseBrowserTab";
        this.http.get(url,options).subscribe(res=>{
          localStorage.clear();
          this.router.navigate(["/login"]);
        },er=>{
          localStorage.clear();
          this.router.navigate(["/login"]);
        })
    }
}
