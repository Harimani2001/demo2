import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helper } from '../../shared/helper';
import { AdminComponent } from './../../layout/admin/admin.component';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SupportComponent implements OnInit {
  data: any = new Array();
  constructor(private adminComponent: AdminComponent, public helper: Helper) { }

  ngOnInit() {
    this.adminComponent.configService.HTTPPostAPI("", "admin/support").subscribe(response => {
      this.data = response;
    });
  }

  download(level) {
    this.adminComponent.spinnerFlag = true;
    this.adminComponent.downloadOrViewFile(level.downloadName, level.url, false).then(resp => {
      this.adminComponent.spinnerFlag = false;
    });
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
