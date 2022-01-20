import { Component, OnInit, Input } from '@angular/core';
import { AdminComponent } from '../../layout/admin/admin.component';

@Component({
  selector: 'app-email-config-for-project',
  templateUrl: './email-config-for-project.component.html',
  styleUrls: ['./email-config-for-project.component.css']
})
export class EmailConfigForProjectComponent implements OnInit {
  @Input() jsonArray: any = new Array();
  Colors: Array<any> = ["#009da0", "#ff8d60", "#1cbcd8", "#0cc27e", "#ff586b", "#009da0", "#009da0", "#ff8d60", "#1cbcd8", "#0cc27e", "#ff586b", "#009da0", "#009da0", "#ff8d60", "#1cbcd8", "#0cc27e", "#ff586b", "#009da0", "#009da0", "#ff8d60", "#1cbcd8", "#0cc27e", "#ff586b", "#009da0"];
  constructor( private adminComponent: AdminComponent) { }

  ngOnInit() {
    this.adminComponent.setUpModuleForHelpContent("");
  }


  getColors(index) {
    let num = this.getnumber(index);
    return this.Colors[num];
  }

  getnumber(data) {
    let i = data;
    if (i > this.Colors.length - 1) {
      i = i - this.Colors.length;
      if (i < this.Colors.length) {
        return i;
      }
      else {
        this.getnumber(i);
      }
    }
    else {
      return i;
    }
  }


  documentWiseEmailAlertFollowUpDisable(checkedFlag, document) {
    document.deleteFlag = checkedFlag;
    document.levels.forEach(level => {
      level.flag = checkedFlag;
      level.users.forEach(user => {
        user.emailAlertFlag = checkedFlag;
        user.followUpFlag = checkedFlag;
      })
    });

  }

  levelWiseEmailAlertFollowUpDisable(checkedFlag, level, document) {
    level.flag = checkedFlag;
    level.users.forEach(user => {
      user.emailAlertFlag = checkedFlag;
      user.followUpFlag = checkedFlag;
    })
    if (document.levels.filter(level => level.flag).length == document.levels.length)
      document.deleteFlag = true;
    else document.deleteFlag = false;
  }


  toCheckAllUserSelectedThenCheckLevel(checkedFlag, user, emailORFollowUPFlag, allLevel, document) {
    if (emailORFollowUPFlag)
      user.emailAlertFlag = checkedFlag;
    else
      user.followUpFlag = checkedFlag;
    allLevel.forEach(element => {
      if (element.users.filter(user => user.emailAlertFlag && user.followUpFlag).length == element.users.length)
        element.flag = true;
      else element.flag = false;
    });
    if (document.levels.filter(level => level.flag).length == allLevel.length)
      document.deleteFlag = true;
    else document.deleteFlag = false;
  }
}