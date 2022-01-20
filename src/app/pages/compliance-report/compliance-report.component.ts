import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import {Router } from '@angular/router';
import { UrsService } from '../urs/urs.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExternalApprovalDTO } from '../../models/model';
import swal from 'sweetalert2';
import { externalApprovalErrorTypes } from '../../shared/constants';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { Permissions } from '../../shared/config';
import { DocumentWorkflowHistoryComponent } from '../document-workflow-history/document-workflow-history.component';

@Component({
  selector: 'app-compliance-report',
  templateUrl: './compliance-report.component.html',
  styleUrls: ['./compliance-report.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ComplianceReportComponent implements OnInit {
  @ViewChild('documentWorkFlowHistory') documentWorkFlowHistory:DocumentWorkflowHistoryComponent;
  spinnerFlag:boolean=false;
  complianceReportData:any=new Array();
  complianceResponse:any=new Array();
  public onExternalApprovalForm: FormGroup;
  externalApprovalDTO:ExternalApprovalDTO;
  viewFlag:boolean=false;
  enbleExternalApproval:boolean=false;
  @ViewChild('externalApprovalmodal') externalApprovalmodal:any;
  isDocumentPublished:boolean=false;
  isDocumentWorkflowCompleted:boolean=false;
  isDocumentWorkflowAdded:boolean=false;
  permissions: Permissions = new Permissions(this.helper.Compliance_Report_Value, false);
  constructor(public fb: FormBuilder,public adminComponent: AdminComponent, public helper: Helper, public configService: ConfigService, public router: Router,public ursService:UrsService,public externalApprovalErrorTypes:externalApprovalErrorTypes,public lookUpService:LookUpService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadData();
    this.lookUpService.getlookUpItemsBasedOnCategory("complianceReportResponse").subscribe(res => {
      this.complianceResponse = res.response;
    });
    this.configService.loadPermissionsBasedOnModule(this.helper.Compliance_Report_Value).subscribe(resp => {
      this.permissions = resp;
    });
    this.onExternalApprovalForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required,Validators.pattern('[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
      ])],
      remarks: ['', Validators.compose([
        Validators.required
      ])],
      validity: ['', Validators.compose([
        Validators.required
      ])]
    });
    this.loadDocumentStatus();
  }
  loadData(){
    this.spinnerFlag=true;
    this.configService.HTTPGetAPI("urs/loadComplianceReport").subscribe(resp  =>{
      this.complianceReportData=resp.result;
      this.enbleExternalApproval=this.complianceReportData.filter(m => this.helper.isEmpty(m.response)).length ==0;
      this.spinnerFlag=false;
    });
  }
  saveReport(){
    this.spinnerFlag=true;
    this.configService.HTTPPostAPI(this.complianceReportData,"urs/saveComplianceReport").subscribe(resp  =>{
      this.spinnerFlag=false;
      this.viewFlag=false;
      this.loadData();
      swal({
        title: 'Success',
        text: 'Compliance Report has been Saved',
        type: 'success',
        timer: 2000, showConfirmButton: false
      });
    });
  }
  onClickTableOfContent() {
    this.router.navigate(['/table-of-content'], { queryParams: { docId: this.helper.Compliance_Report_Value, status: document.location.pathname }, skipLocationChange: true });
  }
  onChangeRemarks(event,row){
    row.remarks=event.target.value;
  }
  pdfdownload() {
    this.spinnerFlag = true;
    this.ursService.generateCompliancePdf().subscribe(res => {
      var blob: Blob = this.b64toBlob(res._body, 'application/pdf');
      let name = "Compliance_Report_" + new Date().toLocaleDateString(); +".pdf";
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

  onClickExternalApproval(){
    this.onExternalApprovalForm.reset();
    this.onExternalApprovalForm.get("validity").setValue(2);
    this.externalApprovalDTO=new ExternalApprovalDTO();
    const ids: any[] = new Array();
    this.externalApprovalDTO.documentType = this.helper.Compliance_Report_Value;
    this.externalApprovalDTO.documentIds = ids;
  }
  onClickSave(){
    if (this.onExternalApprovalForm.valid) {
      this.spinnerFlag=true;
      this.externalApprovalDTO.email = this.onExternalApprovalForm.get("email").value;
      this.externalApprovalDTO.validity = this.onExternalApprovalForm.get("validity").value;
      this.externalApprovalDTO.remarks = this.onExternalApprovalForm.get("remarks").value;
      this.externalApprovalDTO.name = this.onExternalApprovalForm.get("name").value;
      this.configService.HTTPPostAPI(this.externalApprovalDTO, 'externalApproval/saveExternalApprovalDetails').subscribe(response => {
        this.spinnerFlag=false;
        this.externalApprovalmodal.hide();
        swal({
          title: '',
          text: 'Success',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      });
    }else {
      Object.keys(this.onExternalApprovalForm.controls).forEach(field => {
        const control = this.onExternalApprovalForm.get(field);            
        control.markAsTouched({ onlySelf: true });      
      });
    }
  }
  loadDocumentStatus(){
    this.configService.HTTPGetAPI("projectDocumentsFlow/isDocumentPublished/233/0").subscribe(resp =>{
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
    this.configService.HTTPGetAPI("projectDocumentsFlow/publishDocument/233/0").subscribe(resp =>{
      this.spinnerFlag = false;
      this.loadDocumentStatus();
      swal({
        title: 'Success',
        text: 'Compliance Report has been published',
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