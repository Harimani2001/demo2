import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { VendorService } from '../vendor.service';
import { VendorValidationDTO, DocumentSummaryDTO, User, UserPrincipalDTO, ExternalApprovalDTO } from '../../../models/model';
import { Helper } from '../../../shared/helper';
import swal from 'sweetalert2';
import { Permissions } from '../../../shared/config';
import { ConfigService } from '../../../shared/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { DocStatusService } from '../../document-status/document-status.service';
import { StepperClass,Page } from './../../../models/model';
import { CommonFileFTPService } from '../../common-file-ftp.service';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { IndividualDocumentItemWorkflowComponent } from '../../individual-document-item-workflow/individual-document-item-workflow.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { EsignAgreementMessege, externalApprovalErrorTypes } from '../../../shared/constants';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { IQTCService } from '../../iqtc/iqtc.service';

@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./view-vendor.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})
export class ViewVendorComponent implements OnInit ,AfterViewInit {
  showSearch: boolean = false;
  @ViewChild('vendorTab') tab:any;
  spinnerFlag = true;
  @ViewChild('myTable') table: any;
  @ViewChild('documentcomments') documentcomments:any;
  viewIndividualDataFlag: boolean = false;
  popupdata:any=new Array();
  vendorValidationDTO: VendorValidationDTO = new VendorValidationDTO();
  modal: Permissions = new Permissions(this.helper.VENDOR_VALIDATION_VALUE,false);
  routeback: any = null;
  draftData:any[]=new Array();
  publishedData:any[]=new Array();
  filterQuery:string="";
  selectAll:boolean=false;
  search:boolean=false;
  isSelectedPublishData:boolean=false;
  viewPdfPreview: boolean = false;
  commentsSwitch: boolean = false;
  pdfURL: any;
  outline: any[];
  pdf: any;
  error: any;
  height: any = "600px";
  heightOutline = '500px';
  public pageVariable: number = 1;
  rotation = 0;
  zoom = 1.1;
  originalSize = true;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  isOutlineShown = true;
  pdfQuery = '';
  outLineList = new Array();
  commentsDocumentsList: any[] = new Array();
  draftIds: any[] = new Array();
  documentDetails: DocumentSummaryDTO=new DocumentSummaryDTO();
  getStatus:any=[];
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  @ViewChild("individualDocumentItemWorkflow") individualDocumentItemWorkflow: IndividualDocumentItemWorkflowComponent;
  selectedDataForWorkflow:any;
  viewSignature: boolean = false;
  public signaturePadOptions: Object = {
    'minWidth': 1,
    'canvasWidth': 540,
    'canvasHeight': 100,
  };
  esignForm:any;
  public errorList: any[] = new Array<any>();
  agreementCheck: boolean = false;
  esignSaveModal: User = new User();
  submitted: boolean;
  comments: any;
  public finalstatus: boolean = true;
  signature: any = "";
  public onExternalApprovalForm: FormGroup;
  externalApprovalDTO:ExternalApprovalDTO;
  isIndividualView:boolean=false;
  @ViewChild('externalApprovalmodal') externalApprovalmodal:any;
  page:Page=new Page();
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  currentLevelIndex:number;
  vendorListForPublish:any[]=new Array();
  constructor(public fb: FormBuilder, public esignAgreementMessage: EsignAgreementMessege,private commonService: CommonFileFTPService,public vendorService: VendorService, public helper: Helper, private permissionService: ConfigService, private route: ActivatedRoute, private routers: Router,
     public adminComponent: AdminComponent, public docStatusService: DocStatusService,public externalApprovalErrorTypes:externalApprovalErrorTypes, public iqtcServices: IQTCService) {
    this.permissionService.loadPermissionsBasedOnModule(this.helper.VENDOR_VALIDATION_VALUE).subscribe(resp=>{
      this.modal=resp
    });
    this.isIndividualView=false;
    this.route.queryParams.subscribe(query => {
      if (!this.helper.isEmpty(query.id)) {
        this.adminComponent.taskDocType = this.helper.VENDOR_VALIDATION_VALUE;
        this.adminComponent.taskEquipmentId = 0;
        this.adminComponent.taskDocTypeUniqueId = query.id;
        this.routeback = query.status;
        this.isIndividualView=true;
        this.viewRowDetails(query.id)
        this.helper.changeMessageforId(query.id)
      }
    });
    this.adminComponent.setUpModuleForHelpContent(this.helper.VENDOR_VALIDATION_VALUE);
    this.adminComponent.taskDocType = this.helper.VENDOR_VALIDATION_VALUE;
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEnbleFlag = true;
  }

  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.size = this.helper.PAGE_SIZE;;
    this.setPage({ offset: 0 });
    this.permissionService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
    })
    this.esignForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      signature: [this.signature],
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
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.permissionService.getUserPreference(this.helper.VENDOR_VALIDATION_VALUE).subscribe(res =>{
      if (res.result)
        this.loadAll(res.result);
      else
        this.loadAll();
    });
  }

  saveCurrentTab(tabName){
    this.permissionService.saveUserPreference(this.helper.VENDOR_VALIDATION_VALUE,tabName).subscribe(res =>{});
  }
  tabChange(tabName: any) {
    this.permissionService.saveUserPreference(this.helper.VENDOR_VALIDATION_VALUE,tabName).subscribe(res =>{
      this.tab.activeId = tabName;
      this.viewPdfPreview = false;
      this.isSelectedPublishData = false;
      if (tabName === 'draft') {
        this.page.pageNumber = 0;
        this.setPage({ offset: 0 });
        this.viewPdfPreview = true;
      } else if (tabName === 'published') {
        this.page.pageNumber = 0;
        this.setPage({ offset: 0 });
      } else if (tabName === 'summary') {
        this.loadSummary();
        this.search = false;
      } else {
        this.search = false;
      }
    });
  }

  loadAll(tabId?){
    this.search = false;
    this.draftData = [];
    this.publishedData = [];
    var currentTab = 'summary';
    if (tabId) {
      currentTab = tabId;
    }
    if(currentTab != 'draft'){
      this.selectAll=false
    }
    if (currentTab === 'summary'){
      this.loadSummary();
    }else if (currentTab != 'audit') {
      if(!this.isIndividualView)
        this.spinnerFlag = true;

        this.search = true;
        
      this.commentsDocumentsList= new Array();
      this.vendorService.loadVendorValidationDetailsBasedOnProject(this.page.pageNumber,currentTab).subscribe(jsonResp => {
        this.page.totalElements = jsonResp.totalElements;
        this.page.totalPages = jsonResp.totalPages;  
        if (jsonResp.unpublishedList && jsonResp.unpublishedList.length > 0){
            this.draftData = jsonResp.unpublishedList;
          }
          if (jsonResp.publishedList && jsonResp.publishedList.length > 0){
            this.publishedData = jsonResp.publishedList;
          }
          if(this.selectAll &&currentTab == 'draft'){
            this.draftData.forEach(d => {
              d.publishedflag = true;
            });
          }
          if(!this.isIndividualView)
            this.spinnerFlag = false;
        },
        err => {
          this.spinnerFlag = false;
        }
      );
    }else{
      this.spinnerFlag = false;
    }
  }

  createVendor() {
    if (this.modal.createButtonFlag)
      this.routers.navigate(["/vendor/add-vendor"]);
    else {
      if (!this.modal.createButtonFlag) {
        swal({
          title: 'Warning!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
          text: "You don't have create permission. Please contact admin!.",
        });
      }
    }
  }
  ngAfterViewInit(): void {
    this.permissionService.getUserPreference(this.helper.VENDOR_VALIDATION_VALUE).subscribe(res =>{
      if (res.result)
        this.tab.activeId = res.result;
    });
  }
  viewRowDetails(id) {
    this.viewIndividualDataFlag=true;
    this.popupdata = [];
    this.vendorService.loadVendorValidationDetailsBasedOnId(id).subscribe(jsonResp => {
      jsonResp.result.formData = JSON.parse(jsonResp.result.jsonExtraData);
      this.popupdata.push(jsonResp.result);
      this.vendorValidationDTO = jsonResp.result;
      this.draftIds.push(this.vendorValidationDTO.id);
      this.commentsDocumentsList.push({ "id": this.vendorValidationDTO.id, "value": this.vendorValidationDTO.vendorCode, "type": "code" });
      this.adminComponent.taskDocType =this.helper.VENDOR_VALIDATION_VALUE
      this.adminComponent.taskDocTypeUniqueId = id;
      this.adminComponent.taskEnbleFlag = true;
      this.adminComponent.taskEquipmentId = 0;
      if(this.vendorValidationDTO.publishedflag && !this.vendorValidationDTO.workFlowCompletionFlag)
        this.downloadFileOrViewAfterPublish(true);
      else
        this.downloadFileOrView(this.vendorValidationDTO,true);

      let stepperModule: StepperClass = new StepperClass();
          stepperModule.constantName = this.helper.VENDOR_VALIDATION_VALUE
          stepperModule.documentIdentity = this.vendorValidationDTO.id;
          stepperModule.code = this.vendorValidationDTO.vendorCode;
          this.helper.stepperchange(stepperModule);
    });
  }
  onClickClose() {
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
    setTimeout(() => {
      this.permissionService.getUserPreference(this.helper.VENDOR_VALIDATION_VALUE).subscribe(res => {
        if (res.result)
          this.tab.activeId = res.result;

        if ('published' === this.tab.activeId) {
          this.loadAll('published');
        } else {
          this.loadAll('draft');
        }
      });
    }, 10)
    this.viewIndividualDataFlag = false;
  }
  downloadFileOrViewAfterPublish(viewFlag) {
      this.spinnerFlag = true;
      const ids: any[] = new Array();
      const stepperModule: StepperClass = new StepperClass();
      stepperModule.constantName = this.helper.VENDOR_VALIDATION_VALUE;
      ids.push(this.vendorValidationDTO.id);
      stepperModule.documentIds = ids;
      this.permissionService.HTTPPostAPI(stepperModule, 'workFlow/pdfPreviewfortimeline').subscribe(response => {
        this.loadDocumentTimeline(this.vendorValidationDTO.id);
        var responseBolb: any[] = this.b64toBlob(response.pdf)
        const blob: Blob = new Blob(responseBolb, { type: "application/pdf" });
        if (viewFlag) {
          this.pdfURL = URL.createObjectURL(blob);
          this.spinnerFlag = false;
        }
      }, error => {
        this.spinnerFlag = false;
      })
  }
  private b64toBlob(b64Data) {
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
    return byteArrays;
  }
  downloadFileOrView(input, viewFlag) {
      this.spinnerFlag = true;
      let filePath = input.filePath;
      let fileName = input.fileName;
      this.commonService.loadFile(filePath).subscribe(resp => {
        this.loadDocumentTimeline(this.vendorValidationDTO.id);
        let contentType = this.commonService.getContentType(fileName.split(".")[fileName.split(".").length - 1]);
        var blob: Blob = new Blob([resp], { type: contentType });
        if (viewFlag) {
          if (!contentType.match(".pdf")) {
            this.commonService.convertFileToPDF(blob, fileName).then((respBlob) => {
              this.pdfURL = URL.createObjectURL(respBlob);
              this.spinnerFlag = false;
            });
          } else {
            this.pdfURL = URL.createObjectURL(blob);
            this.spinnerFlag = false;
          }
        } else {
          this.iqtcServices.auditForMultipleFileDownload(input.vendorCode, fileName, this.helper.VENDOR_VALIDATION_VALUE,input.id).subscribe(resp => { });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
          this.spinnerFlag = false;
        }
      }, error => {
        this.spinnerFlag = false;
      })
  }
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.loadOutline();
  }

  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
      if(this.outline)
      this.outLineList = this.outline.map(o => ({ id: o.title, value: o.title.replace(" ", ""), type: 'chapter' }));
      else{
        this.outLineList=new Array();
      }
    });
  }

  onError(error: any) {
    this.error = error; // set error
    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );
      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  setPassword(password: string) {
    let newSrc;
    if (this.pdfURL instanceof ArrayBuffer) {
      newSrc = { data: this.pdfURL };
    } else if (typeof this.pdfURL === 'string') {
      newSrc = { url: this.pdfURL };
    } else {
      newSrc = { ...this.pdfURL };
    }
    newSrc.password = password;
    this.pdfURL = newSrc;
  }

  reload(data){
    this.viewRowDetails(data.result);
  }

  
  openSuccessCancelSwal(dataObj) {
    swal({
      title:"Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    })
    .then((value) => {
      if(value){
        dataObj.userRemarks="Comments : " + value;
        this.deleteVendorValidation(dataObj);
      }else{
        swal({
          title: '',
          text: 'Comments is requried',
          type: 'info',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        });
      }
    });
  }

  deleteVendorValidation(dataObj): boolean {
    dataObj.documentFormData = "";
    let status = false;
    this.vendorService.deleteVendorValidation(dataObj)
      .subscribe((resp) => {
        if (resp.result) {
          this.ngOnInit();
          status = true;
          swal({
            title: 'Deleted!',
            text: dataObj.vendorCode + ' has been deleted',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
                this.onClickClose();
                this.viewIndividualDataFlag = false;
                this.closeIndividualData();
            }
          });
        } else {
          status = false;
          swal({
            title: 'Not Deleted!',
            text: dataObj.vendorCode + 'has  not been deleted',
            type: 'error',
            timer: this.helper.swalTimer,
          }
          );
        }
      }, (err) => {
        status = false;

        swal(
          'Not Deleted!',
          dataObj.vendorCode + 'has  not been deleted',
          'error'
        );

      });
    return status;
    }

  closeIndividualData() {
    this.viewIndividualDataFlag = false
    this.adminComponent.taskDocType = this.helper.VENDOR_VALIDATION_VALUE;
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
  }

  

  toEdit(id) {
    this.routers.navigate(['/vendor/add-vendor',id]);

  }
  publishData() {
    this.spinnerFlag = true;
    this.vendorService.publish(this.selectAll?this.vendorListForPublish:this.draftData).subscribe(result => {
      this.spinnerFlag = false;
      this.loadAll("draft");
      this.isSelectedPublishData=false;
    });
  }
  singlepublishData(data){
    this.spinnerFlag = true;
    data.publishedflag = true;
    this.vendorService.singlePublish(data).subscribe(res=>{
      if(res.result === this.helper.SUCCESS_RESULT_MESSAGE){
        swal({
          title: 'Success',
          text: 'Record has been published',
          type: 'success',
          timer: 2000, showConfirmButton: false,
          onClose: () => {
            this.spinnerFlag = false;
            data.publishedflag=true;
            this.viewRowDetails(data.id);
          }
        });
      }else{
        this.spinnerFlag = false;
      }
    }, (err) => {
      this.spinnerFlag = false;
    });
  }
  onChangePublishData() {
    for (let data of this.draftData) {
      if (data.publishedflag) {
        this.isSelectedPublishData = true;
        break;
      } else {
        this.isSelectedPublishData = false;
      }
    }
  }
  
  selectAllData(event){
    this.selectAll = event.currentTarget.checked;;
    if(event.currentTarget.checked){
      this.draftData.forEach(d => {
        d.publishedflag = true;
      });
      this.isSelectedPublishData=true;
    }else{
      this.draftData.forEach(d => {
        d.publishedflag = false;
      });
      this.isSelectedPublishData=false;
    }
  }

  loadSummary() {
    if(!this.isIndividualView)
      this.spinnerFlag=true;
    this.vendorService.loadSummary().subscribe(result => {
      if(!this.isIndividualView)
        this.spinnerFlag=false;
      if (result.result != null) {
        this.documentDetails = result.result;
      }
    })
  }

  openIndividualWorkflowSetup(row){
    this.individualDocumentItemWorkflow.openModal(row.id,row.vendorCode);
  }

  loadDocumentTimeline(id) {
    this.selectedDataForWorkflow=undefined;
    this.permissionService.HTTPGetAPI("individualDocumentFlow/loadApproveTimeLine/" + id+"/"+this.helper.VENDOR_VALIDATION_VALUE).subscribe((resp) => {
      this.getStatus = resp;
      this.getStatus.forEach((element,index) => {
        if(element.lastEntry && element.permission){
          this.selectedDataForWorkflow=element;
          this.currentLevelIndex=index;
        }
      });
    }, (err) => {
      this.spinnerFlag = false;
    });
  }
  approveOrReject(data){
    this.selectedDataForWorkflow=data;
    if(data.lastEntry && data.permission){
        this.openMyModal('effect-1');
    }
  }
  openMyModal(event) {
    this.esignForm.reset();
    this.errorList=[];
    this.agreementCheck=false;
    document.querySelector('#' + event).classList.add('md-show');
  }
  closeMyModal(event) {
    this.agreementCheck=false;
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

  esign() {
    this.spinnerFlag=true;
    this.permissionService.HTTPPostAPI(this.esignSaveModal,'workFlow/validEsignUser').subscribe(response => {
    if (response.flag) {
      this.documentApproveOrReject(this.finalstatus?"Y":"N");
      document.querySelector('#' + 'effect-1').classList.remove('md-show');
      } else {
        this.spinnerFlag = false;
        this.errorList = response.errorList;
      }
    });
  }

  onSubmit(esignForm) {
    if (esignForm.valid) {
      this.spinnerFlag=true;
      this.submitted=false;
      this.esignSaveModal.userName = this.esignForm.get('userName').value;
      this.esignSaveModal.password = this.esignForm.get('password').value;
      this.comments=this.esignForm.get('comments').value;
      this.esign();
    }else
    this.submitted=true;
  }

  documentApproveOrReject(status) {
    this.selectedDataForWorkflow.status = status;
    this.selectedDataForWorkflow.comments = this.comments;
    this.selectedDataForWorkflow.documentType=this.helper.VENDOR_VALIDATION_VALUE;
    this.selectedDataForWorkflow.documentCode=this.popupdata[0].vendorCode;
    this.selectedDataForWorkflow.signature= this.signature;
    this.spinnerFlag = true;
    this.permissionService.HTTPPostAPI(this.selectedDataForWorkflow,"individualDocumentFlow/documentApproveOrReject").subscribe((resp) => {
      this.spinnerFlag = false;
      swal({
        title: '',
        text: 'Esign validated',
        type: 'success',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      });
      this.esignForm.reset();
      this.agreementCheck=false;
      this.comments = "";
      this.loadDocumentTimeline(this.selectedDataForWorkflow.documentId);
    }, (err) => {
      this.spinnerFlag = false;
    });
  }
  onclickAccept(){
    this.agreementCheck=!this.agreementCheck;
    this.esignForm.get('userName').setValue(this.currentUser.email);
  }

  onClickExternalApproval(data){
    this.onExternalApprovalForm.reset();
    this.onExternalApprovalForm.get("validity").setValue(2);
    this.externalApprovalDTO=new ExternalApprovalDTO();
    const ids: any[] = new Array();
    ids.push({"key":this.popupdata[0].id,"value":this.popupdata[0].vendorCode});
    this.externalApprovalDTO.documentType = this.helper.VENDOR_VALIDATION_VALUE;
    this.externalApprovalDTO.documentIds = ids;
    this.externalApprovalDTO.levelId=data.levelId;
  }
  onClickSave(){
    if (this.onExternalApprovalForm.valid) {
      this.spinnerFlag=true;
       this.externalApprovalDTO.documentType = this.helper.VENDOR_VALIDATION_VALUE;
      this.externalApprovalDTO.email = this.onExternalApprovalForm.get("email").value;
      this.externalApprovalDTO.validity = this.onExternalApprovalForm.get("validity").value;
      this.externalApprovalDTO.remarks = this.onExternalApprovalForm.get("remarks").value;
      this.externalApprovalDTO.name = this.onExternalApprovalForm.get("name").value;
      this.permissionService.HTTPPostAPI(this.externalApprovalDTO, 'externalApproval/saveExternalApprovalDetails').subscribe(response => {
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
  signatureComplete() {
    this.signature=this.signaturePad.toDataURL();
    this.esignForm.get('signature').setValue(this.signaturePad.toDataURL());
  }
  clearSignature() {
    this.esignForm.get('signature').setValue('');
    this.signaturePad.clear();
  }
  loadStepperData() {
    this.getStatus.forEach((element,index) => {
      if(index < this.currentLevelIndex){
        element.workFlowCompleted=true;
      }else{
        element.workFlowCompleted=false;
      }
    });
    this.getStatus=this.getStatus.filter(d => d.status !="Rejected" && d.status != "Deactivated");
  }
  loadSelectAllDataForPublish(event) {
    this.vendorListForPublish = new Array();
    if (event.currentTarget.checked) {
      this.spinnerFlag = true;
      this.vendorService.loadVendorValidationDetailsBasedOnProject(-1, 'draft').subscribe(jsonResp => {
        this.spinnerFlag = false;
        this.vendorListForPublish = jsonResp.unpublishedList;
        this.vendorListForPublish.forEach(d => {
          d.publishedflag = true;
        });
      });
    }
  }
}

