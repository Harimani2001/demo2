import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(private adminComponent: AdminComponent, private http: Http, public config: ConfigService, public helper: Helper) { }
  public notificationList: any = new Map<any,any>();
  notificationSpinnerFlag = false;
  ngOnInit() {
    this.loadall();
    this.adminComponent.setUpModuleForHelpContent("");
  }
  loadall() {
    this.notificationSpinnerFlag = true;
    this.loadnotification("", "usernotification/loadallnotification").subscribe(response => {
      this.notificationList = response;
      this.notificationSpinnerFlag = false;
    }, er => this.notificationSpinnerFlag = false);

  }

  viewedFlagForsinglenotification(item) {
    const data: any[] = new Array<any>();
    data.push(item);
    this.loadnotification(data, 'usernotification/checkedNotification').subscribe(response => {
      this.loadall()

    });

  }

  clearAll(list:Map<any,any[]>){
    const data: any[] = list['key'];
    data.forEach(notification=>{notification.deleteFlag='Y'});
    this.loadnotification(data, 'usernotification/checkedNotification').subscribe(response => {
      this.loadall();
      this.adminComponent.loadNotification();
    });
   
  }
  loadnotification(data, url) {
    return this.http.post(this.helper.common_URL + url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

}
