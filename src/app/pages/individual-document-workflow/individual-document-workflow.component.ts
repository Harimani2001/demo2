import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  PDFDocumentProxy, PDFProgressData
} from 'ng2-pdf-viewer';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CommonModel, ExternalApprovalDTO, StepperClass, UserPrincipalDTO, WorkflowDocumentStatusDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { externalApprovalErrorTypes } from '../../shared/constants';
import { Helper } from '../../shared/helper';
import { IndividualDocumentWorkflowService } from './individual-document-workflow.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-individual-document-workflow',
  templateUrl: './individual-document-workflow.component.html',
  styleUrls: ['./individual-document-workflow.component.css']
})
export class IndividualDocumentWorkflowComponent implements OnInit,OnChanges {
  @ViewChild('ApprovalPDFViewerComponent')
  private pdfComponent: any;
  pdfSrc: any = '';
  showModal=false;
  renderText = true;
  progressData: PDFProgressData;
  isLoaded = false;
  stickToPage = true;
  pdf: any;
  outline: any[];
  error:any;
  height: any = "600px";
  heightOutline = '500px';
  public pageVariable:number = 1;
  rotation = 0;
  zoom = 1.1;
  originalSize = true;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  isOutlineShown = false;
  pdfQuery = '';
  outLineList=new Array();
  @Input() permissionConstant: string="";
  @ViewChild('documentSign') documentChildComponent;
  @ViewChild('esignmodal') closeEsignModal: any;
  @ViewChild('modalLarge') approvalModal: any;
  @ViewChild('levelDescription') levelDescription:any;
  @ViewChild('externalApprovalmodal') externalApprovalmodal:any;
  @ViewChild('forumView') documentForum;
  @ViewChild('levelHistroyModal') levelHistroyModal;
  @Input('documentPrimaryKey') documentPrimaryKey;
  @Input('onlyPDF') onlyPDF:boolean=false;
  public previewdoc: any = []
  public row: any;
  public viewpdf: boolean = true;
  public getStatus: any = [];
  public filteredPendingDocList: any[] = new Array();
  public spinnerFlag: Boolean = false;
  public comments: any = null;
  public filteredData: any[]=new Array();
  public filteredApprovalData: any[]=new Array();
  public docItemList: any;
  public searchData: any;
  public esignHistoryList: any[] = new Array();
  public filteredCompletedDocList: any[] = new Array();
  public esignActionData: WorkflowDocumentStatusDTO[] = new Array<WorkflowDocumentStatusDTO>();
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  public commonModel: CommonModel = new CommonModel();
  @Output() onRejectDocument = new EventEmitter();
  @Output() onClose = new EventEmitter();
  content:any;
  show: boolean;
  commentsSwitch:boolean=false;
  commentsDocumentsList: any[] = new Array();
  public onExternalApprovalForm: FormGroup;
  externalApprovalDTO:ExternalApprovalDTO;
  userApprovalList:any=new Array();
  fullScreen:boolean=false;
  forumFlag=false;
  groupingFlag:boolean = false;
  currentLevelIndex:number;
  currentLevelData:any;
  workflowJobStatus:boolean=false;
  isLoadingData:boolean=false;
  public stepperData: any = [];
  isShowClose:boolean=false;
  levelApprovalHistory: any = [];
  constructor(public sanitizer:DomSanitizer,private comp: AdminComponent,private service: IndividualDocumentWorkflowService, public config: ConfigService, public helper: Helper,public fb: FormBuilder,public externalApprovalErrorTypes:externalApprovalErrorTypes,public router: Router) { }

  ngOnInit() {
    this.isShowClose="/requirementSummary" === this.router.url;
    this.height = window.innerHeight+ 'px'
    this.heightOutline = window.innerHeight - 200 + 'px'
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
   this.helper.currentId.subscribe(
      data => {
        if (data !== 'no data') {
          this.closeEsignModal.hide();
          this.isLoadingData=false;
          this.loadDocuments();
        }
      })
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.permissionConstant) {
      if (changes.permissionConstant.previousValue != this.permissionConstant) {
        this.loadDefault();
      }
    }
    if (changes.documentPrimaryKey) {
      if (changes.documentPrimaryKey.previousValue != this.documentPrimaryKey) {
        this.loadDefault();
      }
    }
  }

  onClickFullscreen(){
    this.fullScreen=!this.fullScreen;
    this.height = window.innerHeight -( this.fullScreen? 20:10) + 'px'
  }

   loadDefault(){
    this.comp.setUpModuleForHelpContent(this.permissionConstant);
    this.isLoadingData=false;
    if(!this.helper.isEmpty(this.permissionConstant))
      this.loadDocuments();
   }


  loadDocuments() {
    this.config.loadCurrentUserDetails().subscribe(response => {
      this.currentUser = response;
      this.spinnerFlag=true;
      this.viewpdf = false;
      this.commonModel.type = 'workflowapprovalStatus';
      this.commonModel.categoryName = 'pending';
      this.commonModel.dataType = 'opt1';
      this.commonModel.value=this.permissionConstant;
      this.commonModel.documentPrimaryKey=this.documentPrimaryKey;
      if(!this.helper.isEmpty(this.permissionConstant)){
        this.config.HTTPGetAPI("common/getWorkflowJobStatus/"+this.permissionConstant+"/"+false).subscribe(res =>{
          this.workflowJobStatus=res.result;
          this.service.Api(this.commonModel, 'workFlow/loadDocumentsForUserAndDocumentType').subscribe(response => {
            this.filteredPendingDocList = response.pendingList;
            if(!this.isLoadingData)
              this.bulkApprovalTimeLine();
          },
            err => {
              this.spinnerFlag = false;
          });
        });
      }else{
        this.spinnerFlag = false;
      }
    });
  }
  bulkApprovalTimeLine() {
    this.isLoadingData=true;
    this.spinnerFlag=true;
    this.pdfSrc="";
    this.commentsSwitch=false;
    this.previewdoc = null;
    const stepperModule: StepperClass = new StepperClass()
    stepperModule.constantName = this.permissionConstant;
    stepperModule.documentIdentity=this.documentPrimaryKey;
    this.service.Api(stepperModule, 'workFlow/bulkDocumentApproveTimeLine').subscribe(response => {
      this.getStatus = response.timeLine;
      if(this.getStatus.length>0)
      this.showModal = true;
      let index=0;
      for(let element of this.getStatus){
        element.errorList = this.filteredPendingDocList.filter(e => e.currentLevel === element.levelId);
        if (this.filteredPendingDocList.length > 0 && !this.previewdoc && element.errorList && element.errorList.length > 0) {
          element.thisIsCurrent = true;
          this.currentLevelIndex=index;
          this.currentLevelData=element;
          this.content = this.currentLevelData;
          this.userApprovalList=element.userApprovalList;
          this.previewdoc = element.errorList;
          if (element.permission) {
            if(!this.workflowJobStatus){
              this.spinnerFlag = true;
              this.pdfpreview(this.previewdoc);
            }else if(this.workflowJobStatus && element.allUserApproval && this.permissionConstant){
              this.config.HTTPGetAPI("common/getWorkflowJobStatus/"+this.permissionConstant+"/"+true).subscribe(res =>{
                this.workflowJobStatus=res.result;
                if(!this.workflowJobStatus){
                  this.spinnerFlag = true;
                  this.pdfpreview(this.previewdoc);
                }else{
                  this.spinnerFlag = false;
                }
              });
            }else{
              this.spinnerFlag = false;
            }
            break;
          }else{
            this.spinnerFlag=false;
          }
        }else{
            this.spinnerFlag = false;
        }
        index=index+1;
      }
    });
  }
  pdfpreview(data) {
    this.spinnerFlag=true;
    this.pdfSrc="";
    this.commentsDocumentsList=[];
    data.forEach(element => {
      this.commentsDocumentsList.push({"id":element.documentId,"value":element.documentCode,"type":"code"});
    });
    this.commentsSwitch=false;
    const ids: any[] = new Array();
    data.forEach(ee => {
      ids.push(ee.documentId);
    });
    const stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = this.permissionConstant;
    stepperModule.documentIds = ids;
    this.service.Api(stepperModule, 'workFlow/pdfPreviewfortimeline').subscribe(response => {
      this.viewpdf = true;
      var responseBolb: any[] = this.b64toBlob(response.pdf)
      const blob: Blob = new Blob(responseBolb, { type: "application/pdf" });
      setTimeout(() => {
        this.pdfSrc = URL.createObjectURL(blob);
        this.spinnerFlag = false;
      }, 10);
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
  getdata(dataIds: any) {
    this.filteredData=[];
    this.filteredApprovalData=[];
    this.esignActionData=[];
    this.comments = null;
    let currentdata = dataIds[0];
    dataIds.forEach(element => {
      this.filteredPendingDocList.forEach(s => {
        if (s.documentId == element.documentId)
          s.approvedFlag = true
      })
    })
    this.filteredData = this.filteredPendingDocList.filter(
      data => (data.currentLevel === currentdata.currentLevel) && (data.approvedFlag === true || data.rejectedFlag === true) && (data.actionTypeName === "Approval" || data.actionType === 1))
    this.filteredApprovalData = this.filteredPendingDocList.filter(
      data => (data.currentLevel === currentdata.currentLevel) && (data.approvedFlag === true || data.rejectedFlag === true) && (data.actionTypeName === "Esign" || data.actionType === 2))
      if (this.documentChildComponent) {
      this.documentChildComponent.loadDocumentList(this.filteredApprovalData)
      this.documentChildComponent.closeMyModal('effect-12')
     // this.bulkApprovalTimeLine();
    }
    if (this.filteredApprovalData.length > 0) {
      this.filteredApprovalData.forEach(element => {
        element.approvedFlag = true
        if (element.groupedItems.length > 0) {
          element.groupedItems.push(element.groupedItems)
        }
        this.esignActionData.push(element)
      })
    }
    if( this.filteredData.length >0)
      this.approvalModal.show();
    if( this.filteredApprovalData.length >0)
      this.closeEsignModal.show(); 
  }
  approve() {
    this.filteredData.forEach(element => {
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
    })
  }
  reject() {
    this.filteredData.forEach(element => {
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
      this.ApproveOrReject();
    })
  }
  ApproveOrReject() {
    this.config.HTTPGetAPI("common/getWorkflowJobStatus/"+this.permissionConstant+"/"+false).subscribe(res =>{
      if(!res.result){
        this.spinnerFlag = true
        this.service.Api(this.filteredData, 'workFlow/approveOrReject').subscribe(response => {
          if (response.dataType === 'Multiple access for same Data') {
            swal({
              title: '',
              text: 'Multiple access for same Data',
              type: 'warning',
              timer: this.helper.swalTimer,
              showConfirmButton: false
            })
          } else {
            swal({
              title: '',
              text: 'Success',
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false
            })
            this.onRejectDocument.emit(true);
          }
          setTimeout(() => { this.loadDocuments(); }, 1000)
        })
      }
      else{
        this.spinnerFlag = false;
        swal({
          title: '',
          text: 'Already approved by other user',
          type: 'warning',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        })
      }
    });
    
  }
  
  onClickExternalApproval(data){
    this.onExternalApprovalForm.reset();
    this.onExternalApprovalForm.get("validity").setValue(2);
    this.externalApprovalDTO=new ExternalApprovalDTO();
    const ids: any[] = new Array();
    data.forEach(ee => {
      ids.push({"key":ee.documentId,"value":ee.documentCode});
    });
    this.externalApprovalDTO.documentType = this.permissionConstant;
    this.externalApprovalDTO.documentIds = ids;
    this.externalApprovalDTO.levelId=data[0].currentLevel;
  }
  onClickSave(){
    if (this.onExternalApprovalForm.valid) {
      this.spinnerFlag=true;
      this.externalApprovalDTO.email = this.onExternalApprovalForm.get("email").value;
      this.externalApprovalDTO.validity = this.onExternalApprovalForm.get("validity").value;
      this.externalApprovalDTO.remarks = this.onExternalApprovalForm.get("remarks").value;
      this.externalApprovalDTO.name = this.onExternalApprovalForm.get("name").value;
      this.service.Api(this.externalApprovalDTO, 'externalApproval/saveExternalApprovalDetails').subscribe(response => {
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


   /**
    * Get pdf information after it's loaded
    * @param pdf
    */
   afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.loadOutline();
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
      if(this.outline)
      this.outLineList = this.outline.map(o => ({ id: o.title, value: o.title.replace(" ", ""), type: 'chapter' }));
      else{
        this.outLineList=new Array();
      }
      // var list = document.getElementsByClassName('ng2-pdf-viewer-container');
      // if (list.length > 0) {
      //   list[0].setAttribute("style", "max-height: 500px;");
      // }
      // var list1 = document.getElementsByClassName('textLayer');
      // if (list1.length > 0) {
      //   list1[0].addEventListener('scroll', function (event) {
      //   });
      // }
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

    if (this.pdfSrc instanceof ArrayBuffer) {
      newSrc = { data: this.pdfSrc };
    } else if (typeof this.pdfSrc === 'string') {
      newSrc = { url: this.pdfSrc };
    } else {
      newSrc = { ...this.pdfSrc };
    }

    newSrc.password = password;

    this.pdfSrc = newSrc;
  }

  /**
 * Pdf loading progress callback
 * @param {PDFProgressData} progressData
 */
  onProgress(progressData: PDFProgressData) {
    this.progressData = progressData;
    this.isLoaded = progressData.loaded >= progressData.total;
    this.error = null; // clear error
  }

  getInt(value: number): number {
    return Math.round(value);
  }

/**
 * Navigate to destination
 * @param destination
 */
  navigateTo(destination: any) {
    this.pdfComponent.pdfLinkService.navigateTo(destination);
  }

  /**
   * Scroll view
   */
  scrollToPage(number) {
    this.pdfComponent.pdfViewer.scrollPageIntoView({
      pageNumber: number
    });
  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   * @param {CustomEvent} e
   */
  pageRendered(e: CustomEvent) {

  }

  onCloseModal(){
    this.pdfSrc="";
    this.viewpdf= false;
    this.showModal=false
    this.onClose.emit(true);
  }

  changeGroupingFlag(){
    this.groupingFlag = !this.groupingFlag;
    this.documentForum.groupAndUnGroup(this.groupingFlag);
  }

  esignFinished() {
    this.onClose.emit(true);
  }
  loadStepperData() {
    this.spinnerFlag=true;
    const stepperModule: StepperClass = new StepperClass()
    stepperModule.constantName = this.permissionConstant;
    stepperModule.documentIdentity=this.documentPrimaryKey;
    this.config.HTTPPostAPI(stepperModule,"workFlow/getDocumentWorkflowData").subscribe(res =>{
      this.stepperData=res;
      this.spinnerFlag=false;
      this.stepperData.forEach((element, index) => {
        if (index < this.currentLevelIndex) {
          element.workFlowCompleted = true;
        } else {
          element.workFlowCompleted = false;
        }
        if(index == this.currentLevelIndex)
          element.currentLevel=true;
      });
    })
  }

  loadLevelHistory(data){
    this.levelApprovalHistory=new Array();
    this.spinnerFlag=true;
    this.config.HTTPGetAPI("workFlow/getLevelApprovalHistory/"+data.levelId).subscribe(res =>{
      this.levelApprovalHistory=res;
      this.spinnerFlag=false;
      this.levelHistroyModal.show();
    });
    
  }
}