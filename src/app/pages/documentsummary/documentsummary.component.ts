import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { IOption } from 'ng-select';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CommonModel, LookUpItem } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { DashBoardService } from '../dashboard/dashboard.service';
import { TemplateBuiderService } from '../templatebuilder/templatebuilder.service';
import { Helper } from './../../shared/helper';
import { AuditTrailViewComponent } from '../audit-trail-view/audit-trail-view.component';

@Component({
  selector: 'app-documentsummary',
  templateUrl: './documentsummary.component.html',
  styleUrls: ['./documentsummary.component.css','../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentsummaryComponent implements OnInit {
  public data:any;
  constructor(private adminComponent: AdminComponent, public dashboardService: DashBoardService,
    private service: TemplateBuiderService,
    public router: Router, public config: ConfigService, private http: Http, public helper: Helper) { }
  public commonModel: CommonModel = new CommonModel();
  public filteredPendingDocList: any;
  public userModalList: any[] = new Array();
  public docItemList: any;
  public filteredpending:any;
  public spinnerFlag: boolean = true;
  public dataTypeFilter: any = 'opt1';
  public searchData:any;
  public filteredcompleted:any;
  public tabchangeId: Number = 0;
  userList: Array<IOption> = new Array<IOption>();
  public userSelectionList: LookUpItem[] = new Array();
  public filteredCompletedDocList: any[] = new Array();
  selectDocumentFilter="";
  public filterQuery = '';
  @ViewChild('documentSummaryTab') tab:any;
  @ViewChild('auditView') auditView: AuditTrailViewComponent;
  submitted=false;
  ngOnInit() {
    if(localStorage.getItem('documentSummaryTab'))
    this.tab.activeId=this.helper.decode(localStorage.getItem('documentSummaryTab'));
    this.adminComponent.setUpModuleForHelpContent("180");
    this.spinnerFlag=true;
    localStorage.removeItem('documentSummaryType');
    this.commonModel.categoryName = this.tab.activeId=="1"?'completed':'pending';
    this.commonModel.jsonExtraData=this.dataTypeFilter;
    this.loadproj()
    this.loaddata();

  }
  onTabChange(id: any) {
    this.spinnerFlag = true;
    this.tabchangeId = id;
    if (id === '0') {
      this.commonModel.categoryName = 'pending';
    }  else if (id === '1') {
      this.commonModel.categoryName = 'completed';
    }
    this.loadproj();
  }
  loadproj(): any {
    this.spinnerFlag=true;
    this.commonModel.type = "workflowsummary";

    this.Api(this.commonModel, "workFlow/loadDocumentsForUser").subscribe(response => {
      this.filteredpending = response.pendingList;
      this.filteredcompleted = response.completedList;
      let data = "";
      if(localStorage.getItem('documentSummaryType') !="undefined" && localStorage.getItem('documentSummaryType'))
        data = this.helper.decode(localStorage.getItem('documentSummaryType'));
       this.filteredPendingDocList = new Array();
       this.filteredCompletedDocList = new Array();
      if (data === "") {
        this.filteredPendingDocList = this.filteredpending;
        this.filteredCompletedDocList = this.filteredcompleted;
      } else {
        this.helper.setworkflowdropdownValues(data)
        this.filteredpending.forEach(element => {
          if (element.documentType === data) {
            this.filteredPendingDocList.push(element);
          }
        });
        this.filteredcompleted.forEach(element => {
          if (element.documentType === data) {
            this.filteredCompletedDocList.push(element);
          }
        });
      }
      this.spinnerFlag=false;

    },
    err => {
      this.spinnerFlag=false;
    });
  }
  Api(data, url) {
    return this.http.post(this.helper.common_URL + url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  routeToComponent(row) {
    if (row.url.toLowerCase().indexOf('ynamic') >= 0) {
      this.adminComponent.redirect(row.url, '/documentsummary')
    }else{
      let documentList = new Array();
    documentList.push("dummy data")
      this.router.navigate([row.url], { queryParams: { id: row.documentId, status: '/documentsummary', exists: true, list: documentList }, skipLocationChange: true });

    }
    }

  sendReminder(row) {
    this.data=row;
    this.submitted=false;
    this.userModalList=new Array();
    this.loadusersForReminderEmail(row)
  }
  loadusersForReminderEmail(row) {

        let list: any[] = row.levelusers;
        this.userList = list.map(option => ({ value: option, label:option }));
         let updatedMap = row.nextLevelUsers;
        Object.keys(updatedMap).forEach((key: any) => {
          list.forEach(d => {
            if (Number(d.id) === Number(key)) {
              this.userModalList.push(d.email)
            }
          });
        });
  }

  onChange(data: any) {
    if(this.auditView)
    this.auditView.loadData(data.key);
    this.searchData="";
    this.filteredPendingDocList = new Array();
    this.filteredCompletedDocList = new Array();
    localStorage.removeItem('documentSummaryType');
    if (data === "") {
      this.filteredPendingDocList = this.filteredpending;
      this.filteredCompletedDocList = this.filteredcompleted;
    } else {
      localStorage.setItem('documentSummaryType',this.helper.encode(data.key));
      this.helper.setworkflowdropdownValues(data)
      this.filteredpending.forEach(element => {
        if (element.documentType === data.key || element.documentTitle === data.value) {
          this.filteredPendingDocList.push(element);
        }
      });
      this.filteredcompleted.forEach(element => {
        if (element.documentType === data.key || element.documentTitle === data.value) {
          this.filteredCompletedDocList.push(element);
        }
      });
    }
  }


  send(){
    this.spinnerFlag=true;
    this.data.LevelUsers=null;
    this.data.levelusers=this.userModalList


        this.service.sendReminder(this.data).subscribe(result => {

          if (result.success) {
            this.swalfunction("mailed Successfully","Success","success")
            this.spinnerFlag=false;
          } else {
            this.swalfunction(result.error,"error","error")
            this.spinnerFlag=false;
          }
        },
        err => {
          this.spinnerFlag=false;
        });
  }

  loaddata() {
    this.spinnerFlag=true;
    this.docItemList = new Array<any>();
    this.config.getDocumentsOfProjectForUserForApproval().subscribe(resp => {
        this.docItemList=resp;
        if(localStorage.getItem('documentSummaryType') !="undefined" && localStorage.getItem('documentSummaryType'))
        this.docItemList.forEach(element => {
          if(element.key==this.helper.decode(localStorage.getItem('documentSummaryType')))
          this.selectDocumentFilter = element;
        });
    },
      err => {
        this.spinnerFlag=false;
      }
    );
  }
  swalfunction(text:any,title:any,type:any)
  {



    let timerInterval;
    swal({
      title:title,
      text:text,
      type:type,
      timer:this.helper.swalTimer,
      showConfirmButton:false,
      onClose: () => {
        clearInterval(timerInterval)
      }
    });
  }

}
