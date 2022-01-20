import { Component, OnInit,ViewEncapsulation, ViewChild } from '@angular/core';
import { ExternalDocumentApprovalComponentService } from './external-document-approval.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ExternalApprovalCommentsDTO } from '../../models/model';
import swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { EsignAgreementMessege } from '../../shared/constants';
import { ModalAnimationComponent } from '../../shared/modal-animation/modal-animation.component';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { Helper } from '../../shared/helper';
@Component({
  selector: 'app-external-document-approval',
  templateUrl: './external-document-approval.component.html',
  styleUrls: ['./external-document-approval.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class ExternalDocumentApprovalComponent implements OnInit {
  @ViewChild('documentEsign') documentEsign:ModalAnimationComponent;
  receivedId: string;
  viewpdf: boolean = true;
  spinnerFlag: Boolean = false;
  documentName:string="";
  projectName:string="";
  isOtpSuccess:boolean=false;
  isInvalidEmail:boolean=false;
  isInvalidOtp:boolean=false;
  mySign: any = '';
  uploadedFileView: boolean = false;
  enableEsign: boolean = false;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild('approveModal') approveModal:any;
  pdfSrc: any = '';
  agreementCheck:boolean=false;
  public signaturePadOptions: Object = {
    'minWidth': 1,
    'canvasWidth': 330,
    'canvasHeight': 100,
  };
  drawStartFlag: boolean = false;
  error: string = '';
  validityExpiryFlag:boolean=false;
  completionFlag:boolean=false;
  public esignForm = null;
  public esignSpinnerFlag=false;
  public esignButtonEnabled: Boolean = false;
  public errorList: any[]= new Array<any>();
  submitted: boolean = false;
  otpSubmitted: boolean = false;
  public finalstatus: boolean=true;
  forumFlag=false;
  pdf: any;
  outline: any[];
  height: any = "600px";
  heightOutline = '500px';
  public pageVariable:number = 1;
  rotation = 0;
  zoom = 1.1;
  originalSize = true;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  isOutlineShown = true;
  pdfQuery = '';
  outLineList=new Array();
  permissionConstant="";
  commentsDocumentsList: any[] = new Array();
  logs:any[]=new Array();
  tenantName:string
  constructor(public router: ActivatedRoute,public service: ExternalDocumentApprovalComponentService,public fb: FormBuilder, 
  public esignAgreementMessage: EsignAgreementMessege,public route: Router, public helper: Helper) { }

  ngOnInit() {
    this.esignForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      comments: ['', [Validators.required]],
    });
    this.receivedId = this.router.snapshot.params["id"];
    this.spinnerFlag=true;
    if(!this.helper.isEmpty(localStorage.getItem("redirectReference"))){
      this.service.getTenantName(localStorage.getItem("redirectReference")).subscribe(resp=>{
        this.tenantName=resp.result;
        localStorage.setItem("tenant",this.tenantName);
        this.service.postApi(this.receivedId, 'externalApproval/loadPdfPreviewforExternalApproval',this.tenantName).subscribe(response => {
          this.viewpdf = true;
          this.documentName=response.documentName;
          this.permissionConstant=response.documentType;
          this.projectName=response.projectName;
          this.validityExpiryFlag=response.validityExpiryFlag;
          this.completionFlag=response.completionFlag;
          this.logs=response.logs;
          response.documentIds.forEach(element => {
            this.commentsDocumentsList.push({"id":element.key,"value":element.value,"type":"code"});
          });
          if(!this.validityExpiryFlag){
            var responseBolb: any[] = this.b64toBlob(response.pdf);
            const blob: Blob = new Blob(responseBolb, { type: "application/pdf" });
            setTimeout(() => {
              this.pdfSrc = URL.createObjectURL(blob); 
              this.spinnerFlag = false;
              }, 10);
          }else{
            this.spinnerFlag=false;
          }
        });
      });
    }
  }
  private createIFrame(blob_url: string) {
    var iframe;
    var elementExists = document.getElementById('iframeView');
    if (!elementExists)
      iframe = document.createElement('iframe');
    else
      iframe = elementExists;
    iframe.setAttribute('id', 'iframeView')
    iframe.setAttribute("height", window.innerHeight);
    iframe.setAttribute("width", "100%");
    iframe.src = blob_url + '#zoom=113';
    const find = document.querySelector('#fileUploadIdBulkApproval');
    find.setAttribute('class', 'well well-lg row');
    find.appendChild(iframe);
    this.spinnerFlag=false;
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
  sendOtp(){
    this.otpSubmitted=false;
    this.submitted=true;
    this.esignForm.get('password').setValue('');
    if(this.esignForm.get('userName').value){
      const url="externalApproval/verifyEmailAndSendOTP/"+this.receivedId+"/"+this.esignForm.get('userName').value;
      this.esignSpinnerFlag=true;
      this.service.getApi(url,this.tenantName).subscribe(response => {
        this.esignSpinnerFlag=false;
        this.isOtpSuccess=response;
        this.isInvalidEmail=!this.isOtpSuccess;
        this.submitted=false;
      });
    }
  }
  onSubmit() {
    this.otpSubmitted=false;
    if (this.esignForm.valid) {
      this.esignSpinnerFlag=true;
      this.otpSubmitted=false;
      const url="externalApproval/verifyOtp/"+this.receivedId+"/"+this.esignForm.get('password').value;
      const dto:ExternalApprovalCommentsDTO=new ExternalApprovalCommentsDTO();
      dto.referenceId=this.receivedId;
      dto.signImage=this.mySign;
      dto.comments=this.esignForm.get('comments').value;
      dto.approvalFlag=this.finalstatus;
      this.service.getApi(url,this.tenantName).subscribe(response => {
        this.isInvalidOtp=!response;
        if(response){
          this.service.postApi(dto,"externalApproval/approveDocument",this.tenantName).subscribe(response => {
            document.querySelector('#' + 'effect-1').classList.remove('md-show');
            this.esignSpinnerFlag = false;
            this.completionFlag=true;
          });
        }else{
          this.esignSpinnerFlag = false;
        }
      });
    }else{
      this.otpSubmitted=true;
    }
  }
  switch() {
    this.uploadedFileView = false;
    this.mySign = '';
    if (this.enableEsign) {
      this.enableEsign = false
    } else {
      this.enableEsign = true
    }
  }
  drawComplete() {
    this.mySign = this.signaturePad.toDataURL();
  }
  clear() {
    if (this.drawStartFlag) {
      this.signaturePad.clear();
      if (this.mySign != '') {
        this.mySign = '';
      }
    }
  }
  onFileChange(event) {
    this.error = '';
    this.uploadedFileView = false;
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      if (file.size > 25000) {
        this.error = "Image size should be below 25KB"
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.mySign = reader.result;
          this.uploadedFileView = true
        };
        reader.readAsDataURL(file);
      }

    }
  }
  drawStart() {
    this.drawStartFlag = true;
  }
 
  openMyModal(event) {
    this.agreementCheck=false;
    document.querySelector('#' + event).classList.add('md-show');
  }

  closeMyModal(event) {
    this.agreementCheck=false;
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
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
}
