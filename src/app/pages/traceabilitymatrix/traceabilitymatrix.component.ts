import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { FormEsignVerificationComponent } from '../form-esign-verification/form-esign-verification.component';
import { IQTCService } from '../iqtc/iqtc.service';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { UrsService } from '../urs/urs.service';
import { traceabilitymatrixService } from './traceabilitymatrix.service';
import { Page }  from '../../models/model';
import swal from 'sweetalert2';
import { DocumentWorkflowHistoryComponent } from '../document-workflow-history/document-workflow-history.component';

@Component({
  selector: 'app-traceabilitymatrix',
  templateUrl: './traceabilitymatrix.component.html',
  styleUrls: ['./traceabilitymatrix.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TraceabilitymatrixComponent implements OnInit {
  @ViewChild('myTable') table: any;
  @ViewChild('formVerification') formVerification: FormEsignVerificationComponent;
  @ViewChild('documentWorkFlowHistory') documentWorkFlowHistory:DocumentWorkflowHistoryComponent;
  spinnerFlag: boolean = false;
  permissionData: any;
  public traceabilityData: any[] = new Array();
  modalpermission: Permissions;
  public filterQuery = '';
  public p: Number = 1;
  public searchText = '';
  public tableView: boolean = true;
  public detailView: boolean = false;
  public tableData: any[] = new Array();
  showSearch: boolean = false;
  page:Page=new Page();
  public traceabilityNoTestcasesData: any[] = new Array();
  isDocumentPublished:boolean=false;
  isDocumentWorkflowCompleted:boolean=false;
  isDocumentWorkflowAdded:boolean=false;
  permissions: Permissions = new Permissions(this.helper.Traceability, false);
  constructor(public ursService: UrsService,
    public helper: Helper, public router: Router,
    public service: IQTCService, public services: RiskAssessmentService,
    private adminComponent: AdminComponent,
    private traceservice: traceabilitymatrixService, private permissionService: ConfigService) {
    this.modalpermission = new Permissions(this.helper.Traceability, false);
  }

  ngOnInit() {
    this.permissionService.loadPermissionsBasedOnModule(this.helper.Traceability).subscribe(resp => {
      this.permissions = resp;
    });
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.setPage({ offset: 0 });
    this.adminComponent.setUpModuleForHelpContent(this.helper.Traceability);
    this.adminComponent.taskDocType = this.helper.Traceability;
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
    this.loadDocumentStatus();
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.spinnerFlag = true;
    this.permissionService.HTTPGetAPI("common/traceabilityMatrix/"+this.page.pageNumber).subscribe(resp =>{
      this.spinnerFlag = false;
      this.page.totalElements = resp.totalElements;
      this.page.totalPages = resp.totalPages;
      this.traceabilityData = resp.list;
    });
  }

  changeview(value: any) {
    this.tableView=false;
    this.detailView=false
    if('table' === value){
      this.tableView=true
    }else if ('detail' === value) {
      this.loadTraceDetailData();
      this.detailView=true;
    }else{
      this.loadTraceabilityNoTestcasesData();
    }
  }

  pdfdownload() {
    this.spinnerFlag = true;
    this.traceservice.generatePdf().subscribe(res => {
      var blob: Blob = this.b64toBlob(res._body, 'application/pdf');
      let name = "Traceabilitymatrix_" + new Date().toLocaleDateString(); +".pdf";
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, name);
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      this.spinnerFlag = false;
    });
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  routeToComponent(rowurl, id) {
    this.router.navigate([rowurl], { queryParams: { id: id, status: '/traceability', exists: true } });
  }

  loadTraceDetailData() {
    this.spinnerFlag = true;
    this.traceservice.getTraceDetailData().subscribe(res => {
      this.tableData = res;
      this.spinnerFlag = false;
    }, error => { this.spinnerFlag = false });
  }

  loadTraceabilityNoTestcasesData() {
    this.spinnerFlag = true;
    this.traceservice.loadTraceabilityNoTestcasesData().subscribe(res => {
      this.traceabilityNoTestcasesData = res;
      this.spinnerFlag = false;
    }, error => { this.spinnerFlag = false });
  }

  verify(documentType, documentCode, documentId) {
    this.formVerification.openMyModal(documentType, documentCode, documentId);
  }

  onClickTableOfContent() {
    this.router.navigate(['/table-of-content'], { queryParams:{docId: this.helper.Traceability , status: document.location.pathname}, skipLocationChange: true });
  }
 
  loadDocumentStatus(){
    this.permissionService.HTTPGetAPI("projectDocumentsFlow/isDocumentPublished/129/0").subscribe(resp =>{
      if(resp.publish)
        this.isDocumentPublished=resp.publish;
      if(resp.workflow)
        this.isDocumentWorkflowCompleted=resp.workflow;
        if(resp.isWorkflowAdded)
        this.isDocumentWorkflowAdded=resp.isWorkflowAdded;
    });
  }
  publishDocument(){
    this.spinnerFlag = true;
    this.permissionService.HTTPGetAPI("projectDocumentsFlow/publishDocument/129/0").subscribe(resp =>{
      this.spinnerFlag = false;
      this.loadDocumentStatus();
      swal({
        title: 'Success',
        text: 'GxP has been published',
        type: 'success',
        timer: 2000, showConfirmButton: false
      });
    },err => {
      this.spinnerFlag = false
  });
  }
  onClickWorkflowHistory(){
    this.documentWorkFlowHistory.showModalView();
  }
}
