import { filter } from './../../formbuilder/dom';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import swal from 'sweetalert2';
import { CommonModel,UserPrincipalDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { DashBoardService } from '../dashboard/dashboard.service';
import { AdminComponent } from '../../layout/admin/admin.component';

@Component({
  selector: 'app-doc-status',
  templateUrl: './doc-status.component.html',
  styleUrls: ['./doc-status.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DocStatusComponent implements OnInit {
  @ViewChild('myTable') table: any;
  spinnerFlag=false;
  modalSpinner=false;
  approvedButtonFlag=false;
  validationMessage="";
  public commonModel: CommonModel = new CommonModel();
  public searchData:any;
  public logsData:any;
  public changetoPublished:boolean=false;
  public modalpermission = new Permissions('',false);
  public modal: Permissions = new Permissions('',false);
  public filteredPendingDocList: any[] = new Array();
  public filteredCompletedDocList: any[] = new Array();
  public levelrepresentation: any[] = new Array();
  public documentForEsign:  any[] = new Array();
  public filteredpending: any[] = new Array();
  public filteredapproved: any[] = new Array();
  public filteredEsign: any[] = new Array();
  public esignHistoryList: any[] = new Array();
  public UserList: any[] = new Array();
  public filteredData: any;
  public pendingDocList: any;
  public tableView:boolean=false;
  public docItemList: any;

  public permissionData: any;
  public docPermissionData:any
  public signDocumentList: any;
  public isSelectedPublishData: boolean = false;
  public Title: String = "";
  public docinfo: any;
  public comments: any =null;
  public currentDocType: any;
  public currentDocStatus: any;
  public currentCreatedBy: any;
  public esign;
  public currentModifiedDate: any;
  public mysource = new BehaviorSubject<any>(' ');
  public map = new Map();
  currentUser:UserPrincipalDTO=new UserPrincipalDTO();

  // tslint:disable-next-line: max-line-length
  constructor( private adminComponent: AdminComponent,private permissionService: ConfigService, 
    public router: Router,private http: Http, public config: ConfigService, public helper: Helper) { }

  ngOnInit() {
    this.permissionService.loadCurrentUserDetails().subscribe(response => {
      this.currentUser=response;
      this.adminComponent.setUpModuleForHelpContent("126");
      if(null!=this.helper.getworkflowcompletedOrPending())
      this.changetoPublished=this.helper.getworkflowcompletedOrPending()
      if(null!=this.helper.getworkflowGridorTable())
      this.tableView=this.helper.getworkflowGridorTable()
      if(null!=this.helper.getworkflowdropdownValues()){
        this.Title=this.helper.getworkflowdropdownValues()
        this.onChange(this.helper.getworkflowdropdownValues())
      }
      this.comments = null;
      this.filteredPendingDocList = [];
      this.filteredCompletedDocList = [];
      this.isSelectedPublishData = false;
      this.loadproj();
      this.loaddata();
      this.loadpermission();
    });
  }
  loadproj(): any {
    this.searchData="";
    this.Title="";
    this.Api(this.commonModel, "workFlow/loadDocumentsForUser").subscribe(response => {
      this.pendingDocList = response;
      this.filteredPendingDocList =response.pendingList;
      this.filteredCompletedDocList = response.completedList;
      this.documentForEsign = response.esignDocuments;
      this.filteredpending = this.filteredPendingDocList
      this.filteredapproved = this.filteredCompletedDocList
      this.filteredEsign = this.documentForEsign;
      this.UserList=response.usersForWorkFlow;

      this.filteredPendingDocList.forEach(row => {
        if (row.documentChildDto.length <= Number(row.totalLevels)) {
          if (row.documentChildDto.length > 0)
            this.levelrepresentation.push(row.documentChildDto)
          Array.from({ length: (row.totalLevels - row.documentChildDto.length) }).forEach((data) => {
            row.documentChildDto.push(data)
          });

        }
      });
  })
}



  Api(data, url) {
    return this.http.post(this.helper.common_URL + url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }
  toggleExpandRow(row) {

    if (row.documentChildDto.length <= Number(row.totalLevels)) {
      if (row.documentChildDto.length > 0)
        this.levelrepresentation.push(row.documentChildDto)
      Array.from({ length: (row.totalLevels - row.documentChildDto.length) }).forEach((data) => {
        row.documentChildDto.push(data)
      });

    }
    this.table.rowDetail.toggleExpandRow(row);
  }
  toggleExpandRowgrid(row) {

    if (row.documentChildDto.length <= Number(row.totalLevels)) {
      if (row.documentChildDto.length > 0)
        this.levelrepresentation.push(row.documentChildDto)
      Array.from({ length: (row.totalLevels - row.documentChildDto.length) }).forEach((data) => {
        row.documentChildDto.push(data)
      });

    }

    this.table.rowDetail.toggleExpandRow(row);
  }

  loaddata() {
    this.docItemList = new Array<any>();
    this.permissionService.loadDocBasedOnProject().subscribe(resp => {
      this.docItemList = resp.result.map(m=>({ 'id': m.key, 'name': m.value }));
    },err => {
      });
  }
  
  onChangePublishData() {
    for (let data of this.filteredPendingDocList) {
      if (data.approvedFlag) {
        this.isSelectedPublishData = true;
        break;
      } else {
        this.isSelectedPublishData = false;
      }
    }
  }
  onChange(data: any) {

    this.searchData="";

    this.filteredPendingDocList = new Array();
    this.filteredCompletedDocList = new Array();
    if (data === "") {
      this.filteredPendingDocList = this.filteredpending;
      this.filteredCompletedDocList = this.filteredapproved;
    } else {
      this.helper.setworkflowdropdownValues(data)
      this.filteredpending.forEach(element => {
        if (element.documentType === data.id) {
          this.filteredPendingDocList.push(element);
        }
      });
      this.filteredapproved.forEach(element => {
        if (element.documentType === data.id) {
          this.filteredCompletedDocList.push(element);
        }
      });
    }
  }

  getdata() {
    this.filteredData = this.filteredPendingDocList.filter(
      data => data.approvedFlag === true || data.rejectedFlag === true );
    this.permissionService.loadPermissionsBasedOnModule(this.filteredData[0].documentType).subscribe(resp=>{
      this.modal=resp
    });
   
  }
  approve() {
    this.isSelectedPublishData = false;
    this.filteredData.forEach(element => {
      element.approvedFlag = true
      element.rejectedFlag = false
      element.comments = this.comments
      element.currentUser = this.currentUser.id;
    })
    swal({
      title: 'Are you sure?',
      text: 'You wont be able to revert',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve All!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonClass: 'btn btn-danger',
      allowOutsideClick: false,
      buttonsStyling: false
    }).then((data) => {
      this.ApproveOrReject()
      this.isSelectedPublishData = false;
    });
  }
  reject() {
    this.isSelectedPublishData = false;
    this.filteredData.forEach(element => {
      element.approvedFlag = false
      element.rejectedFlag = true
      element.comments = this.comments
      element.currentUser = this.currentUser.id;
    });
    swal({
      title: 'Are you sure?',
      text: 'You wont be able to revert',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject All!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonClass: 'btn btn-danger',
      allowOutsideClick: false,
      buttonsStyling: false
    }).then((data) => {
      this.ApproveOrReject()
      this.isSelectedPublishData = false;
    });
  }
  ApproveOrReject() {
    this.Api(this.filteredData, 'workFlow/approveOrReject').subscribe(response => {
      this.ngOnInit();
    });
  }
  loadDocumentCommentLog(row) {
    this.docinfo = null;
    this.currentDocType = row.docName;
    this.currentDocStatus = row.levelName;
    this.currentCreatedBy = row.createdBy;
    this.currentModifiedDate = row.lastModifiedTime;
    this.docinfo = row.documentChildDto.filter(
      data => data != undefined);
  }
  loadLog(row) {

    this.logsData = row

  }
  loadesignDocs(row) {
    this.esignHistoryList = new Array();
    if (null != row)
      this.esignHistoryList=row


  }
  routeToComponent(row) {
    let documentList = this.filteredCompletedDocList.filter(data => row.selectedDocuments.some(element => element.documentId ==data.documentId && data.documentType==element.documentType));
    this.helper.changeMessage({"session":row.session,"documentList":documentList})
    this.router.navigate([documentList[0].url], { queryParams: { id: documentList[0].documentId, status: '/documentapprovalstatus', exists: true, list: documentList } });

  }
  loadpermission() {
    this.permissionService.loadPermissionsBasedOnModule(this.helper.DocumentStatus).subscribe(resp=>{
      this.modalpermission=resp
    });
  }
 
  changeview(value){
    this.helper.setworkflowGridorTable(value)
    this.tableView=value;
  }
  searcheverywhere(){
    this.Title=""
   let  data= this.searchData
    this.filteredPendingDocList = new Array();
    this.filteredCompletedDocList = new Array();
    if (data === "") {
      this.filteredPendingDocList = this.filteredpending;
      this.filteredCompletedDocList = this.filteredapproved;
    } else {
      this.filteredpending.forEach(element => {

        if (element.documentType.toLowerCase().includes(data.toLowerCase()) || element.documentCode.toLowerCase().includes(data.toLowerCase()) ) {
          this.filteredPendingDocList.push(element);

        }
      });
      this.filteredapproved.forEach(element => {
        if (element.documentType.toLowerCase().includes(data.toLowerCase()) || element.documentCode.toLowerCase().includes(data.toLowerCase()) ) {
          this.filteredCompletedDocList.push(element);
        }
      });
    }
    }
    changePublished(data){
      this.helper.setworkflowcompletedOrPending(data);
      this.changetoPublished=data;
    }

}


