import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { IOption } from 'ng-select';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { User, UserPrincipalDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { EsignAgreementMessege, eSignErrorTypes } from '../../shared/constants';
import { Helper } from '../../shared/helper';
import { ModalAnimationComponent } from '../../shared/modal-animation/modal-animation.component';
import { DashBoardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-documentsign',
  templateUrl: './documentsign.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./documentsign.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],

  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class DocumentsignComponent implements OnInit, OnDestroy {
  public subscription;
  @Input() data: any = null;
  @Input() isIcon: boolean = false;
  @Input() stepperData: any;
  @ViewChild('documentEsign') documentEsign: ModalAnimationComponent;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public documentlist: any[] = new Array<any>();
  public modal: User = new User();
  public summaryorindividual: Boolean = false;
  public docSignselectList: Array<IOption> = new Array<IOption>();
  public esignForm: FormGroup = null;
  public finalstatus: boolean = true;
  public rejectionOption:boolean=false;
  public comments: any = "";
  public signature: any = "";
  public esignSpinnerFlag = false;
  public esignButtonEnabled: Boolean = false;
  public errorList: any[] = new Array<any>();
  submitted: boolean = false;
  @Input() closeFlag = true;
  agreementCheck: boolean = false;
  viewSignature: boolean = false;
  @Output() onClose = new EventEmitter();
  public signaturePadOptions: Object = {
    'minWidth': 1,
    'canvasWidth': 540,
    'canvasHeight': 100,
  };
  constructor(public config: ConfigService, private http: Http, public esignAgreementMessage: EsignAgreementMessege, public fb: FormBuilder,
    public router: Router, public esignErrors: eSignErrorTypes, public helper: Helper, public dashboardService: DashBoardService) { }

  ngOnInit() {
    debugger
    this.agreementCheck = false;
    if (null === this.data) {
      this.summaryorindividual = true;
    }
    if (null != this.stepperData) {
      const result = this.stepperData.filter(t => t.lastEntry);
      if (null != result) {
        this.data = result[0].workflowDto;
        this.data.actionTypeName = "Esign"
      }
    }
    this.esignForm = this.fb.group({
      userName: [this.modal.email, [Validators.required]],
      password: [this.modal.password, [Validators.required]],
      comments: [this.modal.dob, [Validators.required]],
      signature: [this.signature],
    });
  }

  changestatus(status) {
    this.documentlist.forEach(element => {
      element.comments = this.esignForm.get('comments').value;
    });
  }

  ngOnDestroy() {
  }

  clickFilter(event): void {
    this.helper.filter(event);
  }

  Api(data, url) {
    return this.http.post(this.helper.common_URL + url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  esign() {
    debugger
    this.esignSpinnerFlag = true;
    this.documentEsign.spinnerShow();
    this.loadDocumentList(this.data);
    this.Api(this.modal, 'workFlow/validEsignUser').subscribe(response => {
      if (response.flag) {
        this.esignSpinnerFlag = true;
        if (null != this.documentlist) {
          this.config.HTTPGetAPI("common/getWorkflowJobStatus/"+ this.documentlist[0].documentType+"/"+false).subscribe(res =>{
            if(!res.result){
              this.documentlist.forEach(element => {
                element.comments = this.comments;
                element.approvedFlag = this.finalstatus;
                element.rejectionOption=this.rejectionOption;
                element.signature = this.esignForm.get('signature').value;
              });
              this.Api(this.documentlist, 'workFlow/approveOrReject').subscribe(res => {
                this.comments = "";
                this.finalstatus = false;
                this.helper.changeMessageforId('data');
               
                if (res.dataType === 'Multiple access for same Data') {
                  swal({
                    title: '',
                    text: 'Multiple access for same Data reload the page',
                    type: 'warning',
                    timer: this.helper.swalTimer,
                    showConfirmButton: false
                  });
                } else {
                  swal({
                    title: '',
                    text: 'Esign validated',
                    type: 'success',
                    timer: this.helper.swalTimer,
                    showConfirmButton: false
                  });
                }
                setTimeout(() => {
                  if (null != this.data && this.data.length === undefined) {
                    this.helper.filter(this.data.documentId);
                  }
                  this.agreementCheck = false;
                  this.esignSpinnerFlag = false;
                  this.documentEsign.spinnerHide();
                  this.onClose.emit(true);
                  document.querySelector('#' + 'effect-1').classList.remove('md-show');
                }, 1000);
              });
            }else{
              this.esignSpinnerFlag = false;
              this.errorList = response.errorList;
              this.documentEsign.spinnerHide();
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
      } else {
        this.esignSpinnerFlag = false;
        this.errorList = response.errorList;
        this.documentEsign.spinnerHide();
      }
    });
  }

  onSubmit(esignForm) {
    if (esignForm.valid) {
      this.closeFlag = true;
      this.esignSpinnerFlag = true;
      this.submitted = false;
      this.modal.userName = this.esignForm.get('userName').value;
      this.modal.password = this.esignForm.get('password').value;
      this.comments = this.esignForm.get('comments').value;
      this.esign();
    } else
      this.submitted = true;
  }

  openMyModal(event) {
    if (this.closeFlag) {
      $("#acceptCheckBox").prop("checked", false);
      this.finalstatus = true;
      this.rejectionOption=false;
      this.submitted = false;
      this.agreementCheck = false;
      this.viewSignature = false;
      document.querySelector('#' + event).classList.add('md-show');
      setTimeout(() => {
        $('#workFlowCommentsId').focus();
      }, 1000);
      this.closeFlag = false;
    }
  }

  closeMyModal(event) {
    this.closeFlag = true;
    this.errorList = new Array();
    this.esignForm.reset();
    this.agreementCheck = false;
    if (document.querySelector('#' + event))
      document.querySelector('#' + event).classList.remove('md-show');
  }

  loadDocumentList(data: any) {
    if (null != data && data.length === undefined) {
      const dd: any[] = new Array<any>();
      data.approveFlag = true;
      dd.push(data);
      this.documentlist = dd;
    } else {
      this.documentlist = data;
    }
  }

  clearSignature() {
    this.esignForm.get('signature').setValue('');
    this.signaturePad.clear();
  }

  signatureComplete() {
    this.esignForm.get('signature').setValue(this.signaturePad.toDataURL());
  }

  onclickAccept() {
    this.agreementCheck = !this.agreementCheck;
    this.config.loadCurrentUserDetails().subscribe(jsonResp => {
      this.esignForm.get('userName').setValue(jsonResp.email);
      $('#passwordId').focus();
    })
  }

}
