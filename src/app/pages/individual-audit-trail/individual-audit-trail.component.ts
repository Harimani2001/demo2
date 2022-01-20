import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Helper } from '../../shared/helper';
import { AuditTrailService } from '../audit-trail/audit-trail.service';

@Component({
  selector: 'app-individual-audit-trail',
  templateUrl: './individual-audit-trail.component.html',
  styleUrls: ['./individual-audit-trail.component.css']
})
export class IndividualAuditTrailComponent implements OnInit {
  oldTable={column:new Array,rows:new Array()};
  newTable={column:new Array,rows:new Array()};
  @ViewChild('auditForTable') tableModal;
  data:any[] = new Array();
  @Input() public permission:any;
  @Input() public id:any;
  viewFlag:boolean=false;

  constructor(public helper: Helper,public auditService: AuditTrailService) { }

  ngOnInit() {
    // this.loadData(this.permission,this.id);
  }

  loadData(permission,id){
    this.auditService.getDataBasedOnPermissionConstantsAndId(permission,id).subscribe(jsonResp => {
      this.data = jsonResp;
      this.data.forEach(element => {
        element.value.forEach(e=>{
          if (!this.helper.isEmpty(e.systemRemarks)) {
            e.systemRemarks = this.createRemarkList(e.systemRemarks);
            if(e.tableAudit.length > 0 && e.systemRemarks.length > 0 && e.systemRemarks[0] === "No changes has been made"){
              e.systemRemarks[0]="Please find the below table section for more details."
            }
          }
          if (!this.helper.isEmpty(e.userRemarks)) {
            e.userRemarks = this.createRemarkList(e.userRemarks);
          }
        })
      });
    });
  }

  createRemarkList(data) {
    let returnArray = [];
    let array=[];
    array = data.split("<#goval#>");
    if(array.length==1)
    array = data.split(",");
    array.forEach(element => {
      if (element != "") {
        element=element.replace(/\\n/g, '').trim();
        returnArray.push(element);
      }
    });
    return returnArray;
  }

  loadTableChanges(table) {
    this.oldTable = table.old;
    this.newTable = table.new;
    this.tableModal.show();
    setTimeout(() => {
      $("table#newTableId>tbody>tr").each(function (iIndex, ele) {
        let newColumn = $(this).find("td");
        for (let index = 0; index < newColumn.length; index++) {
          const newElement = newColumn[index];
          const oldElement = document.getElementById('oldtd_' + iIndex + '_' + index);
          if (oldElement) {
            if (newElement.innerHTML != oldElement.innerHTML) {
              (<any>$(this).find("td")[index]).style.backgroundColor = "#90EE90";
              oldElement.style.backgroundColor =  '#F08080'
            } else if (newElement.innerHTML == oldElement.innerHTML) {
              (<any>$(this).find("td")[index]).style.backgroundColor = "white";
              oldElement.style.backgroundColor = "white"
            }
          } else {
            (<any>$(this).find("td")[index]).style.backgroundColor = "#FBE870";
          }
        }
      });
    }, 10);
  }

}
