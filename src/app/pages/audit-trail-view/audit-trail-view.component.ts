import { Component, Input, OnChanges, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { AuditTrailService } from '../audit-trail/audit-trail.service';

@Component({
  selector: 'app-audit-trail-view',
  templateUrl: './audit-trail-view.component.html',
  styleUrls: ['./audit-trail-view.component.css']
})

export class AuditTrailViewComponent implements OnInit, OnChanges {
  oldTable = { column: new Array, rows: new Array() };
  newTable = { column: new Array, rows: new Array() };
  @ViewChild('auditForTable') tableModal;
  @ViewChild('myTable') table: any;
  @Input() public permission: any;
  @Input() public mappingId: any;
  @Input() public projects: any[] = new Array();
  public auditViewSpinnerFlag: boolean = false;
  tableOffset: number = 0;
  public data: any;
  public rowsOnPage = 10;

  constructor(public helper: Helper, public auditService: AuditTrailService, public configService: ConfigService) { }

  ngOnInit() {
    this.loadData(this.permission, this.mappingId, this.projects);
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.permission) {
      if (changes.permission.previousValue != this.permission) {
        this.loadData(this.permission, this.mappingId, this.projects);
      }
    }
  }

  loadData(permission, mapping?, projects?) {
    return new Promise<any>(resolve => {
      try {
        if (!this.auditViewSpinnerFlag)
          this.auditViewSpinnerFlag = true;
        if (mapping === undefined || mapping === 0 || mapping === '')
          mapping = false;
        let ids = [];
        if (projects && projects.length > 0)
          ids = this.projects.map(m => m.id);
        let data = { "permission": permission, "mappingId": mapping, "projectIds": ids };
        this.auditService.getDataBasedOnPermissionConstants(data).subscribe(jsonResp => {
          this.tableOffset = 0;
          this.data = jsonResp.result;
          this.data.forEach(element => {
            if (!this.helper.isEmpty(element.systemRemarks)) {
              element.systemRemarks = this.createRemarkList(element.systemRemarks);
              if (element.tableAudit.length > 0 && element.systemRemarks.length > 0 && element.systemRemarks[0] === "No changes has been made") {
                element.systemRemarks[0] = "Please find the below table section for more details."
              }
            }
            if (!this.helper.isEmpty(element.userRemarks)) {
              element.userRemarks = this.createRemarkList(element.userRemarks);
            }
          });
          resolve('');
          this.auditViewSpinnerFlag = false;
        });
      } catch (error) {
        resolve('');
      }
    });
  }

  onChangePage(event: any): void {
    this.tableOffset = event.offset;
  }

  rowsAfterFilter() {
    this.tableOffset = 0;
  }

  createRemarkList(data) {
    let returnArray = [];
    let array = [];
    array = data.split("<#goval#>");
    if (array.length == 1)
      array = data.split(",");
    array.forEach(element => {
      if (element != "") {
        element = element.replace(/\\n/g, '').trim();
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
              oldElement.style.backgroundColor = '#F08080'
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
