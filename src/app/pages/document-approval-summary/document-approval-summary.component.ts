import { Component, OnInit, EventEmitter, ViewChild, Output, ViewEncapsulation } from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import swal from 'sweetalert2';
import { UserPrincipalDTO } from '../../models/model';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-document-approval-summary',
  templateUrl: './document-approval-summary.component.html',
  styleUrls: ['./document-approval-summary.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class DocumentApprovalSummaryComponent implements OnInit {
  @ViewChild('esignmodal') closeEsignModal: any;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  documentData: any[] = new Array();
  filteredDocumentData: any[] = new Array();
  documentsList: any[] = new Array();
  actionTypesList: any[] = new Array();
  windowHeight = window;
  spinnerFlag: boolean = false;
  selectedDocuments: any[] = new Array();
  selectedActionType: any[] = new Array();
  documentTypeSettings = {
    singleSelection: false,
    text: "Select",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
    maxHeight:200,
    position:'bottom'
  };
  actionTypeSettings = {
    singleSelection: true,
    text: "Select",
    selectAllText: 'Select',
    enableSearchFilter: true,
    badgeShowLimit: 2,
    classes: "myclass custom-class",
    maxHeight:200,
    position:'bottom'
  };
  selectedDocumentsForApproval:any=new Array();
  subscription: any;
  public comments: any = null;
  public tableView: boolean = true;
  docItemList:any[]=new Array();
  selectedDocument:string="";
  documentPrimaryKey:string="";
  routerDocument:string;
  constructor(public configService: ConfigService,public helper: Helper,public admin: AdminComponent, public router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    this.configService.loadCurrentUserDetails().subscribe(response => {
      this.currentUser = response
    });
    this.subscription = this.helper.currentId.subscribe(
      data => {
        if (data !== 'no data') {
          this.selectedDocumentsForApproval=new Array();
          this.closeEsignModal.hide();
          this.loadData(2);
        } else {
          this.loadData(2);
        }
      })
      this.route.queryParams.subscribe(query => {
        if (!this.helper.isEmpty(query.documentType)) {
          this.routerDocument=query.documentType;
        }
        if (!this.helper.isEmpty(query.documentId)) {
          this.documentPrimaryKey=query.documentId;
        }
      });
    this.actionTypesList.push({ id: 1, itemName: 'Approval' });
    this.actionTypesList.push({ id: 2, itemName: 'Esign' });
    this.selectedActionType.push({ id: 2, itemName: 'Esign' });
    this.spinnerFlag = true;
    this.loadData(this.selectedActionType[0].id);
    this.spinnerFlag = false
    this.admin.setUpModuleForHelpContent('181');
    this.admin.taskDocType = "181";
    this.admin.taskDocTypeUniqueId = "";
    this.admin.taskEquipmentId = 0;
    this.configService.HTTPGetAPI("admin/loadDocumentsForDocumentApproval").subscribe(resp =>{
      this.docItemList=resp;
      if(this.docItemList.length > 0){
       if(this.helper.isEmpty(this.routerDocument)){
        this.selectedDocument=this.docItemList[0].key;
        if(this.selectedDocument === "212" || this.selectedDocument === "213" || this.selectedDocument === "214" || this.selectedDocument === "215" || this.selectedDocument === "216")
          this.documentPrimaryKey=this.docItemList[0].mappingId;
       } else{
          this.selectedDocument=this.routerDocument;
        }
      }
    });
  }
  changeview(value){
    this.tableView =!this.tableView;
  }
  onChange(index){
   let selected= this.docItemList[index-1];
   if(selected.key === "212" || selected.key === "213" || selected.key === "214" || selected.key === "215" || selected.key === "216")
   this.documentPrimaryKey=selected.mappingId;
  }
  onChangeDocument(event){
    this.selectedDocumentsForApproval=new Array();
    this.filteredDocumentData=new Array();
    if(event.length > 0){
      event.forEach(element => {
        this.documentData.forEach(document =>{
          if(element.id === +document.documentType){
            document.selectAll=false;
            document.documentList.forEach(d => {
              d.approvedFlag = false;
            });
            this.filteredDocumentData.push(document);
          }
        })
      });
    }else{
      this.documentData.forEach(document =>{
        document.selectAll=false;
          document.documentList.forEach(d => {
            d.approvedFlag = false;
          });
      })
      this.filteredDocumentData=this.documentData;
    }
  }
  onChangeActionType(event){
    this.loadData(event[0].id);
  }
  loadData(actionType){
    this.selectedDocumentsForApproval=new Array();
    this.documentData=new Array();
    this.configService.HTTPGetAPI("workFlow/loadDocumentApprovalSummaryForUser/"+actionType).subscribe(res => {
      this.documentData=res;
      this.filteredDocumentData=res;
      this.documentsList = this.documentData.map(option => ({ id: +option.documentType, itemName: option.documentName }));
      this.spinnerFlag = false;
    });
  }

  routeView(row) {
    if (row.url.toLowerCase().indexOf('ynamic') >= 0) {
      this.admin.redirect(row.url, '/documentapprovalstatus')
    }
    if (row.url.toLowerCase().indexOf('ynamic') < 0) {
      this.router.navigate([row.url], { queryParams: { id: row.documentId, status: '/documentapprovalstatus', exists: true, list: row.selectedDocuments } })
    }
  }

  selectAllData(event,document) {
    document.selectAll = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      document.documentList.forEach(d => {
        d.approvedFlag = true;
      });
    } else {
      document.documentList.forEach(d => {
        d.approvedFlag = false;
      });
    }
    this.onSelectForApprove();
  }

  onSelectForApprove(){
    this.selectedDocumentsForApproval=new Array();
    this.filteredDocumentData.forEach(document => {
      document.documentList.forEach(item => {
        if(item.approvedFlag)
          this.selectedDocumentsForApproval.push(item);
      });
    });
  }
  approve() {
    this.selectedDocumentsForApproval.forEach(element => {
      element.approvedFlag = true
      element.rejectedFlag = false
      element.globalProjectId = this.currentUser.projectId
      element.comments = this.comments
      element.currentUser = this.currentUser.id
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
      this.selectedDocumentsForApproval=new Array();
    })
  }
  
  reject() {
    this.selectedDocumentsForApproval.forEach(element => {
      element.approvedFlag = false
      element.rejectedFlag = true
      element.globalProjectId = this.currentUser.projectId
      element.comments = this.comments
      element.currentUser = this.currentUser.id
    })
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

    })
  }
  ApproveOrReject() {
    this.spinnerFlag = true
    this.configService.HTTPPostAPI(this.selectedDocumentsForApproval, 'workFlow/approveOrReject').subscribe(response => {

      this.spinnerFlag = false
      if (response.dataType === 'Multiple access for same Data') {
        swal({
          title: '',
          text: 'Multiple access for same Data',
          type: 'warning',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        })
        this.loadData(1);
      } else {
        swal({
          title: '',
          text: 'Success',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        })
      }
      setTimeout(() => {
        this.loadData(1);
      }, 1000)
    })
  }
}
